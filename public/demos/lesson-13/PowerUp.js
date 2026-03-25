/**
 * ⭐ Клас PowerUp — артефакт на полі
 */
import { TILE, TANK_SIZE } from './constants.js';
import { spriteSheet, POWERUP_SPRITES } from './SpriteSheet.js';

const POWERUP_TYPES = ['tank', 'shovel', 'helmet', 'star', 'grenade', 'timer'];

export class PowerUp {
  constructor(fx, fy, type) {
    this.x      = fx;
    this.y      = fy;
    this.width  = TANK_SIZE;
    this.height = TANK_SIZE;
    this.type   = type;
    this.active = true;
    this.flashTimer = 0;
    this.visible    = true;
  }

  update(dt) {
    if (!this.active) return;
    this.flashTimer += dt;
    if (this.flashTimer > 200) {
      this.flashTimer = 0;
      this.visible = !this.visible;
    }
  }

  render(ctx, ox, oy) {
    if (!this.active || !this.visible) return;
    const dx = Math.round(this.x) + ox;
    const dy = Math.round(this.y) + oy;
    if (spriteSheet.ready) {
      const spr = POWERUP_SPRITES[this.type];
      if (spr) {
        ctx.drawImage(spriteSheet.img, spr.x, spr.y, 16, 16, dx, dy, this.width, this.height);
        return;
      }
    }
    ctx.fillStyle = '#f8f858';
    ctx.fillRect(dx + 4, dy + 4, this.width - 8, this.height - 8);
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.type[0].toUpperCase(), dx + this.width / 2, dy + this.height / 2 + 4);
  }

  static randomType() {
    return POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  }
}
