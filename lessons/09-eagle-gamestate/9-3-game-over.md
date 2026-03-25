# 💀 Урок 9.3: Game Over

## Коли гра закінчується?

В Battle City є **дві причини** для Game Over:
1. **Штаб знищено** — ворог або сам гравець влучив в Орла
2. **Гравець втратив усі життя** — `lives <= 0` і танк знищено

В оригінальній NES грі при Game Over:
- Текст **"GAME OVER"** повільно **піднімається знизу** екрану до центру
- Гра не зупиняється миттєво — вибухи ще догоряють
- Через кілька секунд — повернення в меню

---

## 🎮 Координація гри в main.js

Зараз наш `main.js` дуже простий — лише `update` та `render`. Потрібно додати **стан гри**: чи Game Over, чи перемога, чи пауза.

Оновлюємо `main.js`:

```js
// main.js — Урок 9: Штаб та стан гри
// Тепер є повний ігровий стан: Game Over, перемога, пауза, рестарт

import {
    CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H
} from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }           from './Player.js';
import { InputManager }     from './InputManager.js';
import { GameField }        from './GameField.js';
import { CollisionManager } from './CollisionManager.js';
import { Explosion }        from './Explosion.js';

// ─── Ініціалізація ───────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();

// Масив вибухів — поки що тільки від куль
const explosions = [];

// Створюємо менеджер колізій з callback для вибухів
const collisions = new CollisionManager(field, (fx, fy, type) => {
    // fx, fy — координати поля, додаємо FIELD_X/Y для Canvas
    explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
});

// ─── Стан гри ────────────────────────────────────────────────────
let paused       = false;  // чи гра на паузі (клавіша P)
let gameOver     = false;  // чи наступив Game Over
let victory      = false;  // чи гравець переміг
let lastTime     = 0;      // час попереднього кадру

// Анімація "GAME OVER" — текст піднімається знизу
let gameOverY       = FIELD_H; // починає знизу поля
let gameOverRising  = false;   // чи текст зараз піднімається

// ─── Ігровий цикл ───────────────────────────────────────────────
function gameLoop(timestamp) {
    // Обчислюємо deltaTime (час між кадрами)
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    // Обмежуємо dt до 50мс (щоб уникнути стрибків при alt-tab)
    const safeDt = Math.min(dt, 50);

    // Обробляємо мета-клавіші (пауза, рестарт)
    handleMeta();

    // Якщо гра не на паузі і не перемога:
    if (!paused && !victory) {
        if (gameOver) {
            // Game Over — тільки анімація тексту
            updateGameOverAnim(safeDt);
        } else {
            // Звичайне оновлення гри
            update(safeDt);
        }
    }

    // Малюємо все
    render();

    // Запускаємо наступний кадр
    requestAnimationFrame(gameLoop);
}

// ─── Обробка клавіш паузи та рестарту ───────────────────────────
function handleMeta() {
    // P — пауза
    if (input.justPause()) {
        paused = !paused; // перемикаємо стан паузи
    }
    // R — рестарт (перезавантажуємо сторінку)
    if (input.justRestart()) {
        location.reload();
    }
    // Очищуємо одноразові натискання
    input.clearFrame();
}

// ─── Основне оновлення гри ──────────────────────────────────────
function update(dt) {
    // Анімація води
    field.update(dt);

    // Функція перевірки руху: враховує поле + інші танки
    const canMove = (tank, nx, ny) => {
        // Спочатку перевіряємо стіни та воду
        if (!field.canTankMove(tank, nx, ny)) return false;
        // Потім перевіряємо інші танки (поки тільки масив з гравця)
        if (collisions.tankOverlap(tank, nx, ny, [player])) return false;
        return true;
    };

    // Оновлюємо гравця
    player.update(
        dt, canMove, Date.now(),
        () => input.getMovement(), // функція читання руху
        () => input.isShoot()      // функція перевірки стрільби
    );

    // Перевіряємо колізії куль (поки без ворогів — пустий масив)
    collisions.update(player, []);

    // Оновлюємо вибухи
    for (const e of explosions) e.update(dt);
    // Видаляємо вибухи що закінчились
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }

    // ─── Перевірка Game Over ──────────────────────────────────
    // 1) Штаб знищено
    if (field.isEagleDestroyed()) {
        triggerGameOver();
    }
    // 2) Гравець втратив усі життя і не відроджується
    if (player.lives <= 0 && !player.alive && !player.isRespawning) {
        triggerGameOver();
    }
}

// ─── Тригер Game Over ───────────────────────────────────────────
function triggerGameOver() {
    // Якщо Game Over вже активний — не запускаємо повторно
    if (gameOver) return;
    gameOver = true;          // гру зупинено
    gameOverRising = true;    // текст починає підніматись
}

// ─── Анімація Game Over ─────────────────────────────────────────
function updateGameOverAnim(dt) {
    // Вода продовжує анімуватись
    field.update(dt);

    // Вибухи продовжують догорати
    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }

    // Текст "GAME OVER" підіймається від низу до центру
    if (gameOverRising) {
        gameOverY -= 1.5; // 1.5 пікселі за кадр вгору
        // Зупиняємо в центрі поля
        if (gameOverY < FIELD_H / 2 - 20) {
            gameOverY = FIELD_H / 2 - 20;
        }
    }
}

// ─── Малювання ──────────────────────────────────────────────────
function render() {
    // 1. Поле (рамка + фон + стіни + вода + штаб)
    field.render(ctx);

    // 2. Танк гравця та його кулі
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) {
        b.render(ctx, FIELD_X, FIELD_Y);
    }

    // 3. Ліс (поверх танків)
    field.renderForest(ctx);

    // 4. Вибухи (поверх усього на полі)
    for (const e of explosions) e.render(ctx);

    // 5. Бічна панель
    drawSidebar();

    // 6. Overlay: пауза / game over / перемога
    if (paused)   drawPause();
    if (gameOver)  drawGameOver();
    if (victory)   drawVictory();
}

// ─── Overlay екрани ─────────────────────────────────────────────

/** Малює напівпрозоре затемнення з текстом "ПАУЗА" */
function drawPause() {
    // Напівпрозорий чорний фон
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // Білий текст по центру
    ctx.fillStyle = '#fcfcfc';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2);
}

/** Малює анімований текст "GAME OVER" (піднімається знизу) */
function drawGameOver() {
    ctx.fillStyle = '#e04038'; // червоний колір
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    // gameOverY починає від FIELD_H і зменшується до центру
    ctx.fillText('GAME', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY);
    ctx.fillText('OVER', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY + 32);
}

/** Малює екран перемоги */
function drawVictory() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    ctx.fillStyle = '#f8f858'; // жовтий
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ПЕРЕМОГА!', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 - 16);

    ctx.fillStyle = '#fcfcfc'; // білий
    ctx.font = '14px monospace';
    ctx.fillText('Натисніть R для рестарту', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 + 16);
}

// ─── Sidebar ────────────────────────────────────────────────────
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;

    // Фон sidebar
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    // Заголовок
    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 9', sx + 8, 30);
    ctx.fillText('Штаб та стан гри', sx + 8, 50);

    // Керування
    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);
    ctx.fillText('P     пауза', sx + 8, 118);
    ctx.fillText('R     рестарт', sx + 8, 134);

    // Статистика
    ctx.fillStyle = '#f8f858';
    ctx.fillText('Lives: ' + player.lives, sx + 8, 168);
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 184);

    // Статус штабу
    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 210);

    // Статус гри
    if (gameOver) {
        ctx.fillStyle = '#e04038';
        ctx.fillText('GAME OVER', sx + 8, 240);
    }
}

// ─── Запуск ─────────────────────────────────────────────────────
requestAnimationFrame(gameLoop);
```

