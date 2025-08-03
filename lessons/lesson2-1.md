# 2.1: Робимо наш сайт красивим! 🎨

## Що ми будемо робити сьогодні? 🚀

Привіт, маленький програміст! 👋 Сьогодні ми зробимо наш сайт ще кращим і красивішим!

- 🎨 додамо нові кольори
- 🎮 створимо ігрове поле 
- 🚗 намалюємо танки гравця та ворога 
- 📝 реалізуємо систему логування подій

<iframe width="850" height="650" src="/battle_city_js_course/mbili/game.html" frameborder="0" allowfullscreen></iframe>

У цьому уроці ми оновимо HTML структуру (як перебудувати замок з лего!) та додамо нові стилі для ігрового контейнера та системи логування (як додати нові фарби до палітри!).

## 📁 Підготовка до роботи

### Крок 0: Створення папки для уроку 2

**Важливо:** Кожен урок - це нова папка! 📁

Уяві собі, що ми переходимо на новий рівень у грі! 🎮

1. **Скопіюйте папку `lesson1`** (як копіювати збереження в грі!)
2. **Перейменуйте її в `lesson2`** (як дати нову назву рівню!)
3. **Відкрийте папку `lesson2` в VS Code** (як відкрити новий рівень!)

**Структура файлів (як план будівництва!):**

```
📁 lesson2
├── 📄 index.html          # Оновлена головна сторінка
├── 📄 main.js             # Новий JavaScript код (як магічні заклинання!)
├── 📄 variables.js        # CSS змінні кольорів (як коробка з фарбами!)
└── 📄 styles.js           # Основні стилі (як інструкція для малювання!)
```

## Крок 1: Оновлення заголовка

1. **Оновіть заголовок та опис:**
   ```html
   <title>Танчики - Урок 2: Малювання поля та танків</title>
   ```

## Крок 2: Додавання нових стилів

**Додайте нові стилі в `styles.css`:**

```css
canvas {
  border: 3px solid var(--primary);
  border-radius: 8px;
  background-color: var(--black);
  display: block;
  margin: 0 auto;
}

/* ------------Кінець файлу попереднього уроку----------------- */

```

### ДОДАЙ КОД НИЖЧЕ
```css
/* 🎮 Контейнер для гри - як розташовуємо ігрове поле та журнал поруч */
.game_container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

/* 📋 Журнал подій гри - як робимо вікно для повідомлень */
.game_log {
  width: 800px;
  height: 600px;
  background-color: var(--bg-secondary);
  border: 2px solid var(--primary);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
/* 📋 Заголовок журналу - як робимо заголовок для вікна */
.game_log__header {
  background-color: var(--bg-elevated);
  padding: 10px;
  border-bottom: 1px solid var(--primary);
  display: flex;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  justify-content: space-between;
  align-items: center;
}

.game_log__header-title {
  margin: 0;
  font-size: 16px;
}
/* 🔘 Кнопка очищення журналу - як робимо кнопку для очищення журналу */
.game_log__clear-btn {
  background-color: var(--danger);
  color: var(--white);
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.game_log__clear-btn:hover {
  background-color: var(--danger-hover);
}
/* 📋 Вміст журналу - як робимо вміст для вікна */
.game_log__content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}
/* 🔘 Блок з тестовими кнопками - як робимо панель кнопок */
.test_buttons {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
}

.test_buttons__title {
  margin-top: 0;
  margin-bottom: 15px;
}

.test_buttons__btn {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.test_buttons__btn:hover {
  background-color: var(--primary-hover);
}

/* 🎮 Блок з керуванням - як робимо інструкцію для гри */
.controls {
  margin-top: 20px;
  background-color: var(--bg-secondary);
  padding: 15px;
  border-radius: 8px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
/* 📋 Легенда - як робимо легенду для вікна */
.legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;
}
/* 📋 Елемент легенди - як робимо елемент для вікна */
.legend_item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background-color: var(--bg-elevated);
  border-radius: 5px;
}
/* 📋 Колір - як робимо колір для вікна */
.legend__color-box {
  width: 20px;
  height: 20px;
  border: 1px solid var(--white);
}
```

## Крок 3: Оновлення HTML контенту

1. **Замініть інформаційний блок:**

   ```html
   <div class="lesson_info">
     <h2>🎨 Малювання поля та танків</h2>
     <p>У цьому уроці ми створимо:</p>
     <ul style="text-align: left;">
       <li>✅ Ігрове поле з сіткою (як шахова дошка!)</li>
       <li>✅ Танк гравця (жовтий - як сонце!)</li>
       <li>✅ Ворожого танка (червоний - як вогонь!)</li>
       <li>✅ Систему логування подій (як щоденник!)</li>
     </ul>
   </div>
   ```

2. **Додайте ігровий контейнер (видаліть старий `<canvas></canvas>`):**

   ```html
   <div class="game_container">
     <canvas id="gameCanvas" width="800" height="600"></canvas>

     <div class="game_log">
       <div class="game_log__header">
         <h3>🎮 Ігровий лог</h3>
         <button class="game_log__clear" onclick="clearLog()">Очистити</button>
       </div>
       <div class="game_log__content" id="logContent">
         <!-- Тут будуть з'являтися записи логу -->
       </div>
     </div>
   </div>
   ```

## 🎉 Результат

Після цих змін у тебе буде:

- ✅ Оновлений заголовок сторінки (як нова назва книги!)
- ✅ Новий макет з ігровим полем та панеллю логування (як новий план кімнати!)
- ✅ Стилізована панель логування з кнопкою очищення (як магічна кнопка!)
- ✅ Готовий контейнер для відображення логів (як порожній щоденник!)

## 🚀 Що далі?

У наступному підрозділі ми створимо базовий клас танка, який буде основою для всіх танків у грі (як створити шаблон для малювання танків!).

**Ти молодець! 🌟 Продовжуй в тому ж дусі!**
