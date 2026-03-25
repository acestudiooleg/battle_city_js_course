// Player.js — Урок 11: + спрайт P1
import { Tank } from './Tank.js';
import { TILE, PLAYER_LIVES, RESPAWN_DELAY, SHIELD_DURATION } from './constants.js';
import { playerYellow } from './colors.js';
import { PLAYER1_SPRITE } from './SpriteSheet.js';

export class Player extends Tank {
    constructor() {
        const spawnX = 8 * TILE;
        const spawnY = 24 * TILE;
        super(spawnX, spawnY, playerYellow, 2, 1);
        this.spawnX = spawnX; this.spawnY = spawnY;
        this.direction = 'up';
        this.lives = PLAYER_LIVES;
        this.isRespawning = false; this.respawnTimer = 0;
        this.shieldActive = true; this.shieldTimer = SHIELD_DURATION; this.shieldFlash = 0;
        this.shootCooldown = 400;
        this.spriteX = PLAYER1_SPRITE.x;
        this.spriteY = PLAYER1_SPRITE.y;
    }

    update(dt, canMove, now, getMovement, isShoot) {
        if (this.isRespawning) {
            this.respawnTimer -= dt;
            if (this.respawnTimer <= 0) this._doRespawn();
            return;
        }
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            this.shieldFlash = (this.shieldFlash + 1) % 10;
            if (this.shieldTimer <= 0) this.shieldActive = false;
        }
        if (!this.alive) return;
        const dir = getMovement();
        if (dir) this.move(dir, dt, canMove);
        if (isShoot()) this.shoot(now, 'player');
        this.updateBullets();
    }

    hit() {
        if (this.shieldActive) return false;
        this.alive = false; this.lives--;
        if (this.lives <= 0) { this.lives = 0; return true; }
        this.isRespawning = true; this.respawnTimer = RESPAWN_DELAY; this.bullets = [];
        return false;
    }

    _doRespawn() {
        this.x = this.spawnX; this.y = this.spawnY;
        this.direction = 'up'; this.alive = true; this.isRespawning = false;
        this.shieldActive = true; this.shieldTimer = SHIELD_DURATION;
    }

    render(ctx, ox, oy) {
        if (this.isRespawning) return;
        if (this.shieldActive && this.shieldFlash > 5) return;
        super.render(ctx, ox, oy);
        if (this.shieldActive) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)'; ctx.lineWidth = 2;
            ctx.strokeRect(Math.round(this.x) + ox - 3, Math.round(this.y) + oy - 3,
                this.width + 6, this.height + 6);
            ctx.restore();
        }
    }
}
