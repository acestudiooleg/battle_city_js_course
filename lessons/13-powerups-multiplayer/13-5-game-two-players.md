# 🎮 Урок 13.5: Game для двох гравців

## 🔧 Оновлюємо Game.js

### Конструктор

```js
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} numPlayers - 1 або 2 (кількість гравців)
 */
constructor(canvas, numPlayers = 1) {
    // ... (існуючий код) ...

    // Зберігаємо кількість гравців
    this.numPlayers = numPlayers;

    // Створюємо P1 (завжди є)
    this.player1 = new Player(1);
    this.player1.setInputManager(this.input);

    // Створюємо P2 (тільки якщо 2 гравці)
    if (numPlayers === 2) {
        this.player2 = new Player(2);
        this.player2.setInputManager(this.input);
        // Масив усіх гравців — зручно для циклів
        this.players = [this.player1, this.player2];
    } else {
        this.player2 = null;
        this.players = [this.player1];
    }
}
```

---

### Update — цикл по масиву гравців

Замість `player.update(...)` тепер проходимо по **масиву** гравців:

```js
_update(dt, now) {
    // ... (спавн, canMove) ...

    // Оновлюємо ВСІХ гравців (1 або 2)
    // for...of — цикл по кожному елементу масиву
    for (const p of this.players) {
        p.update(dt, canMove, now);
    }

    // Вороги (якщо не заморожені)
    if (this.freezeTimer <= 0) {
        for (const e of this.enemies) {
            e.update(dt, canMove, now);
        }
    }

    // Колізії куль — для КОЖНОГО гравця окремо
    for (const p of this.players) {
        this.collisions.update(p, this.enemies);
    }

    // Очистка мертвих куль — для кожного гравця
    for (const p of this.players) {
        p.bullets = p.bullets.filter((b) => b.active);
    }

    // ... (вороги, вибухи) ...

    // Game Over — перевіряємо чи ВСІ гравці мертві
    // .every() — повертає true тільки якщо КОЖЕН елемент відповідає умові
    const allDead = this.players.every(
        (p) => p.lives <= 0 && !p.alive && !p.isRespawning
    );
    if (allDead) {
        this._triggerGameOver();
    }
}
```

---

### Render — малюємо обох

```js
_render() {
    // ... (поле) ...

    // Малюємо ВСІХ гравців та їх кулі
    for (const p of this.players) {
        p.render(ctx, ox, oy);
        // renderBullets — малює всі кулі гравця
        p.renderBullets(ctx, ox, oy);
    }

    // ... (вороги, артефакти, ліс, вибухи) ...
}
```

---

### Sidebar — блоки P1 та P2

```js
_renderSidebar(ctx) {
    // ... (іконки ворогів) ...

    // Блок P1 (завжди)
    this._renderPlayerBlock(ctx, this.player1, iconsX, CANVAS_H - BORDER - 120, 'I', '#e7a821');

    // Блок P2 (тільки якщо є другий гравець)
    if (this.player2) {
        this._renderPlayerBlock(ctx, this.player2, iconsX, CANVAS_H - BORDER - 80, 'II', '#00a800');
    }

    // ... (прапор) ...
}
```

---

## Без Friendly Fire!

Кулі гравців **не шкодять** одне одному. В `CollisionManager` перевіряємо `bullet.owner`:

```js
// Куля гравця — перевіряємо тільки ворогів
if (bullet.owner === 'player') {
    // Куля ↔ вороги (може вбити)
    // Куля ↔ кулі ворогів (знищують одне одного)
    // Куля ↔ інший гравець — ІГНОРУЄМО!
}
```

---

## Артефакти для двох гравців

Артефакт може підібрати **будь-який** гравець — хто перший наїде:

```js
// В _updatePowerUps:
for (const p of this.players) {
    if (!p.alive || p.isRespawning) continue;
    if (!this.powerUp || !this.powerUp.active) continue;

    const pu = this.powerUp;
    // Перевірка перетину гравець ↔ артефакт
    if (p.x < pu.x + pu.width && p.x + p.width > pu.x &&
        p.y < pu.y + pu.height && p.y + p.height > pu.y) {
        this._collectPowerUp(p, pu);
    }
}
```

---

## 📖 Розбираємо: `.every()` та `.some()`

Два корисні методи масивів:

```js
const nums = [2, 4, 6, 8];

// .every() — true якщо ВСІ відповідають
nums.every(n => n % 2 === 0); // true (всі парні)
nums.every(n => n > 5);       // false (2 і 4 не > 5)

// .some() — true якщо ХОЧА Б ОДИН відповідає
nums.some(n => n > 5);        // true (6 і 8 > 5)
nums.some(n => n > 10);       // false (жоден > 10)
```

В нашому коді:
- `players.every(p => dead)` — "чи ВСІ гравці мертві?"
- `players.some(p => moving)` — "чи ХТОСЬ рухається?" (для звуку двигуна)

---

## Підсумок дня 13

За цей день ти:
- ✅ Створив `PowerUp.js` — 6 типів артефактів з миганням
- ✅ Спавн у випадковому вільному місці кожні 15–30 сек
- ✅ 6 ефектів: life, helmet, star, grenade, timer, shovel
- ✅ Розділив ввід на P1 (WASD) та P2 (стрілки)
- ✅ Player з `playerNum` — різні spawn, спрайти, кольори
- ✅ Game підтримує масив `players[]` для 1 або 2 гравців
- ✅ Без friendly fire!

**Завтра:** Титульний екран з меню вибору та фінальна збірка! 🏆

**Результат дня:** [Демо уроку 13](/battle_city_js_course/demos/lesson-13/game.html){target="_blank"}
