# 🔫 Урок 10.4: AI стрільба та отримання пошкоджень

## Автоматична стрільба

Вороги стріляють **автоматично** — їм не потрібно натискати кнопку. Кожен раз коли кулдаун готовий, ворог робить постріл.

Метод `shoot()` ми вже маємо в класі `Tank` (батьківський клас). Він перевіряє `shootCooldown` і створює кулю. Ворог просто викликає його кожен кадр:

```js
// В update() ворога:
this.shoot(now, 'enemy');
// 'enemy' — мітка власника кулі (щоб відрізняти від гравця)
```

**Різниця між типами:**
- `basic`, `fast`, `armor` — кулдаун 1500 мс (стріляють кожні 1.5 секунди)
- `power` — кулдаун 800 мс (стріляє майже вдвічі частіше!)

---

## 💔 Отримання пошкоджень

Додаємо метод `takeDamage()` в Enemy:

```js
/**
 * Ворог отримує пошкодження від кулі гравця
 * @param {number} dmg - кількість пошкоджень (зазвичай 1)
 * @returns {boolean} true якщо ворог знищений
 */
takeDamage(dmg = 1) {
    // Знімаємо HP
    this.hp -= dmg;

    // Якщо HP впало до 0 або нижче — ворог знищений
    if (this.hp <= 0) {
        this.alive = false; // позначаємо як мертвого
        return true; // повертаємо "знищений"
    }

    // Ворог ще живий — оновлюємо колір (для броньованого)
    if (this.type === 'armor') {
        // Колір змінюється від зеленого до червоного
        this.color = Enemy._colorByType('armor', this.hp, this.maxHp);
    }

    return false; // не знищений
}
```

### Приклад: Броньований ворог

```
Влучання 1: HP 4→3, колір зелений → жовтий
Влучання 2: HP 3→2, колір жовтий → помаранчевий
Влучання 3: HP 2→1, колір помаранчевий → червоний
Влучання 4: HP 1→0, ЗНИЩЕНИЙ! 💥
```

---

## 🔧 Повний файл Enemy.js

Зберемо все разом:

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

const DIRS   = ['up', 'down', 'left', 'right'];
const HP_MAP = { basic: 1, fast: 1, power: 1, armor: 4 };

export class Enemy extends Tank {
    constructor(fx, fy, type = 'basic') {
        const spd   = type === 'fast' ? ENEMY_FAST_SPEED : ENEMY_SPEED;
        const hp    = HP_MAP[type] ?? 1;
        const color = Enemy._colorByType(type, hp, hp);
        super(fx, fy, color, spd, hp);

        this.type   = type;
        this.maxHp  = hp;

        // AI
        this.dirTimer    = 0;
        this.changeDirIn = 800 + Math.random() * 1200;

        // Стрільба
        this.shootCooldown = type === 'power'
            ? POWER_SHOOT_COOLDOWN : SHOOT_COOLDOWN;

        // Spawn
        this.spawnFlash = true;
        this.spawnTimer = SPAWN_FLASH_DURATION;
        this.flashFrame = 0;

        // Початковий напрямок — вниз
        this.direction = 'down';
    }

    static _colorByType(type, hp, maxHp) {
        switch (type) {
            case 'fast':  return enemyFastColor;
            case 'power': return enemyPowerColor;
            case 'armor': {
                const idx = Math.max(0, Math.min(3, maxHp - hp));
                return armorColors[idx];
            }
            default: return enemyBasicColor;
        }
    }

    update(dt, canMove, now) {
        if (!this.alive) return;

        if (this.spawnFlash) {
            this.spawnTimer -= dt;
            this.flashFrame  = (this.flashFrame + 1) % 8;
            if (this.spawnTimer <= 0) this.spawnFlash = false;
            return;
        }

        this.dirTimer += dt;
        if (this.dirTimer >= this.changeDirIn) this._pickRandomDir();

        const moved = this.move(this.direction, dt, canMove);
        if (!moved) this._pickRandomDir();

        this.shoot(now, 'enemy');
        this.updateBullets();

        if (this.type === 'armor') {
            this.color = Enemy._colorByType('armor', this.hp, this.maxHp);
        }
    }

    _pickRandomDir() {
        this.direction   = DIRS[Math.floor(Math.random() * DIRS.length)];
        this.dirTimer    = 0;
        this.changeDirIn = 800 + Math.random() * 1500;
        this.snapToGrid(this.direction);
    }

    takeDamage(dmg = 1) {
        this.hp -= dmg;
        if (this.hp <= 0) { this.alive = false; return true; }
        if (this.type === 'armor') {
            this.color = Enemy._colorByType('armor', this.hp, this.maxHp);
        }
        return false;
    }

    render(ctx, ox, oy) {
        if (!this.alive) return;

        if (this.spawnFlash) {
            const dx = Math.round(this.x) + ox;
            const dy = Math.round(this.y) + oy;
            if (this.flashFrame < 4) {
                ctx.save();
                ctx.strokeStyle = '#fcfcfc';
                ctx.lineWidth = 2;
                const r = this.width / 2 + 4;
                ctx.beginPath();
                ctx.arc(dx + this.width / 2, dy + this.height / 2, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
            return;
        }

        super.render(ctx, ox, oy);
    }
}
```

---

## ✅ Що далі

В підуроці 10.5 ми створимо **систему спавну ворогів** та інтегруємо все в main.js.
