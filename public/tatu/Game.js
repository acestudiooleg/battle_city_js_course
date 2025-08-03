import { yellow, red } from './colors.js';

/**
 * 🎮 Клас Game - головний клас гри з підтримкою руху та стрільби
 * 
 * Відповідає за:
 * - Ініціалізацію всіх компонентів гри
 * - Управління ігровим циклом
 * - Координацію між різними частинами гри
 */

import { canvas, ctx, GAME_CONFIG } from './main.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { GameField } from './GameField.js';
import { InputManager } from './InputManager.js';

export class Game {
    constructor() {
        this.canvas = canvas;
        this.ctx = ctx;
        this.config = GAME_CONFIG;
        
        // Ігрові об'єкти
        this.player = null;
        this.enemy = null;
        this.gameField = null;
        this.inputManager = new InputManager();
        
        // Стан гри
        this.isRunning = false;
        this.lastTime = 0;
    }
    
    /**
     * Ініціалізація гри
     * Створює всі необхідні об'єкти
     */
    init() {
        console.log('🎮 Ініціалізація гри...');
        
        // Створюємо ігрове поле
        this.gameField = new GameField(this.ctx, this.config);
        
        // Створюємо гравця (жовтий танк)
        this.player = new Player({
            x: 100,
            y: 100,
            color: yellow, // Жовтий колір
            size: this.config.TILE_SIZE
        });
        
        // Створюємо ворога (червоний танк)
        this.enemy = new Enemy({
            x: 300,
            y: 200,
            color: red, // Червоний колір
            size: this.config.TILE_SIZE
        });
        
        console.log('✅ Гра ініціалізована успішно!');
    }
    
    /**
     * Запуск гри
     */
    start() {
        this.isRunning = true;
        this.gameLoop();
        console.log('🚀 Гра запущена!');
    }
    
    /**
     * Зупинка гри
     */
    stop() {
        this.isRunning = false;
        console.log('⏹️ Гра зупинена!');
    }
    
    /**
     * Оновлення стану гри
     * Викликається кожен кадр
     */
    update(deltaTime) {
        // Оновлюємо ігрове поле
        this.gameField.update(deltaTime);
        
        // Оновлюємо гравця
        this.player.update(deltaTime, this.inputManager, this.gameField);
        
        // Оновлюємо ворога
        this.enemy.update(deltaTime);
    }
    
    /**
     * Малювання гри
     * Викликається кожен кадр
     */
    render() {
        // Очищаємо Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Малюємо ігрове поле
        this.gameField.render();
        
        // Малюємо гравця
        this.player.render(this.ctx);
        
        // Малюємо ворога
        this.enemy.render(this.ctx);
    }
    
    /**
     * Головний ігровий цикл
     * Викликається багато разів для плавної анімації
     */
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Обчислюємо час між кадрами
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Оновлюємо гру
        this.update(deltaTime);
        
        // Малюємо гру
        this.render();
        
        // Запитуємо наступний кадр
        requestAnimationFrame((time) => this.gameLoop(time));
    }
} 