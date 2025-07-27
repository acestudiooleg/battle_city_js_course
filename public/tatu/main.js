/**
 * 🎮 Танчики - Урок 3: Рух та стрільба
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
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 32, // Розмір однієї клітинки в пікселях
    FPS: 60 // Кількість кадрів за секунду
};

// Імпортуємо клас гри
import { Game } from './Game.js';

// Створюємо екземпляр гри
let game;

/**
 * Функція ініціалізації гри
 * Викликається один раз при запуску
 */
function initGame() {
    console.log('🎮 Ініціалізація гри "Танчики" - Урок 3...');
    console.log('📐 Розмір Canvas:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
    console.log('🔲 Розмір клітинки:', GAME_CONFIG.TILE_SIZE, 'пікселів');
    
    // Створюємо нову гру
    game = new Game();
    
    // Ініціалізуємо гру
    game.init();
    
    // Запускаємо гру
    game.start();
    
    console.log('✅ Гра запущена успішно!');
}

// Запускаємо гру після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Сторінка завантажена, запускаємо гру...');
    initGame();
});

// Експортуємо основні змінні для використання в інших файлах
export { canvas, ctx, GAME_CONFIG }; 