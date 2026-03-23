// === NES Battle City — Канонічні константи ===

// Базовий тайл
export const TILE = 16;

// Розмір танка (2×2 тайли)
export const TANK_SIZE = TILE * 2; // 32px

// Розміри ігрового поля (26×26 тайлів)
export const COLS = 26;
export const ROWS = 26;
export const FIELD_W = COLS * TILE; // 416px
export const FIELD_H = ROWS * TILE; // 416px

// Рамка навколо поля
export const BORDER = 16;

// Бічна панель (справа)
export const SIDEBAR_W = 160;

// Розміри канвасу
export const CANVAS_W = BORDER + FIELD_W + BORDER + SIDEBAR_W; // 608px
export const CANVAS_H = BORDER + FIELD_H + BORDER;              // 448px

// Офсет ігрового поля від лівого / верхнього краю канвасу
export const FIELD_X = BORDER; // 16px
export const FIELD_Y = BORDER; // 16px

// ─── Ігрова логіка ───────────────────────────────────────────────────────────

// Максимум ворогів одночасно на полі
export const MAX_ACTIVE_ENEMIES = 4;
// Всього ворогів у рівні
export const TOTAL_ENEMIES = 20;
// Початкова кількість життів гравця
export const PLAYER_LIVES = 3;

// Швидкості (пікселів за кадр)
export const PLAYER_SPEED    = 1.5;
export const ENEMY_SPEED     = 1.0;
export const ENEMY_FAST_SPEED = 2.0;
export const BULLET_SPEED    = 5;

// HP матеріалів
export const BRICK_HP    = 4;   // 4 влучання
export const CONCRETE_HP = 99;  // невразливий

// Затримки (мс)
export const ENEMY_SPAWN_INTERVAL = 3000;
export const SPAWN_FLASH_DURATION = 2000;
export const SHOOT_COOLDOWN       = 1500;
export const POWER_SHOOT_COOLDOWN = 800;
export const RESPAWN_DELAY        = 2000;

// ─── Позиції на карті (тайлові координати) ──────────────────────────────────

// Орел (штаб): займає 2×2 тайли, починаючи з (12, 24)
export const EAGLE_TX = 12;
export const EAGLE_TY = 24;

// Точки появи гравців (верхній лівий кут 2×2 танка)
export const PLAYER_SPAWN = { tx: 8, ty: 24 };

// Точки появи ворогів
export const ENEMY_SPAWN_POINTS = [
  { tx: 0,  ty: 0 },
  { tx: 12, ty: 0 },
  { tx: 24, ty: 0 },
];

// ─── Типи ворогів ────────────────────────────────────────────────────────────
export const ENEMY_TYPE = {
  BASIC: 'basic',   // звичайний
  FAST:  'fast',    // швидкий
  POWER: 'power',   // потужний (частіше стріляє)
  ARMOR: 'armor',   // броньований (4 HP)
};

// Черга ворогів для рівня 1 (20 штук)
export const ENEMY_QUEUE = [
  'basic','basic','fast','basic','power',
  'basic','armor','basic','fast','basic',
  'power','basic','basic','armor','fast',
  'basic','basic','power','basic','armor',
];
