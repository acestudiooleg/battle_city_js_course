# 3.7: Стрільба ворога

## Що ми будемо робити?

У цьому підрозділі ми додамо функціональність стрільби до класу `Enemy.js` з автоматичним націлюванням на гравця.

## Оновлення класу Enemy.js

Додайте до класу `Enemy.js` нові методи для стрільби:

```javascript
// ... існуючий код ...

export class Enemy extends Tank {
    constructor(options = {}) {
        // ... існуючий код конструктора ...
        
        // Система стрільби
        this.shooting = {
            canShoot: true,
            lastShotTime: 0,
            shootCooldown: 2000, // 2 секунди між пострілами
            bullets: [], // масив активних куль
            accuracy: 0.8 // точність стрільби (80%)
        };
        
        // ... існуючий код ...
    }
    
    // ... існуючі методи ...
    
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
        if (this.ai.state === 'attack' && 
            this.shooting.canShoot && 
            this.ai.chase.target) {
            this.shoot();
        }
    }
    
    /**
     * Стрільба ворога
     */
    shoot() {
        if (!this.ai.chase.target) return;
        
        // Отримуємо позицію для стрільби (метод з базового класу Tank)
        const shootPos = this.getShootPosition();
        
        // Розраховуємо напрямок до гравця
        const targetDirection = this.calculateTargetDirection();
        
        // Додаємо неточність до стрільби
        const finalDirection = this.addShootingInaccuracy(targetDirection);
        
        // Імпортуємо клас Bullet
        import('./Bullet.js').then(module => {
            const { Bullet } = module;
            
            // Створюємо нову кулю
            const bullet = new Bullet({
                x: shootPos.x,
                y: shootPos.y,
                direction: finalDirection,
                owner: 'enemy',
                speed: 4 // швидкість кулі ворога (повільніше за гравця)
            });
            
            // Додаємо кулю до масиву
            this.shooting.bullets.push(bullet);
            
            // Встановлюємо затримку між пострілами
            this.shooting.canShoot = false;
            this.shooting.lastShotTime = 0;
            
            // Логуємо стрільбу
            this.logger.enemyAction('Ворог стріляє', `напрямок: ${finalDirection}`);
            
            this.logger.gameEvent('Ворог вистрілив кулю', `позиція: (${bullet.x}, ${bullet.y})`);
        });
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
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
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
        this.shooting.bullets.forEach(bullet => {
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
        this.shooting.bullets.forEach(bullet => bullet.destroy());
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
            lastShotTime: this.shooting.lastShotTime
        };
    }
}
```

## Оновлення методу render

Оновіть метод `render` для малювання куль:

```javascript
/**
 * Малювання ворога на екрані
 * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
 */
render(ctx) {
    // Викликаємо базовий метод render з батьківського класу
    super.render(ctx);
    
    // Малюємо індикатор стану AI
    this.drawAIStateIndicator(ctx);
    
    // Малюємо індикатор стрільби (якщо не може стріляти)
    if (!this.shooting.canShoot) {
        this.drawShootCooldownIndicator(ctx);
    }
}

/**
 * Малювання індикатора затримки стрільби
 * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
 */
drawShootCooldownIndicator(ctx) {
    // темно-червоний колір для індикатора затримки
    ctx.fillStyle = darkGray;
    // розмір індикатора
    const indicatorSize = 3;
    
    // розміщуємо індикатор в лівому верхньому куті танка
    const indicatorX = this.x + 2;
    const indicatorY = this.y + 2;
    
    // малюємо маленький квадрат
    ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
}
```

## Що додано до класу Enemy?

### Нові властивості:
- **`shooting.canShoot`** - чи може ворог стріляти
- **`shooting.lastShotTime`** - час останнього пострілу
- **`shooting.shootCooldown`** - затримка між пострілами (2 секунди)
- **`shooting.bullets`** - масив активних куль
- **`shooting.accuracy`** - точність стрільби (80%)

### Нові методи:
- **`updateShooting()`** - оновлення системи стрільби
- **`shoot()`** - створення нової кулі
- **`calculateTargetDirection()`** - розрахунок напрямку до цілі
- **`addShootingInaccuracy()`** - додавання неточності
- **`updateBullets()`** - оновлення всіх куль
- **`renderBullets()`** - малювання куль
- **`getBullets()`** - отримання всіх куль
- **`removeBullet()`** - видалення конкретної кулі
- **`clearBullets()`** - очищення всіх куль
- **`setShootCooldown()`** - налаштування затримки
- **`setShootingAccuracy()`** - налаштування точності
- **`drawShootCooldownIndicator()`** - індикатор затримки
- **`getShootingInfo()`** - отримання інформації про стрільбу

### Використання методів з базового класу:
- **`getShootPosition()`** - позиція для стрільби (з Tank.js)

## Система стрільби ворога

### Умови стрільби:
- **Режим атаки** (`ai.state === 'attack'`)
- **Можна стріляти** (`canShoot === true`)
- **Є ціль** (`ai.chase.target`)

### Особливості:
- **Автоматичне націлювання** на гравця
- **Система точності** (80% за замовчуванням)
- **Затримка 2 секунди** між пострілами
- **Швидкість кулі** 4 пікселі за кадр

## Позиція стрільби

### Розрахунок позиції:
```javascript
// Використовуємо метод з базового класу Tank
const shootPos = this.getShootPosition();
```

### Логіка розрахунку (з Tank.js):
- **Вгору**: центр танка, вище танка
- **Вниз**: центр танка, нижче танка
- **Вліво**: центр танка, лівіше танка
- **Вправо**: центр танка, правіше танка

## Система точності

### Розрахунок напрямку:
1. **Визначення основного напрямку** до гравця
2. **Додавання неточності** згідно з `accuracy`
3. **Випадковий напрямок** при неточній стрільбі

### Налаштування точності:
- **1.0** - 100% точність
- **0.8** - 80% точність (за замовчуванням)
- **0.5** - 50% точність
- **0.0** - повністю випадкова стрільба

## Візуальні індикатори

### Індикатор затримки стрільби:
- **Темно-червоний квадрат** в лівому верхньому куті
- **Показується** коли не можна стріляти

### Розташування індикаторів:
- **Правий верхній** - стан AI
- **Лівий верхній** - затримка стрільби

## Використання

```javascript
// Створення ворога
const enemy = new Enemy({
    x: 300,
    y: 200,
    color: '#e74c3c',
    size: 32
});

// Встановлення цілі для переслідування
enemy.setTarget(player);

// Налаштування стрільби
enemy.setShootCooldown(1500); // 1.5 секунди між пострілами
enemy.setShootingAccuracy(0.9); // 90% точність

// Оновлення в ігровому циклі
enemy.update(deltaTime);

// Отримання інформації про стрільбу
const shootingInfo = enemy.getShootingInfo();
console.log('Куль ворога:', shootingInfo.bulletsCount);

// Отримання всіх куль для перевірки колізій
const bullets = enemy.getBullets();
```

## Результат

Після додавання цього функціоналу у вас буде:
- ✅ Автоматична стрільба ворога
- ✅ Націлювання на гравця
- ✅ Система точності стрільби
- ✅ Візуальні індикатори стану
- ✅ Готовність для системи колізій
- ✅ Використання спільних методів з базового класу

## Що далі?

У наступному підрозділі ми створимо систему колізій для перевірки зіткнень між кулями та танками. 