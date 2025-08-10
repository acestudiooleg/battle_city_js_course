import { darkGray, black, red } from './colors.js';

/**
 * 🎮 Клас GameField - представляє ігрове поле
 * 
 * Відповідає за:
 * - Малювання сітки поля
 * - Фон ігрового поля
 * - Розмітку клітинок
 * - Штаб (базу)
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
        
        // Позиція штабу
        this.base = {
            x: 400, // центр поля по X
            y: 550, // внизу поля по Y
            width: 40,
            height: 40,
            isDestroyed: false
        };
        
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
        // малюємо штаб
        this.drawBase();
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

    /**
     * Малювання штабу (бази)
     */
    drawBase() {
        if (this.base.isDestroyed) return;

        // Червоний колір для штабу
        this.ctx.fillStyle = red;
        
        // Малюємо штаб як квадрат
        this.ctx.fillRect(
            this.base.x - this.base.width / 2,
            this.base.y - this.base.height / 2,
            this.base.width,
            this.base.height
        );

        // Малюємо обведення штабу
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.base.x - this.base.width / 2,
            this.base.y - this.base.height / 2,
            this.base.width,
            this.base.height
        );

        // Малюємо хрестик на штабі
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        
        // Вертикальна лінія хрестика
        this.ctx.beginPath();
        this.ctx.moveTo(this.base.x, this.base.y - 10);
        this.ctx.lineTo(this.base.x, this.base.y + 10);
        this.ctx.stroke();
        
        // Горизонтальна лінія хрестика
        this.ctx.beginPath();
        this.ctx.moveTo(this.base.x - 10, this.base.y);
        this.ctx.lineTo(this.base.x + 10, this.base.y);
        this.ctx.stroke();
    }
    
    /**
     * Отримання меж ігрового поля
     * @returns {Object} - Межі поля
     */
    getBounds() {
        return {
            minX: 0,
            minY: 0,
            maxX: this.config.CANVAS_WIDTH,
            maxY: this.config.CANVAS_HEIGHT
        };
    }

    /**
     * Отримання інформації про штаб
     * @returns {Object} - Інформація про штаб
     */
    getBase() {
        return { ...this.base };
    }

    /**
     * Знищення штабу
     */
    destroyBase() {
        this.base.isDestroyed = true;
        this.logger.gameEvent('Штаб знищений!');
    }

    /**
     * Перевірка чи штаб знищений
     * @returns {boolean} - true якщо штаб знищений
     */
    isBaseDestroyed() {
        return this.base.isDestroyed;
    }
}