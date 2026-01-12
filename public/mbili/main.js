/**
 * 🎮 Танчики - Урок 2: Малювання поля та танків
 *
 * У цьому файлі ми запускаємо гру з:
 * - Ігровим полем та сіткою
 * - Танком гравця (жовтий квадрат)
 * - Ворожим танком (червоний квадрат)
 * - Стінами та перешкодами
 */

// Імпортуємо класи
import { Game } from './Game.js';
import { GameLogger } from './GameLogger.js';

/**
 * @typedef {Object} GameConfig
 * @property {number} CANVAS_WIDTH - Ширина Canvas в пікселях
 * @property {number} CANVAS_HEIGHT - Висота Canvas в пікселях
 * @property {number} FIELD_WIDTH - Ширина ігрового поля
 * @property {number} FIELD_HEIGHT - Висота ігрового поля
 * @property {number} OFFSET_LEFT - Зміщення ігрового поля зліва в пікселях
 * @property {number} OFFSET_TOP - Зміщення ігрового поля зверху в пікселях
 * @property {number} TILE_SIZE - Розмір однієї клітинки в пікселях (для сітки)
 * @property {number} TANK_SIZE_SCALE - Масштаб розміру танка (трохи збільшений або зменшений)
 * @property {number} FPS - Кількість кадрів за секунду
 */

/** @type {GameConfig} */
const GAME_CONFIG = {
  // ширина Canvas в пікселях
  CANVAS_WIDTH: 800,

  // висота Canvas в пікселях
  CANVAS_HEIGHT: 600,

  // ширина ігрового поля в пікселях
  FIELD_WIDTH: 572,

  // висота ігрового поля в пікселях
  FIELD_HEIGHT: 572,

  // зміщення ігрового поля зліва в пікселях
  OFFSET_LEFT: 15,

  // зміщення ігрового поля по вертикалі в пікселях
  OFFSET_TOP: 15,

  // масштаб розміру танка (трохи збільшений або зменшений)
  TANK_SIZE_SCALE: 0.7,

  // розмір однієї клітинки в пікселях (572 ÷ 26 ≈ 22)
  TILE_SIZE: 22,

  // кількість кадрів за секунду
  FPS: 60,
};

/**
 * Головний клас додатку Battle City
 */
class BattleCityApp {
  constructor() {
    // Отримуємо Canvas елемент з HTML
    this.canvas = document.getElementById('gameCanvas');

    // Отримуємо контекст для малювання (2D)
    this.ctx = this.canvas.getContext('2d');

    // екземпляр гри (поки що не створений)
    this.game = null;

    // екземпляр логера (поки що не створений)
    this.logger = null;
  }

  /**
   * Функція ініціалізації гри
   * Викликається один раз при запуску
   */
  initGame() {
    // Ініціалізуємо логер
    this.logger = new GameLogger();

    // записуємо початок ініціалізації
    this.logger.gameEvent('Ініціалізація гри "Танчики" - Урок 2');

    // інформація про розміри
    this.logger.info(
      `📐 Розмір Canvas: ${GAME_CONFIG.CANVAS_WIDTH} x ${GAME_CONFIG.CANVAS_HEIGHT}`
    );

    // інформація про клітинки
    this.logger.info(`🔲 Розмір клітинки: ${GAME_CONFIG.TILE_SIZE} пікселів`);

    // Створюємо нову гру
    this.game = new Game(this.logger, this.canvas, this.ctx, GAME_CONFIG);

    // Ініціалізуємо гру
    this.game.init();

    // Запускаємо гру
    this.game.start();

    // записуємо успішний запуск
    this.logger.success('Гра запущена успішно!');
  }

  /**
   * Запуск додатку
   */
  start() {
    this.initGame();
  }
}

// Створення та запуск додатку після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
  // Створюємо екземпляр додатку
  const app = new BattleCityApp();

  // Запускаємо додаток
  app.start();
});
