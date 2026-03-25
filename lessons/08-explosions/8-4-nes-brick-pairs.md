# 🎮 Урок 8.4: NES-руйнування цегли парами

## Як в оригіналі! 🧱💥🧱

В оригінальному NES Battle City куля руйнує **2 тайли одночасно** — з того боку блоку, звідки вона прилетіла.

---

## Блок 32×32 = 4 тайли

```
Блок (2×2 тайли):

  ┌────┬────┐
  │ TL │ TR │   TL = top-left     (tx%2=0, ty%2=0)
  ├────┼────┤   TR = top-right    (tx%2=1, ty%2=0)
  │ BL │ BR │   BL = bottom-left  (tx%2=0, ty%2=1)
  └────┴────┘   BR = bottom-right (tx%2=1, ty%2=1)
```

---

## Правила NES

| Напрямок кулі | Руйнує | Пояснення |
|---------------|--------|-----------|
| ↓ (down) | TL + TR | Куля летить вниз → влучає зверху |
| ↑ (up) | BL + BR | Куля летить вгору → влучає знизу |
| → (right) | TL + BL | Куля летить вправо → влучає зліва |
| ← (left) | TR + BR | Куля летить вліво → влучає справа |

```
Куля ↓ :        Куля → :
  ■               ■ →
  ↓
┌────┬────┐     ┌────┬────┐
│ 💥 │ 💥 │     │ 💥 │    │
├────┼────┤     ├────┼────┤
│    │    │     │ 💥 │    │
└────┴────┘     └────┴────┘
```

---

## `destroyBrickPair()` в GameField

```javascript
/**
 * NES-стиль: руйнує 2 тайли з того боку, звідки летить куля.
 * @param {Object} hitTile    — тайл, у який влучила куля
 * @param {string} bulletDir  — напрямок кулі: 'up', 'down', 'left', 'right'
 */
destroyBrickPair(hitTile, bulletDir) {
    if (hitTile.material !== 'brick') return false;

    const { tx, ty } = hitTile;
    let partnerTx, partnerTy;

    if (bulletDir === 'up' || bulletDir === 'down') {
        // Горизонтальна пара: той самий ty, інший tx у межах блоку
        partnerTx = (tx % 2 === 0) ? tx + 1 : tx - 1;
        partnerTy = ty;
    } else {
        // Вертикальна пара: той самий tx, інший ty у межах блоку
        partnerTx = tx;
        partnerTy = (ty % 2 === 0) ? ty + 1 : ty - 1;
    }

    // Знищити влучений тайл
    this.damageTile(hitTile, hitTile.hp);

    // Знищити партнера (якщо існує і це цегла)
    const partner = this.findWallAt(partnerTx, partnerTy);
    if (partner && partner.material === 'brick') {
        this.damageTile(partner, partner.hp);
    }

    return true;
}

/** Знайти тайл за тайловими координатами */
findWallAt(tx, ty) {
    return this.walls.find(t => t.tx === tx && t.ty === ty) || null;
}
```

---

## Як це працює?

Приклад: куля летить вниз (↓), влучає в тайл `(4, 2)`:

```
tx=4, ty=2 — це TL (tx%2=0, ty%2=0)
bulletDir = 'down' → горизонтальна пара
partnerTx = 4 + 1 = 5 (наступний по X)
partnerTy = 2 (той самий Y)

Результат: знищуємо (4,2) та (5,2) — верхня пара блоку!
```

---

## Оновлюємо CollisionManager

```javascript
// Замість:
this.field.damageTile(tile);

// Тепер:
this.field.destroyBrickPair(tile, b.direction);
```

---

## Підсумок Дня 8

За цей урок ти:
- ✅ Створив `Explosion.js` — систему частинок з 3 типами
- ✅ Підключив вибухи через callback до CollisionManager
- ✅ Простежив повний ланцюжок: Space → Bullet → Collision → Explosion
- ✅ Додав NES-руйнування цегли парами (`destroyBrickPair`)

**Вибухи виглядають круто!** Завтра додамо штаб та стан гри! 🏆

---

## 🔄 Що буде далі?

У наступному уроці ми:
- 🦅 Додамо логіку штабу (Орла) — якщо знищений → Game Over
- 💀 Game Over анімація (текст знизу вгору, NES-стиль)
- 🏆 Перемога: коли всі вороги знищені
- ⏸️ Пауза (P) та рестарт (R)

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-08/game.html){target="_blank"}
