/**
 * 🗺️ Клас GameField — ігрове поле (26×26 тайлів)
 *
 * Відповідає за:
 * - Побудову карти з levels.js (13×13 блоків → 26×26 тайлів)
 * - Малювання стін, води, лісу, штабу (Орла)
 * - Пошкодження / руйнування тайлів
 * - Окремий шар лісу, що малюється ПОВЕРХ танків (z-index)
 */
import {
  TILE, FIELD_W, FIELD_H, FIELD_X, FIELD_Y,
  EAGLE_TX, EAGLE_TY, TANK_SIZE,
  CANVAS_W, CANVAS_H, BORDER, SIDEBAR_W,
  BRICK_HP, CONCRETE_HP,
} from './constants.js';
import { LEVEL_1, buildTileList } from './levels.js';
import {
  fieldBg, borderBg,
  brickFull, brickHalf, brickLow,
  concreteCol, waterCol, forestCol, iceCol,
  eagleAlive, eagleDead,
} from './colors.js';

export class GameField {
  constructor() {
    /** Масив тайлів-перешкод (brick / concrete) */
    this.walls = [];

    /** Масив тайлів води (непрохідна, але кулі летять) */
    this.water = [];

    /** Масив тайлів лісу (малюється поверх танків) */
    this.forest = [];

    /** Штаб (Орел) */
    this.eagle = {
      tx: EAGLE_TX, ty: EAGLE_TY,
      x: EAGLE_TX * TILE,
      y: EAGLE_TY * TILE,
      width: TANK_SIZE,
      height: TANK_SIZE,
      alive: true,
    };

    // Захисна стінка навколо штабу (цегла)
    this._buildEagleWall();

    // Розгортаємо карту рівня
    this._buildLevel(LEVEL_1);
  }

  // ─── Побудова рівня ──────────────────────────────────────────────────────────

  _buildLevel(blockMap) {
    const tiles = buildTileList(blockMap, TILE);
    for (const t of tiles) {
      if (t.material === 'water')       { this.water.push(t);   continue; }
      if (t.material === 'forest')      { this.forest.push(t);  continue; }
      // brick / concrete → walls
      this.walls.push(t);
    }
  }

  /** Цегляна стінка навколо Орла (П-подібна) */
  _buildEagleWall() {
    const ex = EAGLE_TX;
    const ey = EAGLE_TY;
    // Ліва колонка, верхній ряд, права колонка
    const positions = [
      // ліва
      [ex - 1, ey], [ex - 1, ey + 1],
      // верх
      [ex, ey - 1], [ex + 1, ey - 1],
      // права
      [ex + 2, ey], [ex + 2, ey + 1],
    ];
    for (const [tx, ty] of positions) {
      if (tx < 0 || ty < 0 || tx >= 26 || ty >= 26) continue;
      this.walls.push({
        tx, ty,
        x: tx * TILE, y: ty * TILE,
        width: TILE, height: TILE,
        material: 'brick',
        hp: BRICK_HP, maxHp: BRICK_HP,
      });
    }
  }

  // ─── Колізії ─────────────────────────────────────────────────────────────────

  /**
   * Чи може танк зайняти цю позицію? (перевіряє стіни, воду, штаб, меж поля)
   * @param {Tank} tank
   * @param {number} nx - нова X (координати поля)
   * @param {number} ny - нова Y (координати поля)
   * @returns {boolean}
   */
  canTankMove(tank, nx, ny) {
    const w = tank.width;
    const h = tank.height;

    // Межі поля
    if (nx < 0 || ny < 0 || nx + w > FIELD_W || ny + h > FIELD_H) return false;

    // Стіни
    for (const t of this.walls) {
      if (nx < t.x + t.width && nx + w > t.x && ny < t.y + t.height && ny + h > t.y) return false;
    }

    // Вода
    for (const t of this.water) {
      if (nx < t.x + t.width && nx + w > t.x && ny < t.y + t.height && ny + h > t.y) return false;
    }

    // Штаб
    const e = this.eagle;
    if (e.alive && nx < e.x + e.width && nx + w > e.x && ny < e.y + e.height && ny + h > e.y) return false;

    return true;
  }

  /**
   * Перевіряє зіткнення кулі зі стінами. Повертає вражений тайл або null.
   */
  bulletHitWall(bx, by, bw, bh) {
    for (const t of this.walls) {
      if (bx < t.x + t.width && bx + bw > t.x && by < t.y + t.height && by + bh > t.y) {
        return t;
      }
    }
    return null;
  }

