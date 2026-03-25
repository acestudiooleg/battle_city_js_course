# 🎮 Урок 8.2: Інтеграція вибухів у Game

## Підключаємо вибухи! 🔥

Тепер з'єднаємо `Explosion.js` з `CollisionManager` — кожне влучання створюватиме красивий вибух.

---

## Масив вибухів

В `main.js` створюємо масив:

```javascript
import { Explosion } from './Explosion.js';

/** @type {Explosion[]} */
const explosions = [];
```

---

## Передаємо callback у CollisionManager

```javascript
const collisions = new CollisionManager(field, (fx, fy, type) => {
    // callback створює вибух у координатах поля
    explosions.push(new Explosion(fx + FIELD_X, fy + FIELD_Y, type));
});
```

**Увага!** Вибухи малюються в **координатах Canvas** (з офсетом FIELD_X/Y), бо вони використовують `ctx.arc()` без додаткового зсуву.

---

## Оновлення та малювання

В `update()`:
```javascript
// Оновлюємо вибухи
for (const e of explosions) e.update(dt);
// Видаляємо завершені
explosions.splice(0, explosions.length,
    ...explosions.filter(e => e.isActive));
```

В `render()`, після куль та перед лісом:
```javascript
// Вибухи
for (const e of explosions) e.render(ctx);
```

---

## Порядок малювання (z-index)

```
1. field.render()         ← стіни, вода, штаб (під усіма)
2. player.render()        ← танк
3. bullets.render()       ← кулі
4. explosions.render()    ← вибухи (поверх куль)
5. field.renderForest()   ← ліс (найвищий шар)
```

---

## Підсумок

- ✅ Масив `explosions[]` зберігає активні вибухи
- ✅ CollisionManager створює вибухи через callback
- ✅ `update()` оновлює та видаляє завершені вибухи
- ✅ Вибухи малюються між кулями та лісом
