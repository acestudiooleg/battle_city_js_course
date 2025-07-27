import { Tank } from './Tank.js';
import { logger } from './main.js';

/**
 * 🎮 Клас Player - представляє гравця
 * 
 * Відповідає за:
 * - Специфічну логіку гравця
 * - Керування гравцем
 */

export class Player extends Tank {
    constructor(options = {}) {
        // Викликаємо конструктор батьківського класу
        super({
            ...options,
            color: options.color || '#f1c40f', // Жовтий колір за замовчуванням
            speed: options.speed || 2, // Гравець рухається швидше
            direction: options.direction || 'up'
        });
        
        logger.playerAction('Гравець створений', `позиція: (${this.x}, ${this.y})`);
    }
    
    /**
     * Оновлення стану гравця
     * Викликається кожен кадр
     */
    update(deltaTime) {
        // Поки що просто оновлюємо час
        // В наступних уроках тут буде логіка руху
    }
    
    /**
     * Малювання гравця на екрані
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    render(ctx) {
        if (!this.isAlive) return;
        
        // Зберігаємо поточний стан контексту
        ctx.save();
        
        // Використовуємо базове малювання з Tank
        super.render(ctx);
        
        // Додаємо специфічні елементи гравця
        this.drawPlayerMark(ctx);
        
        // Відновлюємо стан контексту
        ctx.restore();
    }
    
    /**
     * Малювання позначки гравця (жовтий круг)
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    drawPlayerMark(ctx) {
        const markSize = 4;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Малюємо жовтий круг
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(centerX, centerY, markSize, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    /**
     * Перевірка чи гравець живий
     * @returns {boolean} - true якщо гравець живий
     */
    isPlayerAlive() {
        return this.isTankAlive();
    }
    
    /**
     * Вбити гравця
     */
    kill() {
        super.kill();
        logger.error('Гравець вбитий!');
    }
    
    /**
     * Відродити гравця
     */
    respawn() {
        super.respawn();
        logger.success('Гравець відроджений!');
    }
} 