### Розбираємо ключові моменти:

**Стан гри (4 змінні):**
```js
let paused = false;    // P — пауза
let gameOver = false;  // штаб знищено або 0 життів
let victory = false;   // всі вороги знищені
```

**Ігровий цикл тепер розумний:**
- Якщо пауза — не оновлюємо, тільки малюємо
- Якщо Game Over — лише анімація тексту та вибухи
- Якщо перемога — все заморожено

**Анімація Game Over (NES-стиль):**
- `gameOverY` починається від `FIELD_H` (низ поля)
- Кожен кадр зменшується на 1.5 пікселі (рухається вгору)
- Зупиняється в центрі: `FIELD_H / 2 - 20`

---

## 🔧 Оновлюємо InputManager.js

Додаємо підтримку клавіш P (пауза) та R (рестарт):

```js
// InputManager.js — оновлений для уроку 9
// Додано: justPause(), justRestart(), clearFrame()

export class InputManager {
    constructor() {
        /** Масив утримуваних клавіш */
        this.held = {};
        /** Масив одноразових натискань (для паузи/рестарту) */
        this._justPressed = {};

        // Слухач "клавішу натиснуто"
        this._onKeyDown = (e) => {
            this.held[e.key.toLowerCase()] = true;
            this._justPressed[e.key.toLowerCase()] = true;
        };
        // Слухач "клавішу відпущено"
        this._onKeyUp = (e) => {
            this.held[e.key.toLowerCase()] = false;
        };

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    /** Напрямок руху (WASD) або null */
    getMovement() {
        if (this.held['w']) return 'up';
        if (this.held['s']) return 'down';
        if (this.held['a']) return 'left';
        if (this.held['d']) return 'right';
        return null;
    }

    /** Чи натиснуто Space (стрільба) */
    isShoot() { return !!this.held[' ']; }

    /** Чи щойно натиснуто P (пауза) — спрацьовує один раз */
    justPause()   { return !!this._justPressed['p']; }

    /** Чи щойно натиснуто R (рестарт) — спрацьовує один раз */
    justRestart() { return !!this._justPressed['r']; }

    /** Очищує одноразові натискання (викликається кожен кадр) */
    clearFrame() { this._justPressed = {}; }

    /** Видаляє слухачі (прибирання при знищенні) */
    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
```

### Чому потрібен `justPause()` замість `held['p']`?

`held['p']` повертає `true` **кожен кадр** поки клавіша утримується. Це означає що за одне натискання пауза увімкнеться і одразу вимкнеться (бо ігровий цикл працює 60 разів на секунду). `justPause()` повертає `true` **тільки один раз** — в момент натискання. А `clearFrame()` очищує цей стан кожен кадр.

---

## ✅ Що далі

В підуроці 9.4 ми додамо **умову перемоги** та **систему підрахунку**.
