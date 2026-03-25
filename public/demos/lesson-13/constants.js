// === NES Battle City — Константи гри ===
// Урок 10: + ворожі константи

export const TILE = 16;
export const TANK_SIZE = TILE * 2;
export const COLS = 26;
export const ROWS = 26;
export const FIELD_W = COLS * TILE;
export const FIELD_H = ROWS * TILE;
export const BORDER = 16;
export const SIDEBAR_W = 160;
export const CANVAS_W = BORDER + FIELD_W + BORDER + SIDEBAR_W;
export const CANVAS_H = BORDER + FIELD_H + BORDER;
export const FIELD_X = BORDER;
export const FIELD_Y = BORDER;

// Ігрова логіка
export const PLAYER_LIVES = 3;
export const RESPAWN_DELAY = 2000;
export const SHIELD_DURATION = 2000;

// Ворожі константи
export const ENEMY_SPEED = 1.0;
export const ENEMY_FAST_SPEED = 2.0;
export const SHOOT_COOLDOWN = 1500;
export const POWER_SHOOT_COOLDOWN = 800;
export const SPAWN_FLASH_DURATION = 2000;
export const MAX_ACTIVE_ENEMIES = 4;
export const TOTAL_ENEMIES = 20;
export const ENEMY_SPAWN_INTERVAL = 3000;

export const ENEMY_SPAWN_POINTS = [
    { tx: 0,  ty: 0 },
    { tx: 12, ty: 0 },
    { tx: 24, ty: 0 },
];

export const ENEMY_QUEUE = [
    'basic','basic','fast','basic','power',
    'basic','armor','basic','fast','basic',
    'power','basic','basic','armor','fast',
    'basic','basic','power','basic','armor',
];
