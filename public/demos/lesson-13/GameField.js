// GameField.js — Урок 11: + спрайтове малювання тайлів
import { TILE, FIELD_W, FIELD_H, FIELD_X, FIELD_Y, CANVAS_W, CANVAS_H, TANK_SIZE }
    from './constants.js';
import { LEVEL_1, buildTileList } from './levels.js';
import { fieldBg, borderBg, brickFull, concreteCol, waterCol, forestCol } from './colors.js';
import { spriteSheet, TILE_SPRITES, WATER_SPRITES, FOREST_SPRITE, EAGLE_SPRITES } from './SpriteSheet.js';

export class GameField {
    constructor() {
        this.walls = []; this.water = []; this.forest = [];
        this.waterFrame = 0; this.waterTimer = 0;
        this.eagle = { x: 12 * TILE, y: 24 * TILE, width: TANK_SIZE, height: TANK_SIZE, alive: true };
        this._buildEagleWall();
        this._buildLevel(LEVEL_1);
    }

    _buildLevel(blockMap) {
        const tiles = buildTileList(blockMap, TILE);
        for (const t of tiles) {
            if (t.material === 'water') { this.water.push(t); continue; }
            if (t.material === 'forest') { this.forest.push(t); continue; }
            this.walls.push(t);
        }
    }

    _buildEagleWall() {
        const ex = 12, ey = 24;
        const positions = [[ex-1,ey],[ex-1,ey+1],[ex,ey-1],[ex+1,ey-1],[ex+2,ey],[ex+2,ey+1]];
        for (const [tx, ty] of positions) {
            this.walls.push({ tx, ty, x: tx*TILE, y: ty*TILE, width: TILE, height: TILE, material: 'brick', hp: 1, maxHp: 1 });
        }
    }

    update(dt) {
        this.waterTimer += dt;
        if (this.waterTimer > 500) { this.waterFrame = 1 - this.waterFrame; this.waterTimer = 0; }
    }

    canTankMove(tank, nx, ny) {
        const w = tank.width, h = tank.height;
        if (nx < 0 || ny < 0 || nx + w > FIELD_W || ny + h > FIELD_H) return false;
        for (const t of this.walls) { if (nx < t.x+t.width && nx+w > t.x && ny < t.y+t.height && ny+h > t.y) return false; }
        for (const t of this.water) { if (nx < t.x+t.width && nx+w > t.x && ny < t.y+t.height && ny+h > t.y) return false; }
        const e = this.eagle;
        if (e.alive && nx < e.x+e.width && nx+w > e.x && ny < e.y+e.height && ny+h > e.y) return false;
        return true;
    }

    bulletHitWall(bx, by, bw, bh) {
        for (const t of this.walls) { if (bx < t.x+t.width && bx+bw > t.x && by < t.y+t.height && by+bh > t.y) return t; }
        return null;
    }

    bulletHitEagle(bx, by, bw, bh) {
        if (!this.eagle.alive) return false;
        const e = this.eagle;
        return bx < e.x+e.width && bx+bw > e.x && by < e.y+e.height && by+bh > e.y;
    }

    damageTile(tile, dmg = 1) {
        tile.hp -= dmg;
        if (tile.hp <= 0) { const idx = this.walls.indexOf(tile); if (idx !== -1) this.walls.splice(idx, 1); return true; }
        return false;
    }

    destroyEagle() { this.eagle.alive = false; }
    isEagleDestroyed() { return !this.eagle.alive; }

    fortifyEagle() {
        this._removeEagleWall();
        this._buildEagleWallMaterial('concrete');
    }

    unfortifyEagle() {
        this._removeEagleWall();
        this._buildEagleWall();
    }

    _removeEagleWall() {
        const ex = 12, ey = 24;
        const positions = [[ex-1,ey],[ex-1,ey+1],[ex,ey-1],[ex+1,ey-1],[ex+2,ey],[ex+2,ey+1]];
        for (const [tx, ty] of positions) {
            const idx = this.walls.findIndex(t => t.tx === tx && t.ty === ty);
            if (idx !== -1) this.walls.splice(idx, 1);
        }
    }

    _buildEagleWallMaterial(material) {
        const ex = 12, ey = 24;
        const positions = [[ex-1,ey],[ex-1,ey+1],[ex,ey-1],[ex+1,ey-1],[ex+2,ey],[ex+2,ey+1]];
        const hp = material === 'concrete' ? 999 : 1;
        for (const [tx, ty] of positions) {
            this.walls.push({ tx, ty, x: tx * TILE, y: ty * TILE, width: TILE, height: TILE, material, hp, maxHp: hp });
        }
    }

    findWallAt(tx, ty) { return this.walls.find(t => t.tx === tx && t.ty === ty) || null; }

