/**
 * 🎮 Головний файл гри - Танчики
 * 
 * Урок 3: Рух та стрільба
 * 
 * Відповідає за:
 * - Ініціалізацію всіх компонентів гри
 * - Запуск ігрового циклу
 * - Управління станом гри
 */

// Отримуємо Canvas та контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Конфігурація гри
const GAME_CONFIG = {
    // Розміри Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Розмір тайла
    TILE_SIZE: 32,
    
    // Налаштування гри
    GAME_SPEED: 60, // FPS
    DEBUG_MODE: false
};

// Імпортуємо всі необхідні класи
import { Game } from './Game.js';
import { GameLogger } from './GameLogger.js';
import { InputManager } from './InputManager.js';

// Глобальні змінні
let game;
let logger;
let inputManager;

/**
 * Ініціалізація гри
 */
function initGame() {
    console.log('🎮 Ініціалізація гри...');
    
    // Створюємо логер
    logger = new GameLogger();
    
    // Створюємо систему керування
    inputManager = new InputManager(logger);

    
    // Створюємо гру
    game = new Game(logger);


    game.init();
    
    // Підключаємо систему керування до гравця
    game.player.setInputManager(inputManager);
    
    // Встановлюємо межі руху (методи з базового класу Tank)
    game.player.setBounds({
        maxX: GAME_CONFIG.CANVAS_WIDTH,
        maxY: GAME_CONFIG.CANVAS_HEIGHT
    });
    
    game.enemy.setBounds({
        maxX: GAME_CONFIG.CANVAS_WIDTH,
        maxY: GAME_CONFIG.CANVAS_HEIGHT
    });
    
    
    // Налаштовуємо стрільбу
    game.player.setShootCooldown(500); // 500мс між пострілами
    game.enemy.setShootCooldown(2000); // 2 секунди між пострілами
    
    // Налаштовуємо пошкодження (методи з базового класу Tank)
    
    // Прослуховуємо події гри
    setupGameEvents();
    
    // Запускаємо гру
    game.start();
    
    logger.info('🎮 Гра успішно ініціалізована!');
    logger.info('⌨️ Керування: WASD для руху, Пробіл для стрільби, P для паузи');
}

/**
 * Налаштування подій гри
 */
function setupGameEvents() {
    // Подія паузи
    document.addEventListener('gamePause', (event) => {
        if (event.detail.isPaused) {
            game.pause();
            logger.warning('⏸️ Гра призупинена');
        } else {
            game.resume();
            logger.info('▶️ Гра відновлена');
        }
    });
    
    // Подія перезапуску
    document.addEventListener('gameRestart', () => {
        restartGame();
    });
    
    // Подія налагодження
    document.addEventListener('gameDebug', () => {
        toggleDebugMode();
    });
    
    // Подія завершення гри
    document.addEventListener('gameOver', (event) => {
        handleGameOver(event.detail);
    });
}

/**
 * Перезапуск гри
 */
function restartGame() {
    logger.info('🔄 Перезапуск гри...');
    
    // Зупиняємо поточну гру
    if (game) {
        game.stop();
    }
    
    // Очищаємо лог
    logger.clear();
    
    // Перезапускаємо гру
    setTimeout(() => {
        initGame();
    }, 100);
}

/**
 * Перемикання режиму налагодження
 */
function toggleDebugMode() {
    GAME_CONFIG.DEBUG_MODE = !GAME_CONFIG.DEBUG_MODE;
    
    if (GAME_CONFIG.DEBUG_MODE) {
        logger.warning('🐛 Режим налагодження увімкнено');
    } else {
        logger.info('🐛 Режим налагодження вимкнено');
    }
}





/**
 * Обробка завершення гри
 * @param {Object} gameOverData - Дані про завершення гри
 */
function handleGameOver(gameOverData) {
    const { winner, reason } = gameOverData;
    
    logger.warning(`🏁 Гра завершена! ${reason}`);
    
    if (winner === 'player') {
        logger.success('🎉 Гравець переміг!');
    } else if (winner === 'enemy') {
        logger.error('💀 Ворог переміг!');
    }
}



/**
 * Функція очищення логу
 */
function clearLog() {
    if (logger) {
        logger.clear();
    }
}

/**
 * Отримання статистики гри
 * @returns {Object} - Статистика
 */
function getGameStats() {
    if (!game) return null;
    
    return {
        player: {
            health: game.player.getHealth(),
            maxHealth: game.player.getMaxHealth(),
            bullets: game.player.getBullets().length,
            position: { x: game.player.x, y: game.player.y }
        },
        enemy: {
            health: game.enemy.getHealth(),
            maxHealth: game.enemy.getMaxHealth(),
            bullets: game.enemy.getBullets().length,
            position: { x: game.enemy.x, y: game.enemy.y },
            aiState: game.enemy.getAIState()
        },
        collisions: game.getCollisionStats(),
        gameTime: game.getGameTime()
    };
}

// Експортуємо глобальні змінні для використання в інших модулях
export { canvas, ctx, GAME_CONFIG, logger };

// Функція очищення логу (глобальна)
window.clearLog = clearLog;

// Функція отримання статистики (глобальна)
window.getGameStats = getGameStats;



// Запускаємо гру після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Запуск гри Танчики - Урок 3');
    initGame();
});

// Обробка помилок
window.addEventListener('error', (event) => {
    console.error('❌ Помилка гри:', event.error);
    if (logger) {
        logger.error(`Помилка: ${event.error.message}`);
    }
});

// Обробка завершення роботи сторінки
window.addEventListener('beforeunload', () => {
    if (game) {
        game.stop();
    }
    console.log('👋 Гра завершена');
});