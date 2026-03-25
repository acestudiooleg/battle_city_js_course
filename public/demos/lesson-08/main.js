// main.js — Урок 8: Вибухи та деструкція

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H }
    from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }           from './Player.js';
import { InputManager }     from './InputManager.js';
import { GameField }        from './GameField.js';
import { CollisionManager } from './CollisionManager.js';
import { Explosion }        from './Explosion.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();

const explosions = [];

const collisions = new CollisionManager(field, (fx, fy, type) => {
    explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
});

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
    if (dir) player.move(dir, dt, (t, nx, ny) => field.canTankMove(t, nx, ny));

    if (input.isShoot()) player.shoot(Date.now(), 'player');

    player.updateBullets();
    collisions.update(player);

    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }
}

function render() {
    field.render(ctx);
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) b.render(ctx, FIELD_X, FIELD_Y);

    for (const e of explosions) e.render(ctx);

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
    ctx.fillText('УРОК 8', sx + 8, 30);
    ctx.fillText('Вибухи!', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 136);
    ctx.fillText('Explos: ' + explosions.length, sx + 8, 152);

    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 180);
}

requestAnimationFrame(gameLoop);
