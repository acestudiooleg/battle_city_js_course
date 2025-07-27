# 🎮 Урок 2: Малювання поля та танків

## Що ми будемо робити сьогодні?

У цьому уроці ми створимо ігрове поле з сіткою, додамо танк гравця та ворожого танка. Ми також створимо систему логування для відстеження подій у грі.

## 📋 Послідовність дій

### Крок 1: Оновлення HTML структури

1. **Оновіть заголовок та опис:**
   ```html
   <title>Танчики - Урок 2: Малювання поля та танків</title>
   ```

2. **Додайте нові стилі для ігрового контейнера:**
   ```html
   <style>
       /* ... існуючі стилі ... */
       
       .game-container {
           display: flex;
           gap: 20px;
           justify-content: center;
           align-items: flex-start;
           margin-bottom: 20px;
       }
       
       .game-log {
           width: 300px;
           height: 600px;
           background-color: #2c3e50;
           border: 2px solid #3498db;
           border-radius: 8px;
           display: flex;
           flex-direction: column;
       }
       
       .log-header {
           background-color: #34495e;
           padding: 10px;
           border-bottom: 1px solid #3498db;
           display: flex;
           justify-content: space-between;
           align-items: center;
       }
       
       .log-header h3 {
           margin: 0;
           font-size: 16px;
       }
       
       .clear-btn {
           background-color: #e74c3c;
           color: white;
           border: none;
           padding: 5px 10px;
           border-radius: 4px;
           cursor: pointer;
           font-size: 12px;
       }
       
       .clear-btn:hover {
           background-color: #c0392b;
       }
       
       .log-content {
           flex: 1;
           overflow-y: auto;
           padding: 10px;
           font-family: 'Courier New', monospace;
           font-size: 12px;
           line-height: 1.4;
       }
       
       .log-entry {
           margin-bottom: 8px;
           padding: 5px;
           border-radius: 4px;
           word-wrap: break-word;
       }
   </style>
   ```

### Крок 2: Оновлення HTML контенту

1. **Замініть інформаційний блок:**
   ```html
   <div class="lesson-info">
       <h2>Малювання поля та танків</h2>
       <p>У цьому уроці ми створимо:</p>
       <ul style="text-align: left;">
           <li>✅ Ігрове поле з сіткою</li>
           <li>✅ Танк гравця (жовтий)</li>
           <li>✅ Ворожого танка (червоний)</li>
           <li>✅ Систему логування подій</li>
       </ul>
   </div>
   ```

2. **Додайте ігровий контейнер:**
   ```html
   <div class="game-container">
       <canvas id="gameCanvas" width="800" height="600"></canvas>
       
       <div class="game-log">
           <div class="log-header">
               <h3>🎮 Ігровий лог</h3>
               <button class="clear-btn" onclick="clearLog()">Очистити</button>
           </div>
           <div class="log-content" id="logContent">
               <!-- Тут будуть з'являтися записи логу -->
           </div>
       </div>
   </div>
   ```

### Крок 3: Створення класу Tank.js

