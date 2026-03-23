/**
 * 🔴 Клас Enemy — ворожий танк з AI
 *
 * AI логіка:
 * 1. Рухається в поточному напрямку
 * 2. Кожні CHANGE_INTERVAL мс — обирає новий випадковий напрямок
 * 3. Якщо застряг (рух заблоковано) — негайно змінює напрямок
 * 4. Стріляє кожні shootCooldown мс
 *
 * Чотири типи:
 * - basic : звичайний (1 HP, швидкість 1)
 * - fast  : швидкий   (1 HP, швидкість 2)
 * - power : потужний  (1 HP, стріляє частіше)
 * - armor : броньований (4 HP, міняє колір при пошкодженні)
 */
import { Tank } from './Tank.js';
import {
  ENEMY_SPEED, ENEMY_FAST_SPEED, SHOOT_COOLDOWN, POWER_SHOOT_COOLDOWN,
  SPAWN_FLASH_DURATION,
} from './constants.js';
import { enemyBasicColor, enemyFastColor, enemyPowerColor, armorColors } from './colors.js';

const DIRS   = ['up', 'down', 'left', 'right'];
const HP_MAP = { basic: 1, fast: 1, power: 1, armor: 4 };

export class Enemy extends Tank {
  /**
   * @param {number} fx    - поле X
   * @param {number} fy    - поле Y
   * @param {string} type  - тип ворога
   * @param {number} spawnIdx - індекс точки спавну (0-2)
   */
  constructor(fx, fy, type = 'basic', spawnIdx = 0) {
    const spd  = type === 'fast' ? ENEMY_FAST_SPEED : ENEMY_SPEED;
    const hp   = HP_MAP[type] ?? 1;
    const color = Enemy._colorByType(type, hp, hp);
    super(fx, fy, color, spd, hp);

    this.type      = type;
    this.spawnIdx  = spawnIdx;

    // AI таймери
    this.dirTimer     = 0;
    this.changeDirIn  = 800 + Math.random() * 1200; // мс до зміни напрямку

    // Стрільба
    this.shootCooldown = type === 'power' ? POWER_SHOOT_COOLDOWN : SHOOT_COOLDOWN;

    // Spawn-анімація
    this.spawnFlash  = true;
    this.spawnTimer  = SPAWN_FLASH_DURATION;
    this.flashFrame  = 0;

    // Початковий напрямок — вниз (вороги з'являються зверху і йдуть вниз)
    this.direction = 'down';
  }

  static _colorByType(type, hp, maxHp) {
    switch (type) {
      case 'fast':  return enemyFastColor;
      case 'power': return enemyPowerColor;
      case 'armor': {
        const idx = Math.max(0, Math.min(3, maxHp - hp));
        return armorColors[idx];
      }
      default: return enemyBasicColor;
    }
  }

  /**
   * Оновлення стану ворога
   * @param {number} dt        - deltaTime (мс)
   * @param {Function} canMove - (tank, nx, ny) => boolean
   * @param {number} now       - поточний час (мс)
   */
  update(dt, canMove, now) {
    if (!this.alive) return;

    // Spawn flash
    if (this.spawnFlash) {
      this.spawnTimer -= dt;
      this.flashFrame  = (this.flashFrame + 1) % 8;
      if (this.spawnTimer <= 0) this.spawnFlash = false;
      // під час spawn-анімації не рухається і не стріляє
      return;
    }

    // Таймер зміни напрямку
    this.dirTimer += dt;
    if (this.dirTimer >= this.changeDirIn) {
      this._pickRandomDir();
    }

    // Спроба руху
    const moved = this.move(this.direction, dt, canMove);
    if (!moved) {
      // Застряг — негайна зміна напрямку
      this._pickRandomDir();
    }

    // Стрільба
    this.shoot(now, 'enemy');

    this.updateBullets();

    // Оновлення кольору броньованого танка
    if (this.type === 'armor') {
      this.color = Enemy._colorByType('armor', this.hp, this.maxHp);
    }
  }

  _pickRandomDir() {
    this.direction   = DIRS[Math.floor(Math.random() * DIRS.length)];
    this.dirTimer    = 0;
    this.changeDirIn = 800 + Math.random() * 1500;
    this.snapToGrid(this.direction);
  }

  /** Малювання (з spawn-анімацією) */
  render(ctx, ox, oy) {
    if (!this.alive) return;

    if (this.spawnFlash) {
      // Мигання під час spawn
      if (this.flashFrame < 4) {
        ctx.save();
        ctx.strokeStyle = '#fcfcfc';
        ctx.lineWidth   = 2;
        const sx = Math.round(this.x) + ox;
        const sy = Math.round(this.y) + oy;
        const r  = this.width / 2 + 4;
        ctx.beginPath();
        ctx.arc(sx + this.width / 2, sy + this.height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      return;
    }

    super.render(ctx, ox, oy);

    // Зірка для броньованого танка (показує що він особливий)
    if (this.type === 'armor' && this.hp === this.maxHp) {
      const sx = Math.round(this.x) + ox + this.width / 2;
      const sy = Math.round(this.y) + oy + this.height / 2;
      ctx.save();
      ctx.fillStyle = '#f8f858';
      ctx.font      = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', sx, sy);
      ctx.restore();
    }
  }
}
