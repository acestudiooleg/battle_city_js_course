# 🦅 Урок 9.1: Штаб — Орел (Eagle)

## Що ми створимо сьогодні

Сьогодні ми додамо **штаб** — головну споруду, яку потрібно захищати! В оригінальній грі Battle City це **Орел** (Eagle). Якщо ворог його знищить — одразу **Game Over**!

Ось що буде після цього дня:

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-09/game.html" frameborder="0" allowfullscreen></iframe>

---

## 🏰 Що таке штаб?

В грі Battle City штаб — це:
- **Позиція:** внизу по центру поля (тайлові координати 12, 24)
- **Розмір:** 2×2 тайли (32×32 пікселів — як танк)
- **Захист:** навколо нього П-подібна стінка з цегли
- **Головне правило:** якщо штаб знищено — гравець програв!

---

## 📋 Що вже є

В уроці 8 наш `GameField.js` вже має об'єкт `eagle`:

```js
this.eagle = {
    x: 12 * TILE, y: 24 * TILE,
    width: TANK_SIZE, height: TANK_SIZE,
    alive: true,
};
```

А метод `_buildEagleWall()` вже будує захисну стінку. Але зараз штаб — просто об'єкт без ігрової логіки. Сьогодні ми додамо:

1. **Методи знищення штабу** — `destroyEagle()`, `isEagleDestroyed()`
2. **Колізію куля ↔ штаб** — `bulletHitEagle()` в CollisionManager
3. **Game Over** — коли штаб знищено або гравець втратив усі життя
4. **Перемогу** — коли всі вороги знищені
5. **Систему життів гравця** — 3 життя, відродження

---

## 🔧 Нові константи

Спершу додамо нові константи до `constants.js`:

```js
// === NES Battle City — Константи гри ===

// ... (все що було раніше залишається) ...

// ─── Ігрова логіка ─────────────────────────────────────────────

// Початкова кількість життів гравця
export const PLAYER_LIVES = 3;

// Затримка перед відродженням (мс)
export const RESPAWN_DELAY = 2000;

// Тривалість мигання щита після відродження (мс)
export const SHIELD_DURATION = 2000;
```

### Розбираємо код:

- **`PLAYER_LIVES = 3`** — гравець починає з трьома життями. Коли танк знищено — одне життя відбирається. Якщо 0 — Game Over
- **`RESPAWN_DELAY = 2000`** — 2 секунди затримка перед тим як гравець з'явиться знову на полі після знищення
- **`SHIELD_DURATION = 2000`** — 2 секунди невразливості після відродження (танк мигає і кулі не шкодять)

---

## 🛡️ Оновлюємо Player.js

Зараз наш Player — простий танк без життів. Оновимо його:

