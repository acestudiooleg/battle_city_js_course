// CollisionManager.js — система зіткнень
// Урок 7: Колізії

import { FIELD_W, FIELD_H } from './constants.js';

export class CollisionManager {
    constructor(field, onExplosion) {
        this.field = field;
        this.onExplosion = onExplosion ?? (() => {});
    }

    update(player) {
        this._processBullets(player);
    }

    _aabb(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    _processBullets(shooter) {
        for (let i = shooter.bullets.length - 1; i >= 0; i--) {
            const b = shooter.bullets[i];
            if (!b.active) continue;

            const bx = b.x - b.width / 2;
            const by = b.y - b.height / 2;

            // Межі поля
            if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
                b.active = false;
                this.onExplosion(b.x, b.y, 'small');
                continue;
            }

            // Стіни
            const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
            if (tile) {
                b.active = false;
                if (tile.material === 'brick') {
                    this.field.destroyBrickPair(tile, b.direction);
                }
                this.onExplosion(b.x, b.y, 'small');
                continue;
            }

            // Штаб
            if (this.field.bulletHitEagle && this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false;
                this.field.destroyEagle();
                this.onExplosion(
                    this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2,
                    'large'
                );
                continue;
            }
        }
    }
}
