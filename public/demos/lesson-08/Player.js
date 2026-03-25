// Player.js — танк гравця
// Урок 3: Малюємо танк

import { Tank } from './Tank.js';
import { TILE } from './constants.js';
import { playerYellow } from './colors.js';

export class Player extends Tank {
    constructor() {
        // Спавн: тайл (8, 24) — стандартна позиція NES Battle City
        const spawnX = 8 * TILE;
        const spawnY = 24 * TILE;

        super(spawnX, spawnY, playerYellow, 2, 1);

        this.direction = 'up';
    }
}