1. **Створіть файл `Tank.js`:**
   ```javascript
   /**
    * 🎮 Клас Tank - базовий клас для всіх танків
    * 
    * Відповідає за:
    * - Базову логіку танка
    * - Малювання танка
    * - Фізику руху
    */

   export class Tank {
       constructor(options = {}) {
           // Позиція танка на полі
           // координата X (за замовчуванням 0)
           this.x = options.x || 0;
           // координата Y (за замовчуванням 0)
           this.y = options.y || 0;
           
           // Розміри танка
           // ширина танка в пікселях
           this.width = options.size || 32;
           // висота танка в пікселях
           this.height = options.size || 32;
           
           // Властивості танка
           // колір танка (за замовчуванням білий)
           this.color = options.color || '#ffffff';
           // швидкість руху танка
           this.speed = options.speed || 1;
           // напрямок дула танка
           this.direction = options.direction || 'up';
           
           // Стан танка
           // чи живий танк
           this.isAlive = true;
           // здоров'я танка (від 0 до 100)
           this.health = 100;
       }
       
       /**
        * Оновлення стану танка
        * @param {number} deltaTime - Час з останнього оновлення
        */
       update(deltaTime) {
           // Базова логіка оновлення (поки що порожня)
           // В наступних уроках тут буде логіка руху та стрільби
       }
       
       /**
        * Малювання танка
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       render(ctx) {
           // якщо танк мертвий, не малюємо його
           if (!this.isAlive) return;
           
           // Малюємо тіло танка (основний прямокутник)
           // встановлюємо колір танка
           ctx.fillStyle = this.color;
           // малюємо прямокутник
           ctx.fillRect(this.x, this.y, this.width, this.height);
           
           // Малюємо дуло танка (додатковий елемент)
           // викликаємо функцію малювання дула
           this.drawBarrel(ctx);
       }
       
       /**
        * Малювання дула танка
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       drawBarrel(ctx) {
           // довжина дула (60% від ширини танка)
           const barrelLength = this.width * 0.6;
           // ширина дула (20% від ширини танка)
           const barrelWidth = this.width * 0.2;
           
           // темно-синій колір для дула
           ctx.fillStyle = '#2c3e50';
           
           // перевіряємо напрямок дула
           switch (this.direction) {
               // якщо дуло дивиться вгору
               case 'up':
                   ctx.fillRect(
                       // центруємо дуло по X
                       this.x + this.width / 2 - barrelWidth / 2,
                       // розміщуємо дуло вище танка
                       this.y - barrelLength,
                       // ширина дула
                       barrelWidth,
                       // довжина дула
                       barrelLength
                   );
                   break;
               // якщо дуло дивиться вниз
               case 'down':
                   ctx.fillRect(
                       // центруємо дуло по X
                       this.x + this.width / 2 - barrelWidth / 2,
                       // розміщуємо дуло нижче танка
                       this.y + this.height,
                       // ширина дула
                       barrelWidth,
                       // довжина дула
                       barrelLength
                   );
                   break;
               // якщо дуло дивиться вліво
               case 'left':
                   ctx.fillRect(
                       // розміщуємо дуло лівіше танка
                       this.x - barrelLength,
                       // центруємо дуло по Y
                       this.y + this.height / 2 - barrelWidth / 2,
                       // довжина дула
                       barrelLength,
                       // ширина дула
                       barrelWidth
                   );
                   break;
               // якщо дуло дивиться вправо
               case 'right':
                   ctx.fillRect(
                       // розміщуємо дуло правіше танка
                       this.x + this.width,
                       // центруємо дуло по Y
                       this.y + this.height / 2 - barrelWidth / 2,
                       // довжина дула
                       barrelLength,
                       // ширина дула
                       barrelWidth
                   );
                   break;
           }
       }
       
       /**
        * Перевірка чи танк живий
        * @returns {boolean} - true якщо танк живий
        */
       isTankAlive() {
           // танк живий якщо isAlive=true і здоров'я > 0
           return this.isAlive && this.health > 0;
       }
       
       /**
        * Вбити танк
        */
       kill() {
           // позначаємо танк як мертвий
           this.isAlive = false;
           // встановлюємо здоров'я в 0
           this.health = 0;
       }
       
       /**
        * Відродити танк
        */
       respawn() {
           // позначаємо танк як живий
           this.isAlive = true;
           // відновлюємо повне здоров'я
           this.health = 100;
       }
   }
   ```

### Крок 4: Створення класу Player.js

1. **Створіть файл `Player.js`:**
   ```javascript
   import { Tank } from './Tank.js';
   import { logger } from './main.js';

   /**
    * 🎮 Клас Player - представляє гравця
    * 
    * Відповідає за:
    * - Специфічну логіку гравця
    * - Керування гравцем
    */

   export class Player extends Tank {
       constructor(options = {}) {
           // Викликаємо конструктор батьківського класу Tank
           super({
               ...options, // передаємо всі опції батьківському класу
               // жовтий колір за замовчуванням
               color: options.color || '#f1c40f',
               // гравець рухається швидше за ворога
               speed: options.speed || 2,
               // початковий напрямок дула вгору
               direction: options.direction || 'up'
           });
           
           // записуємо в лог
           logger.playerAction('Гравець створений', `позиція: (${this.x}, ${this.y})`);
       }
       
       /**
        * Оновлення стану гравця
        * @param {number} deltaTime - Час з останнього оновлення
        */
       update(deltaTime) {
           // Поки що просто оновлюємо час (порожня функція)
           // В наступних уроках тут буде логіка руху за клавішами
       }
       
       /**
        * Малювання гравця на екрані
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       render(ctx) {
           // якщо гравець мертвий, не малюємо
           if (!this.isAlive) return;
           
           // зберігаємо поточний стан контексту (колір, стиль тощо)
           ctx.save();
           
           // викликаємо метод render батьківського класу
           super.render(ctx);
           
           // малюємо жовтий круг
           this.drawPlayerMark(ctx);
           
           // відновлюємо стан контексту (повертаємо попередні налаштування)
           ctx.restore();
       }
       
       /**
        * Малювання позначки гравця (жовтий круг)
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       drawPlayerMark(ctx) {
           // розмір позначки в пікселях
           const markSize = 4;
           // центр танка по X
           const centerX = this.x + this.width / 2;
           // центр танка по Y
           const centerY = this.y + this.height / 2;
           
           // помаранчево-жовтий колір
           ctx.fillStyle = '#f39c12';
           // починаємо малювати шлях
           ctx.beginPath();
           // малюємо коло
           ctx.arc(centerX, centerY, markSize, 0, 2 * Math.PI);
           // заповнюємо коло кольором
           ctx.fill();
       }
   }
   ```

