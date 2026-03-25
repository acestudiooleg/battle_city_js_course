// main.js — Урок 12: Звуки та NES Sidebar

import {
    CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H,
    TILE, BORDER, SIDEBAR_W,
    MAX_ACTIVE_ENEMIES, TOTAL_ENEMIES,
    ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_POINTS, ENEMY_QUEUE,
} from './constants.js';
import { sidebarBg, enemyBasicColor } from './colors.js';
import { Player }           from './Player.js';
import { Enemy }            from './Enemy.js';
import { InputManager }     from './InputManager.js';
import { GameField }        from './GameField.js';
import { CollisionManager } from './CollisionManager.js';
import { Explosion }        from './Explosion.js';
import { SoundManager }     from './SoundManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const input  = new InputManager();
const player = new Player();
const field  = new GameField();
const sound  = new SoundManager();
const explosions = [];

const collisions = new CollisionManager(field, (fx, fy, type) => {
    explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
    sound.play(type === 'large' ? 'explodeL' : 'explodeS', 0.5);
});

const enemies = [];
const spawnQueue = [...ENEMY_QUEUE];
let spawnTimer = 0, spawnIdx = 0, killedCount = 0;
let paused = false, gameOver = false, victory = false;
let lastTime = 0, gameOverY = FIELD_H, gameOverRising = false;

// Інтро музика
sound.play('intro', 0.5);

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
    for (let i = explosions.length - 1; i >= 0; i--) { if (!explosions[i].isActive) explosions.splice(i, 1); }

    // Звук двигуна
    const isMoving = player.alive && !player.isRespawning && input.getMovement() !== null;
    sound.setEngineSound(isMoving);

    if (field.isEagleDestroyed()) triggerGameOver();
    if (player.lives <= 0 && !player.alive && !player.isRespawning) triggerGameOver();
    if (killedCount >= TOTAL_ENEMIES && enemies.length === 0 && spawnQueue.length === 0) victory = true;
}

function triggerGameOver() {
    if (gameOver) return;
    gameOver = true; gameOverRising = true;
    sound.setEngineSound(false);
    sound.play('explodeL', 0.8);
}

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
    const sx = BORDER + FIELD_W + BORDER;
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, SIDEBAR_W, CANVAS_H);

    // Іконки ворогів (2 колонки)
    const remaining = spawnQueue.length + enemies.length;
    const iconSize = 8, iconGap = 2;
    const iconsX = sx + 16;
    let iconsY = BORDER + 8;
    for (let i = 0; i < remaining; i++) {
        const col = i % 2, row = Math.floor(i / 2);
        const ix = iconsX + col * (iconSize + iconGap);
        const iy = iconsY + row * (iconSize + iconGap);
        ctx.fillStyle = '#000';
        ctx.fillRect(ix, iy, iconSize, iconSize);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(ix + 1, iy, 2, iconSize);
        ctx.fillRect(ix + iconSize - 3, iy, 2, iconSize);
        ctx.fillRect(ix + 2, iy + 1, iconSize - 4, iconSize - 2);
    }

    // Блок P1
    renderPlayerBlock(ctx, player, iconsX, CANVAS_H - BORDER - 120, 'I', '#e7a821');

    // Прапор з номером рівня
    const flagY = CANVAS_H - BORDER - 44;
    ctx.fillStyle = '#000';
    ctx.fillRect(iconsX + 8, flagY, 2, 26);
    ctx.fillStyle = '#f15b3e';
    ctx.beginPath();
    ctx.moveTo(iconsX, flagY);
    ctx.lineTo(iconsX + 8, flagY);
    ctx.lineTo(iconsX, flagY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1', iconsX + 8, flagY + 38);
    ctx.textAlign = 'left';
}

function renderPlayerBlock(ctx, pl, x, y, label, tankColor) {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y);
    ctx.fillStyle = enemyBasicColor;
    ctx.fillText('P', x + label.length * 7, y);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y + 6, 10, 10);
    ctx.fillStyle = tankColor;
    ctx.fillRect(x + 2, y + 7, 6, 8);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(String(pl.lives), x + 14, y + 16);
}

requestAnimationFrame(gameLoop);
