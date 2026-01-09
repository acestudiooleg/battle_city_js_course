# 2.7: Створюємо мотор гри! 🚗

## Що ми будемо робити сьогодні? 🚀

У цьому уроці ми створимо клас `Game.js`, який буде головним класом гри, що координує всі компоненти та керує ігровим циклом.

## 🎮 Створення класу Game.js

Створіть файл `Game.js`:

```javascript
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { GameField } from './GameField.js';
import { yellow, red } from './colors.js';

/**
 * 🎮 Клас Game - головний клас гри
 *
 * Відповідає за:
 * - Ініціалізацію всіх компонентів гри
 * - Управління ігровим циклом
 * - Координацію між різними частинами гри
 */

/**
 * Головний клас гри
 * Відповідає за ініціалізацію та управління грою
 * @class Game
 * @constructor
 * @param {GameLogger} logger - екземпляр логера для запису подій
 * @param {HTMLCanvasElement} canvas - Canvas елемент для малювання
 * @param {CanvasRenderingContext2D} ctx - Контекст для малювання на Canvas
 * @param {Object} GAME_CONFIG - Конфігурація гри
 */
export class Game {
  constructor(logger, canvas, ctx, GAME_CONFIG) {
    // Canvas елемент з HTML
    this.canvas = canvas;
    // контекст для малювання
    this.ctx = ctx;
    // конфігурація гри
    this.config = GAME_CONFIG;
    // логгер для запису подій
    this.logger = logger;

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
    this.logger.gameEvent('Ініціалізація гри');

    // створюємо нове ігрове поле
    this.gameField = new GameField(this.ctx, this.config, this.logger);

    this.player = new Player(
      {
        // позиція X гравця
        x: 100,
        // позиція Y гравця
        y: 100,
        // жовтий колір для гравця
        color: yellow,
        // розмір танка
        size: this.config.TILE_SIZE,
      },
      this.logger
    );

    this.enemy = new Enemy(
      {
        // позиція X ворога
        x: 300,
        // позиція Y ворога
        y: 200,
        // червоний колір для ворога
        color: red,
        // розмір танка
        size: this.config.TILE_SIZE,
      },
      this.logger
    );

    // записуємо успіх в лог
    this.logger.success('Гра ініціалізована успішно!');
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
    this.logger.gameEvent('Гра запущена!');
  }

  /**
   * Зупинка гри
   */
  stop() {
    // позначаємо гру як зупинену
    this.isRunning = false;
    // записуємо в лог
    this.logger.gameEvent('Гра зупинена!');
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

## 🎯 Що робить цей клас?

### Основні властивості:

- **`canvas`** - HTML Canvas елемент
- **`ctx`** - контекст для малювання
- **`config`** - конфігурація гри
- **`player`** - об'єкт гравця
- **`enemy`** - об'єкт ворога
- **`gameField`** - об'єкт ігрового поля
- **`isRunning`** - чи запущена гра
- **`lastTime`** - час останнього кадру

### Основні методи:

- **`init()`** - ініціалізація всіх компонентів
- **`start()`** - запуск гри
- **`stop()`** - зупинка гри
- **`update(deltaTime)`** - оновлення стану всіх об'єктів
- **`render()`** - малювання всіх об'єктів
- **`gameLoop(currentTime)`** - головний ігровий цикл

## 🔄 Ігровий цикл

### Структура циклу:

1. **Перевірка стану** - чи гра запущена
2. **Розрахунок часу** - різниця між кадрами
3. **Оновлення** - оновлення всіх об'єктів
4. **Малювання** - малювання всіх об'єктів
5. **Планування** - планування наступного кадру

### Порядок оновлення:

1. **Ігрове поле** - `gameField.update()`
2. **Гравець** - `player.update()`
3. **Ворог** - `enemy.update()`

### Порядок малювання:

1. **Очищення Canvas** - `clearRect()`
2. **Ігрове поле** - `gameField.render()`
3. **Гравець** - `player.render()`
4. **Ворог** - `enemy.render()`

## 🎯 Ініціалізація об'єктів

### Позиції танків:

- **Гравець**: (100, 100) - жовтий танк
- **Ворог**: (300, 200) - червоний танк

### Розміри:

- **Танки**: 32x32 пікселі (розмір клітинки)
- **Canvas**: 800x600 пікселів

## 🎮 Використання

```javascript
// Створення гри (логгер передається автоматично)
const game = new Game();

// Ініціалізація
game.init();

// Запуск гри
game.start();

// Зупинка гри (опціонально)
// game.stop();
```

## 📝 Параметр logger

**`logger`** - це об'єкт системи логування, який автоматично передається в конструктор для запису подій гри:

- **Тип**: `GameLogger` або `null`
- **Призначення**: Запис подій, дій та стану гри
- **Методи**:
  - `gameEvent(message, details)` - запис ігрових подій
  - `success(message, details)` - успішні операції
  - `info(message, details)` - інформаційні повідомлення
  - `warning(message, details)` - попередження
  - `error(message, details)` - помилки

**Приклад використання**:

```javascript
// Створення логгера
const logger = new GameLogger();

// Створення гри (логгер передається автоматично)
const game = new Game();

// Автоматичне логування подій гри
// logger.gameEvent('Ініціалізація гри')
// logger.success('Гра ініціалізована успішно!')
// logger.gameEvent('Гра запущена!')
```

## 📝 Логування

Клас автоматично логує:

- **Ініціалізацію гри** - `gameEvent('Ініціалізація гри')`
- **Успішну ініціалізацію** - `success('Гра ініціалізована успішно!')`
- **Запуск гри** - `gameEvent('Гра запущена!')`
- **Зупинку гри** - `gameEvent('Гра зупинена!')`

## ⚙️ Особливості

### requestAnimationFrame:

- **Плавна анімація** - 60 FPS
- **Оптимізація** - браузер сам керує частотою
- **Економія ресурсів** - зупиняється коли вкладка неактивна

### deltaTime:

- **Незалежність від FPS** - рух буде однаковим на різних пристроях
- **Плавність** - компенсація змін частоти кадрів

## 🎉 Результат

Після створення цього класу у тебе буде:

- ✅ Повноцінний ігровий движок
- ✅ Координація всіх компонентів
- ✅ Плавний ігровий цикл
- ✅ Готовність для додавання нових функцій

## 🚀 Що далі?

У наступному уроці ми оновимо головний файл `main.js` для запуску всієї гри.

**Ти молодець! 🌟 Продовжуй в тому ж дусі!**
