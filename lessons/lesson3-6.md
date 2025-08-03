# 3.6: Рух ворога

## Що ми будемо робити?

У цьому підрозділі ми оновимо клас `Enemy.js`, додавши базовий штучний інтелект для руху ворога.

## Оновлення класу Enemy.js

Оновіть файл `Enemy.js`:

```javascript
import { Tank } from './Tank.js';
import { red, darkGray, blue, gray } from './colors.js';

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

}
```

## Що додано до класу Enemy?

### Нові властивості:

- **`ai.patrol`** - налаштування патрулювання
- **`movementState`** - стан руху

### Нові методи:

- **`updateAI()`** - оновлення штучного інтелекту
- **`updateMovement()`** - оновлення руху
- **`changePatrolDirection()`** - зміна напрямку патрулювання
- **`reverseDirection()`** - зміна напрямку на протилежний
- **`drawAIStateIndicator()`** - індикатор стану AI
- **`getAIState()`** - отримання стану AI

### Використання методів з базового класу:

- **`checkBounds()`** - перевірка меж руху (з Tank.js)
- **`setBounds()`** - встановлення меж руху (з Tank.js)

## Штучний інтелект

### Патрулювання:

- **Випадковий рух** по полю
- **Зміна напрямку** кожні 2 секунди
- **Система повторів** напрямку (до 2 разів)
- **Автоматичне повернення** при виході за межі

## Візуальні індикатори

### Індикатор стану AI:

- **Синій** - режим патрулювання

### Розташування:

- **Правий верхній кут** танка
- **Розмір** 3x3 пікселі

## Система меж

### Перевірка меж:

```javascript
// Використовуємо метод з базового класу Tank
if (this.checkBounds(newX, newY)) {
  this.x = newX;
  this.y = newY;
} else {
  // Якщо вийшли за межі, змінюємо напрямок
  this.reverseDirection();
}
```

### Налаштування меж:

- **За замовчуванням**: 0 до 800x600 (з Tank.js)
- **Налаштовується** через `setBounds()` (з Tank.js)
- **Автоматичне повернення** в межі поля

## Використання

```javascript
// Створення ворога
const enemy = new Enemy({
  x: 300,
  y: 200,
  color: '#e74c3c',
  size: 32,
});

// Встановлення меж руху (метод з базового класу)
enemy.setBounds({
  maxX: 800,
  maxY: 600,
});

// Оновлення в ігровому циклі
enemy.update(deltaTime);

// Отримання стану AI
const aiState = enemy.getAIState();
console.log('Напрямок ворога:', aiState.direction);
```

## Результат

Після оновлення цього класу у вас буде:

- ✅ Базовий штучний інтелект ворога
- ✅ Патрулювання по полю
- ✅ Візуальні індикатори стану
- ✅ Використання спільних методів з базового класу

## Що далі?

У наступному підрозділі ми додамо стрільбу ворога.
