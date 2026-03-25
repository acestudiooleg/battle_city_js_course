# 🎮 Урок 8.1: Explosion.js — система частинок

## Красиві вибухи! 💥✨

Замість простих білих кружків із уроку 7, створимо справжню систему частинок — яскраві розлітаючі іскри!

Ось результат:

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-08/game.html" frameborder="0" allowfullscreen></iframe>

---

## Як працює система частинок?

Вибух — це багато маленьких **частинок**, які:
1. З'являються в одній точці
2. Розлітаються в різні боки
3. Поступово згасають та зменшуються
4. Зникають коли їх "життя" закінчується

```
Кадр 0:        Кадр 5:         Кадр 10:
    ★              ✦ · ✧           · · ·
   ★★★          · ✦ · ✧ ·         · · · ·
    ★            ✧ · ✦ ·           · · ·
               (розліт)          (згасання)
```

---

## Три типи вибухів

| Тип | Частинок | Тривалість | Коли |
|-----|----------|-----------|------|
| `small` | 8 | 400 мс | Куля вдарила в стіну |
| `medium` | 14 | 700 мс | Цегла зруйнована |
| `large` | 22 | 1200 мс | Танк / штаб знищено |

---

## Створюємо `Explosion.js`

```javascript
// Explosion.js — система частинок вибуху
// Урок 8: Вибухи та деструкція

/**
 * Клас Explosion — вибух із розлітаючими частинками.
 * Створюється в точці (x, y) з типом 'small', 'medium' або 'large'.
 */
export class Explosion {
    /**
     * @param {number} x    — X-координата центру вибуху (поле)
     * @param {number} y    — Y-координата центру вибуху (поле)
     * @param {string} type — тип: 'small', 'medium', 'large'
     */
    constructor(x, y, type = 'small') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.age = 0;                  // скільки мс пройшло
        this.duration = this._duration(); // загальна тривалість
        this.isActive = true;          // чи ще видно
        this.particles = [];           // масив частинок
        this._spawnParticles();        // створюємо частинки
    }

    /** Тривалість за типом (мс) */
    _duration() {
        return { small: 400, medium: 700, large: 1200 }[this.type] ?? 500;
    }

    /** Кількість частинок за типом */
    _particleCount() {
        return { small: 8, medium: 14, large: 22 }[this.type] ?? 8;
    }

    /** Палітра кольорів за типом */
    _colors() {
        switch (this.type) {
            case 'small':  return ['#f39c12', '#e67e22', '#f1c40f'];
            case 'medium': return ['#e74c3c', '#c0392b', '#d35400', '#f39c12'];
            case 'large':  return ['#e74c3c', '#8e44ad', '#f1c40f', '#2c3e50', '#e67e22'];
            default:       return ['#f39c12'];
        }
    }

    /** Створює частинки з випадковими параметрами */
    _spawnParticles() {
        const count  = this._particleCount();
        const colors = this._colors();
        // Діапазон швидкості залежить від типу
        const speeds = { small: [1.5, 3], medium: [2.5, 5], large: [3.5, 7] }[this.type];

        for (let i = 0; i < count; i++) {
            // Кут: рівномірно по колу + невелика випадковість
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            // Швидкість: випадкова в діапазоні
            const spd = speeds[0] + Math.random() * (speeds[1] - speeds[0]);
            // Розмір: більший для large, менший для small
            const sz = (this.type === 'large' ? 4 : this.type === 'medium' ? 3 : 2)
                       + Math.random() * 3;

            this.particles.push({
                x: this.x,                // стартова позиція = центр вибуху
                y: this.y,
                vx: Math.cos(angle) * spd, // горизонтальна швидкість
                vy: Math.sin(angle) * spd, // вертикальна швидкість
                size: sz,                  // початковий розмір
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0,                // 1.0 = повне життя, 0.0 = мертва
                decay: 0.02 + Math.random() * 0.03, // швидкість згасання
            });
        }
    }

    /**
     * Оновлює частинки: рух, згасання, зменшення.
     * @param {number} dt — deltaTime (мс)
     */
    update(dt) {
        if (!this.isActive) return;

        this.age += dt;
        if (this.age >= this.duration) { this.isActive = false; return; }

        for (const p of this.particles) {
            p.x    += p.vx;    // рух
            p.y    += p.vy;
            p.life -= p.decay; // згасання
            p.size *= 0.97;    // зменшення
        }

        // Видаляємо мертві частинки
        this.particles = this.particles.filter(p => p.life > 0);
        if (this.particles.length === 0) this.isActive = false;
    }

    /**
     * Малює вибух: центральний спалах + частинки.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.isActive) return;
        ctx.save();

        // Центральний спалах (перші 20% часу)
        const pct = this.age / this.duration;
        if (pct < 0.2) {
            const r = (this.type === 'large' ? 20 : this.type === 'medium' ? 12 : 6)
                      * (1 - pct / 0.2); // зменшується
            ctx.globalAlpha = 0.7 * (1 - pct / 0.2);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Частинки
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life); // прозорість = life
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
```

---

## Розбираємо частинки

### `angle` — кут розльоту

Частинки розлітаються **рівномірно по колу** (360°):

```javascript
const angle = (i / count) * Math.PI * 2; // 0..2π
```

`Math.cos(angle)` та `Math.sin(angle)` дають напрямок на одиничному колі:
```
          90° (π/2)
           ↑
    135°←──●──→ 45°
           │
         180° ←──●──→ 0°
           │
    225°←──●──→ 315°
           ↓
         270° (3π/2)
```

### `life` та `decay` — згасання

Кожна частинка має `life` від 1.0 до 0.0. Кожен кадр `life -= decay`:
```
Кадр 0:   life = 1.0  (яскрава, повний розмір)
Кадр 10:  life = 0.7  (напівпрозора)
Кадр 30:  life = 0.1  (ледь видна)
Кадр 35:  life ≤ 0    → filter видаляє
```

---

## Підсумок

- ✅ `Explosion` — 3 типи: small (8 частинок), medium (14), large (22)
- ✅ Частинки розлітаються по колу з випадковою швидкістю
- ✅ Кожна частинка має life, decay, size, color
- ✅ Центральний білий спалах на початку
- ✅ `update()` рухає та згашує, `render()` малює з прозорістю
