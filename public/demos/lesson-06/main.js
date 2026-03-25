// main.js — Урок 6: Ігрове поле

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H, TILE }
    from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }       from './Player.js';
import { InputManager } from './InputManager.js';
import { GameField }    from './GameField.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();

let lastTime = 0;

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    const safeDt = Math.min(dt, 50);
    update(safeDt);
    render();
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    field.update(dt);

    const dir = input.getMovement();
    if (dir) {
        player.move(dir, dt, () => true); // колізії будуть в уроці 7
    }

    if (input.isShoot()) {
        player.shoot(Date.now(), 'player');
    }

    player.updateBullets();
}

function render() {
    field.render(ctx);
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) b.render(ctx, FIELD_X, FIELD_Y);
    field.renderForest(ctx);
    drawSidebar();
}

function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, 144, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('УРОК 6', sx + 8, 30);
    ctx.fillText('Ігрове поле', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 136);
    ctx.fillText('Water: ' + field.water.length, sx + 8, 152);
    ctx.fillText('Forest: ' + field.forest.length, sx + 8, 168);
}

requestAnimationFrame(gameLoop);
