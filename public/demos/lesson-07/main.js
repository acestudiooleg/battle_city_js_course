// main.js — Урок 7: Колізії

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H }
    from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }           from './Player.js';
import { InputManager }     from './InputManager.js';
import { GameField }        from './GameField.js';
import { CollisionManager } from './CollisionManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();

// Масив вибухів (поки простий — без Explosion.js)
const explosions = [];

const collisions = new CollisionManager(field, (fx, fy, type) => {
    // Простий вибух: білий кружок, що зникає
    explosions.push({ x: fx, y: fy, age: 0, duration: 300, type });
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

    // Оновлюємо вибухи
    for (const e of explosions) e.age += dt;
    explosions.splice(0, explosions.length, ...explosions.filter(e => e.age < e.duration));
}

function render() {
    field.render(ctx);
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) b.render(ctx, FIELD_X, FIELD_Y);

    // Простий вибух (білий кружок)
    for (const e of explosions) {
        const pct = 1 - e.age / e.duration;
        const r = (e.type === 'large' ? 16 : 6) * pct;
        ctx.save();
        ctx.globalAlpha = pct;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(e.x + FIELD_X, e.y + FIELD_Y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

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
    ctx.fillText('УРОК 7', sx + 8, 30);
    ctx.fillText('Колізії', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);

    ctx.fillStyle = '#f8f858';
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 136);

    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 168);
}

requestAnimationFrame(gameLoop);
