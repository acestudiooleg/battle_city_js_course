# 3.8: Система колізій

## Що ми будемо робити?

У цьому підрозділі ми створимо систему колізій для перевірки зіткнень між кулями та танками, а також додамо систему пошкоджень.

## Створення класу CollisionManager.js

Створіть файл `CollisionManager.js`:

```javascript
/**
 * 🎮 Клас CollisionManager - система колізій
 * 
 * Відповідає за:
 * - Перевірку зіткнень між об'єктами
 * - Обробку пошкоджень
 * - Видалення зіткнутих об'єктів
 */

export class CollisionManager {
    constructor(logger) {
        // Статистика колізій
        this.stats = {
            totalCollisions: 0,
            playerHits: 0,
            enemyHits: 0,
            bulletCollisions: 0
        };
        
        // Логгер для запису подій
        this.logger = logger;
        
        this.logger.gameEvent('Система колізій ініціалізована');
    }
    
    /**
     * Перевірка всіх колізій в грі
     * @param {Object} gameObjects - Об'єкти гри
     */
    checkAllCollisions(gameObjects) {
        const { player, enemy, gameField } = gameObjects;
        
        if (!player || !enemy) return;
        
        // Перевіряємо колізії куль гравця з ворогом
        this.checkPlayerBulletsCollisions(player, enemy);
        
        // Перевіряємо колізії куль ворога з гравцем
        this.checkEnemyBulletsCollisions(enemy, player);
        
        // Перевіряємо колізії куль між собою
        this.checkBulletToBulletCollisions(player, enemy);
        
        // Перевіряємо колізії з межами поля
        this.checkBoundaryCollisions(player, enemy, gameField);
    }
    
    /**
     * Перевірка колізій куль гравця з ворогом
     * @param {Player} player - Гравець
     * @param {Enemy} enemy - Ворог
     */
    checkPlayerBulletsCollisions(player, enemy) {
        if (!player.isAlive || !enemy.isAlive) return;
        
        const playerBullets = player.getBullets();
        
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const bullet = playerBullets[i];
            
            // Перевіряємо колізію кулі з ворогом
            if (this.checkCollision(bullet, enemy)) {
                this.handlePlayerHitEnemy(player, enemy, bullet);
                break; // Виходимо після першого попадання
            }
            
            // Перевіряємо чи куля вийшла за межі поля
            if (this.isBulletOutOfBounds(bullet, gameField)) {
                player.removeBullet(bullet);
            }
        }
    }
    
    /**
     * Перевірка колізій куль ворога з гравцем
     * @param {Enemy} enemy - Ворог
     * @param {Player} player - Гравець
     */
    checkEnemyBulletsCollisions(enemy, player) {
        if (!enemy.isAlive || !player.isAlive) return;
        
        const enemyBullets = enemy.getBullets();
        
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            
            // Перевіряємо колізію кулі з гравцем
            if (this.checkCollision(bullet, player)) {
                this.handleEnemyHitPlayer(enemy, player, bullet);
                break; // Виходимо після першого попадання
            }
            
            // Перевіряємо чи куля вийшла за межі поля
            if (this.isBulletOutOfBounds(bullet, gameField)) {
                enemy.removeBullet(bullet);
            }
        }
    }
    
    /**
     * Перевірка колізій куль між собою
     * @param {Player} player - Гравець
     * @param {Enemy} enemy - Ворог
     */
    checkBulletToBulletCollisions(player, enemy) {
        const playerBullets = player.getBullets();
        const enemyBullets = enemy.getBullets();
        
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const playerBullet = playerBullets[i];
            
            for (let j = enemyBullets.length - 1; j >= 0; j--) {
                const enemyBullet = enemyBullets[j];
                
                if (this.checkCollision(playerBullet, enemyBullet)) {
                    this.handleBulletCollision(playerBullet, enemyBullet, player, enemy);
                    break;
                }
            }
        }
    }
    
    /**
     * Перевірка колізій з межами поля
     * @param {Player} player - Гравець
     * @param {Enemy} enemy - Ворог
     * @param {GameField} gameField - Ігрове поле
     */
    checkBoundaryCollisions(player, enemy, gameField) {
        // Перевіряємо чи танки не вийшли за межі поля
        if (this.isTankOutOfBounds(player, gameField)) {
            this.handleTankOutOfBounds(player, gameField);
        }
        
        if (this.isTankOutOfBounds(enemy, gameField)) {
            this.handleTankOutOfBounds(enemy, gameField);
        }
    }
    
    /**
     * Перевірка колізії між двома об'єктами
     * @param {Object} obj1 - Перший об'єкт
     * @param {Object} obj2 - Другий об'єкт
     * @returns {boolean} - true якщо є колізія
     */
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    /**
     * Обробка попадання гравця по ворогу
     * @param {Player} player - Гравець
     * @param {Enemy} enemy - Ворог
     * @param {Bullet} bullet - Куля
     */
    handlePlayerHitEnemy(player, enemy, bullet) {
        // Видаляємо кулю
        player.removeBullet(bullet);
        
        // Наносимо пошкодження ворогу
        enemy.takeDamage(25); // 25 очок пошкодження
        
        // Оновлюємо статистику
        this.stats.totalCollisions++;
        this.stats.playerHits++;
        
        // Логуємо подію
        console.log('🎯 Гравець попав по ворогу!');
        
        // Перевіряємо чи ворог знищений
        if (!enemy.isAlive) {
            console.log('💀 Ворог знищений!');
        }
    }
    
    /**
     * Обробка попадання ворога по гравцю
     * @param {Enemy} enemy - Ворог
     * @param {Player} player - Гравець
     * @param {Bullet} bullet - Куля
     */
    handleEnemyHitPlayer(enemy, player, bullet) {
        // Видаляємо кулю
        enemy.removeBullet(bullet);
        
        // Наносимо пошкодження гравцю
        player.takeDamage(20); // 20 очок пошкодження
        
        // Оновлюємо статистику
        this.stats.totalCollisions++;
        this.stats.enemyHits++;
        
        // Логуємо подію
        console.log('💥 Ворог попав по гравцю!');
        
        // Перевіряємо чи гравець знищений
        if (!player.isAlive) {
            console.log('💀 Гравець знищений!');
        }
    }
    
    /**
     * Обробка зіткнення куль
     * @param {Bullet} bullet1 - Перша куля
     * @param {Bullet} bullet2 - Друга куля
     * @param {Player} player - Гравець
     * @param {Enemy} enemy - Ворог
     */
    handleBulletCollision(bullet1, bullet2, player, enemy) {
        // Видаляємо обидві кулі
        player.removeBullet(bullet1);
        enemy.removeBullet(bullet2);
        
        // Оновлюємо статистику
        this.stats.bulletCollisions++;
        
        // Логуємо подію
        console.log('💥 Кулі зіткнулися!');
    }
    
    /**
     * Перевірка чи куля вийшла за межі поля
     * @param {Bullet} bullet - Куля
     * @param {GameField} gameField - Ігрове поле
     * @returns {boolean} - true якщо куля за межами
     */
    isBulletOutOfBounds(bullet, gameField) {
        if (!gameField) return false;
        
        const bounds = gameField.getBounds();
        return bullet.x < bounds.minX || 
               bullet.x > bounds.maxX || 
               bullet.y < bounds.minY || 
               bullet.y > bounds.maxY;
    }
    
    /**
     * Перевірка чи танк вийшов за межі поля
     * @param {Tank} tank - Танк
     * @param {GameField} gameField - Ігрове поле
     * @returns {boolean} - true якщо танк за межами
     */
    isTankOutOfBounds(tank, gameField) {
        if (!gameField) return false;
        
        const bounds = gameField.getBounds();
        return tank.x < bounds.minX || 
               tank.x + tank.width > bounds.maxX || 
               tank.y < bounds.minY || 
               tank.y + tank.height > bounds.maxY;
    }
    
    /**
     * Обробка виходу танка за межі поля
     * @param {Tank} tank - Танк
     * @param {GameField} gameField - Ігрове поле
     */
    handleTankOutOfBounds(tank, gameField) {
        const bounds = gameField.getBounds();
        
        // Повертаємо танк в межі поля
        if (tank.x < bounds.minX) tank.x = bounds.minX;
        if (tank.x + tank.width > bounds.maxX) tank.x = bounds.maxX - tank.width;
        if (tank.y < bounds.minY) tank.y = bounds.minY;
        if (tank.y + tank.height > bounds.maxY) tank.y = bounds.maxY - tank.height;
        
        console.log('🚫 Танк повернуто в межі поля');
    }
    
    /**
     * Отримання статистики колізій
     * @returns {Object} - Статистика
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Скидання статистики
     */
    resetStats() {
        this.stats = {
            totalCollisions: 0,
            playerHits: 0,
            enemyHits: 0,
            bulletCollisions: 0
        };
    }
}
```

