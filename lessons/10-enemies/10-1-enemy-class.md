# 🔴 Урок 10.1: Клас Enemy — ворожі танки

## Що ми створимо сьогодні

Сьогодні ми додамо **ворогів**! Це найважливіша частина гри — без ворогів нічого захищати. В Battle City є **4 типи** ворожих танків, кожен з унікальними характеристиками.

Ось що буде після цього дня:

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-10/game.html" frameborder="0" allowfullscreen></iframe>

---

## 🎯 Чотири типи ворогів

В оригінальній грі Battle City є такі типи:

| Тип | HP | Швидкість | Кулдаун | Колір | Опис |
|-----|-----|-----------|---------|-------|------|
| **basic** | 1 | 1.0 | 1500 мс | сірий | Звичайний ворог |
| **fast** | 1 | 2.0 | 1500 мс | білий | Швидкий — важко втекти! |
| **power** | 1 | 1.0 | 800 мс | жовтогарячий | Стріляє дуже часто |
| **armor** | 4 | 1.0 | 1500 мс | зелений→жовтий→червоний | Потрібно 4 влучання! |

---

## 🔧 Нові константи

Додамо константи для ворогів у `constants.js`:

```js
// === Константи ворогів ===

// Швидкість ворогів (пікселів за крок)
export const ENEMY_SPEED      = 1.0;  // звичайна швидкість
export const ENEMY_FAST_SPEED = 2.0;  // для типу "fast"

// Кулдаун стрільби (мс — мілісекунди)
export const SHOOT_COOLDOWN       = 1500; // звичайний (1.5 сек)
export const POWER_SHOOT_COOLDOWN = 800;  // для типу "power" (0.8 сек)

// Анімація появи (мигаюча зірка)
export const SPAWN_FLASH_DURATION = 2000; // 2 секунди

// Спавн ворогів
export const MAX_ACTIVE_ENEMIES    = 4;    // максимум 4 на полі одночасно
export const TOTAL_ENEMIES         = 20;   // всього ворогів у рівні
export const ENEMY_SPAWN_INTERVAL  = 3000; // новий ворог кожні 3 секунди

// 3 точки появи ворогів (верхній рядок поля)
export const ENEMY_SPAWN_POINTS = [
    { tx: 0,  ty: 0 },  // лівий верхній кут
    { tx: 12, ty: 0 },  // по центру зверху
    { tx: 24, ty: 0 },  // правий верхній кут
];

// Черга ворогів для рівня 1 (20 штук — мікс різних типів)
export const ENEMY_QUEUE = [
    'basic','basic','fast','basic','power',
    'basic','armor','basic','fast','basic',
    'power','basic','basic','armor','fast',
    'basic','basic','power','basic','armor',
];
```

### Розбираємо:

- **`ENEMY_SPAWN_POINTS`** — 3 точки у верхньому рядку поля. Вороги з'являються циклічно: перший у точці 0, другий у точці 1, третій у точці 2, четвертий знову в точці 0...
- **`ENEMY_QUEUE`** — масив типів ворогів у порядку появи. Перші два — basic, потім fast, і т.д. Всього 20 штук
- **`MAX_ACTIVE_ENEMIES = 4`** — на полі одночасно не більше 4 ворогів. Новий з'явиться тільки коли один буде знищений

---

## 🔧 Нові кольори

Додамо кольори ворогів у `colors.js`:

```js
// Кольори ворогів
export const enemyBasicColor = '#a4a7a7'; // сірий — звичайний
export const enemyFastColor  = '#fcfcfc'; // білий — швидкий
export const enemyPowerColor = '#f8b800'; // жовтогарячий — потужний

// Кольори броньованого ворога (змінюється з HP)
// 4 HP → зелений, 3 HP → жовтий, 2 HP → помаранч, 1 HP → червоний
export const armorColors = ['#00a800', '#f8f858', '#f8b800', '#e04038'];
```

---

## 🎮 Клас Enemy

Створюємо `Enemy.js` — ворожий танк що **наслідує** від Tank:

