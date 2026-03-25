# 🎮 Урок 6.3: Будуємо рівень — GameField.js

## Поле оживає! 🏗️

Створюємо клас `GameField`, який збирає рівень з тайлів та малює стіни, воду, штаб.

---

## Створюємо `GameField.js`

```javascript
// GameField.js — ігрове поле
// Урок 6: Ігрове поле з даних

import { TILE, FIELD_W, FIELD_H, FIELD_X, FIELD_Y, CANVAS_W, CANVAS_H, TANK_SIZE }
    from './constants.js';
import { LEVEL_1, buildTileList } from './levels.js';
import { fieldBg, borderBg, brickFull, concreteCol, waterCol, forestCol }
    from './colors.js';

/**
 * Клас GameField — управляє ігровим полем.
 * Зберігає масиви стін, води та лісу.
 * Малює карту та перевіряє колізії.
 */
export class GameField {
    constructor() {
        /** @type {Array} Масив стін (brick / concrete) */
        this.walls = [];

        /** @type {Array} Масив води (непрохідна для танків) */
        this.water = [];

        /** @type {Array} Масив лісу (малюється ПОВЕРХ танків) */
        this.forest = [];

        /** Анімація води: 2 кадри, перемикаються кожні 500 мс */
        this.waterFrame = 0;
        this.waterTimer = 0;

        /** Штаб (Орел) — в центрі знизу поля */
        this.eagle = {
            x: 12 * TILE,           // тайл (12, 24)
            y: 24 * TILE,
            width: TANK_SIZE,       // 32×32
            height: TANK_SIZE,
            alive: true,
        };

        // Захисна стінка навколо штабу
        this._buildEagleWall();

        // Розгортаємо карту рівня
        this._buildLevel(LEVEL_1);
    }

    /**
     * Розгортає карту та розподіляє тайли по масивах.
     * @param {number[][]} blockMap — масив 13×13
     */
    _buildLevel(blockMap) {
        // buildTileList перетворює 13×13 блоків у масив тайлових об'єктів
        const tiles = buildTileList(blockMap, TILE);

        // Цикл for...of проходить по кожному тайлу в масиві.
        // Це як "для кожного тайла t зі списку tiles — зроби..."
        for (const t of tiles) {
            // Сортуємо тайли по масивах залежно від матеріалу:
            // continue = "перестрибни на наступний тайл"
            if (t.material === 'water')  { this.water.push(t);  continue; } // вода → окремий масив
            if (t.material === 'forest') { this.forest.push(t); continue; } // ліс → окремий масив
            this.walls.push(t); // все інше (brick, concrete) → стіни
        }
    }

    /**
     * Будує П-подібну цегляну стінку навколо Орла.
     * 6 тайлів: 2 ліворуч, 2 зверху, 2 праворуч.
     *
     * Схема (O = орел, # = цегла):
     *      ##
     *     #OO#
     *     #OO#
     */
    _buildEagleWall() {
        const ex = 12; // тайлова X-координата орла
        const ey = 24; // тайлова Y-координата орла

        // Масив позицій для 6 тайлів стінки
        // [tx, ty] — тайлові координати кожної цеглини
        const positions = [
            [ex - 1, ey], [ex - 1, ey + 1],     // 2 тайли ліворуч від орла
            [ex, ey - 1], [ex + 1, ey - 1],     // 2 тайли зверху
            [ex + 2, ey], [ex + 2, ey + 1],     // 2 тайли праворуч
        ];

        // Цикл: для кожної позиції [tx, ty] зі списку...
        // const [tx, ty] — це "деструктуризація": розпаковуємо масив [11, 24] у tx=11, ty=24
        for (const [tx, ty] of positions) {
            // Створюємо тайл цегли та додаємо до стін
            this.walls.push({
                tx, ty,                            // тайлові координати
                x: tx * TILE, y: ty * TILE,        // піксельні координати
                width: TILE, height: TILE,         // розмір 16×16
                material: 'brick', hp: 1, maxHp: 1,
            });
        }
    }

    // ─── Оновлення ────────────────────────────────────────────────────

    /**
     * Оновлює анімацію води (2 кадри кожні 500 мс).
     * @param {number} dt — deltaTime
     */
    update(dt) {
        this.waterTimer += dt;
        if (this.waterTimer > 500) {
            this.waterFrame = 1 - this.waterFrame; // 0→1→0→1
            this.waterTimer = 0;
        }
    }

    // Колізії (canTankMove, bulletHitWall, damageTile) додамо в уроці 7!

    // ─── Малювання ────────────────────────────────────────────────────

    /**
     * Малює все поле: рамку, фон, воду, стіни, штаб.
     * Ліс малюється ОКРЕМО через renderForest() — поверх танків.
     */
    render(ctx) {
        const ox = FIELD_X;
        const oy = FIELD_Y;

        // Рамка (сірий фон)
        ctx.fillStyle = borderBg;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Чорне поле
        ctx.fillStyle = fieldBg;
        ctx.fillRect(ox, oy, FIELD_W, FIELD_H);

        // Вода (анімована)
        this._drawWater(ctx, ox, oy);

        // Стіни (цегла + бетон)
        for (const t of this.walls) {
            this._drawTile(ctx, t, ox, oy);
        }

        // Штаб (Орел)
        this._drawEagle(ctx, ox, oy);
    }

    /**
     * Малює ліс ПОВЕРХ танків та куль (z-index).
     * Викликається після малювання танків!
     */
    renderForest(ctx) {
        const ox = FIELD_X;
        const oy = FIELD_Y;
        for (const t of this.forest) {
            ctx.fillStyle = forestCol;
            ctx.fillRect(t.x + ox, t.y + oy, TILE, TILE);
            // Деталі листя
            ctx.fillStyle = '#009000';
            ctx.fillRect(t.x + ox + 2, t.y + oy + 2, 4, 4);
            ctx.fillRect(t.x + ox + 10, t.y + oy + 6, 4, 4);
        }
    }

    // ─── Приватні методи малювання ─────────────────────────────────────

    /** Малює воду з анімацією хвиль */
    _drawWater(ctx, ox, oy) {
        for (const t of this.water) {
            const dx = t.x + ox;
            const dy = t.y + oy;
            ctx.fillStyle = waterCol;
            ctx.fillRect(dx, dy, TILE, TILE);
            // Хвилі (зсув залежить від кадру анімації)
            ctx.strokeStyle = '#5070fc';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const ly = dy + 3 + i * 5 + this.waterFrame * 2;
                ctx.beginPath();
                ctx.moveTo(dx + 1, ly);
                ctx.lineTo(dx + TILE - 1, ly);
                ctx.stroke();
            }
        }
    }

    /** Малює один тайл стіни (цегла або бетон) */
    _drawTile(ctx, t, ox, oy) {
        const dx = t.x + ox;
        const dy = t.y + oy;

        if (t.material === 'brick') {
            ctx.fillStyle = brickFull;
            ctx.fillRect(dx, dy, TILE, TILE);
            // Цегляний візерунок
            ctx.strokeStyle = '#801010';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(dx, dy, TILE / 2, TILE / 2);
            ctx.strokeRect(dx + TILE / 2, dy + TILE / 2, TILE / 2, TILE / 2);
        } else if (t.material === 'concrete') {
            ctx.fillStyle = concreteCol;
            ctx.fillRect(dx, dy, TILE, TILE);
            // Бетонна рамка
            ctx.strokeStyle = '#9a9a9a';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(dx + 1, dy + 1, TILE - 2, TILE - 2);
        }
    }

    /** Малює штаб (Орел) — живий або знищений */
    _drawEagle(ctx, ox, oy) {
        const e = this.eagle;
        const dx = e.x + ox;
        const dy = e.y + oy;
        const s = e.width;

        if (e.alive) {
            ctx.fillStyle = '#7c7c7c';
            ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
            ctx.fillStyle = '#e04038';
            ctx.font = `${s * 0.6}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('\u2655', dx + s / 2, dy + s / 2); // ♕ символ орла
        } else {
            ctx.fillStyle = '#3c3c3c';
            ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
            // Хрестик "знищено"
            ctx.strokeStyle = '#e04038';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(dx + 6, dy + 6);
            ctx.lineTo(dx + s - 6, dy + s - 6);
            ctx.moveTo(dx + s - 6, dy + 6);
            ctx.lineTo(dx + 6, dy + s - 6);
            ctx.stroke();
        }
    }
}
```

---

## Розбираємо архітектуру

### Три масиви

GameField розділяє тайли по **призначенню**:

```
buildTileList() → tiles[]
    │
    ├── material === 'water'  → this.water[]   (непрохідна)
    ├── material === 'forest' → this.forest[]  (малюється поверх)
    └── інше ('brick'/'concrete') → this.walls[] (перешкоди)
```

### Колізії — в наступному уроці!

Поки що танк проїжджає крізь стіни (`() => true`). В уроці 7 ми додамо `canTankMove()` — і стіни стануть непрохідними!

### `render()` vs `renderForest()`

Ліс малюється **окремо** після танків, щоб танки проїжджали "під" лісом:

```
Порядок малювання:
1. field.render()     ← стіни, вода, штаб
2. player.render()    ← танк
3. bullets.render()   ← кулі
4. field.renderForest() ← ліс ПОВЕРХ танків
```

---

## Підсумок

- ✅ `GameField` зберігає walls[], water[], forest[] та eagle
- ✅ `_buildLevel()` розгортає карту з levels.js
- ✅ `_buildEagleWall()` створює П-подібну стінку навколо штабу
- ✅ `render()` малює поле, `renderForest()` — ліс поверх танків
- ✅ Колізії (canTankMove, bulletHitWall) — будуть в уроці 7
