import { canvas, ctx, GAME_CONFIG, logger } from './main.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { GameField } from './GameField.js';
import { InputManager } from './InputManager.js';
import { CollisionManager } from './CollisionManager.js';
import { yellow, red } from './colors.js';

/**
 * 🎮 Клас Game - головний клас гри
 * 
 * Відповідає за:
 * - Ініціалізацію всіх компонентів гри
 * - Управління ігровим циклом
 * - Координацію між різними частинами гри
 */

export class Game {
    constructor(logger) {
        // Canvas елемент з HTML
        this.canvas = canvas;
        // контекст для малювання
        this.ctx = ctx;
        // конфігурація гри
        this.config = GAME_CONFIG;
        // логгер для запису подій
        this.logger = logger;
        
        // гравець (поки що не створений)
        this.player = null;
        // ворог (поки що не створений)
        this.enemy = null;
        // ігрове поле (поки що не створене)
        this.gameField = null;
        // система керування
        this.inputManager = null;
        // система колізій
        this.collisionManager = null;
        
        // чи запущена гра
        this.isRunning = false;
        // час останнього кадру
        this.lastTime = 0;
    }
    
    /**
     * Ініціалізація гри
     * Створює всі необхідні об'єкти
     */
    init() {
        // записуємо в лог
        this.logger.gameEvent('Ініціалізація гри');
        
        // створюємо нове ігрове поле
        this.gameField = new GameField(this.ctx, this.config, this.logger);
        
        // створюємо систему керування
        this.inputManager = new InputManager(this.logger);
        
        // створюємо систему колізій
        this.collisionManager = new CollisionManager(this.logger);
        
        this.player = new Player({
            // позиція X гравця
            x: 100,
            // позиція Y гравця
            y: 100,
            // жовтий колір для гравця
            color: yellow,
            // розмір танка
            size: this.config.TILE_SIZE
        }, this.logger);
        
        this.enemy = new Enemy({
            // позиція X ворога
            x: 300,
            // позиція Y ворога
            y: 200,
            // червоний колір для ворога
            color: red,
            // розмір танка
            size: this.config.TILE_SIZE
        }, this.logger);
        
        // Встановлюємо ціль для ворога
        this.enemy.setTarget(this.player);
        
        // Встановлюємо систему керування для гравця
        this.player.setInputManager(this.inputManager);
        
        // записуємо успіх в лог
        this.logger.success('Гра ініціалізована успішно!');
    }
    
    /**
     * Запуск гри
     */
    start() {
        // позначаємо гру як запущену
        this.isRunning = true;
        // запускаємо ігровий цикл
        this.gameLoop();
        // записуємо в лог
        this.logger.gameEvent('Гра запущена!');
    }
    
    /**
     * Зупинка гри
     */
    stop() {
        // позначаємо гру як зупинену
        this.isRunning = false;
        // записуємо в лог
        this.logger.gameEvent('Гра зупинена!');
    }
    
    /**
     * Пауза гри
     */
    pause() {
        // записуємо в лог
        this.logger.gameEvent('Гра на паузі!');
    }
    
    /**
     * Продовження гри
     */
    resume() {
        // записуємо в лог
        this.logger.gameEvent('Гра продовжена!');
    }
    
    /**
     * Оновлення стану гри
     * @param {number} deltaTime - Час з останнього оновлення
     */
    update(deltaTime) {
        // Перевіряємо чи гра на паузі
        if (this.inputManager.getGameState().isPaused) {
            return;
        }
        
        // оновлюємо стан поля
        this.gameField.update(deltaTime);
        
        // оновлюємо керування гравцем
        this.updatePlayerInput();
        
        // оновлюємо стан гравця
        this.player.update(deltaTime);
        
        // оновлюємо стан ворога
        this.enemy.update(deltaTime);
        
        // перевіряємо колізії
        this.collisionManager.checkAllCollisions({
            player: this.player,
            enemy: this.enemy,
            gameField: this.gameField
        });
    }
    
    /**
     * Оновлення керування гравцем
     */
    updatePlayerInput() {
        // Отримуємо напрямок руху
        const movement = this.inputManager.getMovementDirection();
        
        // Встановлюємо рух гравця
        this.player.setMovement(movement);
        
        // Перевіряємо стрільбу
        if (this.inputManager.isShootPressed()) {
            this.player.shoot();
        }
    }
    
    /**
     * Малювання гри
     */
    render() {
        // видаляємо все попереднє малювання
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // малюємо фон та сітку
        this.gameField.render();
        
        // малюємо жовтий танк гравця
        this.player.render(this.ctx);
        
        // малюємо червоний танк ворога
        this.enemy.render(this.ctx);
        
        // малюємо кулі гравця
        this.player.renderBullets(this.ctx);
        
        // малюємо кулі ворога
        this.enemy.renderBullets(this.ctx);
    }
    
    /**
     * Головний ігровий цикл
     * @param {number} currentTime - Поточний час
     */
    gameLoop(currentTime = 0) {
        // якщо гра не запущена, виходимо
        if (!this.isRunning) return;
        
        // різниця часу між кадрами
        const deltaTime = currentTime - this.lastTime;
        // зберігаємо поточний час
        this.lastTime = currentTime;
        
        // оновлюємо всі об'єкти гри
        this.update(deltaTime);
        
        // малюємо все на Canvas
        this.render();
        
        // плануємо наступний кадр
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}