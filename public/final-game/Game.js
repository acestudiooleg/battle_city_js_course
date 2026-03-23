/**
 * 🎮 Клас Game — центральний координатор гри
 *
 * Відповідає за:
 * - Ігровий цикл (update / render)
 * - Спавн ворогів (черга з 20 штук, до 4 одночасно)
 * - Керування станом: пауза, game over, перемога
 * - Малювання бічної панелі (Sidebar)
 * - Координація звуків та вибухів
 */
import {
  TILE,
  FIELD_X, FIELD_Y, FIELD_W, FIELD_H,
  CANVAS_W, CANVAS_H, BORDER, SIDEBAR_W,
  MAX_ACTIVE_ENEMIES, TOTAL_ENEMIES,
  ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_POINTS,
  ENEMY_QUEUE,
} from './constants.js';
import {
  sidebarBg, sidebarText, heartRed, white,
  enemyBasicColor,
} from './colors.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { GameField } from './GameField.js';
import { CollisionManager } from './CollisionManager.js';
import { InputManager } from './InputManager.js';
import { SoundManager } from './SoundManager.js';
import { Explosion } from './Explosion.js';

export class Game {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    // Системи
    this.input = new InputManager();
    this.sound = new SoundManager();
    this.field = new GameField();

    this.collisions = new CollisionManager(
      this.field,
      (fx, fy, type) => this._spawnExplosion(fx, fy, type),
      (key) => this.sound.play(key),
    );

    // Гравець
    this.player = new Player();
    this.player.setInputManager(this.input);

    // Вороги
    /** @type {Enemy[]} Активні вороги на полі */
    this.enemies = [];
    this.spawnQueue   = [...ENEMY_QUEUE];
    this.spawnTimer   = 0;
    this.spawnIdx     = 0; // індекс точки спавну (циклічно 0-1-2)
    this.killedCount  = 0;

    // Вибухи
    /** @type {Explosion[]} */
    this.explosions = [];

    // Стан
    this.paused     = false;
    this.gameOver   = false;
    this.victory    = false;
    this.running    = false;
    this.lastTime   = 0;

