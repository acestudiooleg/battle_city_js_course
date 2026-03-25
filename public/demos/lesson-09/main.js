// main.js — Урок 9: Штаб та стан гри

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

let paused = false, gameOver = false, victory = false;
let lastTime = 0;
let gameOverY = FIELD_H, gameOverRising = false;

function gameLoop(timestamp) {
    const dt = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;

    handleMeta();

    if (!paused && !victory) {
        if (gameOver) updateGameOverAnim(dt);
        else update(dt);
    }

    render();
    requestAnimationFrame(gameLoop);
}

function handleMeta() {
    if (input.justPause()) paused = !paused;
    if (input.justRestart()) location.reload();
    input.clearFrame();
}

function update(dt) {
    field.update(dt);

    const canMove = (tank, nx, ny) => {
        if (!field.canTankMove(tank, nx, ny)) return false;
        if (collisions.tankOverlap(tank, nx, ny, [player])) return false;
        return true;
    };

    player.update(dt, canMove, Date.now(),
        () => input.getMovement(), () => input.isShoot());

    collisions.update(player, []);

    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }

    if (field.isEagleDestroyed()) triggerGameOver();
    if (player.lives <= 0 && !player.alive && !player.isRespawning) triggerGameOver();
}

function triggerGameOver() {
    if (gameOver) return;
    gameOver = true;
    gameOverRising = true;
}

function updateGameOverAnim(dt) {
    field.update(dt);
    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }
    if (gameOverRising) {
        gameOverY -= 1.5;
        if (gameOverY < FIELD_H / 2 - 20) gameOverY = FIELD_H / 2 - 20;
    }
}

function render() {
    field.render(ctx);
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) b.render(ctx, FIELD_X, FIELD_Y);
    field.renderForest(ctx);
    for (const e of explosions) e.render(ctx);
    drawSidebar();

    if (paused) drawPause();
    if (gameOver) drawGameOver();
    if (victory) drawVictory();
}

function drawPause() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = '#fcfcfc'; ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2);
}

function drawGameOver() {
    ctx.fillStyle = '#e04038'; ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GAME', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY);
    ctx.fillText('OVER', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY + 32);
}

function drawVictory() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = '#f8f858'; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ПЕРЕМОГА!', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 - 16);
    ctx.fillStyle = '#fcfcfc'; ctx.font = '14px monospace';
    ctx.fillText('Натисніть R для рестарту', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 + 16);
}

function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg; ctx.fillRect(sx, 0, 144, CANVAS_H);
    ctx.fillStyle = sidebarText; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
    ctx.fillText('УРОК 9', sx + 8, 30);
    ctx.fillText('Штаб та стан гри', sx + 8, 50);
    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);
    ctx.fillText('P     пауза', sx + 8, 118);
    ctx.fillText('R     рестарт', sx + 8, 134);
    ctx.fillStyle = '#f8f858';
    ctx.fillText('Lives: ' + player.lives, sx + 8, 168);
    ctx.fillText('Walls: ' + field.walls.length, sx + 8, 184);
    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 210);
    if (gameOver) { ctx.fillStyle = '#e04038'; ctx.fillText('GAME OVER', sx + 8, 240); }
}

requestAnimationFrame(gameLoop);
