/**
 * 🎮 Клас Tank — базовий клас для всіх танків
 *
 * Відповідає за:
 * - Зберігання стану (позиція, напрямок, здоров'я)
 * - Grid-snapping: танки вирівнюються по тайловій сітці
 * - Базове малювання корпусу та дула
 * - Управління кулями
 */
import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
import { Bullet } from './Bullet.js';
import { darkGray } from './colors.js';
import { spriteSheet, DIR_COL } from './SpriteSheet.js';

export class Tank {
  /**
   * @param {number} fx   - початкова X в координатах поля
   * @param {number} fy   - початкова Y в координатах поля
   * @param {string} color - колір корпусу
   * @param {number} speed - швидкість (px/frame)
   * @param {number} hp   - кількість очок здоров'я
   */
  constructor(fx, fy, color, speed, hp = 1) {
    // Позиція у координатах поля
    this.x = fx;
    this.y = fy;

    this.width  = TANK_SIZE;
    this.height = TANK_SIZE;

    this.color     = color;
    this.speed     = speed;
    this.direction = 'up';

    this.hp    = hp;
    this.maxHp = hp;
    this.alive = true;

    // Масив активних куль цього танка
    this.bullets = [];

    // Кулдаун стрільби
    this.shootCooldown    = 1500; // мс
    this.lastShotTime     = -9999;

    // Анімаційний лічильник (для мигання гусениць)
    this.animFrame = 0;
    this.animTimer = 0;

    // Координати спрайта на спрайт-листі (встановлюються підкласом)
    this.spriteX = 0;
    this.spriteY = 0;
  }

  // ─── Рух ───────────────────────────────────────────────────────────────────

  /**
   * Вирівнює танк по тайловій сітці при повороті.
   * Якщо танк рухається горизонтально — вирівнює Y.
   * Якщо вертикально — вирівнює X.
   * @param {string} newDir
   */
  snapToGrid(newDir) {
    if (newDir === 'left' || newDir === 'right') {
      this.y = Math.round(this.y / TILE) * TILE;
    } else {
      this.x = Math.round(this.x / TILE) * TILE;
    }
  }

  /**
   * Спроба зрушити танк. Повертає нові координати або null якщо рух неможливий.
   * Перевірку колізій зі стінами виконує CollisionManager.canTankMove().
   *
   * @param {string} dir - 'up'|'down'|'left'|'right'
   * @param {number} dt  - deltaTime (мс)
   * @param {Function} canMove - (tank, nx, ny) => boolean
   * @returns {boolean} - true якщо рух відбувся
   */
  move(dir, dt, canMove) {
    if (!this.alive) return false;

    // При зміні напрямку — snap
    if (dir !== this.direction) {
      this.snapToGrid(dir);
      this.direction = dir;
    }

    const step = this.speed;
    let nx = this.x;
    let ny = this.y;

    switch (dir) {
      case 'up':    ny -= step; break;
      case 'down':  ny += step; break;
      case 'left':  nx -= step; break;
      case 'right': nx += step; break;
    }

    // Межі поля
    nx = Math.max(0, Math.min(FIELD_W - this.width,  nx));
    ny = Math.max(0, Math.min(FIELD_H - this.height, ny));

    if (canMove(this, nx, ny)) {
      this.x = nx;
      this.y = ny;

      // Анімація гусениць
      this.animTimer += dt;
      if (this.animTimer > 120) {
        this.animFrame = (this.animFrame + 1) % 2;
        this.animTimer = 0;
      }
      return true;
    }
    return false;
  }

  // ─── Стрільба ──────────────────────────────────────────────────────────────

  /**
   * Постріл. Повертає нову кулю або null якщо кулдаун не закінчився.
   * @param {number} now   - поточний час (Date.now())
   * @param {string} owner - 'player' | 'enemy'
   * @returns {Bullet|null}
   */
  shoot(now, owner) {
    if (!this.alive) return null;
    if (now - this.lastShotTime < this.shootCooldown) return null;
    this.lastShotTime = now;

    const cx = this.x + this.width  / 2;
    const cy = this.y + this.height / 2;

    // Стартова позиція кулі — центр перед дулом
    const offsets = {
      up:    { bx: cx,               by: this.y - 2 },
      down:  { bx: cx,               by: this.y + this.height + 2 },
      left:  { bx: this.x - 2,       by: cy },
      right: { bx: this.x + this.width + 2, by: cy },
    };
    const { bx, by } = offsets[this.direction];
    const bullet = new Bullet(bx, by, this.direction, owner);
    this.bullets.push(bullet);
    return bullet;
  }

