# 3.3: Клас кулі 🎯

## Що ми будемо робити? 🚀

У цьому підрозділі ми створимо клас `Bullet.js`, який буде відповідати за логіку куль, їх рух та малювання. Це як створити снаряди для нашого танка!

## 🔧 Створення класу Bullet.js

Створіть файл `Bullet.js`:

```javascript
import { orange, red, white } from './colors.js';

/**
 *
 * @typedef {Object} CollisionBounds
 * @property {number} x - X координата верхнього лівого кута
 * @property {number} y - Y координата верхнього лівого кута
 * @property {number} width - ширина об'єкта
 * @property {number} height - висота об'єкта
 */

/**
 * 🎮 Клас Bullet - представляє кулю
 *
 * Відповідає за:
 * - Зберігання позиції кулі
 * - Рух кулі в заданому напрямку
 * - Малювання кулі на екрані
 * - Перевірку колізій
 */
export class Bullet {
  /**
   *
   * @param {Object} options - налаштування кулі
   * @param {number} options.x - початкова X позиція
   * @param {number} options.y - початкова Y позиція
   * @param {number} options.width - ширина кулі
   * @param {number} options.height - висота кулі
   * @param {'up' | 'down' | 'left' | 'right'} options.direction - напрямок руху ('up', 'down', 'left', 'right')
   * @param {number} options.speed - швидкість руху кулі
   * @param {'player' | 'enemy'} options.owner - власник кулі ('player' або 'enemy')
   * @param {import('./GameLogger.js').GameLogger} logger - логгер для запису подій
   */
  constructor(options = {}, logger) {
    // Позиція кулі
    this.x = options.x || 0;
    this.y = options.y || 0;

    // Розмір кулі
    this.width = options.width || 4;
    this.height = options.height || 4;

    // Напрямок руху
    this.direction = options.direction || 'up';

    // Швидкість кулі
    this.speed = options.speed || 5;

    // Власник кулі ('player' або 'enemy')
    this.owner = options.owner || 'player';

    // Колір кулі
    this.color = this.owner === 'player' ? orange : red;

    // Стан кулі
    this.isActive = true;

    // Час життя кулі (в мілісекундах)
    this.lifetime = 3000; // 3 секунди
    this.age = 0;

    // Логгер для запису подій
    this.logger = logger;

    this.logger.gameEvent(
      'Куля створена',
      `власник: ${this.owner}, позиція: (${this.x}, ${this.y})`
    );
  }

  /**
   * Оновлення стану кулі
   * Викликається кожен кадр
   * @param {number} deltaTime - Час з останнього оновлення
   */
  update(deltaTime) {
    if (!this.isActive) return;

    // Оновлюємо час життя
    this.age += deltaTime;

    // Перевіряємо чи куля не застаріла
    if (this.age >= this.lifetime) {
      this.destroy();
      return;
    }

    // Рухаємо кулю
    this.move();
  }

  /**
   * Рух кулі в заданому напрямку
   */
  move() {
    switch (this.direction) {
      case 'up':
        this.y -= this.speed;
        break;
      case 'down':
        this.y += this.speed;
        break;
      case 'left':
        this.x -= this.speed;
        break;
      case 'right':
        this.x += this.speed;
        break;
    }
  }

  /**
   * Малювання кулі на екрані
   * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
   */
  render(ctx) {
    if (!this.isActive) return;

    // Зберігаємо поточний стан контексту
    ctx.save();

    // Малюємо кулю як маленький квадрат
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Малюємо рамку навколо кулі
    ctx.strokeStyle = white;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Відновлюємо стан контексту
    ctx.restore();
  }

  /**
   * Перевірка чи куля активна
   * @returns {boolean} - true якщо куля активна
   */
  isBulletActive() {
    return this.isActive;
  }

  /**
   * Знищення кулі
   */
  destroy() {
    this.isActive = false;
    this.logger.gameEvent('💥 Куля знищена');
  }

  /**
   * Отримання меж кулі для перевірки колізій
   * @returns {CollisionBounds} - Об'єкт з межами кулі
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Перевірка колізії з іншим об'єктом
   * @param {CollisionBounds} object - Об'єкт для перевірки колізії
   * @returns {boolean} - true якщо є колізія
   */
  checkCollision(object) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }

  /**
   * Перевірка чи куля вийшла за межі екрану
   * @param {number} canvasWidth - Ширина Canvas
   * @param {number} canvasHeight - Висота Canvas
   * @returns {boolean} - true якщо куля за межами екрану
   */
  isOutOfBounds(canvasWidth, canvasHeight) {
    return (
      this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight
    );
  }

  /**
   * Встановлення позиції кулі
   * @param {number} x - Нова X координата
   * @param {number} y - Нова Y координата
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Встановлення напрямку кулі
   * @param {'up' | 'down' | 'left' | 'right'} direction - Напрямок ('up', 'down', 'left', 'right')
   */
  setDirection(direction) {
    this.direction = direction;
  }
}
```

