/**
 * 🎮 Танчики - Урок 1: Налаштування середовища
 * 
 * У цьому файлі ми налаштовуємо базове середовище для гри:
 * - Отримуємо доступ до Canvas елемента
 * - Налаштовуємо контекст для малювання
 * - Створюємо базову структуру для подальшої розробки
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

function initGame() {
    console.log('🎮 Гра "Танчики" ініціалізована!');
    console.log('📐 Розмір Canvas:', GAME_CONFIG.CANVAS_WIDTH, 'x', GAME_CONFIG.CANVAS_HEIGHT);
    console.log('🔲 Розмір клітинки:', GAME_CONFIG.TILE_SIZE, 'пікселів');
    
    // Малюємо привітання на Canvas
    drawTitleScreen();
}

// Battle City (Namco) NES palette
const black = '#000000';
const white = '#fcfcfc';
const gray = '#a4a7a7';
const darkGray = '#545454';
const red = '#e04038';
const orange = '#f8b800';
const yellow = '#f8f858';
const green = '#38a038';
const darkGreen = '#005c00';
const blue = '#3858d8';
const brown = '#a86c30';
const brick = '#bd4400';
const steel = '#a4a7a7';
const water = '#4f00ff';
const forest = '#38a038';
const ice = '#fcfcfc';


function drawTitleScreen() {
    // Очищаємо Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Встановлюємо чорний фон
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Малюємо інформацію про гравця (I- 00 HI- 20000)
    ctx.fillStyle = white;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('I- 00 HI- 20000', 20, 30);
    
    // Малюємо заголовок BATTLE CITY
    ctx.fillStyle = brick;
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    
    // Малюємо BATTLE
    ctx.fillText('BATTLE', canvas.width / 2, canvas.height / 2 - 80);
    // Малюємо CITY
    ctx.fillText('CITY', canvas.width / 2, canvas.height / 2 - 20);
    
    // Малюємо опції меню
    ctx.fillStyle = white;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    
    // Малюємо танк-іконку перед "1 PLAYER"
    ctx.fillStyle = yellow;
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 20, 16, 12);
    ctx.fillStyle = yellow;
    ctx.fillRect(canvas.width / 2 - 116, canvas.height / 2 + 16, 8, 4);
    
    // Малюємо текст меню
    ctx.fillStyle = white;
    ctx.fillText('1 PLAYER', canvas.width / 2, canvas.height / 2 + 35);
    ctx.fillText('2 PLAYERS', canvas.width / 2, canvas.height / 2 + 65);
    ctx.fillText('CONSTRUCTION', canvas.width / 2, canvas.height / 2 + 95);
    
    // Малюємо логотип namcoT
    ctx.fillStyle = brown;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('namcoT', canvas.width / 2, canvas.height / 2 + 150);
    
    // Малюємо копірайт
    ctx.fillStyle = white;
    ctx.font = '12px monospace';
    ctx.fillText('© 1980 1985 NAMCO LTD.', canvas.width / 2, canvas.height - 40);
    ctx.fillText('ALL RIGHTS RESERVED', canvas.width / 2, canvas.height - 25);
}

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