```js
// Enemy.js — ворожий танк з AI
// Урок 10: Вороги

import { Tank } from './Tank.js';
import {
    ENEMY_SPEED, ENEMY_FAST_SPEED,
    SHOOT_COOLDOWN, POWER_SHOOT_COOLDOWN,
    SPAWN_FLASH_DURATION,
} from './constants.js';
import {
    enemyBasicColor, enemyFastColor, enemyPowerColor, armorColors,
} from './colors.js';

// 4 можливих напрямки руху
const DIRS = ['up', 'down', 'left', 'right'];

// Таблиця HP за типом ворога
const HP_MAP = { basic: 1, fast: 1, power: 1, armor: 4 };

export class Enemy extends Tank {
    /**
     * Створює ворожий танк
     * @param {number} fx - позиція X на полі (пікселі)
     * @param {number} fy - позиція Y на полі (пікселі)
     * @param {string} type - тип ворога: 'basic', 'fast', 'power', 'armor'
     */
    constructor(fx, fy, type = 'basic') {
        // Визначаємо швидкість за типом
        // Тип "fast" рухається вдвічі швидше
        const spd = type === 'fast' ? ENEMY_FAST_SPEED : ENEMY_SPEED;

        // Визначаємо HP за типом (armor = 4 HP, решта = 1 HP)
        const hp = HP_MAP[type] ?? 1;

        // Визначаємо колір за типом
        const color = Enemy._colorByType(type, hp, hp);

        // Викликаємо конструктор батьківського класу Tank
        super(fx, fy, color, spd, hp);

        // Зберігаємо тип ворога
        this.type = type;

        // Зберігаємо максимальне HP (для зміни кольору броньованого)
        this.maxHp = hp;

        // ─── AI таймери ──────────────────────────────────────────
        /** Лічильник часу до зміни напрямку */
        this.dirTimer = 0;
        /** Через скільки мс змінити напрямок (випадково 800-2000 мс) */
        this.changeDirIn = 800 + Math.random() * 1200;

        // ─── Стрільба ───────────────────────────────────────────
        // Тип "power" стріляє частіше (800мс vs 1500мс)
        this.shootCooldown = type === 'power'
            ? POWER_SHOOT_COOLDOWN   // 800 мс
            : SHOOT_COOLDOWN;        // 1500 мс

        // ─── Spawn-анімація ─────────────────────────────────────
        /** Чи зараз мигає зірка появи */
        this.spawnFlash = true;
        /** Лічильник часу spawn-анімації */
        this.spawnTimer = SPAWN_FLASH_DURATION; // 2 секунди
        /** Кадр мерехтіння (для малювання зірки) */
        this.flashFrame = 0;

        // Вороги з'являються зверху і йдуть вниз
        this.direction = 'down';
    }

    /**
     * Визначає колір ворога за типом та поточним HP
     * Броньований танк змінює колір при пошкодженні!
     */
    static _colorByType(type, hp, maxHp) {
        switch (type) {
            case 'fast':  return enemyFastColor;  // білий
            case 'power': return enemyPowerColor;  // жовтогарячий
            case 'armor': {
                // idx = 0 при повному HP, 3 при 1 HP
                const idx = Math.max(0, Math.min(3, maxHp - hp));
                return armorColors[idx]; // зелений → жовтий → помаранч → червоний
            }
            default: return enemyBasicColor; // сірий
        }
    }

    // ... (update та render будуть у наступних підуроках)
}
```

### Розбираємо:

**Наслідування від Tank:**
- Enemy "розширює" (extends) Tank — він має все що має Tank (позиція, move, shoot, render)
- Плюс додатково: AI, типи, spawn-анімація

**Конструктор:**
- Тип визначає все: швидкість, HP, колір, кулдаун стрільби
- `HP_MAP` — проста таблиця HP за типом
- Броньований (`armor`) починає зеленим і червоніє при пошкодженні

**AI таймери:**
- `dirTimer` + `changeDirIn` — ворог міняє напрямок кожні 0.8-2 секунди
- Це створює природний рух — не занадто випадковий, не занадто прямий

---

## ✅ Що далі

В підуроці 10.2 ми додамо **spawn-анімацію** — мигаючу зірку перед появою ворога.