    destroyBrickPair(hitTile, bulletDir) {
        if (hitTile.material !== 'brick') return false;
        const { tx, ty } = hitTile;
        let partnerTx, partnerTy;
        if (bulletDir === 'up' || bulletDir === 'down') { partnerTx = (tx%2===0)?tx+1:tx-1; partnerTy = ty; }
        else { partnerTx = tx; partnerTy = (ty%2===0)?ty+1:ty-1; }
        this.damageTile(hitTile, hitTile.hp);
        const partner = this.findWallAt(partnerTx, partnerTy);
        if (partner && partner.material === 'brick') this.damageTile(partner, partner.hp);
        return true;
    }

    render(ctx) {
        const ox = FIELD_X, oy = FIELD_Y;
        ctx.fillStyle = borderBg; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = fieldBg; ctx.fillRect(ox, oy, FIELD_W, FIELD_H);
        this._drawWater(ctx, ox, oy);
        for (const t of this.walls) this._drawTile(ctx, t, ox, oy);
        this._drawEagle(ctx, ox, oy);
    }

    renderForest(ctx) {
        const ox = FIELD_X, oy = FIELD_Y;
        for (const t of this.forest) {
            const dx = t.x + ox, dy = t.y + oy;
            if (spriteSheet.ready) {
                const qx = t.tx % 2, qy = t.ty % 2;
                ctx.drawImage(spriteSheet.img, FOREST_SPRITE.x + qx*8, FOREST_SPRITE.y + qy*8, 8, 8, dx, dy, TILE, TILE);
            } else {
                ctx.fillStyle = forestCol; ctx.fillRect(dx, dy, TILE, TILE);
                ctx.fillStyle = '#009000'; ctx.fillRect(dx+2, dy+2, 4, 4); ctx.fillRect(dx+10, dy+6, 4, 4);
            }
        }
    }

    _drawWater(ctx, ox, oy) {
        const spr = WATER_SPRITES[this.waterFrame];
        for (const t of this.water) {
            const dx = t.x + ox, dy = t.y + oy;
            if (spriteSheet.ready) {
                const qx = t.tx % 2, qy = t.ty % 2;
                ctx.drawImage(spriteSheet.img, spr.x + qx*8, spr.y + qy*8, 8, 8, dx, dy, TILE, TILE);
            } else {
                ctx.fillStyle = waterCol; ctx.fillRect(dx, dy, TILE, TILE);
            }
        }
    }

    _drawTile(ctx, t, ox, oy) {
        const dx = t.x + ox, dy = t.y + oy;
        if (spriteSheet.ready) {
            const spr = TILE_SPRITES[t.material];
            if (spr) {
                const qx = t.tx % 2, qy = t.ty % 2;
                ctx.drawImage(spriteSheet.img, spr.x + qx*8, spr.y + qy*8, 8, 8, dx, dy, TILE, TILE);
                return;
            }
        }
        if (t.material === 'brick') {
            ctx.fillStyle = brickFull; ctx.fillRect(dx, dy, TILE, TILE);
            ctx.strokeStyle = '#801010'; ctx.lineWidth = 0.5;
            ctx.strokeRect(dx, dy, TILE/2, TILE/2); ctx.strokeRect(dx+TILE/2, dy+TILE/2, TILE/2, TILE/2);
        } else if (t.material === 'concrete') {
            ctx.fillStyle = concreteCol; ctx.fillRect(dx, dy, TILE, TILE);
            ctx.strokeStyle = '#9a9a9a'; ctx.lineWidth = 0.5; ctx.strokeRect(dx+1, dy+1, TILE-2, TILE-2);
        }
    }

    _drawEagle(ctx, ox, oy) {
        const e = this.eagle, dx = e.x + ox, dy = e.y + oy, s = e.width;
        if (spriteSheet.ready) {
            const spr = e.alive ? EAGLE_SPRITES.alive : EAGLE_SPRITES.dead;
            ctx.drawImage(spriteSheet.img, spr.x, spr.y, 16, 16, dx, dy, s, s);
            return;
        }
        if (e.alive) {
            ctx.fillStyle = '#7c7c7c'; ctx.fillRect(dx+4, dy+4, s-8, s-8);
            ctx.fillStyle = '#e04038'; ctx.font = `${s*0.6}px monospace`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('\u2655', dx+s/2, dy+s/2);
        } else {
            ctx.fillStyle = '#3c3c3c'; ctx.fillRect(dx+4, dy+4, s-8, s-8);
            ctx.strokeStyle = '#e04038'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(dx+6,dy+6); ctx.lineTo(dx+s-6,dy+s-6);
            ctx.moveTo(dx+s-6,dy+6); ctx.lineTo(dx+6,dy+s-6); ctx.stroke();
        }
    }
}