## Оновлення класу Tank.js

Додайте до класу `Tank.js` методи для пошкоджень:

```javascript
// ... існуючий код ...

export class Tank {
    constructor(options = {}) {
        // ... існуючий код ...
        
        // Система пошкоджень
        this.damage = {
            maxHealth: options.maxHealth || 100,
            currentHealth: options.maxHealth || 100,
            damageResistance: options.damageResistance || 0 // відсоток зменшення пошкоджень
        };
        
        // ... існуючий код ...
    }
    
    // ... існуючі методи ...
    
    /**
     * Отримання пошкодження
     * @param {number} damage - Кількість пошкодження
     */
    takeDamage(damage) {
        // Застосовуємо стійкість до пошкоджень
        const actualDamage = damage * (1 - this.damage.damageResistance);
        
        // Зменшуємо здоров'я
        this.damage.currentHealth -= actualDamage;
        
        // Перевіряємо чи танк знищений
        if (this.damage.currentHealth <= 0) {
            this.damage.currentHealth = 0;
            this.kill();
        }
        
        console.log(`💔 Танк отримав ${actualDamage} пошкодження. Здоров'я: ${this.damage.currentHealth}`);
    }
    
    /**
     * Відновлення здоров'я
     * @param {number} amount - Кількість здоров'я для відновлення
     */
    heal(amount) {
        this.damage.currentHealth = Math.min(
            this.damage.maxHealth, 
            this.damage.currentHealth + amount
        );
        
        console.log(`💚 Танк відновив ${amount} здоров'я. Здоров'я: ${this.damage.currentHealth}`);
    }
    
    /**
     * Отримання поточного здоров'я
     * @returns {number} - Поточне здоров'я
     */
    getHealth() {
        return this.damage.currentHealth;
    }
    
    /**
     * Отримання максимального здоров'я
     * @returns {number} - Максимальне здоров'я
     */
    getMaxHealth() {
        return this.damage.maxHealth;
    }
    
    /**
     * Отримання відсотка здоров'я
     * @returns {number} - Відсоток здоров'я (0-100)
     */
    getHealthPercentage() {
        return (this.damage.currentHealth / this.damage.maxHealth) * 100;
    }
    
    /**
     * Встановлення стійкості до пошкоджень
     * @param {number} resistance - Відсоток стійкості (0-1)
     */
    setDamageResistance(resistance) {
        this.damage.damageResistance = Math.max(0, Math.min(1, resistance));
    }
    
    /**
     * Повне відновлення здоров'я
     */
    fullHeal() {
        this.damage.currentHealth = this.damage.maxHealth;
        console.log('💚 Танк повністю відновлений');
    }
}
```

## Оновлення класу Game.js

Додайте до класу `Game.js` інтеграцію з системою колізій:

```javascript
// ... існуючий код ...

