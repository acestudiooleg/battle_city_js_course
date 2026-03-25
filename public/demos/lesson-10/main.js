// main.js — Урок 10: Вороги

import {
    CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H,
    TILE, MAX_ACTIVE_ENEMIES, TOTAL_ENEMIES,
    ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_POINTS, ENEMY_QUEUE,
} from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }           from './Player.js';
import { Enemy }            from './Enemy.js';
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

const enemies = [];
const spawnQueue = [...ENEMY_QUEUE];
let spawnTimer = 0, spawnIdx = 0, killedCount = 0;
let paused = false, gameOver = false, victory = false;
let lastTime = 0, gameOverY = FIELD_H, gameOverRising = false;

function gameLoop(timestamp) {
    const dt = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;
    handleMeta();
    if (!paused && !victory) {
        if (gameOver) updateGameOverAnim(dt); else update(dt);
    }
    render();
    requestAnimationFrame(gameLoop);
}

function handleMeta() {
    if (input.justPause()) paused = !paused;
    if (input.justRestart()) location.reload();
    input.clearFrame();
}

function updateSpawn(dt) {
    if (spawnQueue.length === 0 || enemies.length >= MAX_ACTIVE_ENEMIES) return;
    spawnTimer += dt;
    if (spawnTimer < ENEMY_SPAWN_INTERVAL) return;
    spawnTimer = 0;
    const type = spawnQueue.shift();
    const sp = ENEMY_SPAWN_POINTS[spawnIdx % ENEMY_SPAWN_POINTS.length];
    spawnIdx++;
    enemies.push(new Enemy(sp.tx * TILE, sp.ty * TILE, type));
}

function update(dt) {
    field.update(dt);
    updateSpawn(dt);

    const allTanks = [player, ...enemies];
    const canMove = (tank, nx, ny) => {
        if (!field.canTankMove(tank, nx, ny)) return false;
        if (collisions.tankOverlap(tank, nx, ny, allTanks)) return false;
        return true;
    };

    player.update(dt, canMove, Date.now(), () => input.getMovement(), () => input.isShoot());
    for (const e of enemies) e.update(dt, canMove, Date.now());

    collisions.update(player, enemies);

    player.bullets = player.bullets.filter(b => b.active);
    for (const e of enemies) e.bullets = e.bullets.filter(b => b.active);

    const before = enemies.length;
    const alive = enemies.filter(e => e.alive);
    killedCount += before - alive.length;
    enemies.length = 0; enemies.push(...alive);

    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }

    if (field.isEagleDestroyed()) triggerGameOver();
    if (player.lives <= 0 && !player.alive && !player.isRespawning) triggerGameOver();
    if (killedCount >= TOTAL_ENEMIES && enemies.length === 0 && spawnQueue.length === 0) victory = true;
}

function triggerGameOver() { if (gameOver) return; gameOver = true; gameOverRising = true; }

function updateGameOverAnim(dt) {
    field.update(dt);
    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) { if (!explosions[i].isActive) explosions.splice(i, 1); }
    if (gameOverRising) { gameOverY -= 1.5; if (gameOverY < FIELD_H / 2 - 20) gameOverY = FIELD_H / 2 - 20; }
}

function render() {
    field.render(ctx);
    player.render(ctx, FIELD_X, FIELD_Y);
    for (const b of player.bullets) b.render(ctx, FIELD_X, FIELD_Y);
    for (const e of enemies) {
        e.render(ctx, FIELD_X, FIELD_Y);
        for (const b of e.bullets) b.render(ctx, FIELD_X, FIELD_Y);
    }
    field.renderForest(ctx);
    for (const e of explosions) e.render(ctx);
    drawSidebar();
    if (paused) drawPause();
    if (gameOver) drawGameOver();
    if (victory) drawVictory();
}

function drawPause() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = '#fcfcfc'; ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2);
}
function drawGameOver() {
    ctx.fillStyle = '#e04038'; ctx.font = 'bold 28px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GAME', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY);
    ctx.fillText('OVER', FIELD_X + FIELD_W / 2, FIELD_Y + gameOverY + 32);
}
function drawVictory() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = '#f8f858'; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ПЕРЕМОГА!', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 - 16);
    ctx.fillStyle = '#fcfcfc'; ctx.font = '14px monospace';
    ctx.fillText('Натисніть R для рестарту', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 + 16);
}

function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg; ctx.fillRect(sx, 0, 144, CANVAS_H);
    ctx.fillStyle = sidebarText; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
    ctx.fillText('УРОК 10', sx + 8, 30); ctx.fillText('Вороги!', sx + 8, 50);
    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86); ctx.fillText('SPACE вогонь', sx + 8, 102);
    ctx.fillText('P     пауза', sx + 8, 118); ctx.fillText('R     рестарт', sx + 8, 134);
    ctx.fillStyle = '#f8f858';
    ctx.fillText('Enemies: ' + (spawnQueue.length + enemies.length), sx + 8, 168);
    ctx.fillText('Killed: ' + killedCount, sx + 8, 184);
    ctx.fillText('Lives: ' + player.lives, sx + 8, 200);
    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 226);
    if (gameOver) { ctx.fillStyle = '#e04038'; ctx.fillText('GAME OVER', sx + 8, 256); }
    if (victory) { ctx.fillStyle = '#f8f858'; ctx.fillText('VICTORY!', sx + 8, 256); }
}

requestAnimationFrame(gameLoop);
