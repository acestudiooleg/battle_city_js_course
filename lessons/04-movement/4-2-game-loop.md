# 🎮 Урок 4.2: Ігровий цикл — серце гри

## Як працює анімація?

Мультфільм — це багато картинок, які показують одну за одною дуже швидко. Кожна картинка називається **кадр** (frame). Якщо показувати 60 кадрів за секунду — рух виглядає плавно!

В іграх все так само. Ігровий цикл (Game Loop) — це функція, яка виконується **60 разів на секунду**:

```
┌─────────────┐
│  Оновити    │ ← пересунути танк, перевірити клавіші
│  стан гри   │
├─────────────┤
│  Намалювати │ ← очистити Canvas, намалювати все заново
│  все заново  │
├─────────────┤
│  Повторити  │ ← через ~16 мс (1000мс / 60 = 16.6мс)
└──────┬──────┘
       │
       └─────→ requestAnimationFrame(gameLoop)
```

---

## `requestAnimationFrame`

Ми вже бачили цю функцію в Уроці 1, але тоді ігровий цикл був порожній. Тепер наповнимо його!

```javascript
function gameLoop() {
    update();   // оновлюємо стан гри
    render();   // малюємо все на Canvas
    requestAnimationFrame(gameLoop); // повторюємо
}
```

`requestAnimationFrame` — це вбудована функція браузера. Вона каже:
> "Браузере, коли будеш готовий малювати наступний кадр — виклич мою функцію."

Зазвичай це відбувається **60 разів на секунду** (60 FPS).

---

## Що таке `deltaTime`?

Не на всіх комп'ютерах ігровий цикл працює однаково швидко. На потужному ПК — 60 FPS, на слабкому — може бути 30 FPS. Щоб танк рухався **з однаковою швидкістю** на всіх комп'ютерах, ми використовуємо **deltaTime** — час між двома кадрами.

```
Кадр 1          Кадр 2          Кадр 3
  │    16 мс      │    16 мс      │     ← 60 FPS (швидкий ПК)
  │──────────────→│──────────────→│

Кадр 1                  Кадр 2
  │       33 мс           │              ← 30 FPS (повільний ПК)
  │──────────────────────→│
```

Ми будемо передавати `dt` у метод руху, щоб рух був плавним.

---

## Оновлюємо `main.js`

Перепишемо `main.js` з повноцінним ігровим циклом:

