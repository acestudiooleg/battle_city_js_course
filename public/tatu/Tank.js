import { white, darkGray } from './colors.js';

/**
 * 🎮 Клас Tank - базовий клас для всіх танків
 * 
 * Відповідає за:
 * - Базову логіку танка (як правила гри!)
 * - Малювання танка
 * - Фізику руху (як рухається танчик!)
 */

export class Tank {
    constructor(options = {}, logger) {
        // Позиція танка на полі (як координати на карті!)
        // координата X (за замовчуванням 0)
        this.x = options.x || 0;
        // координата Y (за замовчуванням 0)
        this.y = options.y || 0;
        
        // Розміри танка
        // ширина танка в пікселях
        this.width = options.size || 32;
        // висота танка в пікселях
        this.height = options.size || 32;
        
        // Властивості танка (що вміє танчик)
        // колір танка (за замовчуванням білий)
        this.color = options.color || white;
        // швидкість руху танка
        this.speed = options.speed || 1;
        // напрямок дула танка (куди дивиться дуло!)
        this.direction = options.direction || 'up';
        
        // Стан танка
        // чи живий танк
        this.isAlive = true;
        // здоров'я танка (від 0 до 100, як здоров'я людини!)
        this.health = 100;
        
        // Межі руху (розміри Canvas) - спільна властивість
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: 800,
            maxY: 600,
        };
        
        // Логгер для запису подій
        this.logger = logger;
    }
    
    /**
     * Оновлення стану танка
     * @param {number} deltaTime - Час з останнього оновлення
     */
    update(deltaTime) {
        // Базова логіка оновлення (поки що порожня)
        // В наступних уроках тут буде логіка руху та стрільби
    }
    
    /**
     * Малювання танка
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    render(ctx) {
        // якщо танк мертвий, не малюємо його
        if (!this.isAlive) return;
        
        // зберігаємо поточний стан контексту
        ctx.save();
        
        // Малюємо тіло танка
        // встановлюємо колір танка
        ctx.fillStyle = this.color;
        // малюємо прямокутник
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Малюємо дуло танка
        // викликаємо функцію малювання дула
        this.drawBarrel(ctx);
        
        // Викликаємо метод для малювання специфічних позначок
        this.drawTankMark(ctx);
        
        // відновлюємо стан контексту
        ctx.restore();
    }
    
    /**
     * Малювання дула танка
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    drawBarrel(ctx) {
        // довжина дула (60% від ширини танка - як довга труба!)
        const barrelLength = this.width * 0.6;
        // ширина дула (20% від ширини танка - як тонка труба!)
        const barrelWidth = this.width * 0.2;
        
        // темно-синій колір для дула (як колір металу!)
        ctx.fillStyle = darkGray;
        
        // перевіряємо напрямок дула (куди дивиться труба!)
        switch (this.direction) {
            // якщо дуло дивиться вгору (як труба дивиться в небо!)
            case 'up':
                ctx.fillRect(
                    // центруємо дуло по X (розміщуємо по центру!)
                    this.x + this.width / 2 - barrelWidth / 2,
                    // розміщуємо дуло вище танка (над танком!)
                    this.y - barrelLength,
                    // ширина дула
                    barrelWidth,
                    // довжина дула
                    barrelLength
                );
                break;
            // якщо дуло дивиться вниз (як труба дивиться в землю!)
            case 'down':
                ctx.fillRect(
                    // центруємо дуло по X (розміщуємо по центру!)
                    this.x + this.width / 2 - barrelWidth / 2,
                    // розміщуємо дуло нижче танка (під танком!)
                    this.y + this.height,
                    // ширина дула
                    barrelWidth,
                    // довжина дула
                    barrelLength
                );
                break;
            // якщо дуло дивиться вліво (як труба дивиться вліво!)
            case 'left':
                ctx.fillRect(
                    // розміщуємо дуло лівіше танка (зліва від танком!)
                    this.x - barrelLength,
                    // центруємо дуло по Y (розміщуємо по центру!)
                    this.y + this.height / 2 - barrelWidth / 2,
                    // довжина дула
                    barrelLength,
                    // ширина дула
                    barrelWidth
                );
                break;
            // якщо дуло дивиться вправо (як труба дивиться вправо!)
            case 'right':
                ctx.fillRect(
                    // розміщуємо дуло правіше танка (справа від танка!)
                    this.x + this.width,
                    // центруємо дуло по Y (розміщуємо по центру!)
                    this.y + this.height / 2 - barrelWidth / 2,
                    // довжина дула
                    barrelLength,
                    // ширина дула
                    barrelWidth
                );
                break;
        }
    }
    
    /**
     * Малювання специфічної позначки танка (перевизначається в дочірніх класах)
     * @param {CanvasRenderingContext2D} ctx - Контекст для малювання
     */
    drawTankMark(ctx) {
        // Базовий метод - порожній, перевизначається в дочірніх класах
    }
    
    /**
     * Встановлення меж руху
     * @param {Object} bounds - Межі руху
     */
    setBounds(bounds) {
        this.bounds = { ...this.bounds, ...bounds };
    }
    
    /**
     * Перевірка меж руху
     * @param {number} newX - Нова X координата
     * @param {number} newY - Нова Y координата
     * @returns {boolean} - true якщо позиція в межах
     */
    checkBounds(newX, newY) {
        return (
            newX >= this.bounds.minX &&
            newX + this.width <= this.bounds.maxX &&
            newY >= this.bounds.minY &&
            newY + this.height <= this.bounds.maxY
        );
    }
    
    /**
     * Отримання позиції для стрільби
     * @returns {Object} - Позиція кулі
     */
    getShootPosition() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Розраховуємо позицію кулі залежно від напрямку
        switch (this.direction) {
            case 'up':
                return { x: centerX - 2, y: this.y - 4 };
            case 'down':
                return { x: centerX - 2, y: this.y + this.height };
            case 'left':
                return { x: this.x - 4, y: centerY - 2 };
            case 'right':
                return { x: this.x + this.width, y: centerY - 2 };
            default:
                return { x: centerX - 2, y: this.y - 4 };
        }
    }
    
    /**
     * Перевірка чи танк живий
     * @returns {boolean} - true якщо танк живий
     */
    isTankAlive() {
        // танк живий якщо isAlive=true і здоров'я > 0
        return this.isAlive && this.health > 0;
    }
    
    /**
     * Знищити танк
     */
    kill() {
        // позначаємо танк як мертвий
        this.isAlive = false;
        // встановлюємо здоров'я в 0
        this.health = 0;
    }
    
    /**
     * Відродити танк
     */
    respawn() {
        // позначаємо танк як живий
        this.isAlive = true;
        // відновлюємо повне здоров'я
        this.health = 100;
    }
}