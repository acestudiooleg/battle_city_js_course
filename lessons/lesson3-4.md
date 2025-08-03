# 3.4: Рух гравця

## Що ми будемо робити?

У цьому підрозділі ми оновимо клас `Player.js`, додавши логіку руху за клавішами та інтеграцію з системою керування.

## Оновлення класу Player.js

Оновіть файл `Player.js`

```javascript
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

    // Перевіряємо межі руху (метод з базового класу Tank)
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
}
```

## Що додано до класу Player?

### Нові властивості:
- **`inputManager`** - посилання на систему керування
- **`movementState`** - стан руху (чи рухається, останній напрямок)

### Нові методи:
- **`setInputManager()`** - встановлення системи керування
- **`updateMovement()`** - оновлення руху за клавішами
- **`updateDirection()`** - оновлення напрямку дула
- **`drawMovementIndicator()`** - малювання індикатора руху
- **`getMovementState()`** - отримання стану руху

### Використання методів з базового класу:
- **`checkBounds()`** - перевірка меж руху (з Tank.js)
- **`setBounds()`** - встановлення меж руху (з Tank.js)
- **`getShootPosition()`** - позиція для стрільби (з Tank.js)

## Особливості руху

### Керування:
- **WASD** або **стрілки** для руху
- **Автоматичне оновлення** напрямку дула
- **Обмеження руху** межами Canvas

### Візуальні ефекти:
- **Зелений індикатор** руху в правому нижньому куті
- **Логування** початку руху
- **Плавний рух** з урахуванням швидкості

## Система меж

### Перевірка меж:
```javascript
// Використовуємо метод з базового класу Tank
if (this.checkBounds(newX, newY)) {
    this.x = newX;
    this.y = newY;
}
```

### Налаштування меж:
- **За замовчуванням**: 0 до 800x600 (з Tank.js)
- **Налаштовується** через `setBounds()` (з Tank.js)
- **Запобігає виходу** за межі екрану

## Позиція стрільби

### Розрахунок позиції:
```javascript
// Використовуємо метод з базового класу Tank
const shootPos = this.getShootPosition();
```

### Логіка розрахунку:
- **Вгору**: центр танка, вище танка
- **Вниз**: центр танка, нижче танка
- **Вліво**: центр танка, лівіше танка
- **Вправо**: центр танка, правіше танка

## Використання

```javascript
// Створення гравця
const player = new Player({
  x: 100,
  y: 100,
  color: '#f1c40f',
  size: 32,
});

// Підключення системи керування
player.setInputManager(inputManager);

// Встановлення меж руху (метод з базового класу)
player.setBounds({
  maxX: 800,
  maxY: 600,
});

// Оновлення в ігровому циклі
player.update(deltaTime);

// Отримання позиції для стрільби (метод з базового класу)
const shootPos = player.getShootPosition();
```

## Результат

Після оновлення цього класу у вас буде:

- ✅ Рух гравця за клавішами WASD
- ✅ Автоматичне оновлення напрямку дула
- ✅ Обмеження руху межами екрану
- ✅ Візуальні індикатори руху
- ✅ Готовність для стрільби
- ✅ Використання спільних методів з базового класу

## Що далі?

У наступному підрозділі ми додамо стрільбу гравця з використанням клавіші пробілу.
