/**
 * 🎮 Базовий клас Tank - представляє танк
 * 
 * Відповідає за:
 * - Зберігання позиції танка
 * - Малювання танка на екрані
 * - Базову логіку танка
 */

import { logger } from './main.js';

export class Tank {
    constructor(options = {}) {
        // Позиція танка
        this.x = options.x || 0;
        this.y = options.y || 0;
        
        // Розмір танка
        this.width = options.size || 32;
        this.height = options.size || 32;
        
        // Візуальні властивості
        this.color = options.color || '#95a5a6';
        
        // Напрямок руху
        this.direction = options.direction || 'up';
        
        // Швидкість руху
        this.speed = options.speed || 1;
        
        // Стан танка
        this.isAlive = true;
        
        logger.debug('Танк створений');
    }
    
    /**
     * Оновлення стану танка
     * Викликається кожен кадр
     */
    update(deltaTime) {
        // Базова логіка оновлення
        // Буде перевизначена в дочірніх класах
    }
    
    /**
     * Малювання танка на екрані
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    render(ctx) {
        if (!this.isAlive) return;
        
        // Зберігаємо поточний стан контексту
        ctx.save();
        
        // Малюємо тіло танка (основний квадрат)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Малюємо рамку навколо танка
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Малюємо дуло танка
        this.drawGun(ctx);
        
        // Відновлюємо стан контексту
        ctx.restore();
    }
    
    /**
     * Малювання дула танка
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    drawGun(ctx) {
        const gunWidth = 4;
        const gunHeight = 8;
        
        // Позиція дула залежить від напрямку
        let gunX, gunY;
        
        switch (this.direction) {
            case 'up':
                gunX = this.x + this.width / 2 - gunWidth / 2;
                gunY = this.y - gunHeight;
                break;
            case 'down':
                gunX = this.x + this.width / 2 - gunWidth / 2;
                gunY = this.y + this.height;
                break;
            case 'left':
                gunX = this.x - gunHeight;
                gunY = this.y + this.height / 2 - gunWidth / 2;
                break;
            case 'right':
                gunX = this.x + this.width;
                gunY = this.y + this.height / 2 - gunWidth / 2;
                break;
        }
        
        // Малюємо дуло
        ctx.fillStyle = '#aaaa00';
        if (this.direction === 'left' || this.direction === 'right') {
            ctx.fillRect(gunX, gunY, gunHeight, gunWidth);
        } else {
            ctx.fillRect(gunX, gunY, gunWidth, gunHeight);
        }
    }
    
    /**
     * Встановлення позиції танка
     * @param {number} x - Нова X координата
     * @param {number} y - Нова Y координата
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Встановлення напрямку танка
     * @param {string} direction - Напрямок ('up', 'down', 'left', 'right')
     */
    setDirection(direction) {
        this.direction = direction;
    }
    
    /**
     * Перевірка чи танк живий
     * @returns {boolean} - true якщо танк живий
     */
    isTankAlive() {
        return this.isAlive;
    }
    
    /**
     * Вбити танк
     */
    kill() {
        this.isAlive = false;
        logger.debug('Танк вбитий!');
    }
    
    /**
     * Відродити танк
     */
    respawn() {
        this.isAlive = true;
        logger.debug('Танк відроджений!');
    }
} 