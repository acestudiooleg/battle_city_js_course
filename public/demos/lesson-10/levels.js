// levels.js — дані рівнів
// Урок 6: Ігрове поле

export const LEVEL_1 = [
  [  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [  0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0 ],
  [  0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
  [  0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0 ],
  [  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
  [  0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
  [  0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0 ],
  [  0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0 ],
  [  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
  [  0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0 ],
  [  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 ],
  [  0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0 ],
  [  0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
];

export const TILE_MATERIAL = ['', 'brick', 'concrete', 'water', 'forest'];
export const TILE_HP = [0, 1, 99, 99, 99];

export function buildTileList(blockMap, TILE) {
    const tiles = [];
    for (let by = 0; by < blockMap.length; by++) {
        for (let bx = 0; bx < blockMap[by].length; bx++) {
            const code = blockMap[by][bx];
            if (code === 0) continue;
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const tx = bx * 2 + dx;
                    const ty = by * 2 + dy;
                    tiles.push({
                        tx, ty,
                        x: tx * TILE, y: ty * TILE,
                        width: TILE, height: TILE,
                        material: TILE_MATERIAL[code],
                        hp: TILE_HP[code], maxHp: TILE_HP[code],
                    });
                }
            }
        }
    }
    return tiles;
}
