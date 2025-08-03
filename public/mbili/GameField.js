import { darkGray, black } from './colors.js';

/**
 * 🎮 Клас GameField - представляє ігрове поле
 * 
 * Відповідає за:
 * - Малювання сітки поля
 * - Фон ігрового поля
 * - Розмітку клітинок
 */

export class GameField {
    constructor(ctx, config, logger) {
        // контекст для малювання
        this.ctx = ctx;
        // конфігурація гри
        this.config = config;
        // розмір клітинки
        this.tileSize = config.TILE_SIZE;
        // логгер для запису подій
        this.logger = logger;
        
        // записуємо в лог
        this.logger.gameEvent('Ігрове поле створене');
    }
    
    /**
     * Оновлення ігрового поля
     * @param {number} deltaTime - Час з останнього оновлення
     */
    update(deltaTime) {
        // Поки що нічого не оновлюємо
        // В майбутньому тут може бути анімація фону
    }
    
    /**
     * Малювання ігрового поля
     */
    render() {
        // малюємо фон поля
        this.drawBackground();
        // малюємо сітку поля
        this.drawGrid();
    }
    
    /**
     * Малювання фону поля
     */
    drawBackground() {
        // Малюємо темно-зелений фон
        // темно-зелений колір для фону
        this.ctx.fillStyle = black;
        // заповнюємо весь Canvas
        this.ctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    }
    
    /**
     * Малювання сітки поля
     */
    drawGrid() {
        // світло-зелений колір для ліній сітки
        this.ctx.strokeStyle = darkGray;
        // товщина ліній сітки
        this.ctx.lineWidth = 1;
        
        // проходимо по всій ширині з кроком tileSize
        for (let x = 0; x <= this.config.CANVAS_WIDTH; x += this.tileSize) {
            // починаємо малювати шлях
            this.ctx.beginPath();
            // початкова точка (верх)
            this.ctx.moveTo(x, 0);
            // кінцева точка (низ)
            this.ctx.lineTo(x, this.config.CANVAS_HEIGHT);
            // малюємо лінію
            this.ctx.stroke();
        }
        
        // проходимо по всій висоті з кроком tileSize
        for (let y = 0; y <= this.config.CANVAS_HEIGHT; y += this.tileSize) {
            // починаємо малювати шлях
            this.ctx.beginPath();
            // початкова точка (ліво)
            this.ctx.moveTo(0, y);
            // кінцева точка (право)
            this.ctx.lineTo(this.config.CANVAS_WIDTH, y);
            // малюємо лінію
            this.ctx.stroke();
        }
    }
}