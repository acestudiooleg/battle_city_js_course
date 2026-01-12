import { Tank } from './Tank.js';
import { yellow, orange } from './colors.js';

/**
 * 🎮 Клас Player - представляє гравця
 *
 * Відповідає за:
 * - Специфічну логіку гравця
 * - Керування гравцем
 *
 * @class Player
 * @extends Tank
 */
export class Player extends Tank {
  /**
   *
   * @param {import('./Tank.js').TankOptions} options
   * @param {import('./GameLogger.js').GameLogger} logger
   */
  constructor(options = {}, logger) {
    // Викликаємо конструктор батьківського класу Tank
    super(
      {
        ...options, // передаємо всі опції батьківському класу
        // жовтий колір за замовчуванням
        color: options.color || yellow,
        // гравець рухається швидше за ворога
        speed: options.speed || 2,
        // початковий напрямок дула вгору
        direction: options.direction || 'up',
      },
      logger
    );

    // Логгер для запису подій гравця
    this.logger = logger;

    // записуємо в лог
    this.logger.playerAction(
      'Гравець створений',
      `позиція: (${this.x}, ${this.y})`
    );
  }

  /**
   * Оновлення стану гравця
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    // Поки що просто оновлюємо час
    // В наступних уроках тут буде логіка руху за клавішами
  }

  /**
   * Малювання гравця на екрані
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  render(ctx) {
    // якщо гравець мертвий, не малюємо
    if (!this.isAlive) return;

    // зберігаємо поточний стан контексту
    ctx.save();

    // викликаємо метод render батьківського класу
    super.render(ctx);

    // малюємо жовтий круг
    this.drawPlayerMark(ctx);

    // відновлюємо стан контексту
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
    ctx.fillStyle = orange;
    // починаємо малювати шлях
    ctx.beginPath();
    // малюємо коло
    ctx.arc(centerX, centerY, markSize, 0, 2 * Math.PI);
    // заповнюємо коло кольором
    ctx.fill();
  }
}
