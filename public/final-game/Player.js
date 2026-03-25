/**
 * 🟡🟢 Клас Player — танк гравця (P1 або P2)
 *
 * Відповідає за:
 * - Зчитування вводу (P1: WASD+Space, P2: Arrows+Enter)
 * - Керування життями та відродженням
 * - Відображення щита невразливості (мигання після spawn)
 */
import { Tank } from './Tank.js';
import { PLAYER1_SPAWN, PLAYER2_SPAWN, PLAYER_LIVES, PLAYER_SPEED, RESPAWN_DELAY, SPAWN_FLASH_DURATION } from './constants.js';
import { playerYellow } from './colors.js';
import { PLAYER1_SPRITE, PLAYER2_SPRITE } from './SpriteSheet.js';

export class Player extends Tank {
  /**
   * @param {number} playerNum - 1 або 2
   */
  constructor(playerNum = 1) {
    const spawn  = playerNum === 1 ? PLAYER1_SPAWN : PLAYER2_SPAWN;
    const sprite = playerNum === 1 ? PLAYER1_SPRITE : PLAYER2_SPRITE;
    const color  = playerNum === 1 ? playerYellow : '#00a800';

    super(spawn.tx * 16, spawn.ty * 16, color, PLAYER_SPEED, 1);

    this.playerNum = playerNum;
    this.spawn     = spawn;

    // Спрайт
    this.spriteX = sprite.x;
    this.spriteY = sprite.y;

    this.lives = PLAYER_LIVES;

    // Функції вводу (встановлюються через setInputManager)
    this._getMovement = null;
    this._isShoot     = null;

    // Стан відродження
    this.isRespawning = false;
    this.respawnTimer = 0;

    // Щит (невразливість після spawn)
    this.shieldActive = true;
    this.shieldTimer  = SPAWN_FLASH_DURATION;
    this.shieldFlash  = 0;

    // Гравець стріляє швидше ніж вороги
    this.shootCooldown = 400;

    // Ранг (star power-up): 0 = базовий, 1 = швидший, 2 = потужний
    this.rank = 0;
  }

  /**
   * Встановлює InputManager та прив'язує відповідні методи вводу
   * @param {InputManager} im
   */
  setInputManager(im) {
    if (this.playerNum === 1) {
      this._getMovement = () => im.getMovementP1();
      this._isShoot     = () => im.isShootP1();
    } else {
      this._getMovement = () => im.getMovementP2();
      this._isShoot     = () => im.isShootP2();
    }
  }

  /**
   * Оновлення стану гравця
   * @param {number} dt        - deltaTime (мс)
   * @param {Function} canMove - (tank, nx, ny) => boolean
   * @param {number} now       - поточний час (мс)
   */
  update(dt, canMove, now) {
    // Відлік відродження
    if (this.isRespawning) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this._doRespawn();
      }
      return;
    }

    // Щит невразливості
    if (this.shieldActive) {
      this.shieldTimer -= dt;
      this.shieldFlash = (this.shieldFlash + 1) % 10;
      if (this.shieldTimer <= 0) this.shieldActive = false;
    }

    if (!this.alive || !this._getMovement) return;

    // Рух
    const dir = this._getMovement();
    if (dir) this.move(dir, dt, canMove);

    // Постріл
    if (this._isShoot()) {
      this.shoot(now, 'player');
    }

    this.updateBullets();
  }

  /**
   * Отримання пошкодження від ворожої кулі
   * @returns {boolean} - true якщо більше немає життів (game over)
   */
  hit() {
    if (this.shieldActive) return false;

    this.alive = false;
    this.lives--;

    if (this.lives <= 0) {
      this.lives = 0;
      return true; // game over
    }

    // Починаємо відродження
    this.isRespawning = true;
    this.respawnTimer = RESPAWN_DELAY;
    this.bullets      = [];
    return false;
  }

  _doRespawn() {
    this.x           = this.spawn.tx * 16;
    this.y           = this.spawn.ty * 16;
    this.direction   = 'up';
    this.alive       = true;
    this.isRespawning = false;
    this.shieldActive = true;
    this.shieldTimer  = SPAWN_FLASH_DURATION;
  }

  /** Чи зараз гравець у стані відродження */
  isPlayerRespawning() { return this.isRespawning; }

  /** Активувати щит (helmet power-up) */
  activateHelmet(duration = 10000) {
    this.shieldActive = true;
    this.shieldTimer  = duration;
  }

  /** Підвищити ранг (star power-up) */
  upgradeRank() {
    this.rank = Math.min(this.rank + 1, 2);
    // Кожен ранг зменшує кулдаун і підвищує швидкість
    this.shootCooldown = [400, 250, 150][this.rank];
    this.speed         = [1.5, 2.0, 2.5][this.rank];
    // Змінити рядок спрайту на вищий star level
    const base = this.playerNum === 1 ? 0 : 128;
    this.spriteY = base + this.rank * 16;
  }

  /** Малювання (з ефектом мигання щита) */
  render(ctx, ox, oy) {
    if (this.isRespawning) return;
    if (this.shieldActive && this.shieldFlash > 5) return;
    super.render(ctx, ox, oy);

    // Малюємо щит
    if (this.shieldActive) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)';
      ctx.lineWidth   = 2;
      ctx.strokeRect(
        Math.round(this.x) + ox - 3,
        Math.round(this.y) + oy - 3,
        this.width + 6,
        this.height + 6
      );
      ctx.restore();
    }
  }
}
