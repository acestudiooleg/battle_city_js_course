import { Tank } from './Tank.js';
import { yellow, orange, green } from './colors.js';

/**
 * 🎮 Клас Player - представляє гравця
 *
 * Відповідає за:
 * - Специфічну логіку гравця
 * - Керування гравцем
 * - Рух за клавішами
 */

export class Player extends Tank {
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

    // Система керування (буде встановлена ззовні)
    this.inputManager = null;

    // Стан руху
    this.movementState = {
      isMoving: false,
      lastDirection: 'up',
    };

    this.shooting = {
      canShoot: true,
      lastShotTime: 0,
      shootCooldown: 500, // 500мс між пострілами
      bullets: [], // масив активних куль
    };

    // записуємо в лог
    this.logger.playerAction(
      'Гравець створений',
      `позиція: (${this.x}, ${this.y})`
    );
  }

  /**
   * Встановлення системи керування
   * @param {InputManager} inputManager - Система керування
   */
  setInputManager(inputManager) {
    this.inputManager = inputManager;
    this.logger.info('Система керування підключена до гравця');
  }

  /**
   * Оновлення стану гравця
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    if (!this.isAlive) return;

    // Оновлюємо рух
    this.updateMovement(deltaTime);

    // Оновлюємо напрямок дула
    this.updateDirection();
  }

  /**
   * Оновлення руху гравця
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateMovement(deltaTime) {
    if (!this.inputManager) return;

    // Отримуємо напрямок руху від системи керування
    const direction = this.inputManager.getMovementDirection();

    // Розраховуємо нову позицію
    let newX = this.x;
    let newY = this.y;
    let isMoving = false;

    // Рух вгору
    if (direction.up) {
      newY -= this.speed;
      isMoving = true;
      this.movementState.lastDirection = 'up';
    }

    // Рух вниз
    if (direction.down) {
      newY += this.speed;
      isMoving = true;
      this.movementState.lastDirection = 'down';
    }

    // Рух вліво
    if (direction.left) {
      newX -= this.speed;
      isMoving = true;
      this.movementState.lastDirection = 'left';
    }

    // Рух вправо
    if (direction.right) {
      newX += this.speed;
      isMoving = true;
      this.movementState.lastDirection = 'right';
    }

    // Перевіряємо межі руху
    if (this.checkBounds(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // Оновлюємо стан руху
    this.movementState.isMoving = isMoving;

    // Логуємо рух (тільки при зміні стану)
    if (isMoving && !this.movementState.isMoving) {
      logger.playerAction(
        'Гравець почав рухатися',
        `напрямок: ${this.movementState.lastDirection}`
      );
    }
  }

  /**
   * Оновлення напрямку дула
   */
  updateDirection() {
    if (!this.inputManager) return;

    const direction = this.inputManager.getMovementDirection();

    // Встановлюємо напрямок дула відповідно до руху
    if (direction.up) {
      this.direction = 'up';
    } else if (direction.down) {
      this.direction = 'down';
    } else if (direction.left) {
      this.direction = 'left';
    } else if (direction.right) {
      this.direction = 'right';
    }
    // Якщо не рухається, залишаємо попередній напрямок
  }

  /**
   * Малювання гравця на екрані
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  render(ctx) {
    // Викликаємо базовий метод render з батьківського класу
    super.render(ctx);

    // Малюємо індикатор руху (якщо рухається)
    if (this.movementState.isMoving) {
      this.drawMovementIndicator(ctx);
    }
  }

  /**
   * Малювання позначки гравця (жовтий круг) - перевизначення базового методу
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  drawTankMark(ctx) {
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

  /**
   * Малювання індикатора руху
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  drawMovementIndicator(ctx) {
    // зелений колір для індикатора руху
    ctx.fillStyle = green;
    // розмір індикатора
    const indicatorSize = 3;

    // розміщуємо індикатор в правому нижньому куті танка
    const indicatorX = this.x + this.width - indicatorSize - 2;
    const indicatorY = this.y + this.height - indicatorSize - 2;

    // малюємо маленький квадрат
    ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
  }

  /**
   * Отримання стану руху
   * @returns {Object} - Стан руху
   */
  getMovementState() {
    return { ...this.movementState };
  }

  /**
   * Оновлення стану гравця
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    if (!this.isAlive) return;

    // Оновлюємо рух
    this.updateMovement(deltaTime);

    // Оновлюємо напрямок дула
    this.updateDirection();

    // Оновлюємо стрільбу
    this.updateShooting(deltaTime);

    // Оновлюємо кулі
    this.updateBullets(deltaTime);
  }

  /**
   * Оновлення системи стрільби
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateShooting(deltaTime) {
    if (!this.inputManager) return;

    // Перевіряємо чи натиснута клавіша стрільби
    if (this.inputManager.isShootPressed() && this.shooting.canShoot) {
      this.shoot();
    }

    // Оновлюємо час останнього пострілу
    this.shooting.lastShotTime += deltaTime;

    // Перевіряємо чи можна стріляти знову
    if (this.shooting.lastShotTime >= this.shooting.shootCooldown) {
      this.shooting.canShoot = true;
    }
  }

  /**
   * Стрільба
   */
  shoot() {
    // Отримуємо позицію для стрільби (метод з базового класу Tank)
    const shootPos = this.getShootPosition();

    // Імпортуємо клас Bullet
    import('./Bullet.js').then((module) => {
      const { Bullet } = module;

      // Створюємо нову кулю
      const bullet = new Bullet({
        x: shootPos.x,
        y: shootPos.y,
        direction: this.direction,
        owner: 'player',
        speed: 6, // швидкість кулі гравця
      });

      // Додаємо кулю до масиву
      this.shooting.bullets.push(bullet);

      // Встановлюємо затримку між пострілами
      this.shooting.canShoot = false;
      this.shooting.lastShotTime = 0;

      // Логуємо стрільбу
      this.logger.playerAction(
        'Гравець стріляє',
        `напрямок: ${this.direction}`
      );

      this.logger.gameEvent(
        'Гравець вистрілив кулю',
        `позиція: (${bullet.x}, ${bullet.y})`
      );
    });
  }

  /**
   * Оновлення куль гравця
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateBullets(deltaTime) {
    // Оновлюємо всі кулі
    for (let i = this.shooting.bullets.length - 1; i >= 0; i--) {
      const bullet = this.shooting.bullets[i];

      // Оновлюємо кулю
      bullet.update(deltaTime);

      // Перевіряємо чи куля активна
      if (!bullet.isBulletActive()) {
        // Видаляємо неактивну кулю
        this.shooting.bullets.splice(i, 1);
      }
    }
  }

  /**
   * Малювання куль гравця
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  renderBullets(ctx) {
    // Малюємо всі активні кулі
    this.shooting.bullets.forEach((bullet) => {
      bullet.render(ctx);
    });
  }

  /**
   * Отримання всіх куль гравця
   * @returns {Array} - Масив активних куль
   */
  getBullets() {
    return [...this.shooting.bullets];
  }

  /**
   * Видалення кулі
   * @param {Bullet} bullet - Куля для видалення
   */
  removeBullet(bullet) {
    const index = this.shooting.bullets.indexOf(bullet);
    if (index > -1) {
      this.shooting.bullets.splice(index, 1);
      bullet.destroy();
    }
  }

  /**
   * Очищення всіх куль
   */
  clearBullets() {
    this.shooting.bullets.forEach((bullet) => bullet.destroy());
    this.shooting.bullets = [];
  }

  /**
   * Встановлення затримки між пострілами
   * @param {number} cooldown - Затримка в мілісекундах
   */
  setShootCooldown(cooldown) {
    this.shooting.shootCooldown = cooldown;
  }

  /**
   * Отримання інформації про стрільбу
   * @returns {Object} - Інформація про стрільбу
   */
  getShootingInfo() {
    return {
      canShoot: this.shooting.canShoot,
      bulletsCount: this.shooting.bullets.length,
      cooldown: this.shooting.shootCooldown,
      lastShotTime: this.shooting.lastShotTime,
    };
  }
}
