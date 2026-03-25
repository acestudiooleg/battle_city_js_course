# 🎮 Урок 4.5: Анімація гусениць

## Як оживити танк?

Коли танк стоїть — гусениці нерухомі. Коли їде — вони обертаються! В NES це робили за допомогою **двох кадрів** (frames), які чергуються:

```
Кадр 0                  Кадр 1
 ║ ┌────────┐ ║          ║ ┌────────┐ ║
 ▓ │        │ ▓          ░ │        │ ░
 ░ │  танк  │ ░          ▓ │  танк  │ ▓
 ▓ │        │ ▓          ░ │        │ ░
 ║ └────────┘ ║          ║ └────────┘ ║

 Смужки зсунуті вниз      Смужки зсунуті вгору
```

Чергування кадрів 0 → 1 → 0 → 1 створює ілюзію руху!

---

## Як це працює в коді?

В класі `Tank` є дві властивості:

```javascript
this.animFrame = 0;    // поточний кадр (0 або 1)
this.animTimer = 0;    // лічильник часу (мілісекунди)
```

В методі `move()` ми вже додали анімацію:

```javascript
// Всередині move(), після зміни позиції:
this.animTimer += dt;
if (this.animTimer > 120) {          // кожні 120 мс
    this.animFrame = (this.animFrame + 1) % 2;  // 0 → 1 → 0 → 1
    this.animTimer = 0;              // скидаємо лічильник
}
```

### Що тут відбувається?

1. Кожен кадр ми додаємо `dt` (зазвичай ~16 мс) до `animTimer`
2. Коли `animTimer` накопичує більше 120 мс — перемикаємо кадр
3. `(0 + 1) % 2 = 1`, потім `(1 + 1) % 2 = 0` — чергування!
4. Скидаємо `animTimer` в 0 і починаємо рахувати знову

```
Час:    0    16   32   48   64   80   96  112  128  144  160
Timer:  0    16   32   48   64   80   96  112   8    24   40
Frame:  0    0    0    0    0    0    0    0    1    1    1
                                              ↑
                                     timer > 120 → Frame змінився!
```

---

## Як `animFrame` впливає на малювання?

Подивись на метод `_drawTreads()` в `Tank.js`:

```javascript
_drawTreads(ctx, sx, sy, sz) {
    ctx.fillStyle = darkGray;
    const af = this.animFrame; // 0 або 1

    if (this.direction === 'up' || this.direction === 'down') {
        // Ліва гусениця
        ctx.fillRect(sx,          sy + af * 4,            4, sz / 2 - 2);
        ctx.fillRect(sx,          sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2);
        // Права гусениця
        ctx.fillRect(sx + sz - 4, sy + af * 4,            4, sz / 2 - 2);
        ctx.fillRect(sx + sz - 4, sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2);
    } else {
        // Аналогічно для горизонтального руху
        ...
    }
}
```

Коли `af = 0` — смужки гусениць зсунуті в одну сторону.
Коли `af = 1` — зсунуті в іншу. Разом це створює ілюзію обертання!

```
af = 0:              af = 1:
▓▓▓▓                 ····
····                 ▓▓▓▓
▓▓▓▓                 ····
····                 ▓▓▓▓
```

---

## Важливо: анімація тільки під час руху!

Зверни увагу: код анімації знаходиться **всередині** `move()`. Це означає, що:
- Якщо гравець тримає WASD — `move()` викликається → анімація працює
- Якщо відпустив клавіші — `move()` не викликається → гусениці застигають

Це саме те, що потрібно!

---

## Перевіряємо!

Відкрий гру в браузері та натисни WASD. Ти побачиш:
- Танк рухається по полю
- Гусениці "обертаються" при русі
- При повороті танк вирівнюється по сітці
- Танк не виїжджає за межі поля

---

## Повний `Tank.js` після уроку 4

Переконайся, що твій `Tank.js` містить всі методи:

