// Player.js — Урок 13: мультиплеєр (P1/P2) + артефакти
import { Tank } from './Tank.js';
import { TILE, PLAYER_LIVES, RESPAWN_DELAY, SHIELD_DURATION } from './constants.js';
import { playerYellow } from './colors.js';
import { PLAYER1_SPRITE, PLAYER2_SPRITE } from './SpriteSheet.js';

const PLAYER1_SPAWN = { tx: 8,  ty: 24 };
const PLAYER2_SPAWN = { tx: 16, ty: 24 };

export class Player extends Tank {
    constructor(playerNum = 1) {
        const spawn  = playerNum === 1 ? PLAYER1_SPAWN : PLAYER2_SPAWN;
        const sprite = playerNum === 1 ? PLAYER1_SPRITE : PLAYER2_SPRITE;
        const color  = playerNum === 1 ? playerYellow : '#00a800';

        super(spawn.tx * TILE, spawn.ty * TILE, color, 1.5, 1);

        this.playerNum = playerNum;
        this.spawn = spawn;
        this.direction = 'up';
        this.lives = PLAYER_LIVES;
        this.isRespawning = false; this.respawnTimer = 0;
        this.shieldActive = true; this.shieldTimer = SHIELD_DURATION; this.shieldFlash = 0;
        this.shootCooldown = 400;
        this.rank = 0;

        this.spriteX = sprite.x;
        this.spriteY = sprite.y;

        this._getMovement = null;
        this._isShoot = null;
    }

    setInputManager(im) {
        if (this.playerNum === 1) {
            this._getMovement = () => im.getMovementP1();
            this._isShoot     = () => im.isShootP1();
        } else {
            this._getMovement = () => im.getMovementP2();
            this._isShoot     = () => im.isShootP2();
        }
    }

    update(dt, canMove, now) {
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
        if (!this.alive || !this._getMovement) return;
        const dir = this._getMovement();
        if (dir) this.move(dir, dt, canMove);
        if (this._isShoot()) this.shoot(now, 'player');
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
        this.x = this.spawn.tx * TILE; this.y = this.spawn.ty * TILE;
        this.direction = 'up'; this.alive = true; this.isRespawning = false;
        this.shieldActive = true; this.shieldTimer = SHIELD_DURATION;
    }

    activateHelmet(duration = 10000) {
        this.shieldActive = true; this.shieldTimer = duration;
    }

    upgradeRank() {
        this.rank = Math.min(this.rank + 1, 2);
        this.shootCooldown = [400, 250, 150][this.rank];
        this.speed = [1.5, 2.0, 2.5][this.rank];
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

    renderBullets(ctx, ox, oy) {
        for (const b of this.bullets) b.render(ctx, ox, oy);
    }
}
