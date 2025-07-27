/**
 * 🎮 Клас Player - представляє гравця
 * 
 * Відповідає за:
 * - Зберігання позиції гравця
 * - Малювання гравця на екрані
 * - Базову логіку гравця
 */

import { Bullet } from './Bullet.js';

export class Player {
    constructor(options = {}) {
        // Позиція гравця
        this.x = options.x || 0;
        this.y = options.y || 0;
        
        // Розмір гравця
        this.width = options.size || 32;
        this.height = options.size || 32;
        
        // Візуальні властивості
        this.color = options.color || '#f1c40f'; // Жовтий колір за замовчуванням
        
        // Напрямок руху
        this.direction = 'up';
        
        // Швидкість руху
        this.speed = 2;
        
        // Стан гравця
        this.isAlive = true;
        
        this.bullets = [];
        this.lastShotTime = 0;
        this.shootCooldown = 300; // мс між пострілами
        
        console.log('👤 Гравець створений:', this);
    }
    
    /**
     * Оновлення гравця: рух, стрільба, оновлення куль
     */
    update(deltaTime, inputManager, gameField) {
        if (!this.isAlive) return;
        // Рух
        let moved = false;
        let newX = this.x;
        let newY = this.y;
        let newDir = this.direction;
        if (inputManager.isMoveUp()) {
            newY -= this.speed;
            newDir = 'up';
            moved = true;
        } else if (inputManager.isMoveDown()) {
            newY += this.speed;
            newDir = 'down';
            moved = true;
        } else if (inputManager.isMoveLeft()) {
            newX -= this.speed;
            newDir = 'left';
            moved = true;
        } else if (inputManager.isMoveRight()) {
            newX += this.speed;
            newDir = 'right';
            moved = true;
        }
        // Перевірка колізій зі стінами
        if (moved && !gameField.checkCollision(newX, newY, this.width, this.height)) {
            this.x = newX;
            this.y = newY;
        }
        this.direction = newDir;
        // Стрільба
        if (inputManager.isShooting()) {
            this.shoot();
        }
        // Оновлення куль
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        // Видалення неактивних куль
        this.bullets = this.bullets.filter(bullet => bullet.isActive && !bullet.isOutOfBounds(gameField.config.CANVAS_WIDTH, gameField.config.CANVAS_HEIGHT));
    }
    
    /**
     * Малювання гравця на екрані
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
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Малюємо дуло танка (маленький прямокутник)
        this.drawGun(ctx);
        
        // Відновлюємо стан контексту
        ctx.restore();
        
        // Малюємо кулі
        this.bullets.forEach(bullet => bullet.render(ctx));
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
        ctx.fillStyle = '#000';
        if (this.direction === 'left' || this.direction === 'right') {
            ctx.fillRect(gunX, gunY, gunHeight, gunWidth);
        } else {
            ctx.fillRect(gunX, gunY, gunWidth, gunHeight);
        }
    }
    
    /**
     * Встановлення позиції гравця
     * @param {number} x - Нова X координата
     * @param {number} y - Нова Y координата
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Встановлення напрямку гравця
     * @param {string} direction - Напрямок ('up', 'down', 'left', 'right')
     */
    setDirection(direction) {
        this.direction = direction;
    }
    
    /**
     * Перевірка чи гравець живий
     * @returns {boolean} - true якщо гравець живий
     */
    isPlayerAlive() {
        return this.isAlive;
    }
    
    /**
     * Вбити гравця
     */
    kill() {
        this.isAlive = false;
        console.log('💀 Гравець вбитий!');
    }
    
    /**
     * Відродити гравця
     */
    respawn() {
        this.isAlive = true;
        console.log('🔄 Гравець відроджений!');
    }
    
    /**
     * Стрільба (створення кулі)
     */
    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime < this.shootCooldown) return;
        this.lastShotTime = now;
        // Центр дула
        let bx = this.x + this.width / 2 - 2;
        let by = this.y + this.height / 2 - 2;
        switch (this.direction) {
            case 'up': by = this.y - 4; break;
            case 'down': by = this.y + this.height; break;
            case 'left': bx = this.x - 4; break;
            case 'right': bx = this.x + this.width; break;
        }
        this.bullets.push(new Bullet({
            x: bx,
            y: by,
            direction: this.direction,
            owner: 'player',
            speed: 6
        }));
    }
} 