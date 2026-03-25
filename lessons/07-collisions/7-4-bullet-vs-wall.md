# 🎮 Урок 7.4: Куля ↔ Стіна — руйнування цегли

## Кулі руйнують стіни! 💥

Коли куля влучає в стіну, вона:
- **Цегла** — руйнується! Тайл видаляється з масиву walls[]
- **Бетон** — не руйнується! Куля просто зникає

---

## `bulletHitWall()` — пошук влученого тайла

```javascript
// В GameField.js:
// bx, by — лівий верхній кут кулі (в пікселях)
// bw, bh — ширина та висота кулі (4×4)
bulletHitWall(bx, by, bw, bh) {
    // Проходимо по КОЖНІЙ стіні в масиві this.walls
    for (const t of this.walls) {
        // Перевіряємо AABB: чи прямокутник кулі перетинається з прямокутником стіни?
        // Це ті самі 4 умови, що і в canTankMove (урок 7.1)
        if (bx < t.x + t.width && bx + bw > t.x &&
            by < t.y + t.height && by + bh > t.y) {
            return t;  // ВЛУЧЕННЯ! Повертаємо тайл, щоб знати його матеріал
        }
    }
    return null; // жодна стіна не влучена → повертаємо null (нічого)
}
```

### Чому повертає `тайл`, а не `true/false`?

Тому що нам потрібно знати **який саме** тайл влучено — щоб перевірити матеріал та пошкодити його!

---

## `damageTile()` — пошкодження тайла

```javascript
// В GameField.js:
// tile — об'єкт тайла, який був влучений
// dmg — скільки HP зняти (за замовчуванням 1)
// dmg = 1 — це значення за замовчуванням: якщо не передати dmg, буде 1
damageTile(tile, dmg = 1) {
    tile.hp -= dmg;  // зменшуємо здоров'я тайла на dmg

    // Якщо HP впало до 0 або нижче — тайл знищено!
    if (tile.hp <= 0) {
        // indexOf знаходить позицію (індекс) елемента в масиві
        // Наприклад: [🧱, 🧱, 🧱].indexOf(🧱середня) → 1
        const idx = this.walls.indexOf(tile);

        // idx !== -1 означає "елемент знайдено" (-1 = не знайдено)
        if (idx !== -1) {
            // splice(індекс, кількість) — видаляє елементи з масиву
            // splice(1, 1) = "видали 1 елемент починаючи з позиції 1"
            this.walls.splice(idx, 1);
        }
        return true;  // повертаємо true = "тайл знищено"
    }
    return false; // HP ще > 0, тайл живий
}
```

### `splice(idx, 1)` — видалення з масиву

```javascript
const arr = ['a', 'b', 'c', 'd'];
arr.splice(2, 1); // видаляємо 1 елемент з індексу 2
// arr = ['a', 'b', 'd']
```

---

## Перевірка штабу

```javascript
// В GameField.js:
// Перевіряє, чи куля (bx, by, bw, bh) влучила в штаб (орел)
bulletHitEagle(bx, by, bw, bh) {
    // Якщо орел вже знищений — перевіряти нема чого
    if (!this.eagle.alive) return false;

    const e = this.eagle; // скорочення для зручності

    // Та сама формула AABB: чи перетинаються куля та орел?
    return bx < e.x + e.width && bx + bw > e.x &&
           by < e.y + e.height && by + bh > e.y;
}

// Знищує штаб — просто ставимо alive = false
destroyEagle() {
    this.eagle.alive = false; // тепер _drawEagle малюватиме хрестик
}

destroyEagle() {
    this.eagle.alive = false;
}
```

Якщо куля влучає в орла — гра закінчується!

---

## Як CollisionManager використовує це

```javascript
// В CollisionManager._processBullets():

// Питаємо GameField: "Під цією кулею є стіна?"
// bulletHitWall повертає об'єкт тайла або null
const tile = this.field.bulletHitWall(bx, by, b.width, b.height);

// if (tile) означає "якщо tile не null" (тобто куля влучила)
if (tile) {
    b.active = false;  // куля завжди зникає при влучанні в стіну

    // Перевіряємо матеріал стіни:
    // tile.material — рядок 'brick' або 'concrete'
    if (tile.material === 'brick') {
        // Цегла: зменшуємо HP, якщо HP <= 0 → видаляємо зі стін
        this.field.damageTile(tile);
    }
    // Якщо бетон — нічого не робимо зі стіною (вона невразлива)
    // Але куля все одно зникла (b.active = false вище)

    // Створюємо маленький вибух на місці влучання
    this.onExplosion(b.x, b.y, 'small');
}
```

---

## Підсумок

- ✅ `bulletHitWall()` повертає влучений тайл або `null`
- ✅ `damageTile()` зменшує HP та видаляє знищені тайли
- ✅ Цегла (hp=1) руйнується з одного пострілу
- ✅ Бетон (hp=99) — невразливий, куля просто зникає
- ✅ `bulletHitEagle()` перевіряє влучання в штаб
