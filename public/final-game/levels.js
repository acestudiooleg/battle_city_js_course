// === NES Battle City — Дані рівнів ===
// Карта 13×13 "блоків" (кожен блок = 2×2 тайли = 32×32px)
//
// 0 = порожньо
// 1 = цегла  (brick,    4 HP)
// 2 = бетон  (concrete, 99 HP)
// 3 = вода   (water)
// 4 = ліс    (forest — малюється ПОВЕРХ танків)
//
// Орел (штаб) знаходиться в блоці (6, 12) — він встановлюється GameField окремо.
// Точки появи ворогів: блоки (0,0), (6,0), (12,0).
// Точки появи гравців: блоки (4,12) та (8,12).

export const LEVEL_1 = [
  // 0    1    2    3    4    5    6    7    8    9   10   11   12
  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ], // ряд 0
  [  0,   1,   1,   0,   1,   0,   1,   0,   1,   0,   1,   1,   0 ], // ряд 1
  [  0,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1,   0 ], // ряд 2
  [  0,   0,   1,   0,   1,   0,   1,   0,   1,   0,   1,   0,   0 ], // ряд 3
  [  2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2 ], // ряд 4
  [  0,   0,   1,   0,   1,   0,   0,   0,   1,   0,   1,   0,   0 ], // ряд 5
  [  0,   0,   0,   0,   0,   0,   4,   0,   0,   0,   0,   0,   0 ], // ряд 6 (ліс у центрі)
  [  0,   0,   1,   0,   1,   0,   0,   0,   1,   0,   1,   0,   0 ], // ряд 7
  [  2,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   2 ], // ряд 8
  [  0,   0,   1,   0,   1,   0,   1,   0,   1,   0,   1,   0,   0 ], // ряд 9
  [  0,   1,   0,   0,   0,   0,   1,   0,   0,   0,   0,   1,   0 ], // ряд 10
  [  0,   1,   1,   0,   1,   1,   1,   1,   1,   0,   1,   1,   0 ], // ряд 11
  [  0,   0,   0,   0,   0,   1,   0,   1,   0,   0,   0,   0,   0 ], // ряд 12 (орел у блоці 6)
];

// Матеріал за числовим кодом
export const TILE_MATERIAL = ['', 'brick', 'concrete', 'water', 'forest'];

// HP за числовим кодом
export const TILE_HP = [0, 4, 99, 99, 99];

/**
 * Розгортає 13×13 блокову карту у список тайлових об'єктів 26×26.
 * @param {number[][]} blockMap - 13×13 масив
 * @param {number} TILE - розмір тайлу
 * @returns {{ tx, ty, x, y, width, height, material, hp, maxHp }[]}
 */
export function buildTileList(blockMap, TILE) {
  const tiles = [];
  for (let by = 0; by < blockMap.length; by++) {
    for (let bx = 0; bx < blockMap[by].length; bx++) {
      const code = blockMap[by][bx];
      if (code === 0) continue;
      // Кожен блок розгортається у 4 тайли (2×2)
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const tx = bx * 2 + dx;
          const ty = by * 2 + dy;
          tiles.push({
            tx, ty,
            x: tx * TILE,
            y: ty * TILE,
            width:  TILE,
            height: TILE,
            material: TILE_MATERIAL[code],
            hp:    TILE_HP[code],
            maxHp: TILE_HP[code],
          });
        }
      }
    }
  }
  return tiles;
}
