# 🎮 Урок 4.3: Метод `move()` — танк рухається!

## Як рухається танк?

Рух — це зміна координат `x` та `y` на кожному кадрі:

```
Напрямок    Що змінюється
─────────   ──────────────────
up          y зменшується (вгору)
down        y збільшується (вниз)
left        x зменшується (ліворуч)
right       x збільшується (праворуч)
```

Пам'ятай: в Canvas вісь Y спрямована **вниз**! Тому "вгору" = менше Y.

```
(0,0) ────────→ X збільшується
  │
  │
  ↓
  Y збільшується
```

---

## Додаємо `move()` до `Tank.js`

Відкрий `Tank.js` і додай метод `move()` після методу `render()`:

```javascript
/**
 * Рухаємо танк у заданому напрямку.
 * Обчислює нову позицію, перевіряє межі та колізії.
 *
 * @param {string}   dir     — напрямок: 'up', 'down', 'left', 'right'
 * @param {number}   dt      — deltaTime (мілісекунди з минулого кадру)
 * @param {Function} canMove — функція перевірки колізій: (tank, nx, ny) => boolean
 * @returns {boolean} — true якщо рух відбувся, false якщо заблоковано
 */
move(dir, dt, canMove) {
    if (!this.alive) return false; // мертвий танк не рухається

    // Якщо гравець натиснув іншу клавішу — спочатку вирівнюємо по сітці
    if (dir !== this.direction) {
        this.snapToGrid(dir);  // округлюємо координату (урок 4.4)
        this.direction = dir;  // зберігаємо новий напрямок
    }

    // Обчислюємо НОВУ позицію (ще не рухаємо!)
    const step = this.speed;   // скільки пікселів за кадр
    let nx = this.x;           // нова X (поки = поточна)
    let ny = this.y;           // нова Y (поки = поточна)

    switch (dir) {
        case 'up':    ny -= step; break; // вгору = менше Y
        case 'down':  ny += step; break; // вниз = більше Y
        case 'left':  nx -= step; break; // вліво = менше X
        case 'right': nx += step; break; // вправо = більше X
    }

    // Обмеження межами поля: не менше 0, не більше (416 - 32)
    nx = Math.max(0, Math.min(FIELD_W - this.width,  nx)); // clamp X
    ny = Math.max(0, Math.min(FIELD_H - this.height, ny)); // clamp Y

    // Перевіряємо, чи можна зайняти нову позицію (колізії)
    if (canMove(this, nx, ny)) {
        this.x = nx;  // оновлюємо позицію X
        this.y = ny;  // оновлюємо позицію Y

        // Анімація гусениць: перемикаємо кадр кожні 120 мс
        this.animTimer += dt;          // накопичуємо час
        if (this.animTimer > 120) {    // 120 мс пройшло?
            this.animFrame = (this.animFrame + 1) % 2; // 0→1→0→1
            this.animTimer = 0;        // скидаємо лічильник
        }
        return true;   // рух вдався
    }
    return false;      // рух заблоковано (стіна або інший танк)
}
```

---

## Розбираємо код крок за кроком

### Крок 1: Перевірка `alive`

```javascript
if (!this.alive) return false;
```
Мертвий танк не рухається. Просто виходимо.

### Крок 2: Зміна напрямку

```javascript
if (dir !== this.direction) {
    this.snapToGrid(dir);
    this.direction = dir;
}
```
Якщо гравець натиснув іншу клавішу — танк повертається. Перед поворотом вирівнюємо по сітці (про це — в наступному підуроці 4.4).

### Крок 3: Обчислення нової позиції

```javascript
const step = this.speed;
let nx = this.x;
let ny = this.y;

switch (dir) {
    case 'up':    ny -= step; break;  // вгору = менше Y
    case 'down':  ny += step; break;  // вниз = більше Y
    case 'left':  nx -= step; break;  // ліворуч = менше X
    case 'right': nx += step; break;  // праворуч = більше X
}
```

`nx` та `ny` — це **нові** координати. Ми ще не перемістили танк! Спочатку перевіримо, чи можна.

### Крок 4: Обмеження межами поля

```javascript
nx = Math.max(0, Math.min(FIELD_W - this.width, nx));
ny = Math.max(0, Math.min(FIELD_H - this.height, ny));
```

Танк має ширину 32px, поле — 416px. Тому максимальна X-позиція = 416 - 32 = 384.

```
  0                            384  416
  │◄──────── поле ──────────────►│
  │  [ ТАНК 32px ]               │
  │                    [ ТАНК ]  │  ← максимум
```

`Math.max(0, ...)` — не менше 0.
`Math.min(384, ...)` — не більше 384.

### Крок 5: Перевірка `canMove`

```javascript
if (canMove(this, nx, ny)) {
    this.x = nx;
    this.y = ny;
    ...
}
```

`canMove` — це функція, яку ми передаємо ззовні. Зараз вона завжди повертає `true`. В уроці 7 (Колізії) ми замінимо її на справжню перевірку стін!

---

## Не забудь імпорт!

На початку `Tank.js` переконайся, що імпортовані `FIELD_W` та `FIELD_H`:

```javascript
import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
```

---

## Підсумок

- ✅ `move(dir, dt, canMove)` — обчислює нову позицію та перевіряє, чи можна рухатися
- ✅ `switch(dir)` — змінює X або Y залежно від напрямку
- ✅ `Math.max / Math.min` — не дає виїхати за межі поля
- ✅ `canMove(tank, nx, ny)` — зовнішня перевірка (для майбутніх колізій)
