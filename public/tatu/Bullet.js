import { orange, red, white } from './colors.js';

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
    constructor(options = {}) {
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
        
        console.log('💥 Куля створена:', this);
    }
    
    /**
     * Оновлення стану кулі
     * Викликається кожен кадр
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
        console.log('💥 Куля знищена');
    }
    
    /**
     * Отримання меж кулі для перевірки колізій
     * @returns {Object} - Об'єкт з межами кулі
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    /**
     * Перевірка колізії з іншим об'єктом
     * @param {Object} object - Об'єкт для перевірки колізії
     * @returns {boolean} - true якщо є колізія
     */
    checkCollision(object) {
        return this.x < object.x + object.width &&
               this.x + this.width > object.x &&
               this.y < object.y + object.height &&
               this.y + this.height > object.y;
    }
    
    /**
     * Перевірка чи куля вийшла за межі екрану
     * @param {number} canvasWidth - Ширина Canvas
     * @param {number} canvasHeight - Висота Canvas
     * @returns {boolean} - true якщо куля за межами екрану
     */
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || 
               this.x > canvasWidth || 
               this.y < 0 || 
               this.y > canvasHeight;
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
     * @param {string} direction - Напрямок ('up', 'down', 'left', 'right')
     */
    setDirection(direction) {
        this.direction = direction;
    }
} 