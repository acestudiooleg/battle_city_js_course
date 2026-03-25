// CollisionManager.js — Урок 10: повна версія з ворогами

import { FIELD_W, FIELD_H } from './constants.js';

export class CollisionManager {
    constructor(field, onExplosion) {
        this.field = field;
        this.onExplosion = onExplosion ?? (() => {});
    }

    update(player, enemies = []) {
        this._processBullets(player, enemies, true);
        for (const enemy of enemies) {
            this._processEnemyBullets(enemy, player);
        }
    }

    _aabb(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    _processBullets(shooter, targets, isPlayer) {
        for (let i = shooter.bullets.length - 1; i >= 0; i--) {
            const b = shooter.bullets[i];
            if (!b.active) continue;
            const bx = b.x - b.width / 2, by = b.y - b.height / 2;

            if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
                b.active = false; this.onExplosion(b.x, b.y, 'small'); continue;
            }

            const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
            if (tile) {
                b.active = false;
                if (tile.material === 'brick') this.field.destroyBrickPair(tile, b.direction);
                this.onExplosion(b.x, b.y, 'small'); continue;
            }

            if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false; this.field.destroyEagle();
                this.onExplosion(this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2, 'large'); continue;
            }

            if (isPlayer) {
                for (const enemy of targets) {
                    if (!enemy.alive || enemy.spawnFlash) continue;
                    if (this._aabb(bx, by, b.width, b.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
                        b.active = false; enemy.hp--;
                        if (enemy.hp <= 0) {
                            enemy.alive = false;
                            this.onExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 'large');
                        } else {
                            this.onExplosion(b.x, b.y, 'small');
                        }
                        break;
                    }
                }
            }
        }
    }

    _processEnemyBullets(enemy, player) {
        for (let i = enemy.bullets.length - 1; i >= 0; i--) {
            const b = enemy.bullets[i];
            if (!b.active) continue;
            const bx = b.x - b.width / 2, by = b.y - b.height / 2;

            if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
                b.active = false; this.onExplosion(b.x, b.y, 'small'); continue;
            }

            const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
            if (tile) {
                b.active = false;
                if (tile.material === 'brick') this.field.destroyBrickPair(tile, b.direction);
                this.onExplosion(b.x, b.y, 'small'); continue;
            }

            if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false; this.field.destroyEagle();
                this.onExplosion(this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2, 'large'); continue;
            }

            if (player.alive && !player.isRespawning) {
                if (this._aabb(bx, by, b.width, b.height, player.x, player.y, player.width, player.height)) {
                    b.active = false; player.hit();
                    this.onExplosion(player.x + player.width / 2, player.y + player.height / 2, 'large');
                }
            }
        }
    }

    tankOverlap(tank, nx, ny, allTanks) {
        for (const other of allTanks) {
            if (other === tank || !other.alive) continue;
            if (other.isRespawning) continue;
            if (other.spawnFlash) continue;
            if (this._aabb(nx, ny, tank.width, tank.height, other.x, other.y, other.width, other.height)) return true;
        }
        return false;
    }
}
