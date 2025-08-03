import { Tank } from './Tank.js';
import { Bullet } from './Bullet.js';
import { red, darkGray, blue, orange, water, gray } from './colors.js';

/**
 * 🎮 Клас Enemy - представляє ворожого танка
 *
 * Відповідає за:
 * - Логіку ворожого танка
 * - Штучний інтелект
 * - Рух та поведінку
 * - Стрільбу та управління кулями
 */

export class Enemy extends Tank {
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

    // Штучний інтелект
    this.ai = {
      // Налаштування патрулювання
      patrol: {
        changeDirectionTime: 2000, // 2 секунди
        lastDirectionChange: 0,
        directionRepeatCount: 0, // кількість повторів напрямку
        maxDirectionRepeats: 2, // максимальна кількість повторів перед зміною
      },
    };

    // Стан руху
    this.movementState = {
      isMoving: false,
      lastDirection: 'down',
    };

    // Система стрільби
    this.shooting = {
      canShoot: true,
      lastShotTime: 0,
      shootCooldown: 1000, // 1 секунда між пострілами
      bullets: [], // масив активних куль
      lastDirectionChange: 0, // час останньої зміни напрямку
    };

    // записуємо в лог
    this.logger.enemyAction('Ворог створений');
  }



  /**
   * Оновлення стану ворога
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    if (!this.isAlive) return;

    // Оновлюємо таймери
    this.updateTimers(deltaTime);

    // Оновлюємо AI
    this.updateAI(deltaTime);

    // Оновлюємо рух
    this.updateMovement(deltaTime);

    // Оновлюємо стрільбу
    this.updateShooting(deltaTime);

    // Оновлюємо кулі
    this.updateBullets(deltaTime);
  }

  /**
   * Оновлення таймерів
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateTimers(deltaTime) {
    this.ai.patrol.lastDirectionChange += deltaTime;
  }

  /**
   * Оновлення штучного інтелекту
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateAI(deltaTime) {
    // Зміна напрямку при патрулюванні
    if (
      this.ai.patrol.lastDirectionChange >= this.ai.patrol.changeDirectionTime
    ) {
      this.changePatrolDirection();
    }
  }



  /**
   * Оновлення руху ворога
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateMovement(deltaTime) {
    let newX = this.x;
    let newY = this.y;
    let isMoving = false;

    // Простий рух у поточному напрямку
    switch (this.direction) {
      case 'up':
        newY -= this.speed;
        break;
      case 'down':
        newY += this.speed;
        break;
      case 'left':
        newX -= this.speed;
        break;
      case 'right':
        newX += this.speed;
        break;
    }
    isMoving = true;

    // Перевіряємо межі руху (метод з базового класу Tank)
    if (this.checkBounds(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      // Якщо вийшли за межі, змінюємо напрямок на протилежний
      this.reverseDirection();
    }

    // Оновлюємо стан руху
    this.movementState.isMoving = isMoving;
    if (isMoving) {
      this.movementState.lastDirection = this.direction;
    }
  }

  /**
   * Зміна напрямку патрулювання
   */
  changePatrolDirection() {
    // Збільшуємо лічильник повторів
    this.ai.patrol.directionRepeatCount++;

    // Якщо досягли максимальної кількості повторів, змінюємо напрямок
    if (
      this.ai.patrol.directionRepeatCount >= this.ai.patrol.maxDirectionRepeats
    ) {
      const directions = ['up', 'down', 'left', 'right'];
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];

      this.direction = randomDirection;
      this.ai.patrol.directionRepeatCount = 0; // Скидаємо лічильник
      this.shooting.lastDirectionChange = 0; // Скидаємо час зміни напрямку для стрільби

      this.logger.enemyAction(
        'Ворог змінив напрямок патрулювання',
        `новий напрямок: ${randomDirection}`
      );
    } else {
      // Просто оновлюємо час, але не змінюємо напрямок
      // Не логуємо кожен повтор, щоб зменшити спам
    }

    this.ai.patrol.lastDirectionChange = 0;
  }

  /**
   * Зміна напрямку на протилежний
   */
  reverseDirection() {
    const directionMap = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };

    const oldDirection = this.direction;
    this.direction = directionMap[this.direction] || 'down';
    this.shooting.lastDirectionChange = 0; // Скидаємо час зміни напрямку для стрільби

    this.logger.enemyAction(
      'Ворог змінив напрямок на протилежний',
      `${oldDirection} → ${this.direction}`
    );
  }

  /**
   * Малювання позначки ворога (червоний хрестик) - перевизначення базового методу
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  drawTankMark(ctx) {
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

  /**
   * Малювання індикатора стану AI
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  drawAIStateIndicator(ctx) {
    const indicatorSize = 3;

    // Розміщуємо індикатор в правому верхньому куті танка
    const indicatorX = this.x + this.width - indicatorSize - 2;
    const indicatorY = this.y + 2;

    // малюємо синій квадрат для режиму патрулювання
    ctx.fillStyle = blue;
    ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
  }

  /**
   * Отримання стану AI
   * @returns {Object} - Стан AI
   */
  getAIState() {
    return {
      isMoving: this.movementState.isMoving,
      direction: this.direction,
      directionRepeatCount: this.ai.patrol.directionRepeatCount,
    };
  }

  /**
   * Оновлення системи стрільби
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateShooting(deltaTime) {
    // Оновлюємо час останнього пострілу
    this.shooting.lastShotTime += deltaTime;
    this.shooting.lastDirectionChange += deltaTime;

    // Перевіряємо чи можна стріляти знову
    if (this.shooting.lastShotTime >= this.shooting.shootCooldown) {
      this.shooting.canShoot = true;
    }

    // Стріляємо при зміні напрямку або раз в секунду
    const shouldShoot =
      this.shooting.lastDirectionChange < 100 || // нещодавно змінив напрямок
      this.shooting.lastShotTime >= this.shooting.shootCooldown; // раз в секунду

    if (this.shooting.canShoot && shouldShoot) {
      this.shoot();
    }
  }

  /**
   * Стрільба ворога
   */
  shoot() {
    // Перевіряємо чи можна стріляти
    if (!this.shooting.canShoot) {
      return;
    }

    // Отримуємо позицію для стрільби (метод з базового класу Tank)
    const shootPos = this.getShootPosition();

    // Використовуємо поточний напрямок дула
    const finalDirection = this.direction;

    // Створюємо нову кулю
    const bullet = new Bullet(
      {
        x: shootPos.x,
        y: shootPos.y,
        direction: finalDirection,
        owner: 'enemy',
        speed: 3, // швидкість кулі ворога
      },
      this.logger
    );

    // Додаємо кулю до масиву
    this.shooting.bullets.push(bullet);

    // Встановлюємо затримку між пострілами
    this.shooting.canShoot = false;
    this.shooting.lastShotTime = 0;

    this.logger.enemyAction('Ворог стріляє', `напрямок: ${finalDirection}`);

    this.logger.gameEvent(
      'Ворог вистрілив кулю',
      `позиція: (${bullet.x}, ${bullet.y}), напрямок: ${finalDirection}`
    );
  }

  /**
   * Оновлення куль ворога
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
   * Малювання куль ворога
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  renderBullets(ctx) {
    // Малюємо всі активні кулі
    this.shooting.bullets.forEach((bullet) => {
      bullet.render(ctx);
    });
  }

  /**
   * Отримання всіх куль ворога
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
    this.shooting.bullets.forEach((bullet) => bullet.destroy()); // <--- this
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