```javascript
// Tank.js — базовий клас для всіх танків
// Урок 4: Рух танка (повна версія з усіма методами)

import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js'; // розміри гри
import { darkGray } from './colors.js'; // колір гусениць та дула

/**
 * Базовий клас Tank — шаблон для всіх танків у грі.
 * Містить логіку руху, малювання, анімації гусениць.
 */
export class Tank {
    /**
     * @param {number} fx    — X-позиція на полі (пікселі)
     * @param {number} fy    — Y-позиція на полі (пікселі)
     * @param {string} color — колір корпусу
     * @param {number} speed — швидкість (пікс/кадр)
     * @param {number} hp    — здоров'я
     */
    constructor(fx, fy, color, speed = 2, hp = 1) {
        this.x = fx;              // позиція X на ігровому полі
        this.y = fy;              // позиція Y на ігровому полі
        this.width  = TANK_SIZE;  // ширина танка (32px)
        this.height = TANK_SIZE;  // висота танка (32px)
        this.color = color;       // колір корпусу
        this.direction = 'up';    // початковий напрямок
        this.speed = speed;       // швидкість руху
        this.hp    = hp;          // поточне здоров'я
        this.alive = true;        // чи живий
        this.animFrame = 0;       // кадр анімації гусениць (0 або 1)
        this.animTimer = 0;       // лічильник часу для анімації (мс)
    }

    // ─── Рух ───────────────────────────────────────────────────────

    /**
     * Вирівнює танк по тайловій сітці при зміні напрямку.
     * @param {string} newDir — новий напрямок руху
     */
    snapToGrid(newDir) {
        if (newDir === 'left' || newDir === 'right') {
            this.y = Math.round(this.y / TILE) * TILE; // округлюємо Y
        } else {
            this.x = Math.round(this.x / TILE) * TILE; // округлюємо X
        }
    }

    /**
     * Рухає танк у заданому напрямку.
     * @param {string}   dir     — напрямок руху
     * @param {number}   dt      — deltaTime (мс)
     * @param {Function} canMove — перевірка колізій: (tank, nx, ny) => boolean
     * @returns {boolean} — true якщо рух відбувся
     */
    move(dir, dt, canMove) {
        if (!this.alive) return false; // мертвий танк не рухається

        if (dir !== this.direction) {
            this.snapToGrid(dir);   // вирівнюємо при повороті
            this.direction = dir;   // зберігаємо новий напрямок
        }

        const step = this.speed;    // крок руху (пікселів)
        let nx = this.x;            // нова X (поки = поточна)
        let ny = this.y;            // нова Y (поки = поточна)

        // Зсуваємо координату залежно від напрямку
        switch (dir) {
            case 'up':    ny -= step; break; // вгору = менше Y
            case 'down':  ny += step; break; // вниз = більше Y
            case 'left':  nx -= step; break; // вліво = менше X
            case 'right': nx += step; break; // вправо = більше X
        }

        // Обмеження межами поля (clamp)
        nx = Math.max(0, Math.min(FIELD_W - this.width,  nx)); // 0..384
        ny = Math.max(0, Math.min(FIELD_H - this.height, ny)); // 0..384

        // Перевірка колізій через зовнішню функцію
        if (canMove(this, nx, ny)) {
            this.x = nx;               // оновлюємо позицію X
            this.y = ny;               // оновлюємо позицію Y

            // Анімація гусениць: перемикаємо кадр кожні 120 мс
            this.animTimer += dt;
            if (this.animTimer > 120) {
                this.animFrame = (this.animFrame + 1) % 2; // 0→1→0→1
                this.animTimer = 0;    // скидаємо лічильник
            }
            return true;               // рух вдався
        }
        return false;                  // рух заблоковано
    }

    // ─── Малювання ─────────────────────────────────────────────────

    /**
     * Малює танк на Canvas (гусениці → корпус → дуло).
     * @param {CanvasRenderingContext2D} ctx — контекст для малювання
     * @param {number} ox — зсув поля по X (FIELD_X)
     * @param {number} oy — зсув поля по Y (FIELD_Y)
     */
    render(ctx, ox, oy) {
        if (!this.alive) return;            // мертвий — не малюємо
        const sx = Math.round(this.x) + ox; // screenX = fieldX + offset
        const sy = Math.round(this.y) + oy; // screenY = fieldY + offset
        const sz = this.width;               // розмір танка (32px)

        ctx.save();                          // зберігаємо стан Canvas
        this._drawTreads(ctx, sx, sy, sz);   // 1. гусениці
        ctx.fillStyle = this.color;          // 2. корпус (колір танка)
        ctx.fillRect(sx + 4, sy + 4, sz - 8, sz - 8); // відступ 4px від гусениць
        this._drawBarrel(ctx, sx, sy, sz);   // 3. дуло
        ctx.restore();                       // відновлюємо стан Canvas
    }

    /**
     * Малює гусениці (по 2 секції з кожного боку).
     * animFrame зсуває секції на 4px, створюючи ілюзію обертання.
     */
    _drawTreads(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;    // темно-сірий колір гусениць
        const af = this.animFrame;   // 0 або 1

        if (this.direction === 'up' || this.direction === 'down') {
            // Вертикальний рух: гусениці ЛІВОРУЧ та ПРАВОРУЧ
            ctx.fillRect(sx,          sy + af * 4,            4, sz / 2 - 2); // ліва верх
            ctx.fillRect(sx,          sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2); // ліва низ
            ctx.fillRect(sx + sz - 4, sy + af * 4,            4, sz / 2 - 2); // права верх
            ctx.fillRect(sx + sz - 4, sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2); // права низ
        } else {
            // Горизонтальний рух: гусениці ЗВЕРХУ та ЗНИЗУ
            ctx.fillRect(sx + af * 4,           sy,           sz / 2 - 2, 4); // верхня ліва
            ctx.fillRect(sx + sz/2 + (1-af)*4,  sy,           sz / 2 - 2, 4); // верхня права
            ctx.fillRect(sx + af * 4,           sy + sz - 4,  sz / 2 - 2, 4); // нижня ліва
            ctx.fillRect(sx + sz/2 + (1-af)*4,  sy + sz - 4,  sz / 2 - 2, 4); // нижня права
        }
    }

    /**
     * Малює дуло танка у напрямку руху.
     * Дуло виступає за межі корпусу на barrelLen пікселів.
     */
    _drawBarrel(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;            // той самий колір, що й гусениці
        const barrelLen = sz * 0.55;         // довжина дула ≈ 17px
        const barrelW   = sz * 0.2;          // ширина дула ≈ 6px
        const cx = sx + sz / 2 - barrelW / 2; // горизонтальний центр
        const cy = sy + sz / 2 - barrelW / 2; // вертикальний центр

        switch (this.direction) {
            case 'up':    ctx.fillRect(cx, sy - barrelLen, barrelW, barrelLen); break; // вгору
            case 'down':  ctx.fillRect(cx, sy + sz,        barrelW, barrelLen); break; // вниз
            case 'left':  ctx.fillRect(sx - barrelLen, cy, barrelLen, barrelW); break; // вліво
            case 'right': ctx.fillRect(sx + sz, cy,        barrelLen, barrelW); break; // вправо
        }
    }
}
```

---

## Підсумок Дня 4

За цей урок ти:
- ✅ Створив `InputManager.js` — зчитування клавіатури
- ✅ Написав повноцінний ігровий цикл з `deltaTime`
- ✅ Додав `move()` — рух танка з обмеженням меж поля
- ✅ Додав `snapToGrid()` — вирівнювання при повороті
- ✅ Анімація гусениць: два кадри чергуються кожні 120 мс

---

## 🔄 Що буде далі?

У наступному уроці ми:
- 🔫 Створимо клас `Bullet` — кулі, що летять!
- 💥 Додамо метод `shoot()` до танка з кулдауном
- 🎯 Підключимо стрільбу до клавіші Space
- 🧹 Навчимося видаляти кулі, що вилетіли за межі поля

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-04/game.html){target="_blank"}
