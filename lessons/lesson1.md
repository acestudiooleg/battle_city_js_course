# 🎮 Урок 1:  Налаштування середовища"

## Що ми будемо робити сьогодні?

У цьому уроці ми створимо базову структуру для гри "Танчики" з нуля. Ми налаштуємо все необхідне, щоб гра могла запуститися і показати перші результати.

## 📋 Послідовність дій

### Крок 1: Створення HTML файлу

1. **Створіть новий файл** з назвою `index.html`
2. **Додайте базову HTML структуру:**
   ```html
   <!DOCTYPE html>
   <html lang="uk">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Танчики - Урок 1: Налаштування середовища</title>
   </head>
   <body>
   </body>
   </html>
   ```

### Крок 2: Додавання CSS стилів

1. **В `<head>` додайте секцію `<style>`:**
   ```html
   <style>
       body {
           font-family: Arial, sans-serif;
           text-align: center;
           background-color: #2c3e50;
           color: white;
           margin: 0;
           padding: 20px;
       }
       
       h1 {
           color: #3498db;
           margin-bottom: 10px;
       }
       
       .lesson-info {
           background-color: #34495e;
           padding: 15px;
           border-radius: 8px;
           margin-bottom: 20px;
           max-width: 800px;
           margin-left: auto;
           margin-right: auto;
       }
       
       canvas {
           border: 3px solid #3498db;
           border-radius: 8px;
           background-color: #000;
           display: block;
           margin: 0 auto;
       }
       
       .controls {
           margin-top: 20px;
           background-color: #34495e;
           padding: 15px;
           border-radius: 8px;
           max-width: 800px;
           margin-left: auto;
           margin-right: auto;
       }
   </style>
   ```

### Крок 3: Додавання HTML контенту

1. **В `<body>` додайте заголовок та інформацію:**
   ```html
   <h1>🎮 Танчики - Урок 1</h1>
   <div class="lesson-info">
       <h2>Налаштування середовища</h2>
       <p>У цьому уроці ми налаштуємо базове середовище для гри:</p>
       <ul style="text-align: left;">
           <li>✅ Створили HTML структуру</li>
           <li>✅ Налаштували Canvas для малювання</li>
           <li>✅ Підготували стилі для красивого відображення</li>
           <li>✅ Створили базову структуру проекту</li>
       </ul>
   </div>
   ```

### Крок 4: Додавання Canvas елемента

1. **Після інформаційного блоку додайте Canvas:**
   ```html
   <canvas id="gameCanvas" width="800" height="600"></canvas>
   ```
   - `id="gameCanvas"` - унікальна назва для Canvas
   - `width="800"` - ширина 800 пікселів
   - `height="600"` - висота 600 пікселів

### Крок 5: Додавання блоку з інструкціями

1. **Після Canvas додайте:**
   ```html
   <div class="controls">
       <h3>Що ми зробили:</h3>
       <p>Створили базову структуру HTML файлу з Canvas елементом для малювання гри.</p>
       <p>Canvas має розмір 800x600 пікселів та готовий для подальшої розробки.</p>
   </div>
   ```

### Крок 6: Створення JavaScript файлу

1. **Створіть новий файл** з назвою `main.js`
2. **Додайте коментарі та імпорти:**
   ```javascript
   /**
    * 🎮 Танчики - Урок 1: Налаштування середовища
    * 
    * У цьому файлі ми налаштовуємо базове середовище для гри:
    * - Отримуємо доступ до Canvas елемента
    * - Налаштовуємо контекст для малювання
    * - Створюємо базову структуру для подальшої розробки
    */

   // Отримуємо Canvas елемент з HTML
   const canvas = document.getElementById('gameCanvas');

   // Отримуємо контекст для малювання (2D)
   const ctx = canvas.getContext('2d');
   ```

### Крок 7: Додавання констант гри

1. **Додайте базові налаштування:**
   ```javascript
   // Базові константи гри
   const GAME_CONFIG = {
       CANVAS_WIDTH: 800, // Ширина Canvas
       CANVAS_HEIGHT: 600, // Висота Canvas
       TILE_SIZE: 32, // Розмір однієї клітинки в пікселях
       FPS: 60 // Кількість кадрів за секунду
   };
   ```

