# 🎮 Урок 13.4: Мультиплеєр — два гравці

## Ідея

В оригінальній NES Battle City можна грати **вдвох**! Кожен гравець має свій танк і своє керування:

| Гравець | Рух | Стрільба | Колір танка | Спавн |
|---------|-----|----------|-------------|-------|
| P1 | W A S D | Space | Жовтий | tx: 8 (ліворуч від штабу) |
| P2 | ↑ ↓ ← → | Enter | Зелений | tx: 16 (праворуч від штабу) |

---

## 🔧 Оновлюємо InputManager.js

Раніше у нас був один набір клавіш. Тепер розділяємо на P1 і P2:

```js
/**
 * ⌨️ Клас InputManager — зчитування вводу з клавіатури
 *
 * Підтримує двох гравців:
 * - P1: WASD для руху, Space для стрільби
 * - P2: Стрілки для руху, Enter для стрільби
 * - P — пауза, R — рестарт (спільні для обох)
 */
export class InputManager {
  constructor() {
    /** Стан утримуваних клавіш (true = натиснута зараз) */
    this.held = {};

    /** Клавіші, натиснуті саме в цьому кадрі (для одноразових дій) */
    this.justPressed = {};

    // Обробник натискання клавіші
    this._onDown = (e) => {
      if (e.repeat) return;              // ігноруємо автоповтор
      this.held[e.code] = true;          // запам'ятовуємо що натиснута
      this.justPressed[e.code] = true;   // позначаємо як "щойно натиснута"
      if (this._isGameKey(e.code)) e.preventDefault(); // блокуємо скрол
    };

    // Обробник відпускання клавіші
    this._onUp = (e) => {
      this.held[e.code] = false;         // клавіша відпущена
    };

    // Підписуємось на події клавіатури
    document.addEventListener('keydown', this._onDown);
    document.addEventListener('keyup', this._onUp);
  }

  // ─── P1: WASD + Space ────────────────────────────────

  /** Напрямок руху P1 (WASD) */
  getMovementP1() {
    if (this.held['KeyW']) return 'up';
    if (this.held['KeyS']) return 'down';
    if (this.held['KeyA']) return 'left';
    if (this.held['KeyD']) return 'right';
    return null;  // не рухається
  }

  /** Чи стріляє P1 (Space) */
  isShootP1() {
    return !!this.held['Space'];
  }

  // ─── P2: Стрілки + Enter ─────────────────────────────

  /** Напрямок руху P2 (стрілки) */
  getMovementP2() {
    if (this.held['ArrowUp'])    return 'up';
    if (this.held['ArrowDown'])  return 'down';
    if (this.held['ArrowLeft'])  return 'left';
    if (this.held['ArrowRight']) return 'right';
    return null;
  }

  /** Чи стріляє P2 (Enter або Numpad Enter) */
  isShootP2() {
    return !!this.held['Enter'] || !!this.held['NumpadEnter'];
  }

  // ─── Спільні клавіші ─────────────────────────────────

  /** Чи щойно натиснута пауза (P) */
  justPause() { return !!this.justPressed['KeyP']; }

  /** Чи щойно натиснутий рестарт (R) */
  justRestart() { return !!this.justPressed['KeyR']; }

  /** Скидання одноразових натискань (викликати в кінці кадру) */
  clearFrame() { this.justPressed = {}; }

  /** Перевірка чи клавіша ігрова (для preventDefault) */
  _isGameKey(code) {
    return [
      'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
      'KeyW','KeyA','KeyS','KeyD',
      'Space','Enter','NumpadEnter','KeyP','KeyR',
    ].includes(code);
  }

  /** Прибрати слухачів (при рестарті) */
  destroy() {
    document.removeEventListener('keydown', this._onDown);
    document.removeEventListener('keyup', this._onUp);
  }
}
```

---

## 🔧 Оновлюємо Player.js

Тепер Player знає свій номер (1 або 2) і обирає відповідні методи вводу:

```js
/**
 * @param {number} playerNum - 1 або 2
 */
constructor(playerNum = 1) {
    // Обираємо позицію спавну залежно від номера гравця
    const spawn = playerNum === 1 ? PLAYER1_SPAWN : PLAYER2_SPAWN;
    // Обираємо спрайт (P1 = жовтий, P2 = зелений)
    const sprite = playerNum === 1 ? PLAYER1_SPRITE : PLAYER2_SPRITE;
    // Обираємо колір (для fallback малювання)
    const color  = playerNum === 1 ? '#e7a821' : '#00a800';

    super(spawn.tx * 16, spawn.ty * 16, color, PLAYER_SPEED, 1);

    this.playerNum = playerNum;
    this.spawn = spawn;

    // Спрайт
    this.spriteX = sprite.x;
    this.spriteY = sprite.y;

    // ...інші властивості...
}

/**
 * Встановлює InputManager та прив'язує методи вводу.
 * P1 отримує getMovementP1/isShootP1
 * P2 отримує getMovementP2/isShootP2
 */
setInputManager(im) {
    if (this.playerNum === 1) {
        // P1: WASD + Space
        this._getMovement = () => im.getMovementP1();
        this._isShoot     = () => im.isShootP1();
    } else {
        // P2: Стрілки + Enter
        this._getMovement = () => im.getMovementP2();
        this._isShoot     = () => im.isShootP2();
    }
}
```

---

## 📖 Розбираємо: тернарний оператор `? :`

```js
// Довгий варіант:
let color;
if (playerNum === 1) {
    color = '#e7a821';
} else {
    color = '#00a800';
}

// Короткий варіант (тернарний оператор):
const color = playerNum === 1 ? '#e7a821' : '#00a800';
//            умова          ? якщо_так  : якщо_ні
```

Читається як питання: "playerNum дорівнює 1? Якщо так — жовтий, якщо ні — зелений".

---

## Підсумок

- ✅ InputManager розділений на P1 (WASD) і P2 (стрілки)
- ✅ Player отримує `playerNum` і обирає spawn/спрайт/колір
- ✅ `setInputManager()` прив'язує правильні методи вводу
- ✅ Розібрали тернарний оператор `? :`

**Далі:** інтегруємо обох гравців у Game.js!
