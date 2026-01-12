import { white, darkGray } from './colors.js';

/**
 * @typedef {Object} TankOptions
 * @property {number} x - Початкова позиція X танка
 * @property {number} y - Початкова позиція Y танка
 * @property {number} size - Розмір танка (ширина і висота)
 * @property {number} sizeScale - Масштаб розміру танка (трохи збільшений або зменшений)
 * @property {string} color - Колір танка
 * @property {number} speed - Швидкість руху танка
 * @property {'up' | 'down' | 'left' | 'right'} direction - Напрямок дула танка ('up', 'down', 'left', 'right')
 */

/**
 * 🎮 Клас Tank - базовий клас для всіх танків
 *
 * Відповідає за:
 * - Базову логіку танка (як правила гри!)
 * - Малювання танка
 * - Фізику руху (як рухається танчик!)
 */
export class Tank {
  /**
   * @param {TankOptions} options - Параметри танка
   * @param {import('./GameLogger.js').GameLogger} logger - Логгер для запису подій танка
   */
  constructor(options = {}, logger) {
    // Позиція танка на полі (як координати на карті!)
    // координата X (за замовчуванням 0)
    this.x = options.x || 0;
    // координата Y (за замовчуванням 0)
    this.y = options.y || 0;

    this.sizeScale = options.sizeScale || 0.7;

    // Розміри танка
    // ширина танка в пікселях
    this.width = options.size || 22;
    // висота танка в пікселях
    this.height = options.size || 22;

    // Властивості танка (що вміє танчик)
    // колір танка (за замовчуванням білий)
    this.color = options.color || white;
    // швидкість руху танка
    this.speed = options.speed || 1;
    // напрямок дула танка (куди дивиться дуло!)
    this.direction = options.direction || 'up';

    // Стан танка
    // чи живий танк
    this.isAlive = true;
    // здоров'я танка (від 0 до 100, як здоров'я людини!)
    this.health = 100;

    // Логгер для запису подій танка
    this.logger = logger;
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

    // Обчислюємо зменшені розміри та зміщення для центрування
    const scaledWidth = this.width * this.sizeScale;
    const scaledHeight = this.height * this.sizeScale;
    const offsetX = (this.width - scaledWidth) / 2;
    const offsetY = (this.height - scaledHeight) / 2;

    // Малюємо тіло танка
    // встановлюємо колір танка
    ctx.fillStyle = this.color;
    // малюємо зменшений прямокутник з центруванням
    ctx.fillRect(
      this.x + offsetX,
      this.y + offsetY,
      scaledWidth,
      scaledHeight
    );

    // Малюємо дуло танка
    // викликаємо функцію малювання дула з параметрами масштабування
    this.drawBarrel(ctx, scaledWidth, scaledHeight, offsetX, offsetY);
  }

  /**
   * Малювання дула танка
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   * @param {number} scaledWidth - Масштабована ширина танка
   * @param {number} scaledHeight - Масштабована висота танка
   * @param {number} offsetX - Зміщення по X для центрування
   * @param {number} offsetY - Зміщення по Y для центрування
   */
  drawBarrel(ctx, scaledWidth, scaledHeight, offsetX, offsetY) {
    // довжина дула (60% від масштабованої ширини танка)
    const barrelLength = scaledWidth * 0.6;
    // ширина дула (20% від масштабованої ширини танка)
    const barrelWidth = scaledWidth * 0.2;

    // темно-синій колір для дула (як колір металу!)
    ctx.fillStyle = darkGray;

    // перевіряємо напрямок дула (куди дивиться труба!)
    switch (this.direction) {
      // якщо дуло дивиться вгору (як труба дивиться в небо!)
      case 'up':
        ctx.fillRect(
          // центруємо дуло по X з урахуванням масштабу
          this.x + offsetX + scaledWidth / 2 - barrelWidth / 2,
          // розміщуємо дуло вище танка
          this.y + offsetY - barrelLength,
          // ширина дула
          barrelWidth,
          // довжина дула
          barrelLength
        );
        break;
      // якщо дуло дивиться вниз (як труба дивиться в землю!)
      case 'down':
        ctx.fillRect(
          // центруємо дуло по X з урахуванням масштабу
          this.x + offsetX + scaledWidth / 2 - barrelWidth / 2,
          // розміщуємо дуло нижче танка
          this.y + offsetY + scaledHeight,
          // ширина дула
          barrelWidth,
          // довжина дула
          barrelLength
        );
        break;
      // якщо дуло дивиться вліво (як труба дивиться вліво!)
      case 'left':
        ctx.fillRect(
          // розміщуємо дуло лівіше танка
          this.x + offsetX - barrelLength,
          // центруємо дуло по Y з урахуванням масштабу
          this.y + offsetY + scaledHeight / 2 - barrelWidth / 2,
          // довжина дула
          barrelLength,
          // ширина дула
          barrelWidth
        );
        break;
      // якщо дуло дивиться вправо (як труба дивиться вправо!)
      case 'right':
        ctx.fillRect(
          // розміщуємо дуло правіше танка
          this.x + offsetX + scaledWidth,
          // центруємо дуло по Y з урахуванням масштабу
          this.y + offsetY + scaledHeight / 2 - barrelWidth / 2,
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
   * Знищити танк
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
