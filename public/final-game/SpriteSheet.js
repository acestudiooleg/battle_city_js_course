/**
 * 🖼️ SpriteSheet — завантаження та нарізка спрайтів з battlecity_general.png
 *
 * Спрайт-ліст: 400×256 px (25×16 клітинок по 16×16)
 *
 * Макет:
 * ┌──────────────┬──────────────┬────────────┐
 * │ x=0-127      │ x=128-255    │ x=256-399  │
 * │ Player tanks │ Enemy tanks  │ Tiles, UI  │
 * │ (Yellow/Grn) │ (Gray/Red)   │ objects    │
 * └──────────────┴──────────────┴────────────┘
 */

class _SpriteSheet {
  constructor() {
    this.img   = new Image();
    this.ready = false;
    this.img.onload = () => { this.ready = true; };
    this.img.src = '../assets/battlecity_general.png';
  }

  /**
   * Малює фрагмент спрайт-листа на Canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} sx - source x
   * @param {number} sy - source y
   * @param {number} sw - source width
   * @param {number} sh - source height
   * @param {number} dx - dest x
   * @param {number} dy - dest y
   * @param {number} dw - dest width
   * @param {number} dh - dest height
   */
  draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!this.ready) return false;
    ctx.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh);
    return true;
  }
}

/** Глобальний сінглтон спрайт-листа */
export const spriteSheet = new _SpriteSheet();

// ─── Координати спрайтів ────────────────────────────────────────────────────

/**
 * Танки: 8 спрайтів 16×16 у рядку.
 * Порядок колонок: UP_F1, UP_F2, LEFT_F1, LEFT_F2, DOWN_F1, DOWN_F2, RIGHT_F1, RIGHT_F2
 */
export const DIR_COL = { up: 0, left: 2, down: 4, right: 6 };

/** Рядки для гравців (x_base = 0, кожен рядок = 16px) */
export const PLAYER1_SPRITE = { x: 0, y: 0 };    // P1 жовтий, star level 0
export const PLAYER2_SPRITE = { x: 0, y: 128 };   // P2 зелений, star level 0

/** Рядки для ворогів (x_base = 128) */
export const ENEMY_SPRITES = {
  basic: { x: 128, y: 0 },
  fast:  { x: 128, y: 32 },
  power: { x: 128, y: 64 },
  armor: { x: 128, y: 96 },
};

/** Кольори броньованого танка при різному HP (рядки спрайтів) */
export const ARMOR_HP_ROWS = {
  4: { x: 128, y: 96 },   // gray / full HP
  3: { x: 128, y: 96 },   // same shape, different shade handled by row below
  2: { x: 128, y: 128 },  // red palette (enemy set 2)
  1: { x: 128, y: 128 },  // red palette
};

// ─── Тайли ──────────────────────────────────────────────────────────────────

/** Тайли стін — 16×16 блок на спрайт-листі (вирізаємо чвертинки 8×8) */
export const TILE_SPRITES = {
  brick:    { x: 256, y: 0 },
  concrete: { x: 256, y: 16 },
};

/** Вода — 2 кадри анімації, кожен 16×16 */
export const WATER_SPRITES = [
  { x: 256, y: 32 },
  { x: 256, y: 48 },
];

/** Ліс — 16×16 (малюється ПОВЕРХ танків) */
export const FOREST_SPRITE = { x: 272, y: 32 };

/** Лід — 16×16 */
export const ICE_SPRITE = { x: 288, y: 32 };

// ─── Орел (штаб) ────────────────────────────────────────────────────────────

export const EAGLE_SPRITES = {
  alive: { x: 304, y: 32 },
  dead:  { x: 320, y: 32 },
};

// ─── Spawn-анімація ─────────────────────────────────────────────────────────

/** 4 кадри зірки появи, кожен 16×16 */
export const SPAWN_STAR_SPRITES = [
  { x: 256, y: 96 },
  { x: 272, y: 96 },
  { x: 288, y: 96 },
  { x: 304, y: 96 },
];

// ─── Вибухи ─────────────────────────────────────────────────────────────────

/** Малий вибух — 3 кадри по 16×16 */
export const EXPL_SMALL = [
  { x: 256, y: 112, s: 16 },
  { x: 272, y: 112, s: 16 },
  { x: 288, y: 112, s: 16 },
];

/** Великий вибух — 2 кадри по 32×32 */
export const EXPL_LARGE = [
  { x: 304, y: 112, s: 16 },   // initial (small flash)
  { x: 256, y: 128, s: 32 },   // big
  { x: 288, y: 128, s: 32 },   // fading
];
