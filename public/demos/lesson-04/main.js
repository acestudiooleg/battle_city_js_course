// main.js — Урок 4: Рух танка

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE }
    from './constants.js';
import { black, borderBg, sidebarBg, sidebarText, white }
    from './colors.js';
import { Player }       from './Player.js';
import { InputManager } from './InputManager.js';

// ─── Ініціалізація ─────────────────────────────────────────────

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();

let lastTime = 0;

// ─── Ігровий цикл ──────────────────────────────────────────────

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    const safeDt = Math.min(dt, 50);

    update(safeDt);
    render();

    requestAnimationFrame(gameLoop);
}

// ─── Оновлення стану ────────────────────────────────────────────

function update(dt) {
    const dir = input.getMovement();

    if (dir) {
        player.move(dir, dt, () => true);
    }
}

// ─── Малювання ──────────────────────────────────────────────────

function render() {
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
        ctx.beginPath(); ctx.moveTo(x, FIELD_Y); ctx.lineTo(x, FIELD_Y + FIELD_H); ctx.stroke();
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
    ctx.fillText('УРОК 4', sx + 8, 30);
    ctx.fillText('Рух танка', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD', sx + 8, 86);
    ctx.fillText('для руху', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('X: ' + Math.round(player.x), sx + 8, 136);
    ctx.fillText('Y: ' + Math.round(player.y), sx + 8, 152);
    ctx.fillText('Dir: ' + player.direction, sx + 8, 168);
}

// ─── Запуск ─────────────────────────────────────────────────────

requestAnimationFrame(gameLoop);
