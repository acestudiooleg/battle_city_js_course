/**
 * 🔹 Клас Bullet — снаряд
 *
 * Відповідає за:
 * - Рух кулі по полі з постійною швидкістю
 * - Зберігання власника (player/enemy) для перевірки колізій
 */
import { BULLET_SPEED } from './constants.js';

export class Bullet {
  /**
   * @param {number} fx - початкова X в координатах поля
   * @param {number} fy - початкова Y в координатах поля
   * @param {string} direction - 'up' | 'down' | 'left' | 'right'
   * @param {string} owner - 'player' | 'enemy'
   * @param {number} [speed]
   */
  constructor(fx, fy, direction, owner, speed = BULLET_SPEED) {
    this.x      = fx;
    this.y      = fy;
    this.width  = 4;
    this.height = 4;
    this.direction = direction;
    this.owner     = owner;  // 'player' | 'enemy'
    this.speed     = speed;
    this.active    = true;

    // Вектор руху
    const dirs = {
      up:    { vx:  0, vy: -1 },
      down:  { vx:  0, vy:  1 },
      left:  { vx: -1, vy:  0 },
      right: { vx:  1, vy:  0 },
    };
    this.vx = (dirs[direction] ?? dirs.up).vx * this.speed;
    this.vy = (dirs[direction] ?? dirs.up).vy * this.speed;
  }

  /** Оновлення позиції */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Малювання кулі (у координатах поля + офсет)
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} ox - FIELD_X офсет
   * @param {number} oy - FIELD_Y офсет
   */
  render(ctx, ox, oy) {
    if (!this.active) return;
    ctx.fillStyle = '#fcfcfc';
    ctx.fillRect(
      Math.round(this.x - this.width / 2)  + ox,
      Math.round(this.y - this.height / 2) + oy,
      this.width,
      this.height
    );
  }
}