```javascript
// main.js — Урок 4: Рух танка

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE }
    from './constants.js';              // розміри гри
import { black, borderBg, sidebarBg, sidebarText, white }
    from './colors.js';                 // палітра кольорів
import { Player }       from './Player.js';       // танк гравця
import { InputManager } from './InputManager.js'; // зчитування клавіатури

// ─── Ініціалізація ─────────────────────────────────────────────

const canvas = document.getElementById('gameCanvas'); // HTML-елемент Canvas
const ctx    = canvas.getContext('2d');   // контекст для малювання
const input  = new InputManager();       // менеджер клавіатури
const player = new Player();             // жовтий танк гравця

let lastTime = 0; // час попереднього кадру (для deltaTime)

// ─── Ігровий цикл ──────────────────────────────────────────────

/**
 * Головний ігровий цикл. Викликається ~60 разів на секунду.
 * @param {number} timestamp — час у мілісекундах (передає браузер)
 */
function gameLoop(timestamp) {
    // deltaTime — скільки мілісекунд пройшло з попереднього кадру
    const dt = timestamp - lastTime; // зазвичай ~16 мс (60 FPS)
    lastTime = timestamp;            // запам'ятовуємо для наступного кадру

    // Захист: якщо вкладка була неактивною, dt може бути 5000+ мс.
    // Обмежуємо до 50 мс щоб танк не "телепортувався"
    const safeDt = Math.min(dt, 50);

    update(safeDt);  // оновлюємо стан гри (рух, логіка)
    render();        // малюємо все на Canvas

    requestAnimationFrame(gameLoop); // запрошуємо наступний кадр
}

// ─── Оновлення стану ────────────────────────────────────────────

/**
 * Оновлює стан гри: зчитує клавіатуру та рухає танк.
 * @param {number} dt — deltaTime (мілісекунди з минулого кадру)
 */
function update(dt) {
    const dir = input.getMovement(); // 'up', 'down', 'left', 'right' або null

    if (dir) {
        // Гравець тримає клавішу руху — рухаємо танк!
        // () => true — функція canMove, поки завжди дозволяє рух
        // (в уроці 7 замінимо на перевірку колізій зі стінами)
        player.move(dir, dt, () => true);
    }
}

// ─── Малювання ──────────────────────────────────────────────────

/**
 * Малює весь ігровий екран: рамку, поле, сітку, танк, sidebar.
 * Викликається кожен кадр після update().
 */
function render() {
    // 1. Сірий фон (стає рамкою навколо поля)
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Чорне ігрове поле
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3. Допоміжна сітка (26×26 тайлів)
    drawGrid();

    // 4. Танк гравця
    player.render(ctx, FIELD_X, FIELD_Y);

    // 5. Бічна панель з інформацією
    drawSidebar();
}

/**
 * Малює сітку 26×26 тайлів на ігровому полі.
 * Кожна клітинка — TILE (16px). Допомагає бачити координати.
 */
function drawGrid() {
    ctx.strokeStyle = '#111111'; // ледь помітний сірий
    ctx.lineWidth = 0.5;        // тонка лінія

    // Вертикальні лінії (27 ліній для 26 колонок)
    for (let c = 0; c <= 26; c++) {
        const x = FIELD_X + c * TILE; // X-координата на Canvas
        ctx.beginPath();
        ctx.moveTo(x, FIELD_Y);         // верхня точка
        ctx.lineTo(x, FIELD_Y + FIELD_H); // нижня точка
        ctx.stroke();                    // малюємо
    }

    // Горизонтальні лінії (27 ліній для 26 рядків)
    for (let r = 0; r <= 26; r++) {
        const y = FIELD_Y + r * TILE; // Y-координата на Canvas
        ctx.beginPath();
        ctx.moveTo(FIELD_X, y);          // ліва точка
        ctx.lineTo(FIELD_X + FIELD_W, y); // права точка
        ctx.stroke();
    }
}

/**
 * Малює бічну панель з назвою уроку та координатами танка.
 * Показує X, Y та напрямок у реальному часі.
 */
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16; // X-позиція sidebar на Canvas

    ctx.fillStyle = sidebarBg;         // сірий фон
    ctx.fillRect(sx, 0, 144, CANVAS_H); // заливаємо всю висоту

    // Заголовок
    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 4', sx + 8, 30);
    ctx.fillText('Рух танка', sx + 8, 50);

    // Підказка
    ctx.font = '11px monospace';
    ctx.fillText('WASD', sx + 8, 86);
    ctx.fillText('для руху', sx + 8, 102);

    // Координати танка в реальному часі (жовтим кольором)
    ctx.fillStyle = '#f8f858';
    ctx.fillText('X: ' + Math.round(player.x), sx + 8, 136);   // позиція X
    ctx.fillText('Y: ' + Math.round(player.y), sx + 8, 152);   // позиція Y
    ctx.fillText('Dir: ' + player.direction, sx + 8, 168);      // напрямок
}

// ─── Запуск ─────────────────────────────────────────────────────

requestAnimationFrame(gameLoop);
```

---

## Розбираємо код

### `timestamp`

Коли ми пишемо `requestAnimationFrame(gameLoop)`, браузер сам передає в `gameLoop` один аргумент — `timestamp`. Це число мілісекунд з моменту завантаження сторінки. Наприклад:
- Кадр 1: `timestamp = 1000.0`
- Кадр 2: `timestamp = 1016.6` (через ~16 мс)

### `dt = timestamp - lastTime`

Різниця між поточним і попереднім кадром = скільки часу минуло. Зазвичай це ~16 мс.

### `Math.min(dt, 50)`

Якщо ти переключився на іншу вкладку і повернувся через 5 секунд, `dt` буде 5000 мс. Танк "стрибне" через все поле! Тому обмежуємо максимум 50 мс.

### `player.move(dir, dt, () => true)`

Третій аргумент `() => true` — це функція, яка перевіряє: "Чи можна рухатися в цю позицію?" Поки що вона завжди каже `true` (так). В майбутніх уроках ми додамо перевірку стін!

---

## Підсумок

- ✅ Зрозуміли, що ігровий цикл — це `update → render → repeat`
- ✅ `requestAnimationFrame` дає ~60 FPS
- ✅ `deltaTime` — час між кадрами для плавного руху
- ✅ `Math.min(dt, 50)` захищає від стрибків
- ✅ Підключили `InputManager` та `Player.move()` до циклу