### Крок 8: Створення функції ініціалізації

1. **Додайте функцію ініціалізації:**
   ```javascript
   function initGame() {
       console.log('🎮 Гра "Танчики" ініціалізована!');
       console.log('📐 Розмір Canvas:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
       console.log('🔲 Розмір клітинки:', GAME_CONFIG.TILE_SIZE, 'пікселів');
       
       // Малюємо привітання на Canvas
       drawWelcomeMessage();
   }
   ```

### Крок 9: Створення функції малювання

1. **Додайте функцію для малювання привітання:**
   ```javascript
   function drawWelcomeMessage() {
       // Очищаємо Canvas
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // Налаштовуємо стиль тексту
       ctx.fillStyle = '#3498db'; // Синій колір
       ctx.font = 'bold 48px Arial';
       ctx.textAlign = 'center';
       
       // Малюємо заголовок
       ctx.fillText('ТАНЧИКИ', canvas.width / 2, canvas.height / 2 - 50);
       
       // Малюємо підзаголовок
       ctx.fillStyle = '#ecf0f1'; // Світло-сірий колір
       ctx.font = '24px Arial';
       ctx.fillText('Урок 1: Налаштування середовища', canvas.width / 2, canvas.height / 2);
       
       // Малюємо інструкцію
       ctx.fillStyle = '#95a5a6'; // Темно-сірий колір
       ctx.font = '18px Arial';
       ctx.fillText('Canvas готовий для розробки!', canvas.width / 2, canvas.height / 2 + 50);
       
       // Малюємо простий квадрат для демонстрації
       ctx.fillStyle = '#e74c3c'; // Червоний колір
       ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 + 80, 50, 50);
       
       // Малюємо рамку навколо квадрата
       ctx.strokeStyle = '#f39c12'; // Помаранчевий колір
       ctx.lineWidth = 3;
       ctx.strokeRect(canvas.width / 2 - 25, canvas.height / 2 + 80, 50, 50);
   }
   ```

### Крок 10: Створення ігрового циклу

1. **Додайте базовий ігровий цикл:**
   ```javascript
   function gameLoop() {
       // Поки що просто викликаємо requestAnimationFrame
       // В наступних уроках тут буде логіка гри
       requestAnimationFrame(gameLoop);
   }
   ```

### Крок 11: Запуск гри

1. **Додайте обробник події завантаження:**
   ```javascript
   // Запускаємо гру після завантаження сторінки
   document.addEventListener('DOMContentLoaded', () => {
       console.log('🚀 Сторінка завантажена, запускаємо гру...');
       initGame();
       gameLoop();
   });
   ```

### Крок 12: Підключення JavaScript файлу

1. **В кінець `<body>` додайте:**
   ```html
   <script type="module" src="main.js"></script>
   ```

## 🎯 Що має вийти в результаті?

Після виконання всіх кроків у вас буде:
- ✅ HTML файл з красивою структурою та стилями
- ✅ Canvas елемент розміром 800x600 пікселів
- ✅ JavaScript файл з повною функціональністю
- ✅ Canvas з написом "ТАНЧИКИ" та демонстраційним квадратом
- ✅ Консоль з повідомленнями про запуск
- ✅ Готове середовище для подальшої розробки

## 🚀 Як запустити?

1. Відкрийте файл `index.html` у браузері
2. Ви повинні побачити темну сторінку з синім Canvas
3. На Canvas буде написано "ТАНЧИКИ" та червоний квадрат з помаранчевою рамкою
4. Відкрийте консоль браузера (F12) - там будуть повідомлення про запуск

## 💡 Поради

- Перевіряйте консоль браузера на наявність помилок
- Переконайтеся, що всі файли знаходяться в одній папці
- Назви файлів повинні точно співпадати з тим, що написано в коді
- Якщо Canvas не відображається, перевірте правильність підключення JavaScript файлу

## 🔄 Що далі?

У наступному уроці ми додамо:
- Рух гравця за допомогою клавіш
- Малювання танка
- Базову фізику руху

---

**Готово! Тепер у вас є повноцінна основа для гри "Танчики"! 🎉** 

## Результат

[ДЕМО  - Урок 1](/battle_city_js_course/moja/index.html){target="_blank"}