  /**
   * Видаляє кулю з масиву
   * @param {Bullet} bullet
   */
  removeBullet(bullet) {
    const i = this.bullets.indexOf(bullet);
    if (i !== -1) this.bullets.splice(i, 1);
  }

  /** Оновлення куль */
  updateBullets() {
    for (const b of this.bullets) b.update();
    this.bullets = this.bullets.filter((b) => b.active);
  }

  /**
   * Малює кулі
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} ox - FIELD_X
   * @param {number} oy - FIELD_Y
   */
  renderBullets(ctx, ox, oy) {
    for (const b of this.bullets) b.render(ctx, ox, oy);
  }

  // ─── Пошкодження ───────────────────────────────────────────────────────────

  /**
   * Отримати пошкодження
   * @param {number} dmg
   * @returns {boolean} - true якщо знищений
   */
  takeDamage(dmg = 1) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.hp    = 0;
      this.alive = false;
      return true;
    }
    return false;
  }

  // ─── Малювання ─────────────────────────────────────────────────────────────

  /**
   * Малювання танка
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} ox - FIELD_X офсет
   * @param {number} oy - FIELD_Y офсет
   */
  render(ctx, ox, oy) {
    if (!this.alive) return;

    const dx = Math.round(this.x) + ox;
    const dy = Math.round(this.y) + oy;
    const sz = this.width;

    // Спрайтове малювання (якщо спрайт-лист готовий)
    if (spriteSheet.ready) {
      const col = DIR_COL[this.direction] + this.animFrame;
      const srcX = this.spriteX + col * 16;
      const srcY = this.spriteY;
      ctx.drawImage(spriteSheet.img, srcX, srcY, 16, 16, dx, dy, sz, sz);
      return;
    }

    // Fallback — програмне малювання
    ctx.save();
    this._drawTreads(ctx, dx, dy, sz);
    ctx.fillStyle = this.color;
    ctx.fillRect(dx + 4, dy + 4, sz - 8, sz - 8);
    this._drawBarrel(ctx, dx, dy, sz);
    ctx.restore();
  }

  _drawTreads(ctx, sx, sy, sz) {
    ctx.fillStyle = darkGray;
    const af = this.animFrame;

    if (this.direction === 'up' || this.direction === 'down') {
      // Ліва гусениця
      ctx.fillRect(sx,      sy + af * 4, 4, sz / 2 - 2);
      ctx.fillRect(sx,      sy + sz / 2 + (1 - af) * 4, 4, sz / 2 - 2);
      // Права гусениця
      ctx.fillRect(sx + sz - 4, sy + af * 4, 4, sz / 2 - 2);
      ctx.fillRect(sx + sz - 4, sy + sz / 2 + (1 - af) * 4, 4, sz / 2 - 2);
    } else {
      // Верхня гусениця
      ctx.fillRect(sx + af * 4,          sy,           sz / 2 - 2, 4);
      ctx.fillRect(sx + sz / 2 + (1 - af) * 4, sy,    sz / 2 - 2, 4);
      // Нижня гусениця
      ctx.fillRect(sx + af * 4,          sy + sz - 4, sz / 2 - 2, 4);
      ctx.fillRect(sx + sz / 2 + (1 - af) * 4, sy + sz - 4, sz / 2 - 2, 4);
    }
  }

  _drawBarrel(ctx, sx, sy, sz) {
    const bl = sz * 0.55;
    const bw = sz * 0.2;
    const cx = sx + sz / 2 - bw / 2;
    const cy = sy + sz / 2 - bw / 2;

    ctx.fillStyle = darkGray;
    switch (this.direction) {
      case 'up':    ctx.fillRect(cx,          sy - bl, bw, bl); break;
      case 'down':  ctx.fillRect(cx,          sy + sz, bw, bl); break;
      case 'left':  ctx.fillRect(sx - bl,     cy,      bl, bw); break;
      case 'right': ctx.fillRect(sx + sz,     cy,      bl, bw); break;
    }
  }
}
