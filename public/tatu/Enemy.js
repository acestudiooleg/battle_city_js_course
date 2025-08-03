import { red, black, darkGray } from './colors.js';

/**
 * 🎮 Клас Enemy - представляє ворога
 * 
 * Відповідає за:
 * - Зберігання позиції ворога
 * - Малювання ворога на екрані
 * - Базову логіку ворога
 */

export class Enemy {
    constructor(options = {}) {
        // Позиція ворога
        this.x = options.x || 0;
        this.y = options.y || 0;
        
        // Розмір ворога
        this.width = options.size || 32;
        this.height = options.size || 32;
        
        // Візуальні властивості
        this.color = options.color || red; // Червоний колір за замовчуванням
        
        // Напрямок руху
        this.direction = 'down';
        
        // Швидкість руху
        this.speed = 1;
        
        // Стан ворога
        this.isAlive = true;
        
        // Таймер для зміни напрямку
        this.directionChangeTimer = 0;
        this.directionChangeInterval = 2000; // 2 секунди
        
        console.log('👹 Ворог створений:', this);
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
        
        console.log('🔄 Ворог змінив напрямок на:', this.direction);
    }
    
    /**
     * Малювання ворога на екрані
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    render(ctx) {
        if (!this.isAlive) return;
        
        // Зберігаємо поточний стан контексту
        ctx.save();
        
        // Малюємо тіло ворога (основний квадрат)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Малюємо рамку навколо ворога
        ctx.strokeStyle = black;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Малюємо дуло ворога
        this.drawGun(ctx);
        
        // Малюємо позначку ворога (червоний хрестик)
        this.drawEnemyMark(ctx);
        
        // Відновлюємо стан контексту
        ctx.restore();
    }
    
    /**
     * Малювання дула ворога
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
        ctx.fillStyle = black;
        if (this.direction === 'left' || this.direction === 'right') {
            ctx.fillRect(gunX, gunY, gunHeight, gunWidth);
        } else {
            ctx.fillRect(gunX, gunY, gunWidth, gunHeight);
        }
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
        ctx.strokeStyle = darkGray;
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
     * Встановлення позиції ворога
     * @param {number} x - Нова X координата
     * @param {number} y - Нова Y координата
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Встановлення напрямку ворога
     * @param {string} direction - Напрямок ('up', 'down', 'left', 'right')
     */
    setDirection(direction) {
        this.direction = direction;
    }
    
    /**
     * Перевірка чи ворог живий
     * @returns {boolean} - true якщо ворог живий
     */
    isEnemyAlive() {
        return this.isAlive;
    }
    
    /**
     * Вбити ворога
     */
    kill() {
        this.isAlive = false;
        console.log('💀 Ворог вбитий!');
    }
    
    /**
     * Відродити ворога
     */
    respawn() {
        this.isAlive = true;
        console.log('🔄 Ворог відроджений!');
    }
} 