    // Game over анімація
    this.gameOverY      = FIELD_H;
    this.gameOverRising = false;
  }

  // ─── Життєвий цикл ───────────────────────────────────────────────────────

  start() {
    this.running = true;
    this.sound.play('intro', 0.5);
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(now) {
    if (!this.running) return;

    const dt = Math.min(now - this.lastTime, 50); // clamp dt для уникнення стрибків
    this.lastTime = now;

    this._handleMeta();

    if (!this.paused && !this.gameOver && !this.victory) {
      this._update(dt, now);
    }

    this._render();

    requestAnimationFrame((t) => this._loop(t));
  }

  /** Обробка мета-клавіш (пауза, рестарт) */
  _handleMeta() {
    if (this.input.justPause()) {
      this.paused = !this.paused;
    }
    if (this.input.justRestart()) {
      this.restart();
    }
    this.input.clearFrame();
  }

  restart() {
    this.running = false;
    this.input.destroy();
    // Перезавантаження сторінки — простий і надійний спосіб
    location.reload();
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  _update(dt, now) {
    // Спавн ворогів
    this._updateSpawn(dt);

    // canMove замикання — враховує поле + інших танків
    const allTanks = [this.player, ...this.enemies];
    const canMove = (tank, nx, ny) => {
      if (!this.field.canTankMove(tank, nx, ny)) return false;
      if (this.collisions.tankOverlap(tank, nx, ny, allTanks)) return false;
      return true;
    };

    // Гравець
    this.player.update(dt, canMove, now);

    // Вороги
    for (const e of this.enemies) {
      e.update(dt, canMove, now);
    }

    // Колізії куль
    this.collisions.update(this.player, this.enemies);

    // Очистка мертвих куль
    this.player.bullets = this.player.bullets.filter((b) => b.active);
    for (const e of this.enemies) {
      e.bullets = e.bullets.filter((b) => b.active);
    }

    // Очистка мертвих ворогів
    const before = this.enemies.length;
    this.enemies = this.enemies.filter((e) => e.alive);
    this.killedCount += before - this.enemies.length;

    // Вибухи
    for (const ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter((ex) => ex.isActive);

    // Звук двигуна
    const isMoving = this.input.getMovement() !== null && this.player.alive;
    this.sound.setEngineSound(isMoving);

    // Game Over перевірки
    if (this.field.isEagleDestroyed()) {
      this._triggerGameOver();
    }
    if (this.player.lives <= 0 && !this.player.alive && !this.player.isRespawning) {
      this._triggerGameOver();
    }

    // Перемога
    if (this.killedCount >= TOTAL_ENEMIES && this.enemies.length === 0 && this.spawnQueue.length === 0) {
      this.victory = true;
    }

    // Game Over — текст підіймається
    if (this.gameOverRising) {
      this.gameOverY -= 1.5;
      if (this.gameOverY < FIELD_H / 2 - 20) {
        this.gameOverY = FIELD_H / 2 - 20;
      }
    }
  }

  _triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.gameOverRising = true;
    this.sound.setEngineSound(false);
    this.sound.play('explodeL', 0.8);
  }

  // ─── Спавн ворогів ────────────────────────────────────────────────────────

  _updateSpawn(dt) {
    if (this.spawnQueue.length === 0) return;
    if (this.enemies.length >= MAX_ACTIVE_ENEMIES) return;

    this.spawnTimer += dt;
    if (this.spawnTimer < ENEMY_SPAWN_INTERVAL) return;
    this.spawnTimer = 0;

    const type = this.spawnQueue.shift();
    const sp   = ENEMY_SPAWN_POINTS[this.spawnIdx % ENEMY_SPAWN_POINTS.length];
    this.spawnIdx++;

    const fx = sp.tx * TILE;
    const fy = sp.ty * TILE;

    const enemy = new Enemy(fx, fy, type, this.spawnIdx);
    this.enemies.push(enemy);
  }

  // ─── Вибухи ──────────────────────────────────────────────────────────────

  _spawnExplosion(fx, fy, type) {
    // fx, fy — координати ПОЛЯ; Explosion зберігає в екранних координатах
    this.explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  _render() {
    const ctx = this.ctx;

    // Поле (рамка + фон + стіни + вода + штаб)
    this.field.render(ctx);

    const ox = FIELD_X;
    const oy = FIELD_Y;

    // Танки та кулі
    this.player.render(ctx, ox, oy);
    this.player.renderBullets(ctx, ox, oy);

    for (const e of this.enemies) {
      e.render(ctx, ox, oy);
      e.renderBullets(ctx, ox, oy);
    }

    // Ліс (поверх танків)
    this.field.renderForest(ctx);

    // Вибухи (поверх усього на полі)
    for (const ex of this.explosions) ex.render(ctx);

    // Sidebar
    this._renderSidebar(ctx);

    // Overlay: пауза / game over / перемога
    if (this.paused)  this._renderPause(ctx);
    if (this.gameOver) this._renderGameOver(ctx);
    if (this.victory)  this._renderVictory(ctx);
  }

  // ─── Sidebar ──────────────────────────────────────────────────────────────

  _renderSidebar(ctx) {
    const sx = BORDER + FIELD_W + BORDER;
    const sy = BORDER;
    const sw = SIDEBAR_W;

    // Фон
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, sw, CANVAS_H);

    ctx.fillStyle = sidebarText;
    ctx.font      = 'bold 12px monospace';
    ctx.textAlign = 'left';

    let y = sy + 10;

    // Вороги, що залишились
    ctx.fillText('ВОРОГИ:', sx + 8, y);
    y += 18;
    const remaining = this.spawnQueue.length + this.enemies.length;
    const cols = 5;
    for (let i = 0; i < remaining; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      ctx.fillStyle = enemyBasicColor;
      ctx.fillRect(sx + 8 + col * 18, y + row * 16, 10, 10);
    }
    y += Math.ceil(remaining / cols) * 16 + 16;

    // Гравець
    ctx.fillStyle = sidebarText;
    ctx.fillText('ГРАВЕЦЬ:', sx + 8, y);
    y += 18;

    // Життя
    for (let i = 0; i < this.player.lives; i++) {
      ctx.fillStyle = heartRed;
      ctx.fillRect(sx + 8 + i * 18, y, 12, 12);
    }
    y += 24;

    // Рівень
    ctx.fillStyle = sidebarText;
    ctx.fillText('РІВЕНЬ:', sx + 8, y);
    y += 18;
    ctx.fillStyle = '#fcfcfc';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('1', sx + 8, y);
  }

  // ─── Overlay екрани ───────────────────────────────────────────────────────

  _renderPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = white;
    ctx.font      = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2);
  }

  _renderGameOver(ctx) {
    ctx.fillStyle = '#e04038';
    ctx.font      = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME', FIELD_X + FIELD_W / 2, FIELD_Y + this.gameOverY);
    ctx.fillText('OVER', FIELD_X + FIELD_W / 2, FIELD_Y + this.gameOverY + 32);
  }

  _renderVictory(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);
    ctx.fillStyle = '#f8f858';
    ctx.font      = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ПЕРЕМОГА!', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 - 16);
    ctx.fillStyle = white;
    ctx.font      = '14px monospace';
    ctx.fillText('Натисніть R для рестарту', FIELD_X + FIELD_W / 2, FIELD_Y + FIELD_H / 2 + 16);
  }
}
