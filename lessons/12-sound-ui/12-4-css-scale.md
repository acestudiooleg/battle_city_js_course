# 🔍 Урок 12.4: CSS масштаб та піксельна графіка

## Проблема: Canvas занадто маленький!

Наш Canvas = 608×448 пікселів. На сучасному моніторі (1920×1080) це виглядає дуже дрібно. Потрібно збільшити!

---

## Рішення: CSS масштаб

Замість того, щоб змінювати логічний розмір Canvas (і переписувати всі координати), ми просто **масштабуємо через CSS**:

```css
canvas {
    /* Масштаб 2× — кожен піксель стає 2×2 */
    transform: scale(2);

    /* Точка масштабування — верхній лівий кут */
    transform-origin: top left;
}
```

Це як збільшити фотографію на екрані — логіка гри не змінюється, але все стає вдвічі більшим!

---

## Піксельна чіткість

Коли збільшуємо піксель-арт, браузер за замовчуванням **згладжує** (blur) пікселі. Це гарно для фотографій, але жахливо для NES графіки — пікселі мають бути **чіткими квадратиками**!

### В CSS:

```css
canvas {
    /* Для всіх браузерів — показуй пікселі як квадратики */
    image-rendering: pixelated;

    /* Для Firefox (альтернативна назва) */
    image-rendering: crisp-edges;
}
```

### В JavaScript:

```js
// Відключаємо згладжування в контексті Canvas
// Без цього — drawImage буде "розмазувати" спрайти 16×16
ctx.imageSmoothingEnabled = false;
```

---

## Повний CSS для game.html

```html
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        background: #1a1a2e;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        /* Ховаємо скролл якщо Canvas виходить за межі */
        overflow: hidden;
    }
    canvas {
        display: block;

        /* Чіткі пікселі — без згладжування */
        image-rendering: pixelated;
        image-rendering: crisp-edges;

        /* Масштаб 2× для повноекранного вигляду */
        transform: scale(2);
        transform-origin: center center;
    }
</style>
```

---

## 📖 Розбираємо: `transform-origin`

Коли ми збільшуємо елемент через `transform: scale(2)`, він росте **з певної точки**:

```
transform-origin: top left;      ← росте вправо-вниз
transform-origin: center center;  ← росте рівномірно в усі боки
transform-origin: top center;     ← росте від верхнього центру
```

Для нашої гри `center center` — найкращий вибір, бо Canvas залишається по центру екрану.

---

## Підключення звуків до гри

Тепер інтегруємо SoundManager в основний файл:

```js
import { SoundManager } from './SoundManager.js';

// Створюємо менеджер звуків
const sound = new SoundManager();

// У функції стрільби:
sound.play('shoot', 0.4);       // тихий звук пострілу

// У функції вибуху:
sound.play('explodeS', 0.5);    // вибух стіни
sound.play('explodeL', 0.8);    // вибух танка (гучніше)

// У функції update (кожен кадр):
const isMoving = player.alive && input.getMovement() !== null;
sound.setEngineSound(isMoving);  // двигун вмикається/вимикається

// При старті гри:
sound.play('intro', 0.5);       // інтро мелодія
```

---

## Підсумок дня 12

За цей день ти:
- ✅ Створив `SoundManager` з завантаженням mp3 файлів
- ✅ Реалізував `play()` з клонуванням Audio
- ✅ Додав двигун як звук-петлю (`loop = true`)
- ✅ Намалював Sidebar в NES-стилі (іконки, лейбл IP, прапор)
- ✅ Налаштував CSS масштаб 2× з `image-rendering: pixelated`

**Завтра:** Артефакти (бонуси) та другий гравець! 🎮

**Результат дня:** [Демо уроку 12](/battle_city_js_course/demos/lesson-12/game.html){target="_blank"}
