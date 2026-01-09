import { canvas, ctx, GAME_CONFIG, logger } from './main.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { GameField } from './GameField.js';
import { InputManager } from './InputManager.js';
import { CollisionManager } from './CollisionManager.js';
import { Explosion } from './Explosion.js';
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
  constructor(logger) {
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
    // система керування
    this.inputManager = null;
    // система колізій
    this.collisionManager = null;

    // масив активних вибухів
    this.explosions = [];

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

    // створюємо систему керування
    this.inputManager = new InputManager(this.logger);

    // створюємо систему колізій
    this.collisionManager = new CollisionManager(this.logger, this);

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

    // Встановлюємо систему керування для гравця
    this.player.setInputManager(this.inputManager);

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
   * Пауза гри
   */
  pause() {
    // записуємо в лог
    this.logger.gameEvent('Гра на паузі!');
  }

  /**
   * Продовження гри
   */
  resume() {
    // записуємо в лог
    this.logger.gameEvent('Гра продовжена!');
  }

  /**
   * Оновлення стану гри
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    // 1. Перевіряємо чи гра на паузі
    if (this.inputManager.getGameState().isPaused) {
      return;
    }

    // 2. Перевіряємо чи гра закінчена
    if (this.player.isGameOver()) {
      this.handleGameOver();
      return;
    }

    // 3. Створюємо контекст для передачі в об'єкти (тепер він не буде undefined)
    const gameContext = {
      collisionManager: this.collisionManager,
      gameField: this.gameField,
    };

    // 4. Перевіряємо чи штаб знищений
    if (this.gameField.isBaseDestroyed()) {
      this.handleBaseDestroyed();
      return;
    }

    // 5. Оновлюємо стан поля
    this.gameField.update(deltaTime);

    // --- ВАЖЛИВО: Метод updatePlayerInput видалено звідси, щоб не дублювати рух ---

    // 6. Оновлюємо танки (передаємо контекст для колізій)
    this.player.update(deltaTime, gameContext);
    this.enemy.update(deltaTime, gameContext);

    // 7. Перевірка колізій (кулі, пошкодження тощо)
    if (this.player.isAlive && !this.player.isPlayerRespawning()) {
      this.collisionManager.checkAllCollisions({
        player: this.player,
        enemy: this.enemy,
        gameField: this.gameField,
      });
    }

    // 8. Оновлюємо вибухи
    this.explosions.forEach((explosion) => explosion.update(deltaTime));
    this.explosions = this.explosions.filter((explosion) =>
      explosion.isExplosionActive()
    );

    // 9. Очищаємо клавіші натиснуті в цьому кадрі (важливо для стрільби)
    this.inputManager.clearPressedThisFrame();
  }

  /**
   * Оновлення керування гравцем
   */
  updatePlayerInput() {
    // Отримуємо напрямок руху
    const movement = this.inputManager.getMovementDirection();

    // Встановлюємо рух гравця
    // this.player.setMovement(movement);

    // Перевіряємо стрільбу
    if (this.inputManager.isShootPressed()) {
      this.player.shoot();
    }
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

    // малюємо кулі гравця
    this.player.renderBullets(this.ctx);

    // малюємо кулі ворога
    this.enemy.renderBullets(this.ctx);

    // малюємо інформацію про життя
    this.renderLivesInfo();

    // малюємо вибухи поверх всього
    this.explosions.forEach((explosion) => explosion.render(this.ctx));

    // малюємо екран кінця гри
    if (this.player.isGameOver() || this.gameField.isBaseDestroyed()) {
      this.renderGameOverScreen();
    }
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

  /**
   * Обробка кінця гри
   */
  handleGameOver() {
    // Зупиняємо гру
    this.stop();
    this.logger.gameEvent('🎮 Гра закінчена!');
  }

  /**
   * Обробка знищення штабу
   */
  handleBaseDestroyed() {
    // Зупиняємо гру
    this.stop();
    this.logger.gameEvent('💥 Штаб знищений! Гра закінчена!');
  }

  /**
   * Малювання інформації про життя
   */
  renderLivesInfo() {
    const lives = this.player.getLives();
    const maxLives = this.player.getMaxLives();

    // Налаштування тексту
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';

    // Малюємо текст життів
    this.ctx.fillText(`Життя: ${lives}/${maxLives}`, 10, 30);

    // Малюємо серця
    const heartSize = 20;
    const heartSpacing = 25;
    const startX = 10;
    const startY = 50;

    for (let i = 0; i < maxLives; i++) {
      const heartX = startX + i * heartSpacing;
      const heartY = startY;

      if (i < lives) {
        // Живе серце (червоне)
        this.ctx.fillStyle = 'red';
      } else {
        // Мертве серце (сіре)
        this.ctx.fillStyle = 'gray';
      }

      // Малюємо просте серце як коло
      this.ctx.beginPath();
      this.ctx.arc(
        heartX + heartSize / 2,
        heartY + heartSize / 2,
        heartSize / 2,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
    }
  }

  /**
   * Малювання екрану кінця гри
   */
  renderGameOverScreen() {
    // Напівпрозорий чорний фон
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Налаштування тексту
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';

    // Визначаємо причину кінця гри
    let title = 'ГРА ЗАКІНЧЕНА';
    let subtitle = '';

    if (this.gameField.isBaseDestroyed()) {
      title = 'ШТАБ ЗНИЩЕНО!';
      subtitle = 'Ворог досяг бази';
    } else if (this.player.isGameOver()) {
      title = 'ГРА ЗАКІНЧЕНА';
      subtitle = 'У гравця не залишилось життів';
    }

    // Малюємо заголовок
    this.ctx.fillText(
      title,
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    // Малюємо підзаголовок
    if (subtitle) {
      this.ctx.font = '24px Arial';
      this.ctx.fillText(
        subtitle,
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }

    // Менший текст
    this.ctx.font = '20px Arial';
    this.ctx.fillText(
      'Натисніть F5 для перезапуску',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }

  /**
   * Створення вибуху в заданій позиції
   * @param {number} x - X координата вибуху
   * @param {number} y - Y координата вибуху
   * @param {string} type - Тип вибуху ('wall', 'armor', 'tank')
   * @param {number} size - Базовий розмір вибуху
   */
  createExplosion(x, y, type = 'small') {
    this.explosions.push(new Explosion(x, y, type, this.logger));
  }

  /**
   * Отримання масиву активних вибухів
   * @returns {Array} - Масив вибухів
   */
  getExplosions() {
    return this.explosions;
  }
}
