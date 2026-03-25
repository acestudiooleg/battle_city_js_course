# 🧱 Урок 11.4: Спрайти тайлів

## Чвертинки 8×8

Тайли (цегла, бетон, вода, ліс) на спрайт-листі мають розмір **16×16 пікселів**, але наш `TILE` теж `= 16`. Блок на карті = **2×2 тайли** = 32×32 пікселів.

Кожен тайл (16×16 на полі) — це **чвертинка** (8×8) з блоку 16×16 на листі:

```
Блок на спрайт-листі (16×16):       4 тайли на полі (кожен 16×16):
┌────────┬────────┐                ┌──────────────┬──────────────┐
│ TL 8×8 │ TR 8×8 │                │  TL (tx%2=0) │  TR (tx%2=1) │
│ qx=0   │ qx=1   │    ═══►       │  qy=0        │  qy=0        │
├────────┼────────┤                ├──────────────┼──────────────┤
│ BL 8×8 │ BR 8×8 │                │  BL (tx%2=0) │  BR (tx%2=1) │
│ qy=1   │ qy=1   │                │  qy=1        │  qy=1        │
└────────┴────────┘                └──────────────┴──────────────┘
```

- **`qx = tx % 2`** — чвертинка по X (0=ліва, 1=права)
- **`qy = ty % 2`** — чвертинка по Y (0=верхня, 1=нижня)

---

## 🔧 Оновлюємо GameField.js

Спочатку імпортуємо всі спрайтові константи:

```js
// GameField.js — додаємо на початку файлу
import { spriteSheet, TILE_SPRITES, WATER_SPRITES, FOREST_SPRITE, EAGLE_SPRITES } from './SpriteSheet.js';
```

### Малювання стін:

```js
/**
 * Малює один тайл стіни (цегла або бетон)
 * @param {object} t - об'єкт тайла {tx, ty, x, y, material, ...}
 */
_drawTile(ctx, t, ox, oy) {
    const dx = t.x + ox; // позиція X на Canvas
    const dy = t.y + oy; // позиція Y на Canvas

    // Спробуємо намалювати зі спрайтів
    if (spriteSheet.ready) {
        // Знаходимо спрайт для цього матеріалу
        const spr = TILE_SPRITES[t.material];
        if (spr) {
            // Визначаємо яку чвертинку вирізати
            const qx = t.tx % 2; // 0 = ліва, 1 = права
            const qy = t.ty % 2; // 0 = верхня, 1 = нижня

            // Вирізаємо чвертинку 8×8 і масштабуємо до TILE (16×16)
            ctx.drawImage(
                spriteSheet.img,
                spr.x + qx * 8,  // X на листі (зсув чвертинки)
                spr.y + qy * 8,  // Y на листі
                8, 8,             // розмір вирізки (8×8)
                dx, dy,           // куди на Canvas
                TILE, TILE        // розмір на Canvas (16×16)
            );
            return;
        }
    }

    // Fallback — програмне малювання (як раніше)
    if (t.material === 'brick') {
        ctx.fillStyle = brickFull;
        ctx.fillRect(dx, dy, TILE, TILE);
        // ... лінії цегли ...
    } else if (t.material === 'concrete') {
        ctx.fillStyle = concreteCol;
        ctx.fillRect(dx, dy, TILE, TILE);
    }
}
```

### Малювання води (з анімацією):

```js
/**
 * Малює воду — 2 кадри анімації чергуються кожні 500мс
 */
_drawWater(ctx, ox, oy) {
    // Обираємо кадр анімації (0 або 1)
    const spr = WATER_SPRITES[this.waterFrame];

    for (const t of this.water) {
        const dx = t.x + ox;
        const dy = t.y + oy;

        if (spriteSheet.ready) {
            // Чвертинка 8×8
            const qx = t.tx % 2;
            const qy = t.ty % 2;
            ctx.drawImage(
                spriteSheet.img,
                spr.x + qx * 8, spr.y + qy * 8, 8, 8,
                dx, dy, TILE, TILE
            );
        } else {
            // Fallback
            ctx.fillStyle = waterCol;
            ctx.fillRect(dx, dy, TILE, TILE);
        }
    }
}
```

### Малювання лісу:

```js
/**
 * Ліс малюється ПОВЕРХ танків та куль (z-index)
 * Це створює ефект "танк заїхав у ліс і його не видно"
 */
renderForest(ctx) {
    const ox = FIELD_X;
    const oy = FIELD_Y;

    for (const t of this.forest) {
        const dx = t.x + ox;
        const dy = t.y + oy;

        if (spriteSheet.ready) {
            const qx = t.tx % 2;
            const qy = t.ty % 2;
            ctx.drawImage(
                spriteSheet.img,
                FOREST_SPRITE.x + qx * 8,
                FOREST_SPRITE.y + qy * 8,
                8, 8,
                dx, dy, TILE, TILE
            );
        } else {
            // Fallback — зелені квадратики
            ctx.fillStyle = forestCol;
            ctx.fillRect(dx, dy, TILE, TILE);
            ctx.fillStyle = '#009000';
            ctx.fillRect(dx + 2, dy + 2, 4, 4);
        }
    }
}
```

---

## ✅ Що далі

В підуроці 11.5 ми додамо спрайти Орла та spawn-зірки, а також збережемо fallback малювання.
