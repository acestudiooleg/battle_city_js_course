/**
 * 🎮 Танчики - Урок 1: Налаштування середовища
 * 
 * У цьому файлі ми налаштовуємо базове середовище для гри:
 * - Отримуємо доступ до Canvas елемента
 * - Налаштовуємо контекст для малювання
 * - Створюємо базову структуру для подальшої розробки
 */

// Отримуємо Canvas елемент з HTML
/**
 * @type {HTMLCanvasElement}
 */
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

/**
 * Функція ініціалізації гри
 * Викликається один раз при запуску
 */
function initGame() {
    console.log('🎮 Гра "Танчики" ініціалізована!');
    console.log('📐 Розмір Canvas:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
    console.log('🔲 Розмір клітинки:', GAME_CONFIG.TILE_SIZE, 'пікселів');
    
    // Малюємо привітання на Canvas
    drawWelcomeMessage();
}

/**
 * Функція для малювання привітання
 * Показує, що Canvas працює правильно
 */
function drawWelcomeMessage() {
    // Очищаємо Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Налаштовуємо стиль тексту
    ctx.fillStyle = '#3498db'; // Синій колір
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    // Малюємо заголовок
    ctx.fillText('ТАНЧИКИ', canvas.width / 2, canvas.height / 2 - 50);
    
    // Малюємо підзаголовок
    ctx.fillStyle = '#ecf0f1'; // Світло-сірий колір
    ctx.font = '24px Arial';
    ctx.fillText('Урок 1: Налаштування середовища', canvas.width / 2, canvas.height / 2);
    
    // Малюємо інструкцію
    ctx.fillStyle = '#95a5a6'; // Темно-сірий колір
    ctx.font = '18px Arial';
    ctx.fillText('Canvas готовий для розробки!', canvas.width / 2, canvas.height / 2 + 50);
    
    // Малюємо простий квадрат для демонстрації
    ctx.fillStyle = '#e74c3c'; // Червоний колір
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 + 80, 50, 50);
    
    // Малюємо рамку навколо квадрата
    ctx.strokeStyle = '#f39c12'; // Помаранчевий колір
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 25, canvas.height / 2 + 80, 50, 50);
}

/**
 * Головний ігровий цикл
 * Ця функція буде викликатися багато разів для оновлення гри
 */
function gameLoop() {
    // Поки що просто викликаємо requestAnimationFrame
    // В наступних уроках тут буде логіка гри
    requestAnimationFrame(gameLoop);
}

// Запускаємо гру після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Сторінка завантажена, запускаємо гру...');
    initGame();
    gameLoop();
});

// Експортуємо основні змінні для використання в інших файлах
export { canvas, ctx, GAME_CONFIG }; 