### Крок 5: Створення класу Enemy.js

1. **Створіть файл `Enemy.js`:**
   ```javascript
   import { Tank } from './Tank.js';
   import { logger } from './main.js';

   /**
    * 🎮 Клас Enemy - представляє ворожого танка
    * 
    * Відповідає за:
    * - Логіку ворожого танка
    * - Штучний інтелект
    */

   export class Enemy extends Tank {
       constructor(options = {}) {
           // Викликаємо конструктор батьківського класу Tank
           super({
               ...options, // передаємо всі опції батьківському класу
               // червоний колір за замовчуванням
               color: options.color || '#e74c3c',
               // ворог рухається повільніше за гравця
               speed: options.speed || 1,
               // початковий напрямок дула вниз
               direction: options.direction || 'down'
           });
           
           // записуємо в лог
           logger.enemyAction('Ворог створений', `позиція: (${this.x}, ${this.y})`);
       }
       
       /**
        * Оновлення стану ворога
        * @param {number} deltaTime - Час з останнього оновлення
        */
       update(deltaTime) {
           // Поки що просто оновлюємо час (порожня функція)
           // В наступних уроках тут буде штучний інтелект ворога
       }
       
       /**
        * Малювання ворога на екрані
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       render(ctx) {
           // якщо ворог мертвий, не малюємо
           if (!this.isAlive) return;
           
           // зберігаємо поточний стан контексту (колір, стиль тощо)
           ctx.save();
           
           // викликаємо метод render батьківського класу
           super.render(ctx);
           
           // малюємо червоний хрестик
           this.drawEnemyMark(ctx);
           
           // відновлюємо стан контексту (повертаємо попередні налаштування)
           ctx.restore();
       }
       
       /**
        * Малювання позначки ворога (червоний хрестик)
        * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
        */
       drawEnemyMark(ctx) {
           // розмір позначки в пікселях
           const markSize = 6;
           // центр танка по X
           const centerX = this.x + this.width / 2;
           // центр танка по Y
           const centerY = this.y + this.height / 2;
           
           // темно-червоний колір для ліній
           ctx.strokeStyle = '#c0392b';
           // товщина ліній хрестика
           ctx.lineWidth = 2;
           
           // починаємо малювати шлях
           ctx.beginPath();
           // початкова точка
           ctx.moveTo(centerX - markSize, centerY - markSize);
           // кінцева точка
           ctx.lineTo(centerX + markSize, centerY + markSize);
           // малюємо лінію
           ctx.stroke();
           
           // починаємо малювати новий шлях
           ctx.beginPath();
           // початкова точка
           ctx.moveTo(centerX + markSize, centerY - markSize);
           // кінцева точка
           ctx.lineTo(centerX - markSize, centerY + markSize);
           // малюємо лінію
           ctx.stroke();
       }
   }
   ```
color: options.color || '#f1c40f',
### Крок 6: Створення класу GameField.js

