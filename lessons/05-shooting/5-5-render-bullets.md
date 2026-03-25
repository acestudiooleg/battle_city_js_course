# 🎮 Урок 5.5: Малюємо кулі та фінальна збірка

## Останній крок — побачимо кулі! 🎯

Залишилося відмалювати кулі на Canvas та зібрати все разом.

---

## Оновлюємо `render()` у main.js

Додай малювання куль гравця після малювання танка:

```javascript
/**
 * Малює весь ігровий екран.
 */
function render() {
    // 1. Сірий фон (рамка)
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Чорне ігрове поле
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3. Допоміжна сітка
    drawGrid();

    // 4. Танк гравця
    player.render(ctx, FIELD_X, FIELD_Y);

    // 5. Кулі гравця  ← НОВЕ!
    for (const b of player.bullets) {
        b.render(ctx, FIELD_X, FIELD_Y);
    }

    // 6. Бічна панель
    drawSidebar();
}
```

---

## Оновлюємо sidebar

Додамо лічильник куль для зручності:

```javascript
/**
 * Бічна панель з інформацією про урок та стан гри.
 */
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;

    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 5', sx + 8, 30);
    ctx.fillText('Стрільба!', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    // Координати танка
    ctx.fillStyle = '#f8f858';
    ctx.fillText('X: ' + Math.round(player.x), sx + 8, 136);
    ctx.fillText('Y: ' + Math.round(player.y), sx + 8, 152);
    ctx.fillText('Dir: ' + player.direction, sx + 8, 168);

    // Кількість куль на полі
    ctx.fillStyle = '#fcfcfc';
    ctx.fillText('Bullets: ' + player.bullets.length, sx + 8, 200);
}
```

---

## Повний `main.js` уроку 5

```javascript
// main.js — Урок 5: Стрільба

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE }
    from './constants.js';
import { black, borderBg, sidebarBg, sidebarText, white }
    from './colors.js';
import { Player }       from './Player.js';
import { InputManager } from './InputManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();

let lastTime = 0;

/**
 * Головний ігровий цикл.
 * @param {number} timestamp — час у мс (від браузера)
 */
function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    const safeDt = Math.min(dt, 50);

    update(safeDt);
    render();

    requestAnimationFrame(gameLoop);
}

/**
 * Оновлює стан гри: рух, стрільба, кулі.
 * @param {number} dt — deltaTime (мс)
 */
function update(dt) {
    // Рух танка
    const dir = input.getMovement();
    if (dir) {
        player.move(dir, dt, () => true);
    }

    // Стрільба (Space)
    if (input.isShoot()) {
        player.shoot(Date.now(), 'player');
    }

    // Оновлення куль (рух + очистка)
    player.updateBullets();
}

/**
 * Малює весь екран: рамку, поле, танк, кулі, sidebar.
 */
function render() {
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    drawGrid();

    player.render(ctx, FIELD_X, FIELD_Y);

    // Малюємо кожну кулю гравця
    for (const b of player.bullets) {
        b.render(ctx, FIELD_X, FIELD_Y);
    }

    drawSidebar();
}

/** Сітка 26×26 тайлів. */
function drawGrid() {
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= 26; c++) {
        const x = FIELD_X + c * TILE;
        ctx.beginPath(); ctx.moveTo(x, FIELD_Y); ctx.lineTo(x, FIELD_Y + FIELD_H); ctx.stroke();
    }
    for (let r = 0; r <= 26; r++) {
        const y = FIELD_Y + r * TILE;
        ctx.beginPath(); ctx.moveTo(FIELD_X, y); ctx.lineTo(FIELD_X + FIELD_W, y); ctx.stroke();
    }
}

/** Бічна панель з координатами та лічильником куль. */
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 5', sx + 8, 30);
    ctx.fillText('Стрільба!', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('X: ' + Math.round(player.x), sx + 8, 136);
    ctx.fillText('Y: ' + Math.round(player.y), sx + 8, 152);
    ctx.fillText('Dir: ' + player.direction, sx + 8, 168);

    ctx.fillStyle = '#fcfcfc';
    ctx.fillText('Bullets: ' + player.bullets.length, sx + 8, 200);
}

// Запуск!
requestAnimationFrame(gameLoop);
```

---

## Підсумок Дня 5

За цей урок ти:
- ✅ Створив `Bullet.js` — клас кулі з вектором руху
- ✅ Додав `shoot()` до Tank з кулдауном 400 мс
- ✅ Підключив стрільбу до клавіші Space через InputManager
- ✅ Кулі деактивуються за межами поля
- ✅ `updateBullets()` — рух та очистка масиву куль
- ✅ Кулі малюються на Canvas як білі квадратики

**Танк стріляє!** Завтра ми побудуємо ігрове поле зі стінами! 🧱

---

## 🔄 Що буде далі?

У наступному уроці ми:
- 🧱 Побудуємо карту рівня з масиву даних (13×13 блоків)
- 🏗️ Намалюємо цеглу, бетон, воду та ліс
- 🌊 Додамо анімацію води
- 🌲 Ліс буде малюватися поверх танків!

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-05/game.html){target="_blank"}
