/**
 * 🟡 Клас Player — танк гравця
 *
 * Відповідає за:
 * - Зчитування вводу від InputManager
 * - Керування життями та відродженням
 * - Відображення щита невразливості (мигання після spawn)
 */
import { Tank } from './Tank.js';
import { PLAYER_SPAWN, PLAYER_LIVES, PLAYER_SPEED, RESPAWN_DELAY, SPAWN_FLASH_DURATION } from './constants.js';
import { playerYellow } from './colors.js';

export class Player extends Tank {
  constructor() {
    const { tx, ty } = PLAYER_SPAWN;
    super(tx * 16, ty * 16, playerYellow, PLAYER_SPEED, 1);

    this.lives         = PLAYER_LIVES;
    this.inputManager  = null;

    // Стан відродження
    this.isRespawning   = false;
    this.respawnTimer   = 0;

    // Щит (невразливість після spawn)
    this.shieldActive   = true;
    this.shieldTimer    = SPAWN_FLASH_DURATION;
    this.shieldFlash    = 0;
  }

  /** Встановлює InputManager */
  setInputManager(im) {
    this.inputManager = im;
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

    if (!this.alive || !this.inputManager) return;

    // Рух
    const dir = this.inputManager.getMovement();
    if (dir) this.move(dir, dt, canMove);

    // Постріл
    if (this.inputManager.isShoot()) {
      this.shoot(now, 'player');
    }

    this.updateBullets();
  }

  /**
   * Отримання пошкодження від ворожої кулі
   * @returns {boolean} - true якщо більше немає життів (game over)
   */
  hit() {
    if (this.shieldActive) return false; // щит захищає

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
    const { tx, ty } = PLAYER_SPAWN;
    this.x           = tx * 16;
    this.y           = ty * 16;
    this.direction   = 'up';
    this.alive       = true;
    this.isRespawning = false;
    this.shieldActive = true;
    this.shieldTimer  = SPAWN_FLASH_DURATION;
  }

  /** Чи зараз гравець у стані відродження */
  isPlayerRespawning() { return this.isRespawning; }

  /** Малювання (з ефектом мигання щита) */
  render(ctx, ox, oy) {
    if (this.isRespawning) return;
    // Під час щита — мигає
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