1. **Створіть файл `GameField.js`:**
   ```javascript
   import { logger } from './main.js';

   /**
    * 🎮 Клас GameField - представляє ігрове поле
    * 
    * Відповідає за:
    * - Малювання сітки поля
    * - Фон ігрового поля
    * - Розмітку клітинок
    */

   export class GameField {
       constructor(ctx, config) {
           // контекст для малювання
           this.ctx = ctx;
           // конфігурація гри
           this.config = config;
           // розмір клітинки
           this.tileSize = config.TILE_SIZE;
           
           // записуємо в лог
           logger.gameEvent('Ігрове поле створене');
       }
       
       /**
        * Оновлення ігрового поля
        * @param {number} deltaTime - Час з останнього оновлення
        */
       update(deltaTime) {
           // Поки що нічого не оновлюємо (порожня функція)
           // В майбутньому тут може бути анімація фону
       }
       
       /**
        * Малювання ігрового поля
        */
       render() {
           // малюємо фон поля
           this.drawBackground();
           // малюємо сітку поля
           this.drawGrid();
       }
       
       /**
        * Малювання фону поля
        */
       drawBackground() {
           // Малюємо темно-зелений фон
           // темно-зелений колір для фону
           this.ctx.fillStyle = '#2d5016';
           // заповнюємо весь Canvas
           this.ctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
       }
       
       /**
        * Малювання сітки поля
        */
       drawGrid() {
           // світло-зелений колір для ліній сітки
           this.ctx.strokeStyle = '#3a5f1e';
           // товщина ліній сітки
           this.ctx.lineWidth = 1;
           
           // проходимо по всій ширині з кроком tileSize
           for (let x = 0; x <= this.config.CANVAS_WIDTH; x += this.tileSize) {
               // починаємо малювати шлях
               this.ctx.beginPath();
               // початкова точка (верх)
               this.ctx.moveTo(x, 0);
               // кінцева точка (низ)
               this.ctx.lineTo(x, this.config.CANVAS_HEIGHT);
               // малюємо лінію
               this.ctx.stroke();
           }
           
           // проходимо по всій висоті з кроком tileSize
           for (let y = 0; y <= this.config.CANVAS_HEIGHT; y += this.tileSize) {
               // починаємо малювати шлях
               this.ctx.beginPath();
               // початкова точка (ліво)
               this.ctx.moveTo(0, y);
               // кінцева точка (право)
               this.ctx.lineTo(this.config.CANVAS_WIDTH, y);
               // малюємо лінію
               this.ctx.stroke();
           }
       }
   }
   ```

### Крок 7: Створення класу GameLogger.js

1. **Створіть файл `GameLogger.js`:**
   ```javascript
   /**
    * 🎮 Клас GameLogger - система логування подій гри
    * 
    * Відповідає за:
    * - Запис подій гри
    * - Відображення логів на екрані
    * - Різні типи повідомлень
    */

   export class GameLogger {
       constructor() {
           // контейнер для логів в HTML
           this.logContainer = document.getElementById('logContent');
           // максимальна кількість записів в лозі
           this.maxEntries = 50;
       }
       
       /**
        * Додавання запису в лог
        * @param {string} message - Повідомлення
        * @param {string} type - Тип повідомлення
        * @param {string} details - Додаткові деталі
        */
       addLogEntry(message, type = 'info', details = '') {
           // поточний час
           const timestamp = new Date().toLocaleTimeString();
           // створюємо новий елемент div
           const entry = document.createElement('div');
           // встановлюємо CSS клас
           entry.className = `log-entry log-${type}`;
           
           // формуємо текст з часом
           let content = `[${timestamp}] ${message}`;
           if (details) { // якщо є деталі
               // додаємо їх до тексту
               content += ` - ${details}`;
           }
           
           // встановлюємо текст елемента
           entry.textContent = content;
           
           // додаємо запис на початок списку
           this.logContainer.insertBefore(entry, this.logContainer.firstChild);
           
           // видаляємо зайві записи (якщо їх більше maxEntries)
           while (this.logContainer.children.length > this.maxEntries) {
               // видаляємо останній елемент
               this.logContainer.removeChild(this.logContainer.lastChild);
           }
           
           // автоматично прокручуємо до верху логу
           this.logContainer.scrollTop = 0;
       }
       
       /**
        * Загальна подія гри
        */
       gameEvent(message, details = '') {
           this.addLogEntry(message, 'game', details); // додаємо запис з типом 'game'
       }
       
       /**
        * Інформаційне повідомлення
        */
       info(message, details = '') {
           this.addLogEntry(message, 'info', details); // додаємо запис з типом 'info'
       }
       
       /**
        * Успішна операція
        */
       success(message, details = '') {
           this.addLogEntry(message, 'success', details); // додаємо запис з типом 'success'
       }
       
       /**
        * Попередження
        */
       warning(message, details = '') {
           this.addLogEntry(message, 'warning', details); // додаємо запис з типом 'warning'
       }
       
       /**
        * Помилка
        */
       error(message, details = '') {
           this.addLogEntry(message, 'error', details); // додаємо запис з типом 'error'
       }
       
       /**
        * Дія гравця
        */
       playerAction(action, details = '') {
           this.addLogEntry(`👤 ${action}`, 'player', details); // додаємо запис з емодзі гравця
       }
       
       /**
        * Дія ворога
        */
       enemyAction(action, details = '') {
           this.addLogEntry(`👹 ${action}`, 'enemy', details); // додаємо запис з емодзі ворога
       }
   }
   ```

