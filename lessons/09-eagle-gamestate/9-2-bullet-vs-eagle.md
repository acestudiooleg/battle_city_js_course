# 💥 Урок 9.2: Куля vs Штаб

## Як куля знищує штаб?

Зараз наш CollisionManager перевіряє тільки зіткнення **куля ↔ стіна**. Потрібно додати перевірку **куля ↔ штаб (Орел)**. Якщо будь-яка куля (навіть гравця!) влучає в Орла — він знищується!

---

## 🔧 Оновлюємо CollisionManager.js

Додамо перевірку штабу та перевірку куля ↔ танк (щоб кулі ворогів могли знищувати гравця):

```js
// CollisionManager.js — система зіткнень
// Урок 9: + куля vs штаб, куля vs танк

import { FIELD_W, FIELD_H } from './constants.js';

export class CollisionManager {
    /**
     * @param {GameField} field - ігрове поле (стіни, вода, штаб)
     * @param {Function} onExplosion - callback для створення вибуху
     */
    constructor(field, onExplosion) {
        this.field = field;
        // Функція створення вибуху: (x, y, type) => {}
        // type може бути 'small' або 'large'
        this.onExplosion = onExplosion ?? (() => {});
    }

    /**
     * Головний метод оновлення — перевіряє всі зіткнення
     * @param {Player} player - танк гравця
     * @param {Enemy[]} enemies - масив ворожих танків (поки пустий)
     */
    update(player, enemies = []) {
        // Перевіряємо кулі гравця (можуть влучити в стіну, штаб або ворога)
        this._processBullets(player, enemies, true);

        // Перевіряємо кулі ворогів (можуть влучити в стіну, штаб або гравця)
        for (const enemy of enemies) {
            this._processEnemyBullets(enemy, player);
        }
    }

    /**
     * Перевірка перетину двох прямокутників (AABB)
     * Повертає true якщо прямокутники перетинаються
     */
    _aabb(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw   // лівий край A лівіше правого краю B
            && ax + aw > bx   // правий край A правіше лівого краю B
            && ay < by + bh   // верхній край A вище нижнього краю B
            && ay + ah > by;  // нижній край A нижче верхнього краю B
    }

    /**
     * Перевіряє зіткнення куль гравця зі стінами, штабом та ворогами
     * @param {Tank} shooter - хто стріляв
     * @param {Enemy[]} targets - вороги, в яких можна влучити
     * @param {boolean} isPlayer - чи це гравець (для логіки)
     */
    _processBullets(shooter, targets, isPlayer) {
        // Проходимо по всіх кулях стрільця ЗАДОМ НАПЕРЕД
        // (задом наперед — щоб безпечно видаляти елементи)
        for (let i = shooter.bullets.length - 1; i >= 0; i--) {
            const b = shooter.bullets[i]; // поточна куля
            if (!b.active) continue; // пропускаємо неактивні

            // Координати прямокутника кулі (центр → лівий верхній кут)
            const bx = b.x - b.width / 2;
            const by = b.y - b.height / 2;

            // ─── 1. Межі поля ────────────────────────────────────
            // Якщо куля вилетіла за край поля — знищуємо
            if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
                b.active = false; // деактивуємо кулю
                this.onExplosion(b.x, b.y, 'small'); // маленький вибух
                continue; // переходимо до наступної кулі
            }

            // ─── 2. Стіни ────────────────────────────────────────
            const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
            if (tile) {
                b.active = false;
                // Якщо це цегла — руйнуємо NES-парою
                if (tile.material === 'brick') {
                    this.field.destroyBrickPair(tile, b.direction);
                }
                // Бетон — куля просто зникає (бетон невразливий)
                this.onExplosion(b.x, b.y, 'small');
                continue;
            }

            // ─── 3. Штаб (Орел) ─────────────────────────────────
            // Будь-яка куля (навіть гравця!) може знищити штаб!
            if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false;
                this.field.destroyEagle(); // штаб знищено!
                // Великий вибух на місці штабу
                this.onExplosion(
                    this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2,
                    'large'
                );
                continue;
            }

            // ─── 4. Вороги (тільки для куль гравця) ──────────────
            if (isPlayer) {
                for (const enemy of targets) {
                    // Пропускаємо мертвих ворогів та тих що ще спавняться
                    if (!enemy.alive || enemy.spawnFlash) continue;
                    // Перевіряємо перетин кулі з ворогом
                    if (this._aabb(bx, by, b.width, b.height,
                                   enemy.x, enemy.y, enemy.width, enemy.height)) {
                        b.active = false;
                        // Знімаємо HP у ворога
                        enemy.hp--;
                        if (enemy.hp <= 0) {
                            enemy.alive = false; // ворог знищений!
                            // Великий вибух при знищенні
                            this.onExplosion(
                                enemy.x + enemy.width / 2,
                                enemy.y + enemy.height / 2,
                                'large'
                            );
                        } else {
                            // Маленький вибух — влучання але не знищення
                            this.onExplosion(b.x, b.y, 'small');
                        }
                        break; // одна куля — один ворог
                    }
                }
            }
        }
    }

    /**
     * Перевіряє кулі ворога: стіни, штаб та гравця
     * @param {Enemy} enemy - ворог, чиї кулі перевіряємо
     * @param {Player} player - гравець, в якого можна влучити
     */
    _processEnemyBullets(enemy, player) {
        for (let i = enemy.bullets.length - 1; i >= 0; i--) {
            const b = enemy.bullets[i];
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
            if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false;
                this.field.destroyEagle();
                this.onExplosion(
                    this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2,
                    'large'
                );
                continue;
            }

            // ─── Гравець ─────────────────────────────────────────
            // Перевіряємо чи куля ворога влучила в гравця
            if (player.alive && !player.isRespawning) {
                if (this._aabb(bx, by, b.width, b.height,
                               player.x, player.y, player.width, player.height)) {
                    b.active = false;
                    // hit() повертає true якщо у гравця закінчились життя
                    player.hit();
                    this.onExplosion(
                        player.x + player.width / 2,
                        player.y + player.height / 2,
                        'large'
                    );
                }
            }
        }
    }

    /**
     * Перевіряє чи танк перекриває іншого танка
     * (танки не можуть проходити одне через одне)
     * @param {Tank} tank - танк що рухається
     * @param {number} nx - нова позиція X
     * @param {number} ny - нова позиція Y
     * @param {Tank[]} allTanks - масив усіх танків
     * @returns {boolean} true якщо є перекриття
     */
    tankOverlap(tank, nx, ny, allTanks) {
        for (const other of allTanks) {
            // Не перевіряємо танк із самим собою
            if (other === tank) continue;
            // Пропускаємо мертвих та тих що спавняться
            if (!other.alive) continue;
            if (other.isRespawning) continue;
            // Перевіряємо AABB перетин
            if (this._aabb(nx, ny, tank.width, tank.height,
                           other.x, other.y, other.width, other.height)) {
                return true; // є перекриття!
            }
        }
        return false; // немає перекриття
    }
}
```

### Що нового:

1. **`bulletHitEagle`** — перевірка влучання в штаб (вже є в GameField)
2. **`_processEnemyBullets`** — окремий метод для куль ворогів (перевіряє штаб + гравця)
3. **`player.hit()`** — виклик при влучанні ворожої кулі в гравця
4. **`tankOverlap`** — перевірка перетину танків (танки не проходять один через одного)

---

## ✅ Що далі

В підуроці 9.3 ми створимо **Game Over** анімацію та повну координацію в `main.js`.
