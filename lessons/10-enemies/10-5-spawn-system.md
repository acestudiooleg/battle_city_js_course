# 🏭 Урок 10.5: Система появи ворогів

## Як вороги з'являються на полі?

В Battle City система спавну працює так:

1. **Черга** — 20 ворогів чекають своєї черги (`ENEMY_QUEUE`)
2. **Таймер** — кожні 3 секунди з черги беремо наступного
3. **Ліміт** — на полі одночасно не більше 4 ворогів
4. **Точки** — 3 точки появи зверху поля, ротація циклічна (0 → 1 → 2 → 0...)

---

## 🎮 Інтеграція в main.js

Оновлюємо `main.js` — додаємо ворогів:

```js
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

// ─── Ініціалізація ───────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();
const explosions = [];

const collisions = new CollisionManager(field, (fx, fy, type) => {
    explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
});

// ─── Система ворогів ─────────────────────────────────────────────
/** Масив активних ворогів на полі */
const enemies = [];

/** Копія черги ворогів (будемо брати з початку) */
const spawnQueue = [...ENEMY_QUEUE]; // [... ] створює копію масиву

/** Таймер до появи наступного ворога */
let spawnTimer = 0;

/** Індекс точки спавну (циклічно 0→1→2→0→1→2...) */
let spawnIdx = 0;

/** Лічильник знищених ворогів */
let killedCount = 0;

// ─── Стан гри ────────────────────────────────────────────────────
let paused = false, gameOver = false, victory = false;
let lastTime = 0;
let gameOverY = FIELD_H, gameOverRising = false;

// ─── Ігровий цикл ───────────────────────────────────────────────
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

// ─── Спавн ворогів ──────────────────────────────────────────────
function updateSpawn(dt) {
    // Якщо черга порожня — нових ворогів не буде
    if (spawnQueue.length === 0) return;

    // Якщо на полі вже максимум ворогів — чекаємо
    if (enemies.length >= MAX_ACTIVE_ENEMIES) return;

    // Збільшуємо таймер
    spawnTimer += dt;

    // Перевіряємо чи настав час нового ворога
    if (spawnTimer < ENEMY_SPAWN_INTERVAL) return;

    // Скидаємо таймер
    spawnTimer = 0;

    // Беремо тип ворога з початку черги
    // shift() видаляє і повертає перший елемент масиву
    const type = spawnQueue.shift();

    // Визначаємо точку спавну (циклічно)
    // % — оператор остачі від ділення (0%3=0, 1%3=1, 2%3=2, 3%3=0, ...)
    const sp = ENEMY_SPAWN_POINTS[spawnIdx % ENEMY_SPAWN_POINTS.length];
    spawnIdx++; // наступного разу — наступна точка

    // Переводимо тайлові координати у пікселі
    const fx = sp.tx * TILE;
    const fy = sp.ty * TILE;

    // Створюємо ворога і додаємо на поле
    const enemy = new Enemy(fx, fy, type);
    enemies.push(enemy);
}

// ─── Основне оновлення ──────────────────────────────────────────
function update(dt) {
    field.update(dt);

    // Спавн нових ворогів
    updateSpawn(dt);

    // Функція перевірки руху (поле + всі танки)
    const allTanks = [player, ...enemies];
    const canMove = (tank, nx, ny) => {
        if (!field.canTankMove(tank, nx, ny)) return false;
        if (collisions.tankOverlap(tank, nx, ny, allTanks)) return false;
        return true;
    };

    // Гравець
    player.update(dt, canMove, Date.now(),
        () => input.getMovement(), () => input.isShoot());

    // Вороги
    for (const e of enemies) {
        e.update(dt, canMove, Date.now());
    }

    // Колізії
    collisions.update(player, enemies);

    // Очистка мертвих куль
    player.bullets = player.bullets.filter(b => b.active);
    for (const e of enemies) {
        e.bullets = e.bullets.filter(b => b.active);
    }

    // Очистка мертвих ворогів
    const before = enemies.length;
    // filter() створює новий масив тільки з живих ворогів
    const alive = enemies.filter(e => e.alive);
    // Різниця = скільки ворогів було знищено цього кадру
    killedCount += before - alive.length;
    // Замінюємо масив на відфільтрований
    enemies.length = 0;
    enemies.push(...alive);

    // Вибухи
    for (const e of explosions) e.update(dt);
    for (let i = explosions.length - 1; i >= 0; i--) {
        if (!explosions[i].isActive) explosions.splice(i, 1);
    }

    // Game Over перевірки
    if (field.isEagleDestroyed()) triggerGameOver();
    if (player.lives <= 0 && !player.alive && !player.isRespawning) triggerGameOver();

    // Перемога: всі вороги знищені і черга порожня
    if (killedCount >= TOTAL_ENEMIES && enemies.length === 0 && spawnQueue.length === 0) {
        victory = true;
    }
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

// ─── Малювання ──────────────────────────────────────────────────
function render() {
    field.render(ctx);

    // Танки та кулі
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

// ─── Sidebar ────────────────────────────────────────────────────
function drawSidebar() {
    const sx = FIELD_X + FIELD_W + 16;
    ctx.fillStyle = sidebarBg; ctx.fillRect(sx, 0, 144, CANVAS_H);
    ctx.fillStyle = sidebarText; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
    ctx.fillText('УРОК 10', sx + 8, 30);
    ctx.fillText('Вороги!', sx + 8, 50);

    ctx.font = '11px monospace';
    ctx.fillText('WASD  рух', sx + 8, 86);
    ctx.fillText('SPACE вогонь', sx + 8, 102);
    ctx.fillText('P     пауза', sx + 8, 118);
    ctx.fillText('R     рестарт', sx + 8, 134);

    ctx.fillStyle = '#f8f858';
    const remaining = spawnQueue.length + enemies.length;
    ctx.fillText('Enemies: ' + remaining, sx + 8, 168);
    ctx.fillText('Killed: ' + killedCount, sx + 8, 184);
    ctx.fillText('Lives: ' + player.lives, sx + 8, 200);

    ctx.fillStyle = field.eagle.alive ? '#00ff00' : '#ff0000';
    ctx.fillText('Eagle: ' + (field.eagle.alive ? 'ALIVE' : 'DEAD'), sx + 8, 226);

    if (gameOver) { ctx.fillStyle = '#e04038'; ctx.fillText('GAME OVER', sx + 8, 256); }
    if (victory) { ctx.fillStyle = '#f8f858'; ctx.fillText('VICTORY!', sx + 8, 256); }
}

// ─── Запуск ─────────────────────────────────────────────────────
requestAnimationFrame(gameLoop);
```

---

## 📝 Підсумок Дня 10

Ось що ми створили:

- ✅ **Enemy.js** — клас ворожого танка з AI (4 типи: basic, fast, power, armor)
- ✅ **Spawn-анімація** — мигаюча зірка 2 секунди перед появою
- ✅ **AI патрулювання** — випадковий рух + негайна зміна при застряганні
- ✅ **AI стрільба** — автоматична стрільба з кулдауном
- ✅ **Система спавну** — черга 20 ворогів, 3 точки, максимум 4 одночасно
- ✅ **Перемога** — коли всі 20 ворогів знищені
- ✅ **Нові константи та кольори** — повний набір характеристик ворогів

### Спробуй:

**Результат дня:** [Демо уроку 10](/battle_city_js_course/demos/lesson-10/game.html){target="_blank"}

- Вороги з'являються зверху з мигаючою зіркою
- Вони патрулюють поле та стріляють!
- Знищуй їх та захищай штаб!

---

## 🔜 Наступний день

**День 11: NES графіка** — замінимо всі `fillRect` на **оригінальні спрайти** з NES! Гра виглядатиме як справжня Battle City!
