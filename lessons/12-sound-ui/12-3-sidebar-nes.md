# 📊 Урок 12.3: Sidebar в NES-стилі

## Що таке Sidebar?

Sidebar — бічна панель справа від ігрового поля. В оригінальній NES Battle City вона показує:

```
┌─────────┐
│ ▪▪ ▪▪   │  ← іконки ворогів (2 колонки)
│ ▪▪ ▪▪   │     кожна іконка = 1 ворог у черзі
│ ▪▪ ▪▪   │
│ ▪▪ ▪▪   │
│          │
│ IP       │  ← "I Player" лейбл
│ 🔶 3     │  ← іконка танка + кількість життів
│          │
│ ┃        │  ← древко прапора
│ ◥        │  ← прапор (оранжевий)
│  1       │  ← номер рівня
└─────────┘
```

---

## 🔧 Малюємо Sidebar

### Іконки ворогів (2 колонки)

```js
/**
 * Малює бічну панель (sidebar) — інформація про гру.
 * Викликається кожен кадр після малювання поля.
 */
_renderSidebar(ctx) {
    // sx — початок sidebar по X
    const sx = BORDER + FIELD_W + BORDER;

    // Фон sidebar — сірий як рамка (перезаписуємо все що було)
    ctx.fillStyle = sidebarBg;
    ctx.fillRect(sx, 0, SIDEBAR_W, CANVAS_H);

    // ─── Іконки ворогів ──────────────────────────────────
    // Рахуємо скільки ворогів залишилось (у черзі + на полі)
    const remaining = this.spawnQueue.length + this.enemies.length;

    // Розміри однієї іконки
    const iconSize = 8;   // 8 пікселів ширина/висота
    const iconGap  = 2;   // 2 пікселі відстань між іконками
    const iconsX   = sx + 16;  // початок іконок по X
    let   iconsY   = BORDER + 8;  // початок по Y

    // Цикл: малюємо i-ту іконку
    for (let i = 0; i < remaining; i++) {
        // col — колонка (0 або 1). Ділимо на 2 із залишком
        // i=0 → col=0, i=1 → col=1, i=2 → col=0, i=3 → col=1...
        const col = i % 2;

        // row — рядок. Ділимо на 2 і відкидаємо дробову частину
        // i=0 → row=0, i=1 → row=0, i=2 → row=1, i=3 → row=1...
        const row = Math.floor(i / 2);

        // Обчислюємо позицію іконки на Canvas
        const ix = iconsX + col * (iconSize + iconGap);
        const iy = iconsY + row * (iconSize + iconGap);

        // Малюємо маленький танк-іконку (чорне тло + темний корпус)
        ctx.fillStyle = '#000';
        ctx.fillRect(ix, iy, iconSize, iconSize);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(ix + 1, iy, 2, iconSize);           // ліва гусениця
        ctx.fillRect(ix + iconSize - 3, iy, 2, iconSize); // права гусениця
        ctx.fillRect(ix + 2, iy + 1, iconSize - 4, iconSize - 2); // корпус
    }
```

---

### Блок гравця (IP + іконка + життя)

```js
    // ─── Блок гравця ──────────────────────────────────
    // "IP" = "I Player" (римська цифра I = перший)
    this._renderPlayerBlock(ctx, this.player, iconsX, CANVAS_H - BORDER - 120, 'I', '#e7a821');

    // ─── Прапор з номером рівня ──────────────────────
    const flagY = CANVAS_H - BORDER - 44;

    // Древко — тонка вертикальна лінія
    ctx.fillStyle = '#000';
    ctx.fillRect(iconsX + 8, flagY, 2, 26);

    // Прапор — оранжевий трикутник
    // beginPath → moveTo → lineTo → closePath → fill
    // Це "малювання від руки" — з'єднуємо 3 точки в трикутник
    ctx.fillStyle = '#f15b3e';
    ctx.beginPath();
    ctx.moveTo(iconsX, flagY);       // верхній лівий кут
    ctx.lineTo(iconsX + 8, flagY);   // верхній правий кут
    ctx.lineTo(iconsX, flagY + 12);  // нижній лівий кут
    ctx.closePath();                  // замикаємо трикутник
    ctx.fill();                       // зафарбовуємо

    // Номер рівня
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('1', iconsX + 8, flagY + 38);
    ctx.textAlign = 'left';
}
```

---

### Допоміжний метод для блоку гравця

```js
/**
 * Малює блок гравця на sidebar:
 * - Лейбл "IP" (I Player) або "IIP" (II Player)
 * - Маленька іконка танка
 * - Цифра — кількість життів
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Player} player - об'єкт гравця
 * @param {number} x      - позиція X
 * @param {number} y      - позиція Y
 * @param {string} label  - 'I' або 'II'
 * @param {string} tankColor - колір іконки танка
 */
_renderPlayerBlock(ctx, player, x, y, label, tankColor) {
    // Лейбл ("I" чорним + "P" червоним)
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#e04038';           // "P" = червоний як в NES
    ctx.fillText('P', x + label.length * 7, y);

    // Іконка танка (маленький прямокутник)
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y + 6, 10, 10);      // чорне тло
    ctx.fillStyle = tankColor;
    ctx.fillRect(x + 2, y + 7, 6, 8);    // кольоровий корпус

    // Кількість життів (цифра праворуч від іконки)
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(String(player.lives), x + 14, y + 16);
}
```

---

## 📖 Розбираємо: `beginPath` та `lineTo`

Canvas вміє малювати не тільки прямокутники! За допомогою **шляху** (path) можна малювати будь-які фігури:

```js
ctx.beginPath();           // 1. Починаємо новий шлях
ctx.moveTo(10, 10);       // 2. Ставимо "ручку" в точку (10, 10)
ctx.lineTo(50, 10);       // 3. Лінія до (50, 10) — верхня сторона
ctx.lineTo(30, 40);       // 4. Лінія до (30, 40) — права сторона
ctx.closePath();           // 5. Замикаємо — лінія назад до (10, 10)
ctx.fill();                // 6. Зафарбовуємо всередині
```

---

## Підсумок

- ✅ Навчились малювати іконки ворогів у 2 колонки
- ✅ Блок гравця: лейбл "IP" + іконка + кількість життів
- ✅ Прапор з номером рівня (трикутник через `beginPath`)
- ✅ Розібрали `beginPath` / `lineTo` / `closePath` / `fill`

**Далі:** CSS масштаб та фінальне полірування!
