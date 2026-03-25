// Tank.js — Урок 11: + спрайтове малювання
import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
import { darkGray } from './colors.js';
import { Bullet } from './Bullet.js';
import { spriteSheet, DIR_COL } from './SpriteSheet.js';

export class Tank {
    constructor(fx, fy, color, speed = 2, hp = 1) {
        this.x = fx; this.y = fy;
        this.width = TANK_SIZE; this.height = TANK_SIZE;
        this.color = color; this.direction = 'up';
        this.speed = speed; this.hp = hp; this.alive = true;
        this.animFrame = 0; this.animTimer = 0;
        this.bullets = []; this.shootCooldown = 400; this.lastShotTime = 0;
        this.spriteX = 0; this.spriteY = 0;
    }

    snapToGrid(newDir) {
        if (newDir === 'left' || newDir === 'right') this.y = Math.round(this.y / TILE) * TILE;
        else this.x = Math.round(this.x / TILE) * TILE;
    }

    move(dir, dt, canMove) {
        if (!this.alive) return false;
        if (dir !== this.direction) { this.snapToGrid(dir); this.direction = dir; }
        const step = this.speed;
        let nx = this.x, ny = this.y;
        switch (dir) {
            case 'up': ny -= step; break; case 'down': ny += step; break;
            case 'left': nx -= step; break; case 'right': nx += step; break;
        }
        nx = Math.max(0, Math.min(FIELD_W - this.width, nx));
        ny = Math.max(0, Math.min(FIELD_H - this.height, ny));
        if (canMove(this, nx, ny)) {
            this.x = nx; this.y = ny;
            this.animTimer += dt;
            if (this.animTimer > 120) { this.animFrame = (this.animFrame + 1) % 2; this.animTimer = 0; }
            return true;
        }
        return false;
    }

    shoot(now, owner) {
        if (!this.alive) return null;
        if (now - this.lastShotTime < this.shootCooldown) return null;
        this.lastShotTime = now;
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        const offsets = {
            up: { bx: cx, by: this.y - 2 }, down: { bx: cx, by: this.y + this.height + 2 },
            left: { bx: this.x - 2, by: cy }, right: { bx: this.x + this.width + 2, by: cy },
        };
        const { bx, by } = offsets[this.direction];
        const bullet = new Bullet(bx, by, this.direction, owner);
        this.bullets.push(bullet);
        return bullet;
    }

    updateBullets() {
        for (const b of this.bullets) b.update();
        this.bullets = this.bullets.filter(b => b.active);
    }

    render(ctx, ox, oy) {
        if (!this.alive) return;
        const dx = Math.round(this.x) + ox;
        const dy = Math.round(this.y) + oy;

        if (spriteSheet.ready) {
            const col = DIR_COL[this.direction] ?? 0;
            const frame = col + this.animFrame;
            const sx = this.spriteX + frame * 16;
            const sy = this.spriteY;
            ctx.drawImage(spriteSheet.img, sx, sy, 16, 16, dx, dy, this.width, this.height);
        } else {
            ctx.save();
            this._drawTreads(ctx, dx, dy, this.width);
            ctx.fillStyle = this.color;
            ctx.fillRect(dx + 4, dy + 4, this.width - 8, this.height - 8);
            this._drawBarrel(ctx, dx, dy, this.width);
            ctx.restore();
        }
    }

    _drawTreads(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;
        const af = this.animFrame;
        if (this.direction === 'up' || this.direction === 'down') {
            ctx.fillRect(sx, sy + af*4, 4, sz/2-2); ctx.fillRect(sx, sy + sz/2 + (1-af)*4, 4, sz/2-2);
            ctx.fillRect(sx+sz-4, sy + af*4, 4, sz/2-2); ctx.fillRect(sx+sz-4, sy + sz/2 + (1-af)*4, 4, sz/2-2);
        } else {
            ctx.fillRect(sx + af*4, sy, sz/2-2, 4); ctx.fillRect(sx + sz/2 + (1-af)*4, sy, sz/2-2, 4);
            ctx.fillRect(sx + af*4, sy+sz-4, sz/2-2, 4); ctx.fillRect(sx + sz/2 + (1-af)*4, sy+sz-4, sz/2-2, 4);
        }
    }

    _drawBarrel(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;
        const bL = sz*0.55, bW = sz*0.2, cx = sx+sz/2-bW/2, cy = sy+sz/2-bW/2;
        switch (this.direction) {
            case 'up': ctx.fillRect(cx, sy-bL, bW, bL); break;
            case 'down': ctx.fillRect(cx, sy+sz, bW, bL); break;
            case 'left': ctx.fillRect(sx-bL, cy, bL, bW); break;
            case 'right': ctx.fillRect(sx+sz, cy, bL, bW); break;
        }
    }
}
