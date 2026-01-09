import { darkGray, black, red } from './colors.js';

/**
 * 🎮 Клас GameField - представляє ігрове поле
 * 
 * Відповідає за:
 * - Малювання сітки поля
 * - Фон ігрового поля
 * - Розмітку клітинок
 * - Штаб (базу)
 * - 3 типи стін з різною міцністю:
 *   - Дерево (1 HP) - легко знищується
 *   - Цегла (3 HP) - середня міцність
 *   - Бетон (10 HP) - дуже міцна
 * - Різні типи вибухів залежно від матеріалу
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
        
        // Масив стін та перешкод
        this.walls = [];
        
        // Створюємо стіни
        this.createWalls();
        
        // записуємо в лог
        this.logger.gameEvent('Ігрове поле створене з 3 типами стін та вибухів');
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
        // малюємо стіни
        this.drawWalls();
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
            // початкова точка (ліва)
            this.ctx.moveTo(0, y);
            // кінцева точка (права)
            this.ctx.lineTo(this.config.CANVAS_WIDTH, y);
            // малюємо лінію
            this.ctx.stroke();
        }
    }
    
    /**
     * Малювання штабу
     */
    drawBase() {
        if (this.base.isDestroyed) {
            // Малюємо зруйнований штаб
            this.ctx.fillStyle = '#7f8c8d';
            this.ctx.fillRect(this.base.x - this.base.width / 2, this.base.y - this.base.height / 2, this.base.width, this.base.height);
            
            // Малюємо хрест
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.base.x - this.base.width / 2, this.base.y - this.base.height / 2);
            this.ctx.lineTo(this.base.x + this.base.width / 2, this.base.y + this.base.height / 2);
            this.ctx.moveTo(this.base.x + this.base.width / 2, this.base.y - this.base.height / 2);
            this.ctx.lineTo(this.base.x - this.base.width / 2, this.base.y + this.base.height / 2);
            this.ctx.stroke();
        } else {
            // Малюємо живий штаб
            this.ctx.fillStyle = '#27ae60';
            this.ctx.fillRect(this.base.x - this.base.width / 2, this.base.y - this.base.height / 2, this.base.width, this.base.height);
            
            // Малюємо прапор
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(this.base.x - this.base.width / 2 - 5, this.base.y - this.base.height / 2 - 15, 10, 15);
        }
    }
    
    /**
     * Отримання меж поля
     */
    getBounds() {
        return {
            minX: 0,
            maxX: this.config.CANVAS_WIDTH,
            minY: 0,
            maxY: this.config.CANVAS_HEIGHT
        };
    }
    
    /**
     * Отримання штабу
     */
    getBase() {
        return this.base;
    }
    
    /**
     * Знищення штабу
     */
    destroyBase() {
        this.base.isDestroyed = true;
        this.logger.gameEvent('Штаб знищений');
    }
    
    /**
     * Перевірка чи штаб знищений
     */
    isBaseDestroyed() {
        return this.base.isDestroyed;
    }
    
    /**
     * Створення стін
     */
    createWalls() {
        // Створюємо стіни по периметру
        this.createBorderWalls();
        
        // Створюємо випадкові стіни всередині поля
        this.createRandomWalls();
    }
    
    /**
     * Створення стін по периметру поля
     */
    createBorderWalls() {
        const gridWidth = Math.floor(this.config.CANVAS_WIDTH / this.tileSize);
        const gridHeight = Math.floor(this.config.CANVAS_HEIGHT / this.tileSize);
        
        // Верхня та нижня стіни
        for (let x = 0; x < gridWidth; x++) {
            this.walls.push({
                x: x * this.tileSize,
                y: 0,
                width: this.tileSize,
                height: this.tileSize,
                type: 'border',
                material: 'concrete', // Залізобетон для рамки
                health: 10,
                maxHealth: 10
            });
            
            this.walls.push({
                x: x * this.tileSize,
                y: (gridHeight - 1) * this.tileSize,
                width: this.tileSize,
                height: this.tileSize,
                type: 'border',
                material: 'concrete', // Залізобетон для рамки
                health: 10,
                maxHealth: 10
            });
        }
        
        // Ліва та права стіни
        for (let y = 1; y < gridHeight - 1; y++) {
            this.walls.push({
                x: 0,
                y: y * this.tileSize,
                width: this.tileSize,
                height: this.tileSize,
                type: 'border',
                material: 'concrete', // Залізобетон для рамки
                health: 10,
                maxHealth: 10
            });
            
            this.walls.push({
                x: (gridWidth - 1) * this.tileSize,
                y: y * this.tileSize,
                width: this.tileSize,
                height: this.tileSize,
                type: 'border',
                material: 'concrete', // Залізобетон для рамки
                health: 10,
                maxHealth: 10
            });
        }
    }
    
    /**
     * Створення випадкових стін всередині поля
     */
    createRandomWalls() {
        const gridWidth = Math.floor(this.config.CANVAS_WIDTH / this.tileSize);
        const gridHeight = Math.floor(this.config.CANVAS_HEIGHT / this.tileSize);
        const numberOfWalls = 25; // Збільшуємо кількість стін для різноманітності
        
        for (let i = 0; i < numberOfWalls; i++) {
            const x = Math.floor(Math.random() * (gridWidth - 2) + 1) * this.tileSize;
            const y = Math.floor(Math.random() * (gridHeight - 2) + 1) * this.tileSize;
            
            // Перевіряємо чи не перекриваємо базу гравця
            if (!this.isPlayerBaseArea(x, y)) {
                // Випадковий матеріал стіни з ваговими коефіцієнтами
                const materials = this.getWeightedMaterials();
                const material = materials[Math.floor(Math.random() * materials.length)];
                
                // Встановлюємо здоров'я залежно від матеріалу
                let health, maxHealth;
                switch (material) {
                    case 'wood':
                        health = maxHealth = 1;
                        break;
                    case 'brick':
                        health = maxHealth = 3;
                        break;
                    case 'concrete':
                        health = maxHealth = 10;
                        break;
                    default:
                        health = maxHealth = 1;
                }
                
                this.walls.push({
                    x: x,
                    y: y,
                    width: this.tileSize,
                    height: this.tileSize,
                    type: 'obstacle',
                    material: material,
                    health: health,
                    maxHealth: maxHealth,
                    explosionType: this.getExplosionTypeByMaterial(material)
                });
            }
        }
    }
    
    /**
     * Отримання матеріалів з ваговими коефіцієнтами
     * Дерево - найчастіше, бетон - найрідше
     */
    getWeightedMaterials() {
        const materials = [];
        // Додаємо матеріали кілька разів для створення ваги
        for (let i = 0; i < 5; i++) materials.push('wood');      // 50% шанс
        for (let i = 0; i < 3; i++) materials.push('brick');     // 30% шанс
        for (let i = 0; i < 2; i++) materials.push('concrete'); // 20% шанс
        return materials;
    }
    
    /**
     * Отримання типу вибуху залежно від матеріалу стіни
     */
    getExplosionTypeByMaterial(material) {
        switch (material) {
            case 'wood':
                return 'medium'; // Малий вибух для дерева
            case 'brick':
                return 'medium'; // Середній вибух для цегли
            case 'concrete':
                return 'small'; // Великий вибух для бетону
            default:
                return 'small';
        }
    }
    
    /**
     * Перевірка чи позиція знаходиться в зоні бази гравця
     */
    isPlayerBaseArea(x, y) {
        const baseX = Math.floor(this.config.CANVAS_WIDTH / 2);
        const baseY = this.config.CANVAS_HEIGHT - 2 * this.tileSize;
        
        return x === baseX && y === baseY;
    }
    
    /**
     * Малювання стін
     */
    drawWalls() {
        this.walls.forEach(wall => {
            // Встановлюємо колір залежно від матеріалу та здоров'я
            const color = this.getWallColor(wall);
            this.ctx.fillStyle = color;
            
            // Малюємо стіну
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            
            // Малюємо рамку
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
            
            // Малюємо текстуру залежно від матеріалу
            this.drawWallTexture(wall);
            
            // Малюємо індикатор пошкодження для стін з більше ніж 1 здоров'ям
            if (wall.maxHealth > 1) {
                this.drawHealthIndicator(wall);
            }
        });
    }
    
    /**
     * Отримання кольору стіни залежно від матеріалу та здоров'я
     */
    getWallColor(wall) {
        const healthPercent = wall.health / wall.maxHealth;
        
        switch (wall.material) {
            case 'wood':
                return healthPercent > 0.5 ? '#8B4513' : '#654321'; // Коричневий
            case 'brick':
                if (healthPercent > 0.66) return '#CD5C5C'; // Червона цегла
                if (healthPercent > 0.33) return '#B22222'; // Темно-червона
                return '#8B0000'; // Дуже темна
            case 'concrete':
                if (healthPercent > 0.8) return '#708090'; // Світло-сірий
                if (healthPercent > 0.6) return '#696969'; // Сірий
                if (healthPercent > 0.4) return '#556B2F'; // Темно-сірий
                if (healthPercent > 0.2) return '#2F4F4F'; // Дуже темний
                return '#191970'; // Темно-синій
            default:
                return '#7f8c8d';
        }
    }
    
    /**
     * Малювання текстури стіни
     */
    drawWallTexture(wall) {
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 1;
        
        switch (wall.material) {
            case 'wood':
                // Дерев'яні кільця
                for (let i = 0; i < 3; i++) {
                    const y = wall.y + (i + 1) * (wall.height / 4);
                    this.ctx.beginPath();
                    this.ctx.moveTo(wall.x, y);
                    this.ctx.lineTo(wall.x + wall.width, y);
                    this.ctx.stroke();
                }
                break;
            case 'brick':
                // Цегляна кладка
                const brickWidth = wall.width / 4;
                const brickHeight = wall.height / 4;
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        const x = wall.x + col * brickWidth;
                        const y = wall.y + row * brickHeight;
                        this.ctx.strokeRect(x, y, brickWidth, brickHeight);
                    }
                }
                break;
            case 'concrete':
                // Бетонна текстура
                for (let i = 0; i < 6; i++) {
                    const x = wall.x + (i + 1) * (wall.width / 7);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, wall.y);
                    this.ctx.lineTo(x, wall.y + wall.height);
                    this.ctx.stroke();
                }
                break;
        }
    }
    
    /**
     * Малювання індикатора здоров'я стіни
     */
    drawHealthIndicator(wall) {
        const barWidth = wall.width - 4;
        const barHeight = 4;
        const barX = wall.x + 2;
        const barY = wall.y + wall.height - 6;
        
        // Фон індикатора
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Заповнення залежно від здоров'я
        const fillWidth = (wall.health / wall.maxHealth) * barWidth;
        this.ctx.fillStyle = this.getHealthColor(wall.health / wall.maxHealth);
        this.ctx.fillRect(barX, barY, fillWidth, barHeight);
    }
    
    /**
     * Отримання кольору індикатора здоров'я
     */
    getHealthColor(healthPercent) {
        if (healthPercent > 0.6) return '#27ae60'; // Зелений
        if (healthPercent > 0.3) return '#f39c12'; // Жовтий
        return '#e74c3c'; // Червоний
    }
    
    /**
     * Отримання масиву стін
     */
    getWalls() {
        return this.walls;
    }
    
    /**
     * Перевірка колізії з стінами
     */
    checkCollision(x, y, width, height) {
        return this.walls.some(wall => {
            return x < wall.x + wall.width &&
                   x + width > wall.x &&
                   y < wall.y + wall.height &&
                   y + height > wall.y;
        });
    }
    
    /**
     * Пошкодження стіни
     */
    damageWall(wall, damage = 1) {
        wall.health -= damage;
        
        if (wall.health <= 0) {
            // Видаляємо зруйновану стіну
            const index = this.walls.indexOf(wall);
            if (index > -1) {
                this.walls.splice(index, 1);
                this.logger.gameEvent(`Стіна зруйнована (${wall.material}) - створюється вибух типу ${wall.explosionType}`);
                return true; // Стіна зруйнована
            }
        } else {
            this.logger.gameEvent(`Стіна пошкоджена (${wall.material}): ${wall.health}/${wall.maxHealth}`);
        }
        
        return false; // Стіна не зруйнована
    }
    
    /**
     * Отримання типу вибуху для стіни
     */
    getWallExplosionType(wall) {
        return wall.explosionType || 'small';
    }
}