### Крок 8: Створення класу Game.js

1. **Створіть файл `Game.js`:**
   ```javascript
   /**
    * 🎮 Клас Game - головний клас гри
    * 
    * Відповідає за:
    * - Ініціалізацію всіх компонентів гри
    * - Управління ігровим циклом
    * - Координацію між різними частинами гри
    */

   import { canvas, ctx, GAME_CONFIG, logger } from './main.js';
   import { Player } from './Player.js';
   import { Enemy } from './Enemy.js';
   import { GameField } from './GameField.js';

   export class Game {
       constructor() {
           // Canvas елемент з HTML
           this.canvas = canvas;
           // контекст для малювання
           this.ctx = ctx;
           // конфігурація гри
           this.config = GAME_CONFIG;
           
           // гравець (поки що не створений)
           this.player = null;
           // ворог (поки що не створений)
           this.enemy = null;
           // ігрове поле (поки що не створене)
           this.gameField = null;
           
           // чи запущена гра
           this.isRunning = false;
           // час останнього кадру
           this.lastTime = 0;
       }
       
       /**
        * Ініціалізація гри
        * Створює всі необхідні об'єкти
        */
       init() {
           // записуємо в лог
           logger.gameEvent('Ініціалізація гри');
           
           // створюємо нове ігрове поле
           this.gameField = new GameField(this.ctx, this.config);
           
           this.player = new Player({
               // позиція X гравця
               x: 100,
               // позиція Y гравця
               y: 100,
               // жовтий колір для гравця
               color: '#f1c40f',
               // розмір танка
               size: this.config.TILE_SIZE
           });
           
           this.enemy = new Enemy({
               // позиція X ворога
               x: 300,
               // позиція Y ворога
               y: 200,
               // червоний колір для ворога
               color: '#e74c3c',
               // розмір танка
               size: this.config.TILE_SIZE
           });
           
           // записуємо успіх в лог
           logger.success('Гра ініціалізована успішно!');
       }
       
       /**
        * Запуск гри
        */
       start() {
           // позначаємо гру як запущену
           this.isRunning = true;
           // запускаємо ігровий цикл
           this.gameLoop();
           // записуємо в лог
           logger.gameEvent('Гра запущена!');
       }
       
       /**
        * Зупинка гри
        */
       stop() {
           // позначаємо гру як зупинену
           this.isRunning = false;
           // записуємо в лог
           logger.gameEvent('Гра зупинена!');
       }
       
       /**
        * Оновлення стану гри
        * @param {number} deltaTime - Час з останнього оновлення
        */
       update(deltaTime) {
           // оновлюємо стан поля
           this.gameField.update(deltaTime);
           
           // оновлюємо стан гравця
           this.player.update(deltaTime);
           
           // оновлюємо стан ворога
           this.enemy.update(deltaTime);
       }
       
       /**
        * Малювання гри
        */
       render() {
           // видаляємо все попереднє малювання
           this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
           
           // малюємо фон та сітку
           this.gameField.render();
           
           // малюємо жовтий танк гравця
           this.player.render(this.ctx);
           
           // малюємо червоний танк ворога
           this.enemy.render(this.ctx);
       }
       
       /**
        * Головний ігровий цикл
        * @param {number} currentTime - Поточний час
        */
       gameLoop(currentTime = 0) {
           // якщо гра не запущена, виходимо
           if (!this.isRunning) return;
           
           // різниця часу між кадрами
           const deltaTime = currentTime - this.lastTime;
           // зберігаємо поточний час
           this.lastTime = currentTime;
           
           // оновлюємо всі об'єкти гри
           this.update(deltaTime);
           
           // малюємо все на Canvas
           this.render();
           
           // плануємо наступний кадр
           requestAnimationFrame((time) => this.gameLoop(time));
       }
   }
   ```

