/**
 * 🎮 Танчики - Урок 2: Малювання поля та танків
 * 
 * У цьому файлі ми запускаємо гру з:
 * - Ігровим полем та сіткою
 * - Танком гравця (жовтий квадрат)
 * - Ворожим танком (червоний квадрат)
 * - Стінами та перешкодами
 */

// Отримуємо Canvas елемент з HTML
const canvas = document.getElementById('gameCanvas');

// Отримуємо контекст для малювання (2D)
const ctx = canvas.getContext('2d');

// Базові константи гри
const GAME_CONFIG = {
    CANVAS_WIDTH: 800, // Ширина Canvas
    CANVAS_HEIGHT: 600, // Висота Canvas
    TILE_SIZE: 32, // Розмір однієї клітинки в пікселях
    FPS: 60 // Кількість кадрів за секунду
};

// Імпортуємо класи
import { Game } from './Game.js';
import { GameLogger } from './GameLogger.js';

// Створюємо екземпляри
let game;
let logger;

/**
 * Функція ініціалізації гри
 * Викликається один раз при запуску
 */
function initGame() {
    // Ініціалізуємо логер
    logger = new GameLogger();
    
    logger.gameEvent('Ініціалізація гри "Танчики" - Урок 2');
    logger.info(`📐 Розмір Canvas: ${GAME_CONFIG.CANVAS_WIDTH} x ${GAME_CONFIG.CANVAS_HEIGHT}`);
    logger.info(`🔲 Розмір клітинки: ${GAME_CONFIG.TILE_SIZE} пікселів`);
    
    // Створюємо нову гру
    game = new Game();
    
    // Ініціалізуємо гру
    game.init();
    
    // Запускаємо гру
    game.start();
    
    logger.success('Гра запущена успішно!');
    
    // Додаємо обробники для кнопок тестування
    setupTestButtons();
}

/**
 * Налаштування кнопок тестування логування
 */
function setupTestButtons() {
    const testLogBtn = document.getElementById('testLog');
    const testPlayerBtn = document.getElementById('testPlayer');
    const testEnemyBtn = document.getElementById('testEnemy');
    
    testLogBtn.addEventListener('click', () => {
        logger.info('Тестова інформація');
        logger.success('Тестовий успіх');
        logger.warning('Тестове попередження');
        logger.error('Тестова помилка');
        logger.debug('Тестовий дебаг');
    });
    
    testPlayerBtn.addEventListener('click', () => {
        logger.playerAction('Тестова дія гравця', 'рух вгору');
        logger.playerAction('Стрільба', 'куля випущена');
        logger.collision('Гравець', 'Стіна');
        logger.scoreUpdate(100, 500);
    });
    
    testEnemyBtn.addEventListener('click', () => {
        logger.enemyAction('Тестова дія ворога', 'рух вниз');
        logger.enemyAction('Стрільба ворога', 'куля випущена');
        logger.collision('Ворог', 'Гравець');
    });
}

// Запускаємо гру після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Експортуємо основні змінні для використання в інших файлах
    export { canvas, ctx, GAME_CONFIG, logger }; 