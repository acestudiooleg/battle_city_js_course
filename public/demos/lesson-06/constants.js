// === NES Battle City — Константи гри ===

// Базовий тайл
export const TILE = 16;

// Розмір танка (2×2 тайли)
export const TANK_SIZE = TILE * 2;

// Розміри ігрового поля (26×26 тайлів)
export const COLS = 26;
export const ROWS = 26;
export const FIELD_W = COLS * TILE;
export const FIELD_H = ROWS * TILE;

// Рамка навколо поля
export const BORDER = 16;

// Бічна панель (sidebar) справа
export const SIDEBAR_W = 160;

// Повний розмір Canvas
export const CANVAS_W = BORDER + FIELD_W + BORDER + SIDEBAR_W; // 608
export const CANVAS_H = BORDER + FIELD_H + BORDER;              // 448

// Зсув ігрового поля від краю Canvas
export const FIELD_X = BORDER;
export const FIELD_Y = BORDER;
