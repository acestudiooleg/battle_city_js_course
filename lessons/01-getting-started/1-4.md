# 🎨 Урок 1.4: Додаємо красиві стилі

## Що таке CSS?

CSS стилі — це як фарби для нашого малюнка! 🎨

Уяви, що ти намалював будинок олівцем (це HTML). Тепер потрібно його розфарбувати! CSS — це фарби, які роблять все красивим та кольоровим!

---

## 🎨 Крок 1: Файл змінних кольорів

Створи новий файл **`variables.css`**

Це як палітра художника — всі кольори в одному місці!

```css
:root {
  /* Світлі кольори */
  --bg: #ffffff;
  --bg-secondary: #f6f6f7;
  --bg-elevated: #ffffff;
  --bg-soft: #f6f6f7;

  /* Кольори тексту */
  --text: #3c3c43;
  --text-secondary: #67676c;
  --text-muted: #929295;

  /* Основні кольори */
  --primary: #3451b2;
  --primary-hover: #3a5ccc;
  --primary-bg: #5672cd;
  --primary-soft: rgba(100, 108, 255, 0.14);

  /* Кольори успіху */
  --success: #18794e;
  --success-hover: #299764;
  --success-bg: #30a46c;
  --success-soft: rgba(16, 185, 129, 0.14);

  /* Кольори попередження */
  --warning: #915930;
  --warning-hover: #946300;
  --warning-bg: #9f6a00;
  --warning-soft: rgba(234, 179, 8, 0.14);

  /* Кольори небезпеки */
  --danger: #b8272c;
  --danger-hover: #d5393e;
  --danger-bg: #e0575b;
  --danger-soft: rgba(244, 63, 94, 0.14);

  /* Сірі */
  --gray: #dddde3;
  --gray-hover: #e4e4e9;
  --gray-bg: #ebebef;
  --gray-soft: rgba(142, 150, 170, 0.14);

  /* Рамки */
  --border: #c2c2c4;
  --border-divider: #e2e2e3;

  /* Утиліти */
  --black: #000000;
  --white: #ffffff;
}
```

**Що це дає?** 🤔
- 🎨 Всі кольори в одному місці — як палітра художника!
- 🔄 Легко змінювати тему — поміняв одне значення і весь сайт змінився!
- 📝 Зрозумілі назви — `--danger` замість `#b8272c`

---

## 🖌️ Крок 2: Основні стилі

Створи новий файл **`styles.css`**

```css
@import './variables.css';

body {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 20px;
}

h1 {
    color: var(--primary);
    margin-bottom: 10px;
}

.lesson-info {
    background-color: var(--bg-secondary);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid var(--border);
}

canvas {
    border: 3px solid var(--primary);
    border-radius: 8px;
    background-color: var(--black);
    display: block;
    margin: 0 auto;
}

.controls {
    margin-top: 20px;
    background-color: var(--bg-secondary);
    padding: 15px;
    border-radius: 8px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid var(--border);
}
```

Зверни увагу на `@import './variables.css'` — це підключає нашу палітру кольорів!

---

## ✅ Перевіряємо

- ✅ Файл `variables.css` створено з кольорами
- ✅ Файл `styles.css` створено зі стилями
- ✅ В `styles.css` є `@import` палітри
- ✅ В `index.html` є `<link rel="stylesheet" href="styles.css">`

**Фарби готові!** 🎨 Тепер напишемо код гри!