## 🎮 Що робить цей клас?

### 🔧 Основні властивості:

- **`x`, `y`** - позиція кулі на екрані
- **`width`, `height`** - розміри кулі (4x4 пікселі)
- **`direction`** - напрямок руху кулі
- **`speed`** - швидкість руху (5 пікселів за кадр)
- **`owner`** - власник кулі ('player' або 'enemy')
- **`color`** - колір кулі (жовтий для гравця, червоний для ворога)
- **`isActive`** - чи активна куля
- **`lifetime`** - час життя кулі (3 секунди)
- **`age`** - поточний вік кулі

### ⚙️ Основні методи:

- **`update(deltaTime)`** - оновлення стану кулі
- **`move()`** - рух кулі в заданому напрямку
- **`render(ctx)`** - малювання кулі на екрані
- **`destroy()`** - знищення кулі
- **`checkCollision(object)`** - перевірка колізії
- **`isOutOfBounds()`** - перевірка виходу за межі екрану

## 🚀 Особливості руху

### 🧭 Напрямки руху:

- **`up`** - рух вгору (зменшення Y)
- **`down`** - рух вниз (збільшення Y)
- **`left`** - рух вліво (зменшення X)
- **`right`** - рух вправо (збільшення X)

### ⚡ Швидкість:

- **5 пікселів за кадр** за замовчуванням
- **Налаштовується** через параметр `speed`

## 🎨 Особливості малювання

### 🎨 Візуальний стиль:

- **Маленький квадрат** 4x4 пікселі
- **Колір залежить від власника**:
  - Жовтий (`#f39c12`) для гравця
  - Червоний (`#e74c3c`) для ворога
- **Біла рамка** навколо кулі

### 🔄 Порядок малювання:

1. **Збереження контексту** (`ctx.save()`)
2. **Малювання квадрата** (`fillRect()`)
3. **Малювання рамки** (`strokeRect()`)
4. **Відновлення контексту** (`ctx.restore()`)

## ⏰ Система життя кулі

### 🕐 Час життя:

- **3 секунди** за замовчуванням
- **Автоматичне знищення** після закінчення часу
- **Відстеження віку** кулі

### 💥 Умови знищення:

1. **Завершення часу життя** (`age >= lifetime`)
2. **Вихід за межі екрану** (`isOutOfBounds()`)
3. **Колізія з об'єктом** (через `checkCollision()`)

## 🎯 Система колізій
 `Колізія - це явище коли 2 і більше обʼєктів стикаються в одному місці`

### 🔍 Алгоритм перевірки:

```javascript
this.x < object.x + object.width &&
  this.x + this.width > object.x &&
  this.y < object.y + object.height &&
  this.y + this.height > object.y;
```

### 🎯 Використання:

- **Перевірка з танками** (гравець, ворог)
- **Перевірка з перешкодами** (стіни, блоки)
- **Перевірка з іншими кулями**

## 💻 Використання

```javascript
// Створення кулі гравця з логгером
const playerBullet = new Bullet(
  {
    x: 100,
    y: 100,
    direction: 'up',
    owner: 'player',
    speed: 6,
  },
  logger
);

// Створення кулі ворога з логгером
const enemyBullet = new Bullet(
  {
    x: 300,
    y: 200,
    direction: 'down',
    owner: 'enemy',
    speed: 4,
  },
  logger
);

// Оновлення кулі
playerBullet.update(deltaTime);

// Малювання кулі
playerBullet.render(ctx);

// Перевірка колізії
if (playerBullet.checkCollision(enemy)) {
  playerBullet.destroy();
  enemy.takeDamage();
}
```

## 📝 Параметр logger

**`logger`** - об'єкт системи логування для запису подій куль.

Див. [Урок 2.8: Система логування](/lessons/lesson2-8.md) для детального опису.

## ✅ Результат

Після створення цього класу у вас буде:

- ✅ Повноцінна система куль
- ✅ Рух у всіх напрямках
- ✅ Система колізій
- ✅ Автоматичне знищення
- ✅ Візуальна різниця між кулями гравця та ворога

## 🚀 Що далі?

У наступному підрозділі ми оновимо клас гравця для додавання руху за клавішами.
