# 🎮 Урок 3.5: Player.js — жовтий танк гравця

## Фінальний крок — гравець на полі! 🏁

Створюємо `Player.js` — підклас `Tank` для гравця, і підключаємо все до `main.js`.

---

## ✍️ Створюємо Player.js

```js
// Player.js — танк гравця (жовтий)

import { Tank } from './Tank.js';        // базовий клас танка
import { TILE } from './constants.js';   // розмір тайла (16px)
import { playerYellow } from './colors.js'; // жовтий колір гравця

/**
 * Клас Player — танк гравця.
 * Успадковує render(), _drawTreads(), _drawBarrel() від Tank.
 * Задає лише свої параметри: колір, позицію спавну, швидкість.
 */
export class Player extends Tank {
    constructor() {
        // Позиція спавну: тайл (8, 24) — ліворуч від штабу
        const spawnX = 8 * TILE;   // 8 * 16 = 128px від лівого краю поля
        const spawnY = 24 * TILE;  // 24 * 16 = 384px від верхнього краю

        // Викликаємо конструктор батьківського класу Tank
        // super(x, y, колір, швидкість, здоров'я)
        super(spawnX, spawnY, playerYellow, 2, 1);

        this.direction = 'up'; // гравець стартує дивлячись вгору
    }
}
```

### Що таке `extends` та `super`?

```js
class Player extends Tank {
    constructor() {
        super(...); // Викликаємо конструктор батьківського класу Tank
    }
}
```

`Player` **успадковує** всі методи `Tank`:
- `render()` — малювання ✅
- `_drawTreads()` — гусениці ✅
- `_drawBarrel()` — дуло ✅

Ми тільки задаємо специфічні налаштування гравця (колір, позиція появи танку).

---

## ✍️ Оновлюємо main.js

```js
// main.js — Урок 3: Малюємо танк

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H } from './constants.js';
import { black, borderBg } from './colors.js';
import { Player } from './Player.js';     // наш жовтий танк

// Отримуємо Canvas та контекст для малювання
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Створюємо об'єкт гравця (new → викликає конструктор Player)
const player = new Player();

/**
 * Малює весь ігровий екран: рамку, поле та танк.
 */
function draw() {
    // 1. Сірий фон (стає рамкою навколо чорного поля)
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Чорне ігрове поле (малюється поверх сірого)
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3. Танк гравця (передаємо зсув поля для правильних координат)
    player.render(ctx, FIELD_X, FIELD_Y);
}

draw(); // запускаємо малювання
```

---

## 🔍 Схема координат

```
Canvas (0,0)
│
├── FIELD_X=16, FIELD_Y=16  ← початок ігрового поля
│   │
│   ├── Player.x=128 (8*TILE), Player.y=384 (24*TILE)
│   │
│   └── На екрані: sx = 128+16 = 144, sy = 384+16 = 400
│
└── ...
```

---

## ✅ Підсумок дня

Сьогодні ти:
- ✅ Зрозумів що таке клас, конструктор і методи
- ✅ Написав `Tank.js` з властивостями (x, y, color, direction, hp)
- ✅ Реалізував `render()` з корпусом та гусеницями
- ✅ Додав `_drawBarrel()` для дула в 4 напрямках
- ✅ Створив `Player.js` через успадкування `extends`
- ✅ Побачив жовтий танк на ігровому полі!

---

## 🔄 Що буде далі?

У наступному уроці ми:
- ⌨️ Створимо `InputManager` для зчитування клавіатури
- 🔄 Напишемо повноцінний ігровий цикл з `deltaTime`
- 🚗 Навчимо танк рухатися по полю через WASD
- 📐 Додамо вирівнювання по сітці при повороті

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-03/game.html){target="_blank"}
