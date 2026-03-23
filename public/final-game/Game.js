/**
 * 🎮 Клас Game — центральний координатор гри
 *
 * Відповідає за:
 * - Ігровий цикл (update / render)
 * - Спавн ворогів (черга з 20 штук, до 4 одночасно)
 * - Керування станом: пауза, game over, перемога
 * - Малювання бічної панелі (Sidebar)
 * - Координація звуків та вибухів
 * - Підтримка 2 гравців (P1: WASD+Space, P2: Arrows+Enter)
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
  sidebarBg, sidebarText, white,
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

    // Піксельна графіка — без згладжування
    this.ctx.imageSmoothingEnabled = false;

    // Системи
    this.input = new InputManager();
    this.sound = new SoundManager();
    this.field = new GameField();

    this.collisions = new CollisionManager(
      this.field,
      (fx, fy, type) => this._spawnExplosion(fx, fy, type),
      (key) => this.sound.play(key),
    );

    // Гравці
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.player1.setInputManager(this.input);
    this.player2.setInputManager(this.input);

    /** Масив обох гравців для зручності ітерації */
    this.players = [this.player1, this.player2];

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

    const dt = Math.min(now - this.lastTime, 50);
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
    location.reload();
  }

  // ─── Update ───────────────────────────────────────────────────────────────

  _update(dt, now) {
    // Анімація води
    this.field.update(dt);

    // Спавн ворогів
    this._updateSpawn(dt);

    // canMove замикання — враховує поле + інших танків
    const allTanks = [...this.players, ...this.enemies];
    const canMove = (tank, nx, ny) => {
      if (!this.field.canTankMove(tank, nx, ny)) return false;
      if (this.collisions.tankOverlap(tank, nx, ny, allTanks)) return false;
      return true;
    };

    // Гравці
    for (const p of this.players) {
      p.update(dt, canMove, now);
    }

    // Вороги
    for (const e of this.enemies) {
      e.update(dt, canMove, now);
    }

    // Колізії куль — для кожного гравця
    for (const p of this.players) {
      this.collisions.update(p, this.enemies);
    }

    // Очистка мертвих куль
    for (const p of this.players) {
      p.bullets = p.bullets.filter((b) => b.active);
    }
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

    // Звук двигуна (якщо хоч один гравець рухається)
    const isMoving = this.players.some(
      (p) => p.alive && !p.isRespawning && p._getMovement && p._getMovement() !== null
    );
    this.sound.setEngineSound(isMoving);

    // Game Over перевірки
    if (this.field.isEagleDestroyed()) {
      this._triggerGameOver();
    }
    // Game over якщо обидва гравці втратили всі життя
    const allDead = this.players.every(
      (p) => p.lives <= 0 && !p.alive && !p.isRespawning
    );
    if (allDead) {
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
    for (const p of this.players) {
      p.render(ctx, ox, oy);
      p.renderBullets(ctx, ox, oy);
    }

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

    // Фон sidebar — сірий як рамка
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, SIDEBAR_W, CANVAS_H);

    // ─── Іконки ворогів (2 колонки, NES-стиль) ─────────────────────────
    const remaining = this.spawnQueue.length + this.enemies.length;
    const iconSize = 8;
    const iconGap  = 2;
    const iconsX   = sx + 16;
    let   iconsY   = BORDER + 8;

    for (let i = 0; i < remaining; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ix = iconsX + col * (iconSize + iconGap);
      const iy = iconsY + row * (iconSize + iconGap);

      ctx.fillStyle = '#000';
      ctx.fillRect(ix, iy, iconSize, iconSize);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(ix + 1, iy, 2, iconSize);
      ctx.fillRect(ix + iconSize - 3, iy, 2, iconSize);
      ctx.fillRect(ix + 2, iy + 1, iconSize - 4, iconSize - 2);
    }

    // ─── Блок P1 ──────────────────────────────────────────────────────
    this._renderPlayerBlock(ctx, this.player1, iconsX, CANVAS_H - BORDER - 120, 'I', '#e7a821');

    // ─── Блок P2 ──────────────────────────────────────────────────────
    this._renderPlayerBlock(ctx, this.player2, iconsX, CANVAS_H - BORDER - 80, 'II', '#00a800');

    // ─── Прапор з номером рівня ─────────────────────────────────────────
    const flagY = CANVAS_H - BORDER - 44;

    // Древко
    ctx.fillStyle = '#000';
    ctx.fillRect(iconsX + 8, flagY, 2, 26);

    // Прапор (оранжевий трикутник)
    ctx.fillStyle = '#f15b3e';
    ctx.beginPath();
    ctx.moveTo(iconsX, flagY);
    ctx.lineTo(iconsX + 8, flagY);
    ctx.lineTo(iconsX, flagY + 12);
    ctx.closePath();
    ctx.fill();

    // Номер рівня
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1', iconsX + 8, flagY + 38);
    ctx.textAlign = 'left';
  }

  /**
   * Малює блок гравця на sidebar (IP лейбл + іконка танка + життя)
   */
  _renderPlayerBlock(ctx, player, x, y, label, tankColor) {
    // Лейбл ("IP" або "IIP")
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y);
    ctx.fillStyle = enemyBasicColor;
    ctx.fillText('P', x + label.length * 7, y);

    // Іконка танка
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y + 6, 10, 10);
    ctx.fillStyle = tankColor;
    ctx.fillRect(x + 2, y + 7, 6, 8);

    // Кількість життів
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(String(player.lives), x + 14, y + 16);
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
