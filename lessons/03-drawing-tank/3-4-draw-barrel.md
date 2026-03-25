# 🎮 Урок 3.4: _drawBarrel() — дуло за напрямком

## Танку потрібне дуло! 🔫

Без дула танк виглядає як простий квадрат. Додаємо дуло, яке дивиться у напрямку руху!

---

## 📐 Де знаходиться дуло

Дуло — прямокутник, що виступає **за межі корпусу** в напрямку руху:

```
      UP          DOWN        LEFT         RIGHT
   ┌──┬──┐      ┌──────┐    ┌──────┐    ┌──────┐
   │  │  │      │      │    │      │    │      │
   │  │  │      │      │    │      │    │      │
   │  ╵  │      │      │    │      │    │      │
   └──────┘      │  ╷  │  ──┤      │    │      ├──
                 └──┴──┘    └──────┘    └──────┘
```

---

## ✍️ Додаємо _drawBarrel() до Tank.js

Після методу `_drawTreads` додай:

```js
    _drawBarrel(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;

        // Довжина дула — 55% від розміру танка
        const barrelLen = sz * 0.55;
        // Ширина дула — 20% від розміру танка
        const barrelW   = sz * 0.2;

        // Центр дула (горизонтальний або вертикальний)
        const cx = sx + sz / 2 - barrelW / 2;
        const cy = sy + sz / 2 - barrelW / 2;

        switch (this.direction) {
            case 'up':
                // Дуло виступає ВГОРУ від корпусу
                ctx.fillRect(cx, sy - barrelLen, barrelW, barrelLen);
                break;
            case 'down':
                // Дуло виступає ВНИЗ
                ctx.fillRect(cx, sy + sz, barrelW, barrelLen);
                break;
            case 'left':
                // Дуло виступає ВЛІВО
                ctx.fillRect(sx - barrelLen, cy, barrelLen, barrelW);
                break;
            case 'right':
                // Дуло виступає ВПРАВО
                ctx.fillRect(sx + sz, cy, barrelLen, barrelW);
                break;
        }
    }
```

---

## 🔍 Розбираємо код

### Чому `sz * 0.55`?

При `TANK_SIZE = 32`:
- Довжина дула: `32 * 0.55 ≈ 17 px` — виступає трохи більше половини розміру
- Ширина дула: `32 * 0.2 ≈ 6 px` — тонке дуло

### `switch` замість `if/else`

Коли є 4+ варіанти — `switch` читається чистіше:

```js
// Замість:
if (dir === 'up') { ... }
else if (dir === 'down') { ... }
else if (dir === 'left') { ... }
else if (dir === 'right') { ... }

// Використовуємо:
switch (dir) {
    case 'up':    ...; break;
    case 'down':  ...; break;
    case 'left':  ...; break;
    case 'right': ...; break;
}
```

---

## 🧪 Протестуй всі напрямки

У `Player.js` (наступний урок) можна змінити напрямок:

```js
this.direction = 'right'; // або 'left', 'down'
```

Подивись як змінюється дуло!

---

Залишився останній крок — клас `Player.js`! 🏁
