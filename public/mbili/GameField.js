import { darkGreen, black, green } from './colors.js';

/**
 * 🎮 Клас GameField - представляє ігрове поле
 */
export class GameField {
  /**
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   * @param {import('./main.js').GameConfig} config - Конфігурація гри
   * @param {import('./GameLogger.js').GameLogger} logger - Логгер для запису подій
   */
  constructor(ctx, config, logger) {
    // контекст для малювання
    this.ctx = ctx;
    // конфігурація гри
    this.config = config;
    // розмір клітинки
    this.tileSize = config.TILE_SIZE;
    // логгер для запису подій
    this.logger = logger;
    // Зміщення ігрового поля зліва (в пікселях)
    this.offsetLeft = config.OFFSET_LEFT;
    this.offsetTop = config.OFFSET_TOP;

    // записуємо в лог
    this.logger.gameEvent('Ігрове поле створене');
  }

  /**
   * Оновлення ігрового поля
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    // Поки що нічого не оновлюємо
    // В майбутньому тут може бути анімація фону
  }

  /**
   * Малювання ігрового поля
   */
  render() {
    // малюємо фон поля
    this.drawBackground();
    // малюємо сітку поля
    this.drawSmallGrid();
    this.drawBigGrid();
  }

  /**
   * Малювання фону поля
   */
  drawBackground() {
    // Малюємо темно-зелений фон
    // темно-зелений колір для фону
    this.ctx.fillStyle = black;
    // заповнюємо весь Canvas
    this.ctx.fillRect(
      0,
      0,
      this.config.CANVAS_WIDTH,
      this.config.CANVAS_HEIGHT
    );
  }

  /**
   * Малювання маленької сітки поля
   */
  drawSmallGrid() {
    // світло-зелений колір для ліній сітки
    this.ctx.strokeStyle = darkGreen;
    // товщина ліній сітки
    this.ctx.lineWidth = 1;

    // Максимальна ширина поля
    const fieldWidth = this.config.FIELD_WIDTH || (this.config.CANVAS_WIDTH - this.offsetLeft);
    const fieldHeight = this.config.FIELD_HEIGHT || (this.config.CANVAS_HEIGHT - this.offsetTop);

    // проходимо по ширині поля з кроком tileSize
    for (let x = 0; x <= fieldWidth; x += this.tileSize) {
      // починаємо малювати шлях
      this.ctx.beginPath();
      // початкова точка (верх) - з урахуванням offsetLeft
      this.ctx.moveTo(this.offsetLeft + x, this.offsetTop);
      // кінцева точка (низ) - з урахуванням offsetLeft
      this.ctx.lineTo(this.offsetLeft + x, this.offsetTop + fieldHeight);
      // малюємо лінію
      this.ctx.stroke();
    }

    // проходимо по висоті поля з кроком tileSize
    for (let y = 0; y <= fieldHeight; y += this.tileSize) {
      // починаємо малювати шлях
      this.ctx.beginPath();
      // початкова точка (ліво) - з урахуванням offsetTop
      this.ctx.moveTo(this.offsetLeft, this.offsetTop + y);
      // кінцева точка (право) - з урахуванням offsetTop
      this.ctx.lineTo(this.offsetLeft + fieldWidth, this.offsetTop + y);
      // малюємо лінію
      this.ctx.stroke();
    }
  }
  /**
   * Малювання великої сітки поля
   */
  drawBigGrid() {
    // світло-зелений колір для ліній сітки
    this.ctx.strokeStyle = green;
    // товщина ліній сітки
    this.ctx.lineWidth = 1;

    // Максимальна ширина поля
    const fieldWidth = this.config.FIELD_WIDTH || (this.config.CANVAS_WIDTH - this.offsetLeft);
    const fieldHeight = this.config.FIELD_HEIGHT || (this.config.CANVAS_HEIGHT - this.offsetTop);
    const tileSize = this.tileSize * 2;

    // проходимо по ширині поля з кроком tileSize
    for (let x = 0; x <= fieldWidth; x += tileSize) {
      // починаємо малювати шлях
      this.ctx.beginPath();
      // початкова точка (верх) - з урахуванням offsetLeft
      this.ctx.moveTo(this.offsetLeft + x, this.offsetTop);
      // кінцева точка (низ) - з урахуванням offsetLeft
      this.ctx.lineTo(this.offsetLeft + x, this.offsetTop + fieldHeight);
      // малюємо лінію
      this.ctx.stroke();
    }

    // проходимо по висоті поля з кроком tileSize
    for (let y = 0; y <= fieldHeight; y += tileSize) {
      // починаємо малювати шлях
      this.ctx.beginPath();
      // початкова точка (ліво) - з урахуванням offsetTop
      this.ctx.moveTo(this.offsetLeft, this.offsetTop + y);
      // кінцева точка (право) - з урахуванням offsetTop
      this.ctx.lineTo(this.offsetLeft + fieldWidth, this.offsetTop + y);
      // малюємо лінію
      this.ctx.stroke();
    }

  }
}
