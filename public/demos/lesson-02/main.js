// === Урок 2: Canvas та координати NES ===

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H,
         BORDER, SIDEBAR_W, TILE, TANK_SIZE } from './constants.js';
import { black, borderBg, sidebarBg, sidebarText, white,
         brickFull, forestCol, waterCol, playerYellow, concreteCol } from './colors.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function draw() {
    // 1. Заливаємо ВСЕ сірим — це рамка
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Малюємо чорне ігрове поле поверх
    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    // 3. Сітка тайлів (для наочності)
    drawGrid();

    // 4. Приклади тайлів на різних позиціях
    drawExamples();

    // 5. Sidebar текст
    const sidebarX = FIELD_X + FIELD_W + BORDER;
    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('FIELD:', sidebarX + 8, 40);
    ctx.fillText(FIELD_W + 'x' + FIELD_H, sidebarX + 8, 56);
    ctx.fillText('TILE: ' + TILE + 'px', sidebarX + 8, 80);
    ctx.fillText('GRID: 26x26', sidebarX + 8, 96);

    // Легенда кольорів
    const legendY = 130;
    const items = [
        { color: brickFull, label: 'BRICK' },
        { color: concreteCol, label: 'CONCRETE' },
        { color: waterCol, label: 'WATER' },
        { color: forestCol, label: 'FOREST' },
        { color: playerYellow, label: 'PLAYER' },
    ];
    items.forEach((item, i) => {
        const y = legendY + i * 24;
        ctx.fillStyle = item.color;
        ctx.fillRect(sidebarX + 8, y, 12, 12);
        ctx.fillStyle = sidebarText;
        ctx.fillText(item.label, sidebarX + 26, y + 11);
    });
}

function drawGrid() {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;

    for (let col = 0; col <= 26; col++) {
        const x = FIELD_X + col * TILE;
        ctx.beginPath();
        ctx.moveTo(x, FIELD_Y);
        ctx.lineTo(x, FIELD_Y + FIELD_H);
        ctx.stroke();
    }
    for (let row = 0; row <= 26; row++) {
        const y = FIELD_Y + row * TILE;
        ctx.beginPath();
        ctx.moveTo(FIELD_X, y);
        ctx.lineTo(FIELD_X + FIELD_W, y);
        ctx.stroke();
    }
}

function drawExamples() {
    // Цегла: кілька блоків
    ctx.fillStyle = brickFull;
    for (let i = 2; i < 8; i++) {
        ctx.fillRect(FIELD_X + i * TILE, FIELD_Y + 4 * TILE, TILE, TILE);
        ctx.fillRect(FIELD_X + i * TILE, FIELD_Y + 5 * TILE, TILE, TILE);
    }

    // Бетон
    ctx.fillStyle = concreteCol;
    ctx.fillRect(FIELD_X + 10 * TILE, FIELD_Y + 4 * TILE, TILE * 2, TILE * 2);

    // Вода
    ctx.fillStyle = waterCol;
    ctx.fillRect(FIELD_X + 14 * TILE, FIELD_Y + 4 * TILE, TILE * 4, TILE * 2);

    // Ліс
    ctx.fillStyle = forestCol;
    ctx.fillRect(FIELD_X + 20 * TILE, FIELD_Y + 4 * TILE, TILE * 4, TILE * 2);

    // Танк гравця (2×2 тайли) на позиції spawn
    ctx.fillStyle = playerYellow;
    ctx.fillRect(FIELD_X + 8 * TILE, FIELD_Y + 24 * TILE, TANK_SIZE, TANK_SIZE);

    // Підписи координат
    ctx.fillStyle = white;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('tx:2-7, ty:4', FIELD_X + 5 * TILE, FIELD_Y + 3.5 * TILE);
    ctx.fillText('BRICK', FIELD_X + 5 * TILE, FIELD_Y + 7 * TILE);

    ctx.fillText('tx:10', FIELD_X + 11 * TILE, FIELD_Y + 3.5 * TILE);
    ctx.fillText('CONCRETE', FIELD_X + 11 * TILE, FIELD_Y + 7 * TILE);

    ctx.fillText('tx:14-17', FIELD_X + 16 * TILE, FIELD_Y + 3.5 * TILE);
    ctx.fillText('WATER', FIELD_X + 16 * TILE, FIELD_Y + 7 * TILE);

    ctx.fillText('tx:20-23', FIELD_X + 22 * TILE, FIELD_Y + 3.5 * TILE);
    ctx.fillText('FOREST', FIELD_X + 22 * TILE, FIELD_Y + 7 * TILE);

    ctx.fillText('PLAYER', FIELD_X + 9 * TILE, FIELD_Y + 23.5 * TILE);
    ctx.fillText('tx:8 ty:24', FIELD_X + 9 * TILE, FIELD_Y + 27 * TILE);
}

draw();

console.log('📐 Canvas:', CANVAS_W, '×', CANVAS_H);
console.log('🎮 Ігрове поле:', FIELD_W, '×', FIELD_H, '(' + 26 + '×' + 26 + ' тайлів)');
console.log('🔲 Тайл:', TILE, 'px | Танк:', TANK_SIZE, 'px');
