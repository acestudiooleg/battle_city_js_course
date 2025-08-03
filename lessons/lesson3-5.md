# 3.5: Стрільба гравця

## Що ми будемо робити?

У цьому підрозділі ми додамо функціональність стрільби до класу `Player.js` та створимо систему управління кулями.

## Оновлення класу Player.js

Додайте до класу `Player.js` нові методи для стрільби:

```javascript
// ... існуючий код ...

export class Player extends Tank {
    constructor(options = {}) {
        // ... існуючий код конструктора ...
        
        // Система стрільби
        this.shooting = {
            canShoot: true,
            lastShotTime: 0,
            shootCooldown: 500, // 500мс між пострілами
            bullets: [] // масив активних куль
        };
        
        // ... існуючий код ...
    }
    
    // ... існуючі методи ...
    
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
        import('./Bullet.js').then(module => {
            const { Bullet } = module;
            
            // Створюємо нову кулю
            const bullet = new Bullet({
                x: shootPos.x,
                y: shootPos.y,
                direction: this.direction,
                owner: 'player',
                speed: 6 // швидкість кулі гравця
            });
            
            // Додаємо кулю до масиву
            this.shooting.bullets.push(bullet);
            
            // Встановлюємо затримку між пострілами
            this.shooting.canShoot = false;
            this.shooting.lastShotTime = 0;
            
            // Логуємо стрільбу
            this.logger.playerAction('Гравець стріляє', `напрямок: ${this.direction}`);
            
            this.logger.gameEvent('Гравець вистрілив кулю', `позиція: (${bullet.x}, ${bullet.y})`);
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
        this.shooting.bullets.forEach(bullet => {
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
     * Отримання інформації про стрільбу
     * @returns {Object} - Інформація про стрільбу
     */
    getShootingInfo() {
        return {
            canShoot: this.shooting.canShoot,
            bulletsCount: this.shooting.bullets.length,
            cooldown: this.shooting.shootCooldown,
            lastShotTime: this.shooting.lastShotTime
        };
    }
}
```

## Оновлення методу render

Оновіть метод `render` для малювання куль:

```javascript
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
    // червоний колір для індикатора затримки
    ctx.fillStyle = '#e74c3c';
    // розмір індикатора
    const indicatorSize = 3;
    
    // розміщуємо індикатор в лівому нижньому куті танка
    const indicatorX = this.x + 2;
    const indicatorY = this.y + this.height - indicatorSize - 2;
    
    // малюємо маленький квадрат
    ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
}
```

## Що додано до класу Player?

### Нові властивості:
- **`shooting.canShoot`** - чи може гравець стріляти
- **`shooting.lastShotTime`** - час останнього пострілу
- **`shooting.shootCooldown`** - затримка між пострілами (500мс)
- **`shooting.bullets`** - масив активних куль

### Нові методи:
- **`updateShooting()`** - оновлення системи стрільби
- **`shoot()`** - створення нової кулі
- **`updateBullets()`** - оновлення всіх куль
- **`renderBullets()`** - малювання куль
- **`getBullets()`** - отримання всіх куль
- **`removeBullet()`** - видалення конкретної кулі
- **`clearBullets()`** - очищення всіх куль
- **`setShootCooldown()`** - налаштування затримки
- **`drawShootCooldownIndicator()`** - індикатор затримки

### Використання методів з базового класу:
- **`getShootPosition()`** - позиція для стрільби (з Tank.js)

## Система стрільби

### Керування:
- **Пробіл** для стрільби
- **Затримка 500мс** між пострілами
- **Автоматичне оновлення** куль

### Особливості:
- **Кулі створюються** в позиції дула танка (через `getShootPosition()`)
- **Напрямок кулі** відповідає напрямку дула
- **Швидкість кулі** 6 пікселів за кадр
- **Автоматичне видалення** неактивних куль

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

## Візуальні індикатори

### Індикатор руху:
- **Зелений квадрат** в правому нижньому куті
- **Показується** тільки під час руху

### Індикатор затримки стрільби:
- **Червоний квадрат** в лівому нижньому куті
- **Показується** коли не можна стріляти

## Використання

```javascript
// Створення гравця
const player = new Player({
    x: 100,
    y: 100,
    color: '#f1c40f',
    size: 32
});

// Підключення системи керування
player.setInputManager(inputManager);

// Налаштування затримки стрільби
player.setShootCooldown(300); // 300мс між пострілами

// Оновлення в ігровому циклі
player.update(deltaTime);

// Отримання інформації про стрільбу
const shootingInfo = player.getShootingInfo();
console.log('Куль гравця:', shootingInfo.bulletsCount);

// Отримання всіх куль для перевірки колізій
const bullets = player.getBullets();
```

## Результат

Після додавання цього функціоналу у вас буде:
- ✅ Стрільба за клавішею пробілу
- ✅ Система затримки між пострілами
- ✅ Автоматичне управління кулями
- ✅ Візуальні індикатори стану
- ✅ Готовність для системи колізій
- ✅ Використання спільних методів з базового класу

## Що далі?

У наступному підрозділі ми додамо рух ворога з базовим штучним інтелектом. 