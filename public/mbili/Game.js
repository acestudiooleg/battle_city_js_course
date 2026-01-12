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
export class Game {
  /**
   * @param {import('./GameLogger.js').GameLogger} logger - екземпляр логера для запису подій
   * @param {HTMLCanvasElement} canvas - Canvas елемент для малювання
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання на Canvas
   * @param {import('./main.js').GameConfig} GAME_CONFIG - Конфігурація гри
   */
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
        x: (this.config.TILE_SIZE * 2) + this.config.OFFSET_LEFT,
        // позиція Y гравця
        y: (this.config.TILE_SIZE * 2) + this.config.OFFSET_TOP,
        // жовтий колір для гравця
        color: yellow,
        // розмір танка
        size: this.config.TILE_SIZE * 2,
      },
      this.logger
    );

    this.enemy = new Enemy(
      {
        // позиція X ворога
        x:  (this.config.TILE_SIZE * 8) + this.config.OFFSET_LEFT,
        // позиція Y ворога
        y: (this.config.TILE_SIZE * 6) + this.config.OFFSET_TOP,
        // червоний колір для ворога
        color: red,
        // розмір танка
        size: this.config.TILE_SIZE * 2,
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