  /**
   * Перевіряє влучання кулі у штаб
   */
  bulletHitEagle(bx, by, bw, bh) {
    if (!this.eagle.alive) return false;
    const e = this.eagle;
    return bx < e.x + e.width && bx + bw > e.x && by < e.y + e.height && by + bh > e.y;
  }

  /**
   * Пошкодити тайл. Повертає true, якщо тайл зруйнований.
   */
  damageTile(tile, dmg = 1) {
    tile.hp -= dmg;
    if (tile.hp <= 0) {
      const idx = this.walls.indexOf(tile);
      if (idx !== -1) this.walls.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** Знищити штаб */
  destroyEagle() {
    this.eagle.alive = false;
  }

  /** Чи штаб знищений */
  isEagleDestroyed() {
    return !this.eagle.alive;
  }

  // ─── Малювання ───────────────────────────────────────────────────────────────

  /**
   * Малювання канвасу: рамка + фон + нижній шар (стіни, вода, штаб).
   * Ліс малюється окремо через renderForest() ПІСЛЯ танків.
   */
  render(ctx) {
    // Рамка
    ctx.fillStyle = borderBg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Фон поля
    ctx.fillStyle = fieldBg;
    ctx.fillRect(FIELD_X, FIELD_Y, FIELD_W, FIELD_H);

    const ox = FIELD_X;
    const oy = FIELD_Y;

    // Вода
    for (const t of this.water) {
      ctx.fillStyle = waterCol;
      ctx.fillRect(t.x + ox, t.y + oy, t.width, t.height);
      // Хвильки
      ctx.strokeStyle = '#5070fc';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const ly = t.y + oy + 3 + i * 5;
        ctx.beginPath();
        ctx.moveTo(t.x + ox + 1, ly);
        ctx.lineTo(t.x + ox + t.width - 1, ly);
        ctx.stroke();
      }
    }

    // Стіни
    for (const t of this.walls) {
      this._drawTile(ctx, t, ox, oy);
    }

    // Штаб (Орел)
    this._drawEagle(ctx, ox, oy);
  }

  /** Ліс — малюється ПОВЕРХ танків та куль */
  renderForest(ctx) {
    const ox = FIELD_X;
    const oy = FIELD_Y;
    for (const t of this.forest) {
      ctx.fillStyle = forestCol;
      ctx.fillRect(t.x + ox, t.y + oy, t.width, t.height);
      // Листочки
      ctx.fillStyle = '#009000';
      ctx.fillRect(t.x + ox + 2, t.y + oy + 2, 4, 4);
      ctx.fillRect(t.x + ox + 10, t.y + oy + 6, 4, 4);
      ctx.fillRect(t.x + ox + 4, t.y + oy + 10, 4, 4);
    }
  }

  _drawTile(ctx, t, ox, oy) {
    const x = t.x + ox;
    const y = t.y + oy;

    if (t.material === 'brick') {
      const pct = t.hp / t.maxHp;
      ctx.fillStyle = pct > 0.75 ? brickFull : pct > 0.25 ? brickHalf : brickLow;
      ctx.fillRect(x, y, t.width, t.height);
      // Цегляна кладка
      ctx.strokeStyle = '#801010';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, t.width / 2, t.height / 2);
      ctx.strokeRect(x + t.width / 2, y + t.height / 2, t.width / 2, t.height / 2);
    } else if (t.material === 'concrete') {
      ctx.fillStyle = concreteCol;
      ctx.fillRect(x, y, t.width, t.height);
      // Риски
      ctx.strokeStyle = '#9a9a9a';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x + 1, y + 1, t.width - 2, t.height - 2);
    }
  }

  _drawEagle(ctx, ox, oy) {
    const e = this.eagle;
    const x = e.x + ox;
    const y = e.y + oy;
    const s = e.width;

    if (e.alive) {
      // Жовтий орел
      ctx.fillStyle = eagleAlive;
      ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
      // Крила
      ctx.fillStyle = '#d8a000';
      ctx.beginPath();
      ctx.moveTo(x + s / 2, y + 4);
      ctx.lineTo(x + 4, y + s - 4);
      ctx.lineTo(x + s - 4, y + s - 4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Сірий зруйнований штаб
      ctx.fillStyle = eagleDead;
      ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
      // Хрест
      ctx.strokeStyle = '#e04038';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + s - 4, y + s - 4);
      ctx.moveTo(x + s - 4, y + 4);
      ctx.lineTo(x + 4, y + s - 4);
      ctx.stroke();
    }
  }
}
