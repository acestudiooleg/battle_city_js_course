# 🎮 Урок 3.2: Tank.js — властивості класу

## Будуємо каркас танка! 🦴

Зараз ми створимо файл `Tank.js` з усіма властивостями танка.

---

## 📁 Структура проєкту

Після сьогоднішнього уроку у нас буде:

```
lesson-03/
├── game.html         ← без змін
├── constants.js      ← без змін
├── colors.js         ← без змін
├── Tank.js           ← NEW! 🆕
├── Player.js         ← NEW! 🆕
└── main.js           ← оновимо
```

---

## ✍️ Створюємо Tank.js

Створи файл `Tank.js`:

```js
// Tank.js — базовий клас для всіх танків

import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
import { darkGray } from './colors.js';

export class Tank {
    constructor(fx, fy, color, speed = 2, hp = 1) {
        // Позиція у координатах поля (не Canvas!)
        this.x = fx;
        this.y = fy;

        // Розмір (завжди 32×32)
        this.width  = TANK_SIZE;
        this.height = TANK_SIZE;

        // Зовнішній вигляд
        this.color = color;

        // Напрямок: 'up' | 'down' | 'left' | 'right'
        this.direction = 'up';

        // Швидкість (пікселів за кадр)
        this.speed = speed;

        // Здоров'я
        this.hp    = hp;
        this.alive = true;

        // Анімація гусениць (0 або 1 — два кадри)
        this.animFrame = 0;
        this.animTimer = 0;
    }
}
```

---

## 🔍 Розбираємо код

### `fx, fy` — координати поля, не Canvas!

Важливо розуміти різницю:

```
Canvas координати:    абсолютні, від лівого верхнього кута Canvas
Поле координати:      відносні, від лівого верхнього кута ігрового поля
```

Танк зберігає **поле-координати** (fx, fy), а при малюванні додаємо зсув поля:

```js
// screenX = fieldX + FIELD_X
const sx = this.x + FIELD_X;
const sy = this.y + FIELD_Y;
```

### `direction = 'up'` — початковий напрямок

Нові танки завжди дивляться вгору — як в оригінальному NES!

### `animFrame` — анімація гусениць

Значення `0` або `1` — два кадри анімації, що чергуються при русі. Поки що танк стоїть — `animFrame = 0`.

---

У наступному підуроці додамо метод `render()` — і побачимо танк на екрані! 🎨