import { CollisionManager } from './CollisionManager.js';

export class Game {
    constructor() {
        // ... існуючий код ...
        
        // Система колізій
        this.collisionManager = new CollisionManager();
        
        // ... існуючий код ...
    }
    
    // ... існуючі методи ...
    
    /**
     * Оновлення гри
     * @param {number} deltaTime - Час з останнього оновлення
     */
    update(deltaTime) {
        // Оновлюємо ігрове поле
        this.gameField.update(deltaTime);
        
        // Оновлюємо гравця
        this.player.update(deltaTime);
        
        // Оновлюємо ворога
        this.enemy.update(deltaTime);
        
        // Перевіряємо колізії
        this.collisionManager.checkAllCollisions({
            player: this.player,
            enemy: this.enemy,
            gameField: this.gameField
        });
        
        // Оновлюємо статистику
        this.updateStats();
    }
    
    /**
     * Оновлення статистики
     */
    updateStats() {
        // Оновлюємо здоров'я в інтерфейсі
        const playerHealthEl = document.getElementById('playerHealth');
        const enemyHealthEl = document.getElementById('enemyHealth');
        const playerBulletsEl = document.getElementById('playerBullets');
        const enemyBulletsEl = document.getElementById('enemyBullets');
        
        if (playerHealthEl) {
            playerHealthEl.textContent = this.player.getHealth();
        }
        
        if (enemyHealthEl) {
            enemyHealthEl.textContent = this.enemy.getHealth();
        }
        
        if (playerBulletsEl) {
            playerBulletsEl.textContent = this.player.getBullets().length;
        }
        
        if (enemyBulletsEl) {
            enemyBulletsEl.textContent = this.enemy.getBullets().length;
        }
    }
    
