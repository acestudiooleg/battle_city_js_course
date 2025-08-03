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
      // Поточний стан AI
      state: 'patrol', // 'patrol', 'attack', 'moveToBase'

      // Налаштування патрулювання
      patrol: {
        changeDirectionTime: 2000, // 2 секунди
        lastDirectionChange: 0,
      },

      // Налаштування атаки
      attack: {
        attackRange: 150, // дистанція атаки
        attackCooldown: 1500, // 1.5 секунди між атаками
        lastAttackTime: 0,
      },

      // Налаштування руху до штабу
      base: {
        x: 400, // позиція штабу по X (центр поля)
        y: 550, // позиція штабу по Y (внизу поля)
        approachDistance: 50, // відстань до штабу для зупинки
      },

      // Таймери
      timers: {
        stateChange: 0,
        directionChange: 0,
      },
    };

    // Стан руху
    this.movementState = {
      isMoving: false,
      lastDirection: 'down',
    };

    this.shooting = {
      canShoot: true,
      lastShotTime: 0,
      shootCooldown: 1000, // 1 секунда між пострілами
      bullets: [], // масив активних куль
    };

    // записуємо в лог
    this.logger.enemyAction('Ворог створений');
  }

  /**
   * Встановлення цілі для переслідування
   * @param {Object} target - Ціль (гравець)
   */
  setTarget(target) {
    this.ai.chase = this.ai.chase || {};
    this.ai.chase.target = target;
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
    this.ai.timers.stateChange += deltaTime;
    this.ai.timers.directionChange += deltaTime;
    this.ai.patrol.lastDirectionChange += deltaTime;
    this.ai.attack.lastAttackTime += deltaTime;
  }

  /**
   * Оновлення штучного інтелекту
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateAI(deltaTime) {
    const target = this.ai.chase?.target;
    const distanceToBase = this.getDistanceToBase();

    // Перевіряємо чи ворог досить близько до штабу
    if (distanceToBase <= this.ai.base.approachDistance) {
      // Ворог біля штабу - атакуємо
      if (this.ai.state !== 'attack') {
        this.changeAIState('attack');
      }
    } else {
      // Ворог далеко від штабу - рухаємося до нього
      if (this.ai.state !== 'moveToBase') {
        this.changeAIState('moveToBase');
      }
    }

    // Зміна напрямку при патрулюванні
    if (
      this.ai.state === 'patrol' &&
      this.ai.patrol.lastDirectionChange >= this.ai.patrol.changeDirectionTime
    ) {
      this.changePatrolDirection();
    }
  }

  /**
   * Зміна стану AI
   * @param {string} newState - Новий стан
   */
  changeAIState(newState) {
    if (this.ai.state === newState) return;

    this.ai.state = newState;
    this.ai.timers.stateChange = 0;

    this.logger.enemyAction(`Ворог змінив стан на: ${newState}`);

    switch (newState) {
      case 'patrol':
        this.setPatrolTarget();
        break;
      case 'moveToBase':
        this.logger.enemyAction('Ворог рухається до штабу');
        break;
      case 'attack':
        this.logger.enemyAction('Ворог атакує штаб');
        break;
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

    switch (this.ai.state) {
      case 'patrol':
        // Патрулювання - випадковий рух
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        switch (randomDirection) {
          case 'up':
            newY -= this.speed;
            this.direction = 'up';
            break;
          case 'down':
            newY += this.speed;
            this.direction = 'down';
            break;
          case 'left':
            newX -= this.speed;
            this.direction = 'left';
            break;
          case 'right':
            newX += this.speed;
            this.direction = 'right';
            break;
        }
        isMoving = true;
        break;

      case 'moveToBase':
        // Рух до штабу
        const dx = this.ai.base.x - this.x;
        const dy = this.ai.base.y - this.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            newX += this.speed;
            this.direction = 'right';
          } else {
            newX -= this.speed;
            this.direction = 'left';
          }
        } else {
          if (dy > 0) {
            newY += this.speed;
            this.direction = 'down';
          } else {
            newY -= this.speed;
            this.direction = 'up';
          }
        }
        isMoving = true;
        break;

      case 'attack':
        // Атака - зупиняємося і стріляємо
        isMoving = false;
        break;
    }

    // Перевіряємо межі руху (метод з базового класу Tank)
    if (this.checkBounds(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } else {
      // Якщо вийшли за межі, змінюємо напрямок
      this.changePatrolDirection();
    }

    // Оновлюємо стан руху
    this.movementState.isMoving = isMoving;
    if (isMoving) {
      this.movementState.lastDirection = this.direction;
    }
  }

  /**
   * Розрахунок відстані до штабу
   * @returns {number} - Відстань до штабу
   */
  getDistanceToBase() {
    const dx = this.ai.base.x - this.x;
    const dy = this.ai.base.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Встановлення цілі патрулювання
   */
  setPatrolTarget() {
    // Випадкова позиція в межах поля
    this.ai.patrol.targetX =
      Math.random() * (this.bounds.maxX - this.bounds.minX - 100) +
      this.bounds.minX +
      50;
    this.ai.patrol.targetY =
      Math.random() * (this.bounds.maxY - this.bounds.minY - 100) +
      this.bounds.minY +
      50;
  }

  /**
   * Зміна напрямку патрулювання
   */
  changePatrolDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    this.direction = randomDirection;
    this.ai.patrol.lastDirectionChange = 0;

    this.logger.enemyAction(
      'Ворог змінив напрямок патрулювання',
      `новий напрямок: ${randomDirection}`
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
    // Кольори для різних станів
    const stateColors = {
      patrol: blue, // синій
      moveToBase: orange, // помаранчевий
      attack: red, // червоний
    };

    const color = stateColors[this.ai.state] || gray;
    const indicatorSize = 3;

    // Розміщуємо індикатор в правому верхньому куті танка
    const indicatorX = this.x + this.width - indicatorSize - 2;
    const indicatorY = this.y + 2;

    // малюємо маленький квадрат
    ctx.fillStyle = color;
    ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
  }

  /**
   * Отримання стану AI
   * @returns {Object} - Стан AI
   */
  getAIState() {
    return {
      state: this.ai.state,
      isMoving: this.movementState.isMoving,
      direction: this.direction,
      distanceToBase: this.getDistanceToBase(),
    };
  }

  /**
   * Оновлення системи стрільби
   * @param {number} deltaTime - Час з останнього оновлення
   */
  updateShooting(deltaTime) {
    // Оновлюємо час останнього пострілу
    this.shooting.lastShotTime += deltaTime;

    // Перевіряємо чи можна стріляти знову
    if (this.shooting.lastShotTime >= this.shooting.shootCooldown) {
      this.shooting.canShoot = true;
    }

    // Стріляємо в режимі атаки або випадково під час патрулювання
    if (this.ai.state === 'attack' || 
        (this.ai.state === 'patrol' && Math.random() < 0.01)) { // 1% шанс стріляти під час патрулювання
      if (this.shooting.canShoot) {
        this.shoot();
      }
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

    // Логуємо стрільбу
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
