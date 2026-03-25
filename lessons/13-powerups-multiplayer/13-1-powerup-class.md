# ⭐ Урок 13.1: Клас PowerUp — артефакти

## Ось що ми зробимо сьогодні:

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-13/game.html" frameborder="0" allowfullscreen></iframe>

---

## 🤔 Що таке артефакти?

Артефакти (power-ups) — це бонуси, які з'являються на полі. Коли гравець наїжджає на артефакт, він отримує ефект:

| Тип | Спрайт | Ефект |
|-----|--------|-------|
| tank | (336, 112) | +1 життя |
| helmet | (256, 112) | Тимчасовий щит на 10 сек |
| star | (304, 112) | Підвищення рангу (швидкість + кулдаун) |
| grenade | (320, 112) | Знищити ВСІХ ворогів на полі! |
| timer | (272, 112) | Заморозити ворогів на 10 сек |
| shovel | (288, 112) | Бетон навколо штабу на 20 сек |

Артефакт **мигає** — то видно, то ні — щоб привернути увагу. На полі може бути **тільки один** артефакт одночасно.

---

## 🔧 Створюємо PowerUp.js

```js
/**
 * ⭐ Клас PowerUp — артефакт на полі
 *
 * Артефакт з'являється у випадковому місці, мигає,
 * і зникає коли гравець його підбирає (наїжджає танком).
 */
import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
import { spriteSheet, POWERUP_SPRITES } from './SpriteSheet.js';

// Масив усіх можливих типів артефактів
const POWERUP_TYPES = ['tank', 'shovel', 'helmet', 'star', 'grenade', 'timer'];

export class PowerUp {
  /**
   * Створює новий артефакт.
   *
   * @param {number} fx   - X координата на полі (пікселі)
   * @param {number} fy   - Y координата на полі (пікселі)
   * @param {string} type - тип артефакту ('tank', 'helmet', ...)
   */
  constructor(fx, fy, type) {
    this.x      = fx;         // позиція X на полі
    this.y      = fy;         // позиція Y на полі
    this.width  = TANK_SIZE;  // ширина = як танк (32px)
    this.height = TANK_SIZE;  // висота = як танк (32px)
    this.type   = type;       // тип артефакту (рядок)
    this.active = true;       // чи ще існує (false = підібрали)

    // Мигання — артефакт мигає, привертаючи увагу
    this.flashTimer = 0;      // таймер мигання (мс)
    this.visible    = true;   // чи видно зараз (перемикається)
  }

  /**
   * Оновлення стану — мигання.
   * Кожні 200 мс міняємо visible: true ↔ false
   *
   * @param {number} dt - deltaTime (мс)
   */
  update(dt) {
    // Якщо артефакт підібрали — нічого не робимо
    if (!this.active) return;

    // Додаємо час до таймера мигання
    this.flashTimer += dt;

    // Кожні 200 мс перемикаємо видимість
    if (this.flashTimer > 200) {
      this.flashTimer = 0;
      // Оператор ! (NOT) — перевертає true на false і навпаки
      this.visible = !this.visible;
    }
  }

  /**
   * Малює артефакт на Canvas (зі спрайту або fallback).
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} ox - зсув X (FIELD_X)
   * @param {number} oy - зсув Y (FIELD_Y)
   */
  render(ctx, ox, oy) {
    // Не малюємо якщо підібрали або зараз "невидима" фаза мигання
    if (!this.active || !this.visible) return;

    // Позиція на Canvas = позиція на полі + зсув
    const dx = Math.round(this.x) + ox;
    const dy = Math.round(this.y) + oy;

    // Спроба намалювати зі спрайт-листа
    if (spriteSheet.ready) {
      // Знаходимо координати спрайту для нашого типу
      const spr = POWERUP_SPRITES[this.type];
      if (spr) {
        // drawImage: вирізаємо 16×16 зі спрайт-листа → малюємо 32×32
        ctx.drawImage(
          spriteSheet.img,
          spr.x, spr.y, 16, 16,     // джерело: 16×16 на листі
          dx, dy, this.width, this.height  // ціль: 32×32 на Canvas
        );
        return;
      }
    }

    // Fallback — жовтий квадрат з літерою
    ctx.fillStyle = '#f8f858';
    ctx.fillRect(dx + 4, dy + 4, this.width - 8, this.height - 8);
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    // Показуємо першу літеру типу: 't' для tank, 'h' для helmet...
    ctx.fillText(this.type[0].toUpperCase(), dx + this.width / 2, dy + this.height / 2 + 4);
  }

  /**
   * Генерує випадковий тип артефакту.
   * Статичний метод — викликається як PowerUp.randomType()
   * (не потрібно створювати об'єкт)
   *
   * @returns {string} - випадковий тип ('tank', 'helmet', ...)
   */
  static randomType() {
    // Math.random() → число від 0 до 1 (наприклад 0.73)
    // * POWERUP_TYPES.length → множимо на 6 (наприклад 4.38)
    // Math.floor() → відкидаємо дробову частину (4)
    // POWERUP_TYPES[4] → 'grenade'
    return POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  }
}
```

---

## 📖 Розбираємо: Статичні методи (`static`)

Звичайний метод належить **об'єкту** (треба спочатку створити `new PowerUp()`).
Статичний метод належить **класу** — можна викликати без створення:

```js
// Статичний — викликаємо через назву класу
const type = PowerUp.randomType(); // 'grenade'

// Звичайний — потрібен об'єкт
const pu = new PowerUp(100, 100, 'tank');
pu.update(16);  // метод об'єкта
```

---

## Підсумок

- ✅ Створили клас `PowerUp` з позицією, типом та миганням
- ✅ Малювання зі спрайтів + fallback
- ✅ Статичний метод `randomType()` для генерації

**Далі:** система спавну — де і коли з'являються артефакти!
