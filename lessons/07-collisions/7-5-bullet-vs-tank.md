# 🎮 Урок 7.5: Куля ↔ Танк та фінальна збірка

## Кулі влучають у танки!

В цьому уроці ми завершимо систему колізій: кулі зможуть влучати в танки, а також кулі зможуть знищувати одна одну.

---

## Куля влучає в танк

Поки у нас немає ворогів (вони будуть у уроці 10), але підготуємо код. Перевірка аналогічна стінам — AABB:

```javascript
// В CollisionManager._processBullets():

// targets — масив танків, у яких може влучити ця куля
// Наприклад, якщо стріляє гравець → targets = [ворог1, ворог2, ...]
// Якщо стріляє ворог → targets = [гравець]

// Проходимо по кожному танку-цілі
for (const target of targets) {
    if (!target.alive) continue; // мертвий танк — пропускаємо

    // Перевіряємо AABB: чи перетинається куля (bx,by,bw,bh) з танком?
    // this._aabb() — та сама формула з уроку 7.1
    if (this._aabb(bx, by, b.width, b.height,
                   target.x, target.y, target.width, target.height)) {

        b.active = false;  // куля зникає після влучання

        target.hp -= 1;    // знімаємо 1 HP у танка
        if (target.hp <= 0) {
            target.alive = false; // HP = 0 → танк знищено!
        }

        // Створюємо вибух у центрі танка
        // Тернарний оператор: умова ? значення_якщо_так : значення_якщо_ні
        // Якщо танк знищено → великий вибух ('large')
        // Якщо ще живий → середній ('medium')
        this.onExplosion(
            target.x + target.width / 2,   // центр танка по X
            target.y + target.height / 2,  // центр танка по Y
            target.hp <= 0 ? 'large' : 'medium'
        );

        break; // break = "вийти з циклу". Одна куля влучає тільки в одного!
    }
}
```

---

## Куля ↔ Куля

Кулі гравця та ворогів знищують одна одну при зіткненні. Оскільки кулі маленькі (4×4) та швидкі (5 px/кадр), ми збільшуємо зону зіткнення:

```javascript
_bulletVsBullet(player, enemies) {
    // PAD — "подушка безпеки" навколо кожної кулі
    // Без неї маленькі швидкі кулі (4×4, швидкість 5) можуть
    // "пролетіти" одна через одну між кадрами
    const PAD = 6;

    // Перший цикл: для кожної кулі ГРАВЦЯ
    for (const pb of player.bullets) {
        if (!pb.active) continue; // мертву пропускаємо

        // Розширюємо зону зіткнення кулі на PAD з кожного боку
        // Було: 4×4, стало: 16×16 (4 + 6*2 = 16)
        const pbx = pb.x - pb.width / 2 - PAD;  // лівий край - PAD
        const pby = pb.y - pb.height / 2 - PAD;  // верхній край - PAD
        const pbw = pb.width + PAD * 2;           // ширина + 2*PAD = 16
        const pbh = pb.height + PAD * 2;          // висота + 2*PAD = 16

        // Другий цикл: для кожного ВОРОГА
        for (const enemy of enemies) {
            // Третій цикл: для кожної кулі цього ворога
            for (const eb of enemy.bullets) {
                if (!eb.active) continue;

                // Так само розширюємо зону зіткнення ворожої кулі
                const ebx = eb.x - eb.width / 2 - PAD;
                const eby = eb.y - eb.height / 2 - PAD;

                // Перевіряємо AABB двох розширених зон
                if (this._aabb(pbx, pby, pbw, pbh, ebx, eby, pbw, pbh)) {
                    pb.active = false; // куля гравця знищена
                    eb.active = false; // куля ворога теж знищена
                }
            }
        }
    }
}
```

### Навіщо PAD = 6?

Дві кулі летять назустріч одна одній зі швидкістю 5 px/кадр кожна = 10 px зближення за кадр. Без PAD вони можуть "пролетіти" одна через одну між кадрами!

---

## Оновлюємо main.js

```javascript
// main.js — Урок 7: Колізії

import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_Y, FIELD_W, FIELD_H }
    from './constants.js';
import { sidebarBg, sidebarText } from './colors.js';
import { Player }           from './Player.js';
import { InputManager }     from './InputManager.js';
import { GameField }        from './GameField.js';
import { CollisionManager } from './CollisionManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const input  = new InputManager();
const player = new Player();
const field  = new GameField();
const collisions = new CollisionManager(field, (fx, fy, type) => {
    // Поки просто логуємо (вибухи — в уроці 8)
});

function update(dt) {
    field.update(dt);

    const dir = input.getMovement();
    if (dir) player.move(dir, dt, (t, nx, ny) => field.canTankMove(t, nx, ny));

    if (input.isShoot()) player.shoot(Date.now(), 'player');

    player.updateBullets();

    // Система зіткнень!
    collisions.update(player);
}
```

Тепер кулі руйнують цегляні стіни, зникають при влучанні в бетон, і знищують орла!

---

## Підсумок Дня 7

За цей урок ти:
- ✅ Зрозумів теорію AABB (перетин прямокутників)
- ✅ Створив `CollisionManager.js` з методом `_aabb()`
- ✅ Танки блокуються стінами через `canTankMove()`
- ✅ Кулі руйнують цеглу та зникають від бетону
- ✅ Кулі влучають у штаб (game over)
- ✅ Кулі знищують одна одну (з PAD для швидких куль)

**Тепер кулі руйнують стіни!** Завтра додамо красиві вибухи! 💥

---

## 🔄 Що буде далі?

У наступному уроці ми:
- 💥 Створимо `Explosion.js` — систему частинок
- ✨ Три типи вибухів: small, medium, large
- 🧱 NES-стиль руйнування цегли (парами по 2 тайли)
- 🔗 Підключимо вибухи до CollisionManager

---

## ДЕМО

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/demos/lesson-07/game.html){target="_blank"}
