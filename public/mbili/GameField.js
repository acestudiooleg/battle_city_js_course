/**
 * 🎮 Клас GameField - представляє ігрове поле
 * 
 * Відповідає за:
 * - Малювання ігрового поля
 * - Створення сітки
 * - Розміщення стін та перешкод
 */

import { logger } from './main.js';

export class GameField {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        
        // Розміри поля в клітинках
        this.gridWidth = Math.floor(config.CANVAS_WIDTH / config.TILE_SIZE);
        this.gridHeight = Math.floor(config.CANVAS_HEIGHT / config.TILE_SIZE);
        
        // Масив стін
        this.walls = [];
        
        // Створюємо стіни
        this.createWalls();
        
        logger.gameEvent('Ігрове поле створене', `${this.gridWidth} x ${this.gridHeight} клітинок`);
    }
    
    /**
     * Створення стін на ігровому полі
     */
    createWalls() {
        // Створюємо стіни по периметру
        this.createBorderWalls();
        
        // Створюємо випадкові стіни всередині поля
        this.createRandomWalls();
        
        // Створюємо базу гравця
        this.createPlayerBase();
    }
    
    /**
     * Створення стін по периметру поля
     */
    createBorderWalls() {
        // Верхня та нижня стіни
        for (let x = 0; x < this.gridWidth; x++) {
            this.walls.push({
                x: x * this.config.TILE_SIZE,
                y: 0,
                width: this.config.TILE_SIZE,
                height: this.config.TILE_SIZE,
                type: 'border'
            });
            
            this.walls.push({
                x: x * this.config.TILE_SIZE,
                y: (this.gridHeight - 1) * this.config.TILE_SIZE,
                width: this.config.TILE_SIZE,
                height: this.config.TILE_SIZE,
                type: 'border'
            });
        }
        
        // Ліва та права стіни
        for (let y = 1; y < this.gridHeight - 1; y++) {
            this.walls.push({
                x: 0,
                y: y * this.config.TILE_SIZE,
                width: this.config.TILE_SIZE,
                height: this.config.TILE_SIZE,
                type: 'border'
            });
            
            this.walls.push({
                x: (this.gridWidth - 1) * this.config.TILE_SIZE,
                y: y * this.config.TILE_SIZE,
                width: this.config.TILE_SIZE,
                height: this.config.TILE_SIZE,
                type: 'border'
            });
        }
    }
    
    /**
     * Створення випадкових стін всередині поля
     */
    createRandomWalls() {
        const numberOfWalls = 15; // Кількість випадкових стін
        
        for (let i = 0; i < numberOfWalls; i++) {
            const x = Math.floor(Math.random() * (this.gridWidth - 2) + 1) * this.config.TILE_SIZE;
            const y = Math.floor(Math.random() * (this.gridHeight - 2) + 1) * this.config.TILE_SIZE;
            
            // Перевіряємо чи не перекриваємо базу гравця
            if (!this.isPlayerBaseArea(x, y)) {
                this.walls.push({
                    x: x,
                    y: y,
                    width: this.config.TILE_SIZE,
                    height: this.config.TILE_SIZE,
                    type: 'obstacle'
                });
            }
        }
    }
    
    /**
     * Створення бази гравця
     */
    createPlayerBase() {
        const baseX = Math.floor(this.gridWidth / 2) * this.config.TILE_SIZE;
        const baseY = (this.gridHeight - 2) * this.config.TILE_SIZE;
        
        this.walls.push({
            x: baseX,
            y: baseY,
            width: this.config.TILE_SIZE,
            height: this.config.TILE_SIZE,
            type: 'base'
        });
    }
    
    /**
     * Перевірка чи позиція знаходиться в зоні бази гравця
     */
    isPlayerBaseArea(x, y) {
        const baseX = Math.floor(this.gridWidth / 2) * this.config.TILE_SIZE;
        const baseY = (this.gridHeight - 2) * this.config.TILE_SIZE;
        
        return x === baseX && y === baseY;
    }
    
    /**
     * Оновлення ігрового поля
     * Викликається кожен кадр
     */
    update(deltaTime) {
        // Поки що нічого не оновлюємо
        // В наступних уроках тут може бути анімація
    }
    
    /**
     * Малювання ігрового поля
     */
    render() {
        // Малюємо сітку
        this.drawGrid();
        
        // Малюємо стіни
        this.drawWalls();
    }
    
    /**
     * Малювання сітки на ігровому полі
     */
    drawGrid() {
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 1;
        
        // Вертикальні лінії
        for (let x = 0; x <= this.config.CANVAS_WIDTH; x += this.config.TILE_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.CANVAS_HEIGHT);
            this.ctx.stroke();
        }
        
        // Горизонтальні лінії
        for (let y = 0; y <= this.config.CANVAS_HEIGHT; y += this.config.TILE_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.CANVAS_WIDTH, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Малювання стін
     */
    drawWalls() {
        this.walls.forEach(wall => {
            switch (wall.type) {
                case 'border':
                    this.ctx.fillStyle = '#34495e'; // Сірий колір для рамки
                    break;
                case 'obstacle':
                    this.ctx.fillStyle = '#7f8c8d'; // Темно-сірий для перешкод
                    break;
                case 'base':
                    this.ctx.fillStyle = '#27ae60'; // Зелений для бази
                    break;
                default:
                    this.ctx.fillStyle = '#95a5a6';
            }
            
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            
            // Малюємо рамку навколо стіни
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });
    }
    
    /**
     * Отримання всіх стін
     * @returns {Array} - Масив стін
     */
    getWalls() {
        return this.walls;
    }
    
    /**
     * Перевірка колізії з стінами
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {number} width - Ширина об'єкта
     * @param {number} height - Висота об'єкта
     * @returns {boolean} - true якщо є колізія
     */
    checkCollision(x, y, width, height) {
        return this.walls.some(wall => {
            return x < wall.x + wall.width &&
                   x + width > wall.x &&
                   y < wall.y + wall.height &&
                   y + height > wall.y;
        });
    }
} 