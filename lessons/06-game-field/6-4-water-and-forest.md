# 🎮 Урок 6.4: Вода та ліс — особливі тайли

## Не всі перешкоди однакові! 🌊🌲

Вода та ліс — це спеціальні матеріали з унікальною поведінкою:
- **Вода** — танк не проїде, але кулі летять над нею. Має анімацію!
- **Ліс** — танк проїде наскрізь, але ліс малюється ПОВЕРХ танка (маскування!)

---

## Анімація води

Вода в NES мерехтить між двома кадрами кожні 500 мс:

```
Кадр 0:            Кадр 1:
┌──────────┐      ┌──────────┐
│ ~~~~~~~~ │      │          │
│          │      │ ~~~~~~~~ │
│ ~~~~~~~~ │      │          │
│          │      │ ~~~~~~~~ │
└──────────┘      └──────────┘
  хвилі вище        хвилі нижче
```

Це створюється в `update(dt)`:

```javascript
update(dt) {
    this.waterTimer += dt;          // накопичуємо час
    if (this.waterTimer > 500) {    // кожні 500 мс
        this.waterFrame = 1 - this.waterFrame; // 0→1→0→1
        this.waterTimer = 0;
    }
}
```

А хвилі зсуваються на `this.waterFrame * 2` пікселі:

```javascript
const ly = dy + 3 + i * 5 + this.waterFrame * 2;
```

---

## Ліс — z-index поверх танків

Ліс створює ефект **маскування**: танк заїжджає під дерева і стає невидимим!

```
Без лісу:           З лісом:
┌──────────┐       ┌──────────┐
│          │       │ 🌲🌲🌲🌲 │
│   🚗     │  →    │ 🌲🌲🌲🌲 │  ← танк прихований!
│          │       │ 🌲🌲🌲🌲 │
└──────────┘       └──────────┘
```

Для цього ліс малюється **після** танків:

```javascript
// В main.js або Game.js:
field.render(ctx);              // 1. Стіни, вода, штаб
player.render(ctx, ox, oy);    // 2. Танк
for (const b of player.bullets) b.render(ctx, ox, oy); // 3. Кулі
field.renderForest(ctx);        // 4. Ліс ПОВЕРХ!
```

---

## Оновлюємо main.js

Тепер `main.js` використовує `GameField`:

```javascript
// main.js — Урок 6: Ігрове поле

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE }
    from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }       from './Player.js';
import { InputManager } from './InputManager.js';
import { GameField }    from './GameField.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();   // ← НОВЕ!

let lastTime = 0;

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    const safeDt = Math.min(dt, 50);
    update(safeDt);
    render();
    requestAnimationFrame(gameLoop);
}

/**
 * Оновлює стан гри.
 */
function update(dt) {
    // Анімація води
    field.update(dt);

    // Рух танка (поки без колізій — додамо в уроці 7)
    const dir = input.getMovement();
    if (dir) {
        player.move(dir, dt, () => true);
    }

    // Стрільба
    if (input.isShoot()) {
        player.shoot(Date.now(), 'player');
    }

    // Оновлення куль
    player.updateBullets();
}

/**
 * Малює екран з правильним порядком шарів.
 */
function render() {
    // 1. Поле (рамка + фон + вода + стіни + штаб)
    field.render(ctx);

    // 2. Танк гравця
    player.render(ctx, FIELD_X, FIELD_Y);

    // 3. Кулі гравця
    for (const b of player.bullets) {
        b.render(ctx, FIELD_X, FIELD_Y);
    }

    // 4. Ліс ПОВЕРХ танків та куль
    field.renderForest(ctx);

    // 5. Sidebar
    drawSidebar();
}

/** Бічна панель. */
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 6', sx + 8, 30);
    ctx.fillText('Ігрове поле', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 136);
    ctx.fillText('Water: ' + field.water.length, sx + 8, 152);
    ctx.fillText('Forest: ' + field.forest.length, sx + 8, 168);
}

requestAnimationFrame(gameLoop);
```

---

## Танк поки проїжджає крізь стіни!

Так, танк зараз ігнорує стіни — `() => true` завжди дозволяє рух. Але ми **бачимо** поле! В наступному уроці додамо `canTankMove()` і танк зупинятиметься перед стінами.

---

## Підсумок Дня 6

За цей урок ти:
- ✅ Зрозумів формат карти: 13×13 блоків → 26×26 тайлів
- ✅ Створив `levels.js` з `LEVEL_1` та `buildTileList()`
- ✅ Написав `GameField.js` з walls[], water[], forest[]
- ✅ Анімація води: 2 кадри кожні 500 мс
- ✅ Ліс малюється ПОВЕРХ танків через `renderForest()`
- ✅ Штаб (Орел) з П-подібною захисною стінкою

**Поле побудоване!** Завтра навчимо кулі руйнувати стіни! 💥

---

## 🔄 Що буде далі?

У наступному уроці ми:
- 💥 Створимо `CollisionManager` — систему зіткнень
- 🧱 Кулі будуть руйнувати цегляні стіни
- 🚫 Бетон не руйнуватиметься
- 🤖 Танки не проходитимуть одне через одного

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-06/game.html){target="_blank"}
