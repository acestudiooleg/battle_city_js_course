// SpriteSheet.js — завантаження спрайтів
// Урок 11: NES графіка

class _SpriteSheet {
    constructor() {
        this.img = new Image();
        this.ready = false;
        this.img.onload = () => { this.ready = true; };
        this.img.src = '../../assets/battlecity_general.png';
    }
    draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (!this.ready) return false;
        ctx.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh);
        return true;
    }
}

export const spriteSheet = new _SpriteSheet();

export const DIR_COL = { up: 0, left: 2, down: 4, right: 6 };
export const PLAYER1_SPRITE = { x: 0, y: 0 };
export const PLAYER2_SPRITE = { x: 0, y: 128 };

export const ENEMY_SPRITES = {
    basic: { x: 128, y: 0 },
    fast:  { x: 128, y: 32 },
    power: { x: 128, y: 64 },
    armor: { x: 128, y: 96 },
};

export const TILE_SPRITES = {
    brick:    { x: 256, y: 0 },
    concrete: { x: 256, y: 16 },
};
export const WATER_SPRITES = [
    { x: 256, y: 32 },
    { x: 256, y: 48 },
];
export const FOREST_SPRITE = { x: 272, y: 32 };

export const EAGLE_SPRITES = {
    alive: { x: 304, y: 32 },
    dead:  { x: 320, y: 32 },
};

export const SPAWN_STAR_SPRITES = [
    { x: 256, y: 96 },
    { x: 272, y: 96 },
    { x: 288, y: 96 },
    { x: 304, y: 96 },
];

export const POWERUP_SPRITES = {
    helmet:  { x: 256, y: 112 },
    timer:   { x: 272, y: 112 },
    shovel:  { x: 288, y: 112 },
    star:    { x: 304, y: 112 },
    grenade: { x: 320, y: 112 },
    tank:    { x: 336, y: 112 },
};
