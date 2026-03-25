// main.js — Урок 3: Малюємо танк

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE } from './constants.js';
import { black, borderBg, sidebarBg, sidebarText, white } from './colors.js';
import { Player } from './Player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dirs = ['up', 'right', 'down', 'left'];
let dirIndex = 0;

const player = new Player();

document.addEventListener('keydown', () => {
    dirIndex = (dirIndex + 1) % dirs.length;
    player.direction = dirs[dirIndex];
    draw();
});

function draw() {
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = black;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    drawGrid();
    player.render(ctx, FIELD_X, FIELD_Y);
    drawSidebar();
}

function drawGrid() {
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= 26; c++) {
        const x = FIELD_X + c * TILE;
        ctx.beginPath(); ctx.moveTo(x, FIELD_Y); ctx.lineTo(x, FIELD_Y + FIELD_W); ctx.stroke();
    }
    for (let r = 0; r <= 26; r++) {
        const y = FIELD_Y + r * TILE;
        ctx.beginPath(); ctx.moveTo(FIELD_X, y); ctx.lineTo(FIELD_X + FIELD_W, y); ctx.stroke();
    }
}

function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 3', sx + 8, 30);
    ctx.fillText('Малюємо', sx + 8, 50);
    ctx.fillText('танк!', sx + 8, 66);

    ctx.font = '11px monospace';
    ctx.fillText('Напрямок:', sx + 8, 100);
    ctx.fillStyle = '#f8f858';
    ctx.fillText(player.direction.toUpperCase(), sx + 8, 116);

    ctx.fillStyle = white;
    ctx.font = '10px monospace';
    ctx.fillText('Натисни', sx + 8, 150);
    ctx.fillText('будь-яку', sx + 8, 164);
    ctx.fillText('клавішу!', sx + 8, 178);
}

draw();
