/**
 * 🗺️ Клас GameField — ігрове поле (26×26 тайлів)
 *
 * Відповідає за:
 * - Побудову карти з levels.js (13×13 блоків → 26×26 тайлів)
 * - Малювання стін, води, лісу, штабу (Орла) зі спрайт-листа
 * - Пошкодження / руйнування тайлів
 * - Окремий шар лісу, що малюється ПОВЕРХ танків (z-index)
 */
import {
  TILE, FIELD_W, FIELD_H, FIELD_X, FIELD_Y,
  EAGLE_TX, EAGLE_TY, TANK_SIZE,
  CANVAS_W, CANVAS_H,
  BRICK_HP, CONCRETE_HP,
} from './constants.js';
import { LEVEL_1, buildTileList } from './levels.js';
import {
  fieldBg, borderBg,
  brickFull, brickHalf, brickLow,
  concreteCol, waterCol, forestCol,
} from './colors.js';
import {
  spriteSheet,
  TILE_SPRITES, WATER_SPRITES, FOREST_SPRITE,
  EAGLE_SPRITES,
} from './SpriteSheet.js';

export class GameField {
  constructor() {
    /** Масив тайлів-перешкод (brick / concrete) */
    this.walls = [];

    /** Масив тайлів води (непрохідна, але кулі летять) */
    this.water = [];

    /** Масив тайлів лісу (малюється поверх танків) */
    this.forest = [];

    /** Анімація води */
    this.waterFrame = 0;
    this.waterTimer = 0;

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
      if (t.material === 'water')  { this.water.push(t);  continue; }
      if (t.material === 'forest') { this.forest.push(t); continue; }
      this.walls.push(t);
    }
  }

  /** Цегляна стінка навколо Орла (П-подібна) */
  _buildEagleWall() {
    const ex = EAGLE_TX;
    const ey = EAGLE_TY;
    const positions = [
      [ex - 1, ey], [ex - 1, ey + 1],
      [ex, ey - 1], [ex + 1, ey - 1],
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

  // ─── Оновлення ────────────────────────────────────────────────────────────────

  update(dt) {
    this.waterTimer += dt;
    if (this.waterTimer > 500) {
      this.waterFrame = 1 - this.waterFrame;
      this.waterTimer = 0;
    }
  }

  // ─── Колізії ─────────────────────────────────────────────────────────────────

  canTankMove(tank, nx, ny) {
    const w = tank.width;
    const h = tank.height;
    if (nx < 0 || ny < 0 || nx + w > FIELD_W || ny + h > FIELD_H) return false;
    for (const t of this.walls) {
      if (nx < t.x + t.width && nx + w > t.x && ny < t.y + t.height && ny + h > t.y) return false;
    }
    for (const t of this.water) {
      if (nx < t.x + t.width && nx + w > t.x && ny < t.y + t.height && ny + h > t.y) return false;
    }
    const e = this.eagle;
    if (e.alive && nx < e.x + e.width && nx + w > e.x && ny < e.y + e.height && ny + h > e.y) return false;
    return true;
  }

  bulletHitWall(bx, by, bw, bh) {
    for (const t of this.walls) {
      if (bx < t.x + t.width && bx + bw > t.x && by < t.y + t.height && by + bh > t.y) return t;
    }
    return null;
  }

  bulletHitEagle(bx, by, bw, bh) {
    if (!this.eagle.alive) return false;
    const e = this.eagle;
    return bx < e.x + e.width && bx + bw > e.x && by < e.y + e.height && by + bh > e.y;
  }

  damageTile(tile, dmg = 1) {
    tile.hp -= dmg;
    if (tile.hp <= 0) {
      const idx = this.walls.indexOf(tile);
      if (idx !== -1) this.walls.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** Знайти тайл за тайловими координатами */
  findWallAt(tx, ty) {
    return this.walls.find(t => t.tx === tx && t.ty === ty) || null;
  }

  /**
   * NES-стиль: куля руйнує 2 тайли з того боку, звідки летить.
   * Блок 32×32 = 4 тайли (2×2):
   *   [TL] [TR]    tx%2=0  tx%2=1
   *   [BL] [BR]    ty%2=0  ty%2=1
   *
   * Куля ↓ (down) → руйнує верхню пару (ty%2=0)
   * Куля ↑ (up)   → руйнує нижню пару (ty%2=1)
   * Куля → (right) → руйнує ліву пару  (tx%2=0)
   * Куля ← (left)  → руйнує праву пару (tx%2=1)
   */
  destroyBrickPair(hitTile, bulletDir) {
    if (hitTile.material !== 'brick') return false;

    const { tx, ty } = hitTile;
    let partnerTx, partnerTy;

    if (bulletDir === 'up' || bulletDir === 'down') {
      // Горизонтальна пара: той самий ty, інший tx в межах блоку
      partnerTx = (tx % 2 === 0) ? tx + 1 : tx - 1;
      partnerTy = ty;
    } else {
      // Вертикальна пара: той самий tx, інший ty в межах блоку
      partnerTx = tx;
      partnerTy = (ty % 2 === 0) ? ty + 1 : ty - 1;
    }

    // Знищити влучений тайл
    this.damageTile(hitTile, hitTile.hp);

    // Знищити партнера (якщо існує і це цегла)
    const partner = this.findWallAt(partnerTx, partnerTy);
    if (partner && partner.material === 'brick') {
      this.damageTile(partner, partner.hp);
    }

    return true;
  }

  // ─── Лопата (Shovel power-up) ─────────────────────────────────────────────

  /** Замінити стінку навколо штабу на бетон (тимчасово) */
  fortifyEagle() {
    this._removeEagleWall();
    this._buildEagleWallMaterial('concrete');
  }

  /** Повернути цегляну стінку навколо штабу */
  unfortifyEagle() {
    this._removeEagleWall();
    this._buildEagleWall();
  }

  _removeEagleWall() {
    const ex = EAGLE_TX;
    const ey = EAGLE_TY;
    const positions = [
      [ex - 1, ey], [ex - 1, ey + 1],
      [ex, ey - 1], [ex + 1, ey - 1],
      [ex + 2, ey], [ex + 2, ey + 1],
    ];
    for (const [tx, ty] of positions) {
      const idx = this.walls.findIndex(t => t.tx === tx && t.ty === ty);
      if (idx !== -1) this.walls.splice(idx, 1);
    }
  }

  _buildEagleWallMaterial(material) {
    const ex = EAGLE_TX;
    const ey = EAGLE_TY;
    const hp = material === 'concrete' ? CONCRETE_HP : BRICK_HP;
    const positions = [
      [ex - 1, ey], [ex - 1, ey + 1],
      [ex, ey - 1], [ex + 1, ey - 1],
      [ex + 2, ey], [ex + 2, ey + 1],
    ];
    for (const [tx, ty] of positions) {
      if (tx < 0 || ty < 0 || tx >= 26 || ty >= 26) continue;
      this.walls.push({
        tx, ty,
        x: tx * TILE, y: ty * TILE,
        width: TILE, height: TILE,
        material, hp, maxHp: hp,
      });
    }
  }

  destroyEagle() { this.eagle.alive = false; }
  isEagleDestroyed() { return !this.eagle.alive; }

  // ─── Малювання ───────────────────────────────────────────────────────────────

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
    this._drawWater(ctx, ox, oy);

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
    const img = spriteSheet.img;
    const spr = FOREST_SPRITE;

    for (const t of this.forest) {
      const dx = t.x + ox;
      const dy = t.y + oy;
      if (spriteSheet.ready) {
        // Чвертинка 8×8 з 16×16 блоку лісу → масштаб до TILE
        const qx = t.tx % 2;
        const qy = t.ty % 2;
        ctx.drawImage(img, spr.x + qx * 8, spr.y + qy * 8, 8, 8, dx, dy, TILE, TILE);
      } else {
        ctx.fillStyle = forestCol;
        ctx.fillRect(dx, dy, TILE, TILE);
        ctx.fillStyle = '#009000';
        ctx.fillRect(dx + 2, dy + 2, 4, 4);
        ctx.fillRect(dx + 10, dy + 6, 4, 4);
      }
    }
  }

  // ─── Приватні методи малювання ────────────────────────────────────────────────

  _drawWater(ctx, ox, oy) {
    const img = spriteSheet.img;
    const spr = WATER_SPRITES[this.waterFrame];

    for (const t of this.water) {
      const dx = t.x + ox;
      const dy = t.y + oy;
      if (spriteSheet.ready) {
        const qx = t.tx % 2;
        const qy = t.ty % 2;
        ctx.drawImage(img, spr.x + qx * 8, spr.y + qy * 8, 8, 8, dx, dy, TILE, TILE);
      } else {
        ctx.fillStyle = waterCol;
        ctx.fillRect(dx, dy, TILE, TILE);
        ctx.strokeStyle = '#5070fc';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const ly = dy + 3 + i * 5;
          ctx.beginPath();
          ctx.moveTo(dx + 1, ly);
          ctx.lineTo(dx + TILE - 1, ly);
          ctx.stroke();
        }
      }
    }
  }

  _drawTile(ctx, t, ox, oy) {
    const dx = t.x + ox;
    const dy = t.y + oy;

    if (spriteSheet.ready) {
      const spr = TILE_SPRITES[t.material];
      if (spr) {
        const qx = t.tx % 2;
        const qy = t.ty % 2;
        ctx.drawImage(spriteSheet.img, spr.x + qx * 8, spr.y + qy * 8, 8, 8, dx, dy, TILE, TILE);
        return;
      }
    }

    // Fallback
    if (t.material === 'brick') {
      const pct = t.hp / t.maxHp;
      ctx.fillStyle = pct > 0.75 ? brickFull : pct > 0.25 ? brickHalf : brickLow;
      ctx.fillRect(dx, dy, TILE, TILE);
      ctx.strokeStyle = '#801010';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(dx, dy, TILE / 2, TILE / 2);
      ctx.strokeRect(dx + TILE / 2, dy + TILE / 2, TILE / 2, TILE / 2);
    } else if (t.material === 'concrete') {
      ctx.fillStyle = concreteCol;
      ctx.fillRect(dx, dy, TILE, TILE);
      ctx.strokeStyle = '#9a9a9a';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(dx + 1, dy + 1, TILE - 2, TILE - 2);
    }
  }

  _drawEagle(ctx, ox, oy) {
    const e = this.eagle;
    const dx = e.x + ox;
    const dy = e.y + oy;
    const s = e.width;

    if (spriteSheet.ready) {
      const spr = e.alive ? EAGLE_SPRITES.alive : EAGLE_SPRITES.dead;
      ctx.drawImage(spriteSheet.img, spr.x, spr.y, 16, 16, dx, dy, s, s);
      return;
    }

    // Fallback
    if (e.alive) {
      ctx.fillStyle = '#7c7c7c';
      ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
      ctx.fillStyle = '#e04038';
      ctx.font = `${s * 0.6}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('\u2655', dx + s / 2, dy + s / 2);
    } else {
      ctx.fillStyle = '#3c3c3c';
      ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
      ctx.strokeStyle = '#e04038';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dx + 6, dy + 6);
      ctx.lineTo(dx + s - 6, dy + s - 6);
      ctx.moveTo(dx + s - 6, dy + 6);
      ctx.lineTo(dx + 6, dy + s - 6);
      ctx.stroke();
    }
  }
}