```js
// Player.js — танк гравця з системою життів
// Урок 9: Штаб та стан гри

import { Tank } from './Tank.js';
import { TILE, PLAYER_LIVES, RESPAWN_DELAY, SHIELD_DURATION } from './constants.js';
import { playerYellow } from './colors.js';

export class Player extends Tank {
    constructor() {
        // Спавн: тайл (8, 24) — стандартна позиція P1 в NES Battle City
        const spawnX = 8 * TILE;  // 8 тайлів від лівого краю
        const spawnY = 24 * TILE; // 24 тайли від верху (майже внизу)

        // Викликаємо конструктор батьківського класу Tank
        // Колір — жовтий, швидкість — 2, HP — 1
        super(spawnX, spawnY, playerYellow, 2, 1);

        // Зберігаємо стартову позицію для відродження
        this.spawnX = spawnX;
        this.spawnY = spawnY;

        // Гравець дивиться вгору на початку
        this.direction = 'up';

        // ─── Система життів ─────────────────────────────────────
        /** Скільки життів залишилось */
        this.lives = PLAYER_LIVES; // 3

        // ─── Стан відродження ────────────────────────────────────
        /** Чи зараз гравець чекає на відродження */
        this.isRespawning = false;
        /** Лічильник часу до відродження (мс) */
        this.respawnTimer = 0;

        // ─── Щит невразливості ───────────────────────────────────
        /** Чи активний щит (танк мигає, кулі не шкодять) */
        this.shieldActive = true; // активний одразу після появи
        /** Скільки часу залишилось щиту (мс) */
        this.shieldTimer = SHIELD_DURATION;
        /** Лічильник кадрів мигання (для ефекту мерехтіння) */
        this.shieldFlash = 0;

        // Гравець стріляє швидше ніж вороги
        this.shootCooldown = 400; // 400мс між пострілами
    }

    /**
     * Оновлення стану гравця кожен кадр
     * @param {number} dt - час між кадрами (мс)
     * @param {Function} canMove - функція перевірки руху
     * @param {number} now - поточний час (мс)
     * @param {Function} getMovement - функція читання клавіш руху
     * @param {Function} isShoot - функція перевірки кнопки стрільби
     */
    update(dt, canMove, now, getMovement, isShoot) {
        // ─── Відлік відродження ──────────────────────────────────
        // Якщо гравець загинув і чекає на респавн:
        if (this.isRespawning) {
            // Зменшуємо таймер кожен кадр
            this.respawnTimer -= dt;

            // Коли таймер дійшов до 0 — відроджуємо!
            if (this.respawnTimer <= 0) {
                this._doRespawn();
            }
            // Поки респавн — не оновлюємо нічого іншого
            return;
        }

        // ─── Щит невразливості ───────────────────────────────────
        if (this.shieldActive) {
            // Зменшуємо таймер щита
            this.shieldTimer -= dt;
            // Мерехтіння: кожен кадр збільшуємо лічильник (0-9)
            this.shieldFlash = (this.shieldFlash + 1) % 10;
            // Коли час вийшов — вимикаємо щит
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
            }
        }

        // Якщо танк мертвий — не оновлюємо
        if (!this.alive) return;

        // ─── Рух ─────────────────────────────────────────────────
        const dir = getMovement();  // Зчитуємо напрямок з клавіатури
        if (dir) {
            this.move(dir, dt, canMove); // Рухаємо танк
        }

        // ─── Стрільба ────────────────────────────────────────────
        if (isShoot()) {
            this.shoot(now, 'player'); // Стріляємо
        }

        // Оновлюємо позиції куль
        this.updateBullets();
    }

    /**
     * Гравець отримує влучання від ворожої кулі
     * @returns {boolean} true = більше немає життів (game over)
     */
    hit() {
        // Якщо щит активний — куля не шкодить!
        if (this.shieldActive) return false;

        // Танк знищено
        this.alive = false;
        // Відбираємо одне життя
        this.lives--;

        // Якщо життів 0 або менше — це Game Over!
        if (this.lives <= 0) {
            this.lives = 0;
            return true; // повертаємо true = game over
        }

        // Якщо ще є життя — запускаємо таймер відродження
        this.isRespawning = true;
        this.respawnTimer = RESPAWN_DELAY; // 2 секунди до респавну
        this.bullets = []; // Очищаємо всі кулі
        return false; // game over ще не настав
    }

    /**
     * Виконує відродження: повертає танк на стартову позицію
     * Викликається автоматично коли таймер respawnTimer дійшов до 0
     */
    _doRespawn() {
        // Повертаємо танк на стартову позицію
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.direction = 'up';       // дивимося вгору
        this.alive = true;           // танк знову живий
        this.isRespawning = false;   // більше не чекаємо
        this.shieldActive = true;    // вмикаємо щит
        this.shieldTimer = SHIELD_DURATION; // на 2 секунди
    }

    /**
     * Малювання гравця (з ефектом мигання щита)
     */
    render(ctx, ox, oy) {
        // Під час респавну — не малюємо нічого
        if (this.isRespawning) return;

        // Якщо щит активний — танк мерехтить (зникає кожні 5 кадрів)
        if (this.shieldActive && this.shieldFlash > 5) return;

        // Малюємо танк як зазвичай (метод батьківського класу)
        super.render(ctx, ox, oy);

        // Малюємо рамку щита навколо танка
        if (this.shieldActive) {
            ctx.save();
            // Жовтий напівпрозорий прямокутник
            ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)';
            ctx.lineWidth = 2;
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
```

### Розбираємо новий код:

**Система життів:**
- Гравець починає з `PLAYER_LIVES = 3` життями
- При влучанні `hit()` відбирає 1 життя
- Якщо `lives <= 0` — повертає `true` (Game Over!)
- Якщо ще є життя — запускає таймер відродження

**Відродження (Respawn):**
- `isRespawning = true` — танк зник з поля, чекаємо 2 секунди
- `respawnTimer` зменшується кожен кадр
- Коли дійшов до 0 — `_doRespawn()` повертає танк на старт з щитом

**Щит невразливості:**
- Після spawn/respawn танк мерехтить 2 секунди
- `shieldFlash` створює ефект мерехтіння (то видно, то ні)
- Поки щит активний — `hit()` повертає false (куля не шкодить)

---

## ✅ Що далі

В наступному підуроці 9.2 ми підключимо колізію **куля ↔ штаб** у CollisionManager, щоб ворожі кулі могли знищити Орла.
