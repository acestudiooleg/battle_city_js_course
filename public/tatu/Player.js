import { Tank } from './Tank.js';
import { Bullet } from './Bullet.js';
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
      initialized: false, // Флаг для відстеження ініціалізації
    };

    this.shooting = {
      canShoot: true,
      lastShotTime: 0,
      shootCooldown: 500, // 500мс між пострілами
      bullets: [], // масив активних куль
    };

    // Система життів
    this.lives = options.lives || 3; // 3 життя за замовчуванням
    this.maxLives = this.lives;
    this.respawnTime = 2000; // 2 секунди на відродження
    this.respawnTimer = 0;
    this.isRespawning = false;
    this.initialPosition = {
      x: this.x,
      y: this.y
    };

    // записуємо в лог
    this.logger.playerAction(
      'Гравець створений',
      `позиція: (${this.x}, ${this.y}), життя: ${this.lives}`
    );
  }

  /**
   * Встановлення системи керування
   * @param {InputManager} inputManager - Система керування
   */
  setInputManager(inputManager) {
    this.inputManager = inputManager;
    this.movementState.initialized = true; // Позначаємо що гравець ініціалізований
    this.logger.info('Система керування підключена до гравця');
  }

  /**
   * Встановлення руху гравця
   * @param {Object} movement - Об'єкт з напрямками руху
   */
  setMovement(movement) {
    // Розраховуємо нову позицію
    let newX = this.x;
    let newY = this.y;
    let isMoving = false;

    // Рух вгору
    if (movement.up) {
      newY -= this.speed;
      isMoving = true;
      this.direction = 'up';
      this.movementState.lastDirection = 'up';
    }

    // Рух вниз
    if (movement.down) {
      newY += this.speed;
      isMoving = true;
      this.direction = 'down';
      this.movementState.lastDirection = 'down';
    }

    // Рух вліво
    if (movement.left) {
      newX -= this.speed;
      isMoving = true;
      this.direction = 'left';
      this.movementState.lastDirection = 'left';
    }

    // Рух вправо
    if (movement.right) {
      newX += this.speed;
      isMoving = true;
      this.direction = 'right';
      this.movementState.lastDirection = 'right';
    }

    // Перевіряємо межі руху (метод з базового класу Tank)
    if (this.checkBounds(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // Оновлюємо стан руху
    this.movementState.isMoving = isMoving;
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

    // Просте логування - GameLogger сам згрупує повідомлення
    const wasMoving = this.movementState.isMoving;
    this.movementState.isMoving = isMoving;
    
    if (isMoving && !wasMoving) {
      this.logger.playerAction('Гравець почав рухатися', `напрямок: ${this.movementState.lastDirection}`);
    } else if (!isMoving && wasMoving) {
      this.logger.playerAction('Гравець зупинився');
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
  }

  /**
   * Малювання гравця на екрані
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  render(ctx) {
    // Якщо гравець відроджується, малюємо індикатор відродження
    if (this.isRespawning) {
      this.drawRespawnIndicator(ctx);
      return;
    }

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
   * Малювання індикатора відродження
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  drawRespawnIndicator(ctx) {
    // Прозорий червоний колір для індикатора відродження
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    
    // Розмір індикатора
    const indicatorSize = 20;
    
    // Центр позиції відродження
    const centerX = this.initialPosition.x + this.width / 2;
    const centerY = this.initialPosition.y + this.height / 2;
    
    // Малюємо коло з анімацією пульсації
    const pulseSize = indicatorSize + Math.sin(Date.now() * 0.01) * 5;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Малюємо текст "Відродження..."
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Відродження...', centerX, centerY + 30);
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
    // Якщо гравець відроджується, оновлюємо таймер
    if (this.isRespawning) {
      this.respawnTimer += deltaTime;
      if (this.respawnTimer >= this.respawnTime) {
        this.respawn();
      }
      return;
    }

    // Якщо гравець мертвий і не відроджується, не оновлюємо
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
    // Оновлюємо час останнього пострілу
    this.shooting.lastShotTime += deltaTime;

    // Перевіряємо чи можна стріляти знову
    if (this.shooting.lastShotTime >= this.shooting.shootCooldown) {
      this.shooting.canShoot = true;
      // Просте логування - GameLogger сам згрупує повідомлення
      this.logger.playerAction('✅ Гравець може стріляти знову');
    }
  }

  /**
   * Стрільба
   */
  shoot() {
    // Перевіряємо чи можна стріляти
    if (!this.shooting.canShoot) {
      this.logger.playerAction('❌ Гравець не може стріляти');
      return;
    }
    
    // Отримуємо позицію для стрільби (метод з базового класу Tank)
    const shootPos = this.getShootPosition();

    // Створюємо нову кулю
    const bullet = new Bullet(
      {
        x: shootPos.x,
        y: shootPos.y,
        direction: this.direction,
        owner: 'player',
        speed: 6, // швидкість кулі гравця
      },
      this.logger
    );

    // Додаємо кулю до масиву
    this.shooting.bullets.push(bullet);

    // Встановлюємо затримку між пострілами
    this.shooting.canShoot = false;
    this.shooting.lastShotTime = 0;

    // Логуємо стрільбу
    this.logger.playerAction('Гравець стріляє', `напрямок: ${this.direction}`);

    this.logger.gameEvent(
      'Гравець вистрілив кулю',
      `позиція: (${bullet.x}, ${bullet.y})`
    );
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

  /**
   * Отримання пошкодження (перевизначення методу з Tank)
   * @param {number} damage - Кількість пошкодження
   */
  takeDamage(damage) {
    this.health -= damage;
                
    // Перевіряємо чи гравець знищений
    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      this.lives--;
      
      // Очищаємо всі кулі при смерті
      this.clearBullets();
      
      this.logger.gameEvent(`Гравець знищений! Залишилось життів: ${this.lives}`);
      
      // Якщо ще є життя, починаємо відродження
      if (this.lives > 0) {
        this.startRespawn();
      } else {
        this.logger.gameEvent('💀 Гра закінчена! У гравця не залишилось життів');
      }
    } else {
      this.logger.gameEvent(`Гравець отримав пошкодження: ${damage}, здоров'я: ${this.health}`);
    }
  }

  /**
   * Початок процесу відродження
   */
  startRespawn() {
    this.isRespawning = true;
    this.respawnTimer = 0;
    this.logger.gameEvent('🔄 Гравець відроджується...');
  }

  /**
   * Відродження гравця (перевизначення методу з Tank)
   */
  respawn() {
    // Позначаємо гравець як живий
    this.isAlive = true;
    // Відновлюємо повне здоров'я
    this.health = 100;
    // Повертаємо на початкову позицію
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    // Скидаємо стан відродження
    this.isRespawning = false;
    this.respawnTimer = 0;
    // Очищаємо всі кулі
    this.clearBullets();
    
    this.logger.gameEvent('✅ Гравець відроджений!');
  }

  /**
   * Отримання кількості життів
   * @returns {number} - Кількість життів
   */
  getLives() {
    return this.lives;
  }

  /**
   * Отримання максимальної кількості життів
   * @returns {number} - Максимальна кількість життів
   */
  getMaxLives() {
    return this.maxLives;
  }

  /**
   * Перевірка чи гра закінчена
   * @returns {boolean} - true якщо гра закінчена
   */
  isGameOver() {
    return this.lives <= 0 && !this.isAlive;
  }

  /**
   * Перевірка чи гравець відроджується
   * @returns {boolean} - true якщо гравець відроджується
   */
  isPlayerRespawning() {
    return this.isRespawning;
  }
}
