# 🎮 Урок 5.3: Підключаємо стрільбу до клавіатури

## Space = Вогонь! 🔥

Тепер з'єднаємо все разом: натискання `Space` → виклик `player.shoot()` → куля летить!

---

## Крок 1: Додаємо `isShoot()` до InputManager

Відкрий `InputManager.js` і додай новий метод після `getMovement()`:

```javascript
    /**
     * Перевіряє, чи гравець натиснув кнопку стрільби (Space).
     * @returns {boolean} — true якщо Space утримується
     */
    isShoot() {
        return !!this.held['Space']; // !! перетворює undefined → false
    }
```

### Що таке `!!` ?

`this.held['Space']` може бути `true`, `false` або `undefined` (якщо клавіша ніколи не натискалась). Подвійне заперечення `!!` гарантує, що результат завжди `true` або `false`:

```javascript
!!true       // true
!!false      // false
!!undefined  // false  ← ось навіщо !!
```

---

## Крок 2: Оновлюємо `update()` в main.js

Відкрий `main.js` і оновити функцію `update()`:

```javascript
/**
 * Оновлює стан гри: рух, стрільба, оновлення куль.
 * @param {number} dt — deltaTime (мс)
 */
function update(dt) {
    // Рух
    const dir = input.getMovement();
    if (dir) {
        player.move(dir, dt, () => true);
    }

    // Стрільба
    if (input.isShoot()) {
        player.shoot(Date.now(), 'player'); // створює кулю з кулдауном
    }

    // Оновлюємо кулі гравця (рух + деактивація за межами)
    player.updateBullets();
}
```

---

## Крок 3: Додаємо `updateBullets()` до Tank.js

Відкрий `Tank.js` і додай метод після `shoot()`:

```javascript
    /**
     * Оновлює всі кулі цього танка.
     * Рухає активні кулі та видаляє неактивні з масиву.
     */
    updateBullets() {
        // Крок 1: рухаємо кожну кулю
        for (const b of this.bullets) {
            b.update(); // x += vx, y += vy
        }

        // Крок 2: видаляємо неактивні (вилетіли за поле)
        this.bullets = this.bullets.filter(b => b.active);
    }
```

### Що таке `filter()`?

`filter()` створює **новий масив** тільки з елементів, що пройшли перевірку:

```javascript
[куля1(active), куля2(dead), куля3(active)]
    .filter(b => b.active)
// Результат: [куля1, куля3]  ← куля2 видалена!
```

---

## Крок 4: Не забудь `Space` в `_isGameKey()`

Переконайся, що `Space` є у списку ігрових клавіш:

```javascript
_isGameKey(code) {
    return ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(code);
}
```

Це запобігає прокрутці сторінки при натисканні пробілу.

---

## Ланцюжок викликів

```
Гравець натискає Space
  → input.isShoot() повертає true
    → player.shoot(Date.now(), 'player')
      → перевірка кулдауну (400мс пройшло?)
        → new Bullet(bx, by, direction, 'player')
          → this.bullets.push(bullet)

Кожен кадр:
  → player.updateBullets()
    → bullet.update() — куля рухається
    → filter(active) — мертві кулі видаляються
```

---

## Підсумок

- ✅ `InputManager.isShoot()` — перевірка натискання Space
- ✅ `update()` тепер обробляє стрільбу та оновлює кулі
- ✅ `Tank.updateBullets()` — рух + очистка масиву куль
- ✅ Ланцюжок: Input → shoot() → Bullet → updateBullets()
