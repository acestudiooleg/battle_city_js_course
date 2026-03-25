# 🏆 Урок 14.1: Титульний екран

## Ось наша фінальна гра!

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-14/game.html" frameborder="0" allowfullscreen></iframe>

---

## 🤔 Що таке титульний екран?

Коли ти вмикав NES і запускав Battle City, перше що бачив — **титульний екран**:
- Логотип "BATTLE CITY" великими літерами
- Пункти меню: "1 PLAYER" та "2 PLAYERS"
- Маленький танк-курсор, що вказує на обраний пункт
- Копірайт "© NAMCO 1985"

Гравець стрілками або WASD обирає кількість гравців і натискає Enter/Space для старту.

---

## 🔧 Оновлюємо main.js

Замість автоматичного старту гри, спочатку показуємо **меню**:

```js
/**
 * 🚀 main.js — точка входу з титульним екраном
 *
 * Потік: Меню → вибір кількості гравців → запуск Game
 */
import { CANVAS_W, CANVAS_H } from './constants.js';
import { spriteSheet, PLAYER1_SPRITE, DIR_COL } from './SpriteSheet.js';
import { Game } from './Game.js';

// Чекаємо завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Встановлюємо розмір Canvas
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx.imageSmoothingEnabled = false;  // Чіткі пікселі

    // ─── Стан меню ───────────────────────────────
    let selected  = 0;     // 0 = "1 PLAYER", 1 = "2 PLAYERS"
    let confirmed = false; // true = гравець натиснув Enter
```

---

## 🔧 Малювання меню

```js
    /**
     * Малює титульний екран з NES-стилем.
     * Викликається кожен кадр анімації, поки confirmed = false.
     */
    function drawMenu() {
        // Чорний фон (як в NES)
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Центр Canvas (для вирівнювання тексту)
        const cx = CANVAS_W / 2;

        // ─── Заголовок ───────────────────────────
        // "BATTLE" — червоним
        ctx.fillStyle = '#e04038';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BATTLE', cx, 100);

        // "CITY" — жовтим
        ctx.fillStyle = '#f8f858';
        ctx.fillText('CITY', cx, 140);

        // ─── Пункти меню ─────────────────────────
        const menuY = 220;  // Y-початок пунктів
        const items = ['1 PLAYER', '2 PLAYERS'];

        // Малюємо кожен пункт білим
        for (let i = 0; i < items.length; i++) {
            ctx.fillStyle = '#fcfcfc';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            // cx + 16 — трохи праворуч (бо зліва стоїть курсор)
            ctx.fillText(items[i], cx + 16, menuY + i * 36);
        }

        // ─── Курсор-танк ─────────────────────────
        // Позиція курсора залежить від selected (0 або 1)
        const cursorY = menuY + selected * 36 - 14;
        const cursorX = cx - 60;

        if (spriteSheet.ready) {
            // Малюємо спрайт танка гравця, напрямок — right (→)
            const col = DIR_COL['right'];
            ctx.drawImage(
                spriteSheet.img,
                PLAYER1_SPRITE.x + col * 16, PLAYER1_SPRITE.y, 16, 16,
                cursorX, cursorY, 20, 20
            );
        } else {
            // Fallback — жовтий трикутник ▶
            ctx.fillStyle = '#f8f858';
            ctx.beginPath();
            ctx.moveTo(cursorX, cursorY);
            ctx.lineTo(cursorX + 16, cursorY + 10);
            ctx.lineTo(cursorX, cursorY + 20);
            ctx.closePath();
            ctx.fill();
        }

        // ─── Підказки та копірайт ────────────────
        ctx.fillStyle = '#7c7c7c';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('↑↓ / W S — вибір   ENTER / SPACE — старт', cx, CANVAS_H - 30);
        ctx.fillText('© NAMCO 1985', cx, CANVAS_H - 14);
    }
```

---

## Підсумок

- ✅ Титульний екран з логотипом "BATTLE CITY"
- ✅ Два пункти меню з курсором-танком
- ✅ Спрайтовий курсор з fallback

**Далі:** обробка клавіш та запуск гри!
