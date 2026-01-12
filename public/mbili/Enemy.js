import { Tank } from './Tank.js';
import { red, darkGray } from './colors.js';

/**
 * 🎮 Клас Enemy - представляє ворожого танка
 *
 * Відповідає за:
 * - Логіку ворожого танка
 * - Штучний інтелект
 * @class Enemy
 * @extends Tank
 */
export class Enemy extends Tank {
  /**
   * @param {import('./Tank.js').TankOptions} options - Параметри ворога
   * @param {import('./GameLogger.js').GameLogger} logger - Логгер для запису подій ворога
   */
  constructor(options = {}, logger) {
    // Викликаємо конструктор батьківського класу Tank
    super(
      {
        ...options, // передаємо всі опції батьківському класу
        // червоний колір за замовчуванням
        color: options.color || red,
        // ворог рухається повільніше за гравця
        speed: options.speed || 1,
        // початковий напрямок дула вниз
        direction: options.direction || 'down',
      },
      logger
    );

    // записуємо в лог
    this.logger.enemyAction(
      'Ворог створений',
      `позиція: (${this.x}, ${this.y})`
    );
  }

  /**
   * Оновлення стану ворога
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    // Поки що просто оновлюємо час
    // В наступних уроках тут буде штучний інтелект ворога
  }

  /**
   * Малювання ворога на екрані
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  render(ctx) {
    // якщо ворог мертвий, не малюємо
    if (!this.isAlive) return;

    // зберігаємо поточний стан контексту
    ctx.save();

    // викликаємо метод render батьківського класу
    super.render(ctx);

    // малюємо червоний хрестик
    this.drawEnemyMark(ctx);

    // відновлюємо стан контексту
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
    ctx.strokeStyle = darkGray;
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
