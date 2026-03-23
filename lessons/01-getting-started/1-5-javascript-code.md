# ⚙️ Урок 1.5: Пишемо JavaScript код

## Що таке JavaScript?

JavaScript — це мова, якою ми "говоримо" з комп'ютером! 🗣️

Уяви, що ти розмовляєш з комп'ютером, як з другом: "Намалюй червоний квадрат!", "Зроби текст синім!", "Запусти гру!". JavaScript — це саме така мова!

---

## 📝 Крок 1: Створюємо main.js

Створи новий файл **`main.js`** і почнемо з коментарів та підключення Canvas:

```javascript
/**
 * 🎮 Танчики - Урок 1: Готуємося до гри!
 *
 * Привіт, друже! 👋 Тут ми налаштовуємо нашу гру:
 * - Знаходимо Canvas (наш аркуш для малювання) 🎨
 * - Готуємо фарби (контекст для малювання) 🖌️
 * - Створюємо основу для крутої гри! 🚀
 */

// Знаходимо наш Canvas в HTML (це наш аркуш для малювання!)
const canvas = document.getElementById('gameCanvas');

// Беремо "фарби" для малювання (це як взяти пензлик!)
const ctx = canvas.getContext('2d');
```

---

## ⚙️ Крок 2: Налаштування гри

```javascript
// Налаштування нашої гри (це як правила гри!)
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,   // Ширина аркуша (800 пікселів)
    CANVAS_HEIGHT: 600,  // Висота аркуша (600 пікселів)
    TILE_SIZE: 32,       // Розмір однієї клітинки (32 пікселі)
    FPS: 60              // Скільки разів за секунду оновлювати гру
};
```

---

## 🎨 Крок 3: Палітра кольорів NES

В оригінальній грі Battle City на NES використовувались специфічні кольори. Запам'ятаємо їх:

```javascript
// Battle City (Namco) NES palette — кольори як у оригінальній грі!
const black     = '#000000';
const white     = '#fcfcfc';
const gray      = '#a4a7a7';
const darkGray  = '#545454';
const red       = '#e04038';
const orange    = '#f8b800';
const yellow    = '#f8f858';
const green     = '#38a038';
const darkGreen = '#005c00';
const blue      = '#3858d8';
const brown     = '#a86c30';
const brick     = '#bd4400';
```

---

## 🖼️ Крок 4: Малюємо титульний екран

Це найцікавіша частина! Ми намалюємо екран як у оригінальній грі:

```javascript
function drawTitleScreen() {
    // Очищаємо Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Чорний фон — як на NES!
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рахунок гравця (верхній лівий кут)
    ctx.fillStyle = white;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('I-    00  HI- 20000', 20, 30);

    // Заголовок BATTLE CITY — цегляним кольором!
    ctx.fillStyle = brick;
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE', canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText('CITY',   canvas.width / 2, canvas.height / 2 - 20);

    // Жовтий танк-курсор біля "1 PLAYER"
    ctx.fillStyle = yellow;
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 20, 16, 12);
    ctx.fillRect(canvas.width / 2 - 116, canvas.height / 2 + 16, 8, 4);

    // Пункти меню
    ctx.fillStyle = white;
    ctx.font = 'bold 24px monospace';
    ctx.fillText('1 PLAYER',     canvas.width / 2, canvas.height / 2 + 35);
    ctx.fillText('2 PLAYERS',    canvas.width / 2, canvas.height / 2 + 65);
    ctx.fillText('CONSTRUCTION', canvas.width / 2, canvas.height / 2 + 95);

    // Логотип та копірайт
    ctx.fillStyle = brown;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('namcoT', canvas.width / 2, canvas.height / 2 + 150);

    ctx.fillStyle = white;
    ctx.font = '12px monospace';
    ctx.fillText('© 1980 1985 NAMCO LTD.', canvas.width / 2, canvas.height - 40);
    ctx.fillText('ALL RIGHTS RESERVED',    canvas.width / 2, canvas.height - 25);
}
```

### 🔍 Розбираємо по рядках:

| Метод | Що робить |
|-------|-----------|
| `ctx.fillStyle = color` | Вибирає колір фарби 🎨 |
| `ctx.fillRect(x, y, w, h)` | Малює зафарбований прямокутник |
| `ctx.font = '...'` | Вибирає шрифт та розмір тексту |
| `ctx.textAlign = 'center'` | Вирівнює текст по центру |
| `ctx.fillText('text', x, y)` | Пише текст на Canvas |
| `ctx.clearRect(...)` | Стирає все на Canvas (як гумка!) |

---

## 🔄 Крок 5: Ігровий цикл та запуск

```javascript
// Функція запуску гри
function initGame() {
    console.log('🎮 Гра "Танчики" запущена!');
    console.log('📐 Розмір аркуша:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
    console.log('🔲 Розмір клітинки:', GAME_CONFIG.TILE_SIZE, 'пікселів');

    drawTitleScreen();
}

// Ігровий цикл (поки що просто заглушка)
function gameLoop() {
    // Пізніше тут буде вся логіка: рух танків, стрільба, вибухи!
    requestAnimationFrame(gameLoop);
}

// Коли сторінка завантажиться — запускаємо! 🚀
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Сторінка готова, запускаємо гру...');
    initGame();
    gameLoop();
});
```

### 🤔 Що таке `requestAnimationFrame`?

Це як мультфільм! 🎬 Браузер малює 60 кадрів за секунду, і кожен кадр — це один виклик `gameLoop()`. Поки що наш цикл порожній, але в наступних уроках тут буде весь рух та логіка гри!

---

## ✅ Перевіряємо

- ✅ Файл `main.js` створено
- ✅ Є палітра кольорів NES
- ✅ Є функція `drawTitleScreen()`
- ✅ Є `initGame()` та `gameLoop()`
- ✅ Є `DOMContentLoaded` для запуску

**Код готовий!** 🧠 Тепер запустимо і подивимося результат!
