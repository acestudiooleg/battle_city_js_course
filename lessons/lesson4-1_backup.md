# 4.1: Клас Explosion та система частинок 💥

## Що ми будемо робити? 🚀

У цьому підрозділі ми створимо "серце" наших візуальних ефектів — клас `Explosion.js`. Ми відійдемо від статичного видалення об'єктів і реалізуємо систему частинок. Тепер кожен вибух буде складатися з дрібних елементів, що розлітаються з різною швидкістю та кольором залежно від того, що саме вибухнуло.



## 🔧 Створення класу Explosion.js

Відкрийте файл `Explosion.js`. Ми розробимо структуру, яка дозволяє створювати три типи вибухів: малий (для дерева), середній (для цегли та танків) та великий (для бетону та штабу).

### 📥 Крок 1: Конструктор та ініціалізація
Тут ми визначимо початкові координати вибуху, його тип та тривалість життя. Кожен тип вибуху матиме свою унікальну затримку перед повним зникненням.

```javascript
constructor(x, y, type = 'small', logger = null) {
    this.x = x;
    this.y = y;
    this.type = type; // 'small', 'medium', 'large'
    this.size = this.getSizeByType(type);
    this.particles = [];
    this.isActive = true;
    this.duration = this.getDurationByType(type);
    this.age = 0;
    this.logger = logger;

    // Створюємо частинки вибуху
    this.createParticles();
  }

  /**
   * Отримання тривалості вибуху залежно від типу
   */
  getDurationByType(type) {
    switch (type) {
      case 'small': return 600; 
      case 'medium': return 1000;
      case 'large': return 2200;
      default: return 800;
    }
  }

  /**
   * Отримання розміру вибуху
   */
  getSizeByType(type, baseSize = 25) {
    switch (type) {
      case 'small': return baseSize * 0.8;
      case 'medium': return baseSize * 1.2;
      case 'large': return baseSize * 1.8;
      default: return baseSize;
    }
  }
```
### 🛠 Крок 2: Генерація частинок
Ми використаємо математичні функції `Math.cos` та `Math.sin`, щоб розштовхати частинки від центру вибуху в різні боки на 360 градусів. Кожна частинка отримає свій колір з нашої NES-палітри.

```javascript
/**
   * Створення частинок для вибуху
   */
  createParticles() {
    const counts = { small: 8, medium: 12, large: 20 };
    const particleCount = counts[this.type] || 8;
    const colors = this.getColorsByType();

    for (let i = 0; i < particleCount; i++) {
      // Випадковий кут розльоту (360 градусів)
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.5);
      
      const speed = this.getSpeedByType();
      const particleSize = this.getParticleSizeByType();

      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: particleSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: this.getDecayByType(),
      });
    }
  }

  getColorsByType() {
    switch (this.type) {
      case 'small': return ['#f39c12', '#e67e22', '#f1c40f']; // Дерево
      case 'medium': return ['#e74c3c', '#c0392b', '#d35400']; // Цегла
      case 'large': return ['#e74c3c', '#8e44ad', '#2c3e50', '#f1c40f']; // Танк/Бетон
      default: return ['#f39c12'];
    }
  }
```

### 🔄 Крок 3: Оновлення стану (Update)
Кожного кадру частинки мають рухатися за своїм вектором швидкості, ставати меншими та втрачати прозорість (`alpha`). Ми також додамо механізм самоочищення масиву частинок.

```javascript
/**
   * Оновлення стану частинок
   */
  update(deltaTime) {
    if (!this.isActive) return;

    this.age += deltaTime;

    // Перевіряємо закінчення тривалості
    if (this.age >= this.duration) {
      this.isActive = false;
      return;
    }

    this.particles.forEach((p) => {
      // Рух за вектором швидкості
      p.x += p.vx;
      p.y += p.vy;
      // Зменшення життя (прозорості)
      p.life -= p.decay;
      // Поступове зменшення розміру
      p.size *= 0.98;
    });

    // Оптимізація: залишаємо лише "живі" частинки
    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.particles.length === 0) {
      this.isActive = false;
    }
  }
```

### 🎨 Крок 4: Візуалізація та спецефекти
Окрім звичайних круглих частинок, ми додамо логіку "уламків": дерев'яні тріски для дерев'яних стін та квадратні осколки для цегли. Це зробить руйнування більш впізнаваними.

```javascript
/**
   * Малювання вибуху
   */
  render(ctx) {
    if (!this.isActive) return;

    ctx.save();
    
    // Малюємо додаткові уламки матеріалу
    this.renderDebris(ctx);

    this.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      // Ефект світіння для потужних вибухів
      if (this.type === 'large') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Специфічні ефекти для дерева та цегли
   */
  renderDebris(ctx) {
    const agePercent = this.age / this.duration;
    if (agePercent > 0.4) return;

    ctx.globalAlpha = 1 - agePercent * 2;
    
    if (this.type === 'small') {
      // Тріски дерева (лінії)
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(angle) * 15, this.y + Math.sin(angle) * 15);
        ctx.stroke();
      }
    }
  }
```

## 🎮 Нові можливості системи ефектів

- **Динамічне згасання**: частинки плавно розчиняються в повітрі.
- **Світіння (Glow)**: для великих вибухів ми використаємо ефект тіні, щоб створити ілюзію яскравого спалаху.
- **Оптимізація**: вибух автоматично позначає себе як неактивний, коли остання частинка зникає.

## 🚀 Що далі?

У наступному підрозділі ми інтегруємо цей клас у головний двигун гри `Game.js`, щоб вибухи почали з'являтися на полі бою!