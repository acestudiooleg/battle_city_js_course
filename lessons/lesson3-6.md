# 3.6: Рух ворога

## Що ми будемо робити?

У цьому підрозділі ми оновимо клас `Enemy.js`, додавши базовий штучний інтелект для руху ворога.

## Оновлення класу Enemy.js

Оновіть файл `Enemy.js`:

```javascript
import { Tank } from './Tank.js';
import { logger } from './main.js';
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
        super({
            ...options, // передаємо всі опції батьківському класу
            // червоний колір за замовчуванням
            color: options.color || red,
            // ворог рухається повільніше за гравця
            speed: options.speed || 1,
            // початковий напрямок дула вниз
            direction: options.direction || 'down'
        }, logger);
        
        // Штучний інтелект
        this.ai = {
            // Поточний стан AI
            state: 'patrol', // 'patrol', 'chase', 'attack', 'retreat'
            
            // Налаштування патрулювання
            patrol: {
                targetX: this.x,
                targetY: this.y,
                changeDirectionTime: 3000, // 3 секунди
                lastDirectionChange: 0
            },
            
            // Налаштування переслідування
            chase: {
                target: null, // ціль для переслідування
                detectionRange: 150, // радіус виявлення
                maxChaseTime: 10000 // 10 секунд переслідування
            },
            
            // Налаштування атаки
            attack: {
                attackRange: 100, // дистанція атаки
                attackCooldown: 2000, // 2 секунди між атаками
                lastAttackTime: 0
            },
            
            // Таймери
            timers: {
                stateChange: 0,
                directionChange: 0
            }
        };
        
        // Стан руху
        this.movementState = {
            isMoving: false,
            lastDirection: 'down'
        };
        
        // записуємо в лог
        this.logger.enemyAction('Ворог створений', `позиція: (${this.x}, ${this.y})`);
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
        if (this.ai.state === 'patrol' && 
            this.ai.patrol.lastDirectionChange >= this.ai.patrol.changeDirectionTime) {
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
        
        logger.enemyAction(`Ворог змінив стан на: ${newState}`);
        
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
        this.ai.patrol.targetX = Math.random() * (this.bounds.maxX - this.bounds.minX - 100) + this.bounds.minX + 50;
        this.ai.patrol.targetY = Math.random() * (this.bounds.maxY - this.bounds.minY - 100) + this.bounds.minY + 50;
    }
    
    /**
     * Зміна напрямку патрулювання
     */
    changePatrolDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        this.direction = randomDirection;
        this.ai.patrol.lastDirectionChange = 0;
        
        // Встановлюємо нову ціль патрулювання
        this.setPatrolTarget();
        
        logger.enemyAction('Ворог змінив напрямок патрулювання', `новий напрямок: ${randomDirection}`);
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
            patrol: blue,        // синій
            chase: orange,       // помаранчевий
            attack: red,         // червоний
            retreat: water       // фіолетовий
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
            direction: this.direction
        };
    }
}
```

## Що додано до класу Enemy?

### Нові властивості:
- **`ai.state`** - поточний стан AI ('patrol', 'chase', 'attack')
- **`ai.patrol`** - налаштування патрулювання
- **`ai.chase`** - налаштування переслідування
- **`ai.attack`** - налаштування атаки
- **`movementState`** - стан руху

### Нові методи:
- **`setTarget()`** - встановлення цілі для переслідування
- **`updateAI()`** - оновлення штучного інтелекту
- **`changeAIState()`** - зміна стану AI
- **`updateMovement()`** - оновлення руху
- **`isTargetInRange()`** - перевірка діапазону до цілі
- **`setPatrolTarget()`** - встановлення цілі патрулювання
- **`changePatrolDirection()`** - зміна напрямку патрулювання
- **`drawAIStateIndicator()`** - індикатор стану AI
- **`getAIState()`** - отримання стану AI

### Використання методів з базового класу:
- **`checkBounds()`** - перевірка меж руху (з Tank.js)
- **`setBounds()`** - встановлення меж руху (з Tank.js)
- **`getShootPosition()`** - позиція для стрільби (з Tank.js)

## Стани штучного інтелекту

### 1. Патрулювання (`patrol`):
- **Випадковий рух** по полю
- **Зміна напрямку** кожні 3 секунди
- **Випадкові цілі** для руху

### 2. Переслідування (`chase`):
- **Рух до гравця** при виявленні
- **Радіус виявлення** 150 пікселів
- **Максимальний час** переслідування 10 секунд

### 3. Атака (`attack`):
- **Зупинка** для стрільби
- **Дистанція атаки** 100 пікселів
- **Затримка між атаками** 2 секунди

## Візуальні індикатори

### Індикатор стану AI:
- **Синій** - патрулювання
- **Помаранчевий** - переслідування
- **Червоний** - атака
- **Фіолетовий** - відступ

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
    this.changePatrolDirection();
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
    size: 32
});

// Встановлення меж руху (метод з базового класу)
enemy.setBounds({
    maxX: 800,
    maxY: 600
});

// Встановлення цілі для переслідування
enemy.setTarget(player);

// Оновлення в ігровому циклі
enemy.update(deltaTime);

// Отримання стану AI
const aiState = enemy.getAIState();
console.log('Стан ворога:', aiState.state);
```

## Результат

Після оновлення цього класу у вас буде:
- ✅ Базовий штучний інтелект ворога
- ✅ Патрулювання по полю
- ✅ Переслідування гравця
- ✅ Візуальні індикатори стану
- ✅ Готовність для стрільби ворога
- ✅ Використання спільних методів з базового класу

## Що далі?

У наступному підрозділі ми додамо стрільбу ворога з автоматичним націлюванням. 