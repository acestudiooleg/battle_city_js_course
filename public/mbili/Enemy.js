import { Tank } from './Tank.js';
import { logger } from './main.js';

/**
 * 🎮 Клас Enemy - представляє ворога
 * 
 * Відповідає за:
 * - Специфічну логіку ворога
 * - ШІ ворога
 */

export class Enemy extends Tank {
    constructor(options = {}) {
        // Викликаємо конструктор батьківського класу
        super({
            ...options,
            color: options.color || '#e74c3c', // Червоний колір за замовчуванням
            speed: options.speed || 1, // Ворог рухається повільніше
            direction: options.direction || 'down'
        });
        
        // Таймер для зміни напрямку
        this.directionChangeTimer = 0;
        this.directionChangeInterval = 2000; // 2 секунди
        
        logger.enemyAction('Ворог створений', `позиція: (${this.x}, ${this.y})`);
    }
    
    /**
     * Оновлення стану ворога
     * Викликається кожен кадр
     */
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // Оновлюємо таймер зміни напрямку
        this.directionChangeTimer += deltaTime;
        
        // Змінюємо напрямок кожні 2 секунди
        if (this.directionChangeTimer >= this.directionChangeInterval) {
            this.changeDirection();
            this.directionChangeTimer = 0;
        }
    }
    
    /**
     * Зміна напрямку руху ворога
     */
    changeDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomIndex = Math.floor(Math.random() * directions.length);
        this.direction = directions[randomIndex];
        
        logger.enemyAction('Зміна напрямку', this.direction);
    }
    
    /**
     * Малювання ворога на екрані
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    render(ctx) {
        if (!this.isAlive) return;
        
        // Зберігаємо поточний стан контексту
        ctx.save();
        
        // Використовуємо базове малювання з Tank
        super.render(ctx);
        
        // Додаємо специфічні елементи ворога
        this.drawEnemyMark(ctx);
        
        // Відновлюємо стан контексту
        ctx.restore();
    }
    
    /**
     * Малювання позначки ворога (червоний хрестик)
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    drawEnemyMark(ctx) {
        const markSize = 6;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Малюємо червоний хрестик
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        
        // Вертикальна лінія
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - markSize);
        ctx.lineTo(centerX, centerY + markSize);
        ctx.stroke();
        
        // Горизонтальна лінія
        ctx.beginPath();
        ctx.moveTo(centerX - markSize, centerY);
        ctx.lineTo(centerX + markSize, centerY);
        ctx.stroke();
    }
    
    /**
     * Перевірка чи ворог живий
     * @returns {boolean} - true якщо ворог живий
     */
    isEnemyAlive() {
        return this.isTankAlive();
    }
    
    /**
     * Вбити ворога
     */
    kill() {
        super.kill();
        logger.enemyAction('Ворог вбитий');
    }
    
    /**
     * Відродити ворога
     */
    respawn() {
        super.respawn();
        logger.enemyAction('Ворог відроджений!');
    }
} 