    /**
     * Отримання статистики колізій
     * @returns {Object} - Статистика
     */
    getCollisionStats() {
        return this.collisionManager.getStats();
    }
}
```

## Що робить система колізій?

### Основні функції:
- **Перевірка зіткнень** між кулями та танками
- **Обробка пошкоджень** та знищення
- **Перевірка меж поля** для куль та танків
- **Зіткнення куль** між собою

### Типи колізій:
1. **Куля гравця → Ворог** (25 пошкодження)
2. **Куля ворога → Гравець** (20 пошкодження)
3. **Куля ↔ Куля** (взаємне знищення)
4. **Танк ↔ Межі поля** (повернення в межі)

## Система пошкоджень

### Властивості танка:
- **`maxHealth`** - максимальне здоров'я (100)
- **`currentHealth`** - поточне здоров'я
- **`damageResistance`** - стійкість до пошкоджень (0-100%)

### Методи:
- **`takeDamage()`** - отримання пошкодження
- **`heal()`** - відновлення здоров'я
- **`getHealthPercentage()`** - відсоток здоров'я
- **`fullHeal()`** - повне відновлення

## Використання

```javascript
// Створення системи колізій з логгером
const collisionManager = new CollisionManager(logger);

// Перевірка колізій в ігровому циклі
collisionManager.checkAllCollisions({
    player: player,
    enemy: enemy,
    gameField: gameField
});

// Отримання статистики
const stats = collisionManager.getStats();
console.log('Загальні колізії:', stats.totalCollisions);

// Налаштування пошкоджень танка
player.setDamageResistance(0.2); // 20% стійкості
player.takeDamage(30); // отримує 24 пошкодження (30 * 0.8)
```

## 📝 Параметр logger

**`logger`** - це об'єкт системи логування, який передається в конструктор для запису подій колізій:

- **Тип**: `GameLogger` або `null`
- **Призначення**: Запис подій колізій, пошкоджень та знищення об'єктів
- **Методи**:
  - `gameEvent(message, details)` - запис ігрових подій
  - `playerAction(message, details)` - запис дій гравця
  - `enemyAction(message, details)` - запис дій ворога
  - `info(message, details)` - інформаційні повідомлення
  - `warning(message, details)` - попередження
  - `error(message, details)` - помилки

**Приклад використання**:
```javascript
// Створення логгера
const logger = new GameLogger();

// Створення системи колізій з логгером
const collisionManager = new CollisionManager(logger);

// Автоматичне логування ініціалізації
// logger.gameEvent('Система колізій ініціалізована')
```

## Результат

Після створення цієї системи у вас буде:
- ✅ Повноцінна система колізій
- ✅ Система пошкоджень та здоров'я
- ✅ Автоматичне видалення зіткнутих об'єктів
- ✅ Статистика колізій
- ✅ Готовність для фінальної інтеграції

## Що далі?

У наступному підрозділі ми оновимо головний файл гри для інтеграції всіх компонентів. 