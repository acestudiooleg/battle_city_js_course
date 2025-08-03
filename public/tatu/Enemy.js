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
      state: 'patrol', // 'patrol', 'chase', 'attack', 'retreat'

      // Налаштування патрулювання
      patrol: {
        targetX: this.x,
        targetY: this.y,
        changeDirectionTime: 3000, // 3 секунди
        lastDirectionChange: 0,
      },

      // Налаштування переслідування
      chase: {
        target: null, // ціль для переслідування
        detectionRange: 150, // радіус виявлення
        maxChaseTime: 10000, // 10 секунд переслідування
      },

      // Налаштування атаки
      attack: {
        attackRange: 100, // дистанція атаки
        attackCooldown: 2000, // 2 секунди між атаками
        lastAttackTime: 0,
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
      shootCooldown: 2000, // 2 секунди між пострілами
      bullets: [], // масив активних куль
      accuracy: 0.8, // точність стрільби (80%)
    };

    // записуємо в лог
    this.logger.enemyAction(
      'Ворог створений',
      `позиція: (${this.x}, ${this.y})`
    );
  }

  /**
   * Встановлення цілі для переслідування
   * @param {Object} target - Ціль (гравець)
   */
  setTarget(target) {
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
    const target = this.ai.chase.target;

    if (target && this.isTargetInRange(target, this.ai.chase.detectionRange)) {
      // Ціль виявлена - переходимо в режим переслідування
      if (this.ai.state !== 'chase') {
        this.changeAIState('chase');
      }

      // Перевіряємо чи ціль в зоні атаки
      if (this.isTargetInRange(target, this.ai.attack.attackRange)) {
        this.changeAIState('attack');
      }
    } else {
      // Ціль не виявлена - повертаємося до патрулювання
      if (this.ai.state !== 'patrol') {
        this.changeAIState('patrol');
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
      case 'chase':
        // Починаємо переслідування
        break;
      case 'attack':
        // Готові до атаки
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
        // Патрулювання - рух до цілі
        const patrolTarget = this.ai.patrol;
        if (this.x < patrolTarget.targetX - 5) {
          newX += this.speed;
          this.direction = 'right';
          isMoving = true;
        } else if (this.x > patrolTarget.targetX + 5) {
          newX -= this.speed;
          this.direction = 'left';
          isMoving = true;
        } else if (this.y < patrolTarget.targetY - 5) {
          newY += this.speed;
          this.direction = 'down';
          isMoving = true;
        } else if (this.y > patrolTarget.targetY + 5) {
          newY -= this.speed;
          this.direction = 'up';
          isMoving = true;
        }
        break;

      case 'chase':
        // Переслідування гравця
        if (this.ai.chase.target) {
          const target = this.ai.chase.target;
          const dx = target.x - this.x;
          const dy = target.y - this.y;

          // Рухаємося до гравця
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
        }
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
   * Перевірка чи ціль в діапазоні
   * @param {Object} target - Ціль
   * @param {number} range - Діапазон
   * @returns {boolean} - true якщо ціль в діапазоні
   */
  isTargetInRange(target, range) {
    if (!target) return false;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= range;
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

    // Встановлюємо нову ціль патрулювання
    this.setPatrolTarget();

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
      chase: orange, // помаранчевий
      attack: red, // червоний
      retreat: water, // фіолетовий
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

    // Стріляємо якщо в режимі атаки і є ціль
    if (
      this.ai.state === 'attack' &&
      this.shooting.canShoot &&
      this.ai.chase.target
    ) {
      this.shoot();
    }
  }

  /**
   * Стрільба ворога
   */
  shoot() {
    if (!this.ai.chase.target) return;
    
    // Перевіряємо чи можна стріляти
    if (!this.shooting.canShoot) {
      return;
    }

    // Отримуємо позицію для стрільби (метод з базового класу Tank)
    const shootPos = this.getShootPosition();

    // Розраховуємо напрямок до гравця
    const targetDirection = this.calculateTargetDirection();

    // Додаємо неточність до стрільби
    const finalDirection = this.addShootingInaccuracy(targetDirection);

    // Створюємо нову кулю
    const bullet = new Bullet({
      x: shootPos.x,
      y: shootPos.y,
      direction: finalDirection,
      owner: 'enemy',
      speed: 4, // швидкість кулі ворога (повільніше за гравця)
    }, this.logger);

    // Додаємо кулю до масиву
    this.shooting.bullets.push(bullet);

    // Встановлюємо затримку між пострілами
    this.shooting.canShoot = false;
    this.shooting.lastShotTime = 0;

    // Логуємо стрільбу
    this.logger.enemyAction('Ворог стріляє', `напрямок: ${finalDirection}`);

    this.logger.gameEvent(
      'Ворог вистрілив кулю',
      `позиція: (${bullet.x}, ${bullet.y})`
    );
  }

  /**
   * Розрахунок напрямку до цілі
   * @returns {string} - Напрямок до гравця
   */
  calculateTargetDirection() {
    if (!this.ai.chase.target) return this.direction;

    const target = this.ai.chase.target;
    const dx = target.x - this.x;
    const dy = target.y - this.y;

    // Визначаємо основний напрямок
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }

  /**
   * Додавання неточності до стрільби
   * @param {string} direction - Початковий напрямок
   * @returns {string} - Фінальний напрямок з неточністю
   */
  addShootingInaccuracy(direction) {
    // Якщо точність 100%, повертаємо точний напрямок
    if (this.shooting.accuracy >= 1.0) {
      return direction;
    }

    // Шанс неточної стрільби
    if (Math.random() > this.shooting.accuracy) {
      const directions = ['up', 'down', 'left', 'right'];
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      return randomDirection;
    }

    return direction;
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
   * Встановлення точності стрільби
   * @param {number} accuracy - Точність (0.0 - 1.0)
   */
  setShootingAccuracy(accuracy) {
    this.shooting.accuracy = Math.max(0.0, Math.min(1.0, accuracy));
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
      accuracy: this.shooting.accuracy,
      lastShotTime: this.shooting.lastShotTime,
    };
  }
}
