# 🎮 Урок 7.2: CollisionManager.js — структура класу

## Центр управління зіткненнями! 🎯

Замість розкидувати перевірки по всьому коду, ми зберемо їх в одному місці — `CollisionManager`.

---

## Створюємо `CollisionManager.js`

```javascript
// CollisionManager.js — система зіткнень
// Урок 7: Колізії

import { FIELD_W, FIELD_H } from './constants.js';

/**
 * Клас CollisionManager — обробляє всі зіткнення в грі.
 * Куля ↔ стіни, куля ↔ танки, куля ↔ штаб, куля ↔ куля.
 */
export class CollisionManager {
    /**
     * @param {GameField} field       — ігрове поле (стіни, штаб)
     * @param {Function}  onExplosion — callback для створення вибуху (fx, fy, type)
     */
    constructor(field, onExplosion) {
        this.field = field;
        this.onExplosion = onExplosion ?? (() => {}); // якщо не передали — порожня функція
    }

    /**
     * Основний метод — викликається щокадру.
     * Обробляє кулі гравця.
     * @param {Player} player — гравець
     */
    update(player) {
        this._processBullets(player);
    }

    /**
     * AABB — перевірка перетинання двох прямокутників.
     * @returns {boolean} — true якщо перетинаються
     */
    _aabb(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx &&
               ay < by + bh && ay + ah > by;
    }

    /**
     * Обробляє кулі одного танка: стіни, штаб, межі поля.
     */
    _processBullets(shooter) {
        // Зворотній цикл: йдемо від останньої кулі до першої (i = 4, 3, 2, 1, 0)
        // Чому з кінця? Якщо видалимо елемент з масиву — індекси ЗА ним зміняться.
        // А індекси ПЕРЕД ним — ні. Тому безпечно йти з кінця.
        for (let i = shooter.bullets.length - 1; i >= 0; i--) {
            const b = shooter.bullets[i]; // поточна куля
            if (!b.active) continue;       // мертва — пропускаємо

            // Куля зберігає координати центру (b.x, b.y).
            // Для AABB потрібен лівий верхній кут — зсуваємо на половину розміру:
            const bx = b.x - b.width / 2;   // лівий край кулі
            const by = b.y - b.height / 2;  // верхній край кулі

            // ── 1. Перевірка: куля за межами поля? ──
            if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
                b.active = false;                    // деактивуємо кулю
                this.onExplosion(b.x, b.y, 'small'); // маленький вибух на краю
                continue;                            // переходимо до наступної кулі
            }

            // ── 2. Перевірка: куля влучила в стіну? ──
            // bulletHitWall повертає тайл, у який влучили, або null
            const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
            if (tile) {
                b.active = false; // куля зникає в будь-якому випадку
                if (tile.material === 'brick') {
                    this.field.damageTile(tile); // цегла руйнується!
                }
                // Бетон (concrete) — куля зникає, але стіна залишається
                this.onExplosion(b.x, b.y, 'small'); // вибух на місці влучання
                continue;
            }

            // ── 3. Перевірка: куля влучила в штаб (Орел)? ──
            if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
                b.active = false;
                this.field.destroyEagle(); // штаб знищено → game over!
                this.onExplosion(
                    // Великий вибух у центрі орла
                    this.field.eagle.x + this.field.eagle.width / 2,
                    this.field.eagle.y + this.field.eagle.height / 2,
                    'large'
                );
                continue;
            }
        }
    }
}
```

---

## Розбираємо код

### Порядок перевірки куль

Для кожної кулі перевіряємо **по черзі**:
1. Чи вилетіла за межі → деактивуємо
2. Чи влучила в стіну → руйнуємо + деактивуємо
3. Чи влучила в штаб → game over

Як тільки спрацювала одна перевірка — `continue` (переходимо до наступної кулі).

### Зворотній цикл `for (let i = length - 1; i >= 0; i--)`

Ми ітеруємо **з кінця** масиву. Це безпечно при видаленні елементів — індекси вже оброблених елементів не змінюються.

### `onExplosion` — callback

Замість створювати вибухи напряму, ми передаємо **callback-функцію**. Це робить CollisionManager незалежним від системи вибухів (яку створимо в уроці 8).

---

## Підсумок

- ✅ `CollisionManager` — один клас для всіх зіткнень
- ✅ `_aabb()` — універсальна перевірка перетинання прямокутників
- ✅ `_processBullets()` — обробка куль: межі → стіни → штаб
- ✅ `onExplosion` callback — для майбутніх вибухів
