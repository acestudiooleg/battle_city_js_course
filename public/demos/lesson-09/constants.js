// === NES Battle City — Константи гри ===
// Урок 9: + PLAYER_LIVES, RESPAWN_DELAY, SHIELD_DURATION

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
