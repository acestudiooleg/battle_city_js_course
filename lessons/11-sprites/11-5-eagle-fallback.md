# 🦅 Урок 11.5: Орел зі спрайтів та Fallback

## Спрайти Орла

Орел (штаб) має **два стани** — живий та мертвий:

```
alive: (304, 32) на листі     dead: (320, 32) на листі
    ┌────────────┐                 ┌────────────┐
    │    ╱╲      │                 │     ╳╳     │
    │   ╱══╲     │                 │    ╳  ╳    │
    │  ╱    ╲    │                 │   ╳    ╳   │
    │ ╱  ◆◆  ╲   │                 │    ╳  ╳    │
    └────────────┘                 └────────────┘
```

### Малювання Орла:

Нагадування — всі спрайтові константи вже імпортовані в `GameField.js` (урок 11.4):

```js
import { spriteSheet, TILE_SPRITES, WATER_SPRITES, FOREST_SPRITE, EAGLE_SPRITES } from './SpriteSheet.js';
```

```js
/**
 * Малює штаб (Орла) — зі спрайта або fallback
 */
_drawEagle(ctx, ox, oy) {
    const e = this.eagle;      // об'єкт штабу
    const dx = e.x + ox;      // позиція X на Canvas
    const dy = e.y + oy;      // позиція Y на Canvas
    const s = e.width;         // розмір (32px)

    if (spriteSheet.ready) {
        // Обираємо спрайт залежно від стану
        const spr = e.alive
            ? EAGLE_SPRITES.alive   // (304, 32) — живий
            : EAGLE_SPRITES.dead;   // (320, 32) — мертвий

        // Малюємо 16×16 → 32×32
        ctx.drawImage(spriteSheet.img, spr.x, spr.y, 16, 16, dx, dy, s, s);
        return;
    }

    // Fallback: живий = символ ♕, мертвий = хрест
    if (e.alive) {
        ctx.fillStyle = '#7c7c7c';
        ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
        ctx.fillStyle = '#e04038';
        ctx.font = `${s * 0.6}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♕', dx + s / 2, dy + s / 2);
    } else {
        ctx.fillStyle = '#3c3c3c';
        ctx.fillRect(dx + 4, dy + 4, s - 8, s - 8);
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
```

---

## ✨ Spawn-зірка зі спрайтів

Замінюємо коло на справжні спрайти зірки появи:

```js
// В Enemy.render(), секція spawn:
if (spriteSheet.ready) {
    // 4 кадри зірки, чергуємо
    const fi = Math.floor(this.flashFrame / 2) % SPAWN_STAR_SPRITES.length;
    const spr = SPAWN_STAR_SPRITES[fi];
    // Малюємо 16×16 → 32×32
    ctx.drawImage(spriteSheet.img, spr.x, spr.y, 16, 16,
                  dx, dy, this.width, this.height);
} else {
    // Fallback — мигаюче коло (як раніше)
    if (this.flashFrame < 4) {
        ctx.strokeStyle = '#fcfcfc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dx + this.width / 2, dy + this.height / 2,
                this.width / 2 + 4, 0, Math.PI * 2);
        ctx.stroke();
    }
}
```

---

## 🔧 Не забуваємо imageSmoothingEnabled!

В `main.js` або `game.html` додаємо одразу після отримання контексту:

```js
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // Чіткі пікселі!
```

---

## 📝 Підсумок Дня 11

Ось що ми створили:

- ✅ **SpriteSheet.js** — клас-сінглтон для завантаження спрайт-листа
- ✅ Карта координат: танки (DIR_COL), тайли (чвертинки 8×8), орел, зірка
- ✅ **Tank.js** — спрайтове малювання з fallback на `fillRect`
- ✅ **GameField.js** — тайли, вода, ліс, орел зі спрайтів
- ✅ **Enemy.js** — spawn-зірка зі спрайтів
- ✅ `imageSmoothingEnabled = false` для чітких пікселів

### Спробуй:

**Результат дня:** [Демо уроку 11](/battle_city_js_course/demos/lesson-11/game.html){target="_blank"}

Тепер гра виглядає як справжня NES Battle City!

---

## 🔜 Наступний день

**День 12: Звуки та UI** — додамо звуковий супровід (стрільба, вибухи, двигун, інтро) та бічну панель в NES-стилі!
