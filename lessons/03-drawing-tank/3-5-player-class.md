# 🎮 Урок 3.5: Player.js — жовтий танк гравця

## Фінальний крок — гравець на полі! 🏁

Створюємо `Player.js` — підклас `Tank` для гравця, і підключаємо все до `main.js`.

---

## ✍️ Створюємо Player.js

```js
// Player.js — танк гравця (жовтий)

import { Tank } from './Tank.js';
import { TILE } from './constants.js';
import { playerYellow } from './colors.js';

export class Player extends Tank {
    constructor() {
        // Спавн: тайл (8, 24) у координатах поля
        const spawnX = 8 * TILE;
        const spawnY = 24 * TILE;

        // Tank(x, y, color, speed, hp)
        super(spawnX, spawnY, playerYellow, 2, 1);

        // Гравець стартує дивлячись вгору
        this.direction = 'up';
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

Ми тільки задаємо специфічні налаштування гравця (колір, позиція спавну).

---

## ✍️ Оновлюємо main.js

```js
// main.js — Урок 3: Малюємо танк

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, BORDER } from './constants.js';
import { black, borderBg } from './colors.js';
import { Player } from './Player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Створюємо гравця
const player = new Player();

function draw() {
    // 1. Фон (рамка)
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Чорне ігрове поле
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3. Малюємо танк гравця
    player.render(ctx, FIELD_X, FIELD_Y);
}

draw();
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

**Наступний урок — танк рухається!** 🚗💨