### Крок 9: Оновлення main.js

1. **Оновіть файл `main.js`:**
   ```javascript
   /**
    * 🎮 Танчики - Урок 2: Малювання поля та танків
    * 
    * У цьому файлі ми запускаємо гру з:
    * - Ігровим полем та сіткою
    * - Танком гравця (жовтий квадрат)
    * - Ворожим танком (червоний квадрат)
    * - Стінами та перешкодами
    */

   // Отримуємо Canvas елемент з HTML
   // знаходимо Canvas по ID
   const canvas = document.getElementById('gameCanvas');

   // Отримуємо контекст для малювання (2D)
   // отримуємо 2D контекст для малювання
   const ctx = canvas.getContext('2d');

   // Базові константи гри
   const GAME_CONFIG = {
       // ширина Canvas в пікселях
       CANVAS_WIDTH: 800,
       // висота Canvas в пікселях
       CANVAS_HEIGHT: 600,
       // розмір однієї клітинки в пікселях
       TILE_SIZE: 32,
       // кількість кадрів за секунду
       FPS: 60
   };

   // Імпортуємо класи
   // імпортуємо головний клас гри
   import { Game } from './Game.js';
   // імпортуємо клас логування
   import { GameLogger } from './GameLogger.js';

   // Створюємо екземпляри
   // екземпляр гри (поки що не створений)
   let game;
   // екземпляр логера (поки що не створений)
   let logger;

   /**
    * Функція ініціалізації гри
    * Викликається один раз при запуску
    */
   function initGame() {
       // Ініціалізуємо логер
       // створюємо новий екземпляр логера
       logger = new GameLogger();
       
       // записуємо початок ініціалізації
       logger.gameEvent('Ініціалізація гри "Танчики" - Урок 2');
       // інформація про розміри
       logger.info(`📐 Розмір Canvas: ${GAME_CONFIG.CANVAS_WIDTH} x ${GAME_CONFIG.CANVAS_HEIGHT}`);
       // інформація про клітинки
       logger.info(`🔲 Розмір клітинки: ${GAME_CONFIG.TILE_SIZE} пікселів`);
       
       // Створюємо нову гру
       // створюємо новий екземпляр гри
       game = new Game();
       
       // Ініціалізуємо гру
       // ініціалізуємо всі компоненти гри
       game.init();
       
       // Запускаємо гру
       // запускаємо ігровий цикл
       game.start();
       
       // записуємо успішний запуск
       logger.success('Гра запущена успішно!');
   }

   // Запускаємо гру після завантаження сторінки
   document.addEventListener('DOMContentLoaded', () => {
       // викликаємо ініціалізацію гри
       initGame();
   });

   // Функція очищення логу
   function clearLog() {
       // знаходимо контейнер логу
       const logContent = document.getElementById('logContent');
       // очищаємо весь вміст
       logContent.innerHTML = '';
   }

   // Експортуємо основні змінні для використання в інших файлах
   // експортуємо для використання в інших модулях
   export { canvas, ctx, GAME_CONFIG, logger };
   ```

## 🎯 Що має вийти в результаті?

Після виконання всіх кроків у вас буде:
- ✅ Ігрове поле з темно-зеленим фоном та сіткою
- ✅ Жовтий танк гравця з позначкою (круг)
- ✅ Червоний танк ворога з позначкою (хрестик)
- ✅ Система логування з бічною панеллю
- ✅ Модульна структура коду з класами
- ✅ Готове середовище для додавання руху

## 🚀 Як запустити?

1. Відкрийте файл `index.html` у браузері
2. Ви повинні побачити ігрове поле з сіткою
3. На полі будуть два танки: жовтий (гравець) та червоний (ворог)
4. Справа буде панель з логами подій
5. Відкрийте консоль браузера (F12) для додаткової інформації

## 💡 Поради

- Перевіряйте консоль браузера на наявність помилок
- Переконайтеся, що всі файли знаходяться в одній папці
- Назви файлів повинні точно співпадати з імпортами
- Якщо танки не відображаються, перевірте правильність створення класів

## 🔄 Що далі?

У наступному уроці ми додамо:
- Рух гравця за допомогою клавіш
- Стрільбу та кулі
- Базову фізику руху

---

**Готово! Тепер у вас є ігрове поле з танками! 🎉** 

## Результат

[Подивитись Результат](/battle_city_js_course/mbili/index.html){target="_blank"}