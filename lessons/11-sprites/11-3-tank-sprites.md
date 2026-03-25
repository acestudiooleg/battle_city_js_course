# 🎮 Урок 11.3: Спрайти танків

## Як влаштовані спрайти танків?

На спрайт-листі кожен тип танка займає **1 або 2 рядки** по 16 пікселів висотою. В кожному рядку — **8 спрайтів** (4 напрямки × 2 кадри анімації):

```
Рядок танка (128 пікселів ширини):
┌────┬────┬────┬────┬────┬────┬────┬────┐
│UP  │UP  │LEFT│LEFT│DOWN│DOWN│RGHT│RGHT│
│ F1 │ F2 │ F1 │ F2 │ F1 │ F2 │ F1 │ F2 │
└────┴────┴────┴────┴────┴────┴────┴────┘
 col0 col1 col2 col3 col4 col5 col6 col7
```

- **F1, F2** — два кадри анімації гусениць. Чергуємо для ефекту руху
- **DIR_COL** — таблиця яка колонка для якого напрямку: `{ up: 0, left: 2, down: 4, right: 6 }`

---

## 🔧 Оновлюємо Tank.js

Спочатку імпортуємо те, що потрібно з SpriteSheet:

```js
// Tank.js — додаємо на початку файлу
import { spriteSheet, DIR_COL } from './SpriteSheet.js';
```

Додаємо спрайтове малювання в `render()`:

```js
// В конструкторі Tank додаємо:
// Координати спрайта на листі (буде встановлено в Player/Enemy)
this.spriteX = 0;  // базова X на спрайт-листі
this.spriteY = 0;  // базова Y на спрайт-листі
```

```js
/**
 * Малювання танка — зі спрайтів або fallback
 */
render(ctx, ox, oy) {
    if (!this.alive) return;

    // Позиція на Canvas
    const dx = Math.round(this.x) + ox;
    const dy = Math.round(this.y) + oy;

    // Спробуємо намалювати зі спрайт-листа
    if (spriteSheet.ready) {
        // Визначаємо колонку за напрямком: up=0, left=2, down=4, right=6
        const col = DIR_COL[this.direction] ?? 0;

        // Додаємо кадр анімації (0 або 1)
        // Парний кадр = F1 (col+0), непарний = F2 (col+1)
        const frame = col + this.animFrame;

        // Обчислюємо координати на спрайт-листі
        // Кожна колонка = 16 пікселів
        const sx = this.spriteX + frame * 16;
        const sy = this.spriteY;

        // Малюємо спрайт 16×16 → масштабуємо до 32×32
        ctx.drawImage(
            spriteSheet.img,
            sx, sy, 16, 16,      // джерело: 16×16 на листі
            dx, dy,              // куди на Canvas
            this.width, this.height  // 32×32 на Canvas
        );
    } else {
        // Fallback — програмне малювання (як раніше)
        ctx.save();
        this._drawTreads(ctx, dx, dy, this.width);
        ctx.fillStyle = this.color;
        ctx.fillRect(dx + 4, dy + 4, this.width - 8, this.height - 8);
        this._drawBarrel(ctx, dx, dy, this.width);
        ctx.restore();
    }
}
```

### Як це працює?

1. **`spriteSheet.ready`** — перевіряємо чи картинка завантажилась
2. **`DIR_COL[this.direction]`** — знаходимо колонку за напрямком (up=0, left=2, down=4, right=6)
3. **`+ this.animFrame`** — додаємо 0 або 1 для анімації гусениць
4. **`spriteX + frame * 16`** — обчислюємо координату X на листі
5. Малюємо 16×16 → 32×32 (збільшення вдвічі)

### Fallback:

Якщо картинка ще не завантажилась — використовуємо старе програмне малювання (`fillRect`). Це гарантує що гра працює навіть без спрайтів!

---

## 🔧 Оновлюємо Player.js та Enemy.js

В `Player.js`:
```js
// В конструкторі:
this.spriteX = PLAYER1_SPRITE.x;  // 0
this.spriteY = PLAYER1_SPRITE.y;  // 0
```

В `Enemy.js`:
```js
// В конструкторі:
const spr = ENEMY_SPRITES[type] ?? ENEMY_SPRITES.basic;
this.spriteX = spr.x;  // 128
this.spriteY = spr.y;  // 0, 32, 64, або 96 залежно від типу
```

---

## ✅ Що далі

В підуроці 11.4 ми замінимо малювання тайлів (цегла, бетон, вода, ліс) на спрайти.
