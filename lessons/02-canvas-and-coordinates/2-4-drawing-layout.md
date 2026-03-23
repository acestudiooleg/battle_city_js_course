# 🖼️ Урок 2.4: Малюємо layout — рамка, поле, sidebar

## Час малювати! 🎨

Сьогодні ми перетворимо наш порожній Canvas у справжній екран NES! Намалюємо три зони:
1. **Сіру рамку** навколо
2. **Чорне ігрове поле** — де будуть танки
3. **Сіру бічну панель** — де буде статистика

---

## 📝 Крок 1: Оновлюємо index.html

Відкрий `index.html` і заміни розмір Canvas:

```html
<canvas id="gameCanvas" width="608" height="448"></canvas>
```

Раніше у нас було 800×600 — тепер точні розміри NES: **608×448**.

Не забудь підключити нові файли перед `main.js`:

```html
<script type="module" src="main.js"></script>
```

---

## 📝 Крок 2: Оновлюємо main.js

Тепер замінимо вміст `main.js` — будемо використовувати наші константи і кольори:

```js
// === Урок 2: Canvas та координати NES ===

// Імпортуємо константи та кольори з наших нових файлів!
import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H,
         BORDER, SIDEBAR_W, TILE } from './constants.js';
import { black, borderBg, sidebarBg, sidebarText,
         white, brickFull, forestCol, waterCol } from './colors.js';

// Отримуємо Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function draw() {
    // 1️⃣ Заливаємо ВСЕ сірим — це рамка
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2️⃣ Малюємо чорне ігрове поле поверх
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3️⃣ Малюємо sidebar (бічну панель)
    // Вона вже сіра від кроку 1, але ми позначимо її текстом
    const sidebarX = FIELD_X + FIELD_W + BORDER;
    ctx.fillStyle = sidebarText;
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SIDEBAR', sidebarX + 10, 30);

    // 4️⃣ Малюємо сітку тайлів (для наочності!)
    drawGrid();
}

function drawGrid() {
    ctx.strokeStyle = '#1a1a1a';  // Ледь помітний сірий
    ctx.lineWidth = 0.5;

    // Вертикальні лінії
    for (let col = 0; col <= 26; col++) {
        const x = FIELD_X + col * TILE;
        ctx.beginPath();
        ctx.moveTo(x, FIELD_Y);
        ctx.lineTo(x, FIELD_Y + FIELD_H);
        ctx.stroke();
    }

    // Горизонтальні лінії
    for (let row = 0; row <= 26; row++) {
        const y = FIELD_Y + row * TILE;
        ctx.beginPath();
        ctx.moveTo(FIELD_X, y);
        ctx.lineTo(FIELD_X + FIELD_W, y);
        ctx.stroke();
    }
}

// Запуск!
draw();

console.log('📐 Canvas:', CANVAS_W, '×', CANVAS_H);
console.log('🎮 Ігрове поле:', FIELD_W, '×', FIELD_H);
console.log('🔲 Тайл:', TILE, 'px');
console.log('📊 Sidebar:', SIDEBAR_W, 'px');
```

---

## 🧠 Розбираємо порядок малювання

**Малювання на Canvas — як малювання фарбами: нові шари перекривають старі!**

```
Крок 1: Заливаємо ВСЕ сірим        → сірий прямокутник 608×448
Крок 2: Малюємо чорне поле поверх   → чорний квадрат 416×416 всередині
Крок 3: Текст на sidebar            → видно на сірому фоні
```

Це простий трюк: замість малювати рамку з 4 прямокутників — просто **заливаємо фон** і **малюємо поле зверху**!

---

## 🔑 Ключова формула

```
ctx.fillRect(x, y, width, height);
```

| Параметр | Що це | Значення |
|----------|-------|----------|
| `x` | Ліва точка | `FIELD_X = 16` |
| `y` | Верхня точка | `FIELD_Y = 16` |
| `width` | Ширина | `FIELD_W = 416` |
| `height` | Висота | `FIELD_H = 416` |

---

## 👀 Що ти побачиш

На екрані з'явиться:
- ✅ **Сіра рамка** (16px) навколо поля
- ✅ **Чорне ігрове поле** з ледь помітною сіткою 26×26
- ✅ **Сіра бічна панель** з текстом "SIDEBAR"
- ✅ В консолі — розміри всіх елементів

Це вже схоже на екран оригінальної гри!

---

**Layout готовий!** 🏗️ Залишилося зрозуміти координати!
