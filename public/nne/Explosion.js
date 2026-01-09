/**
 * 💥 Клас Explosion - анімація вибуху
 *
 * Створює ефект вибуху з частинками, які розлітаються в різні сторони
 * Підтримує 3 типи вибухів:
 * - small: малий вибух при зіткненні з деревянними стінами (1 HP)
 * - medium: середній вибух при зіткненні з цегляними стінами (3 HP) або бронею танка
 * - large: великий вибух при знищенні бетонних стін (10 HP) або танка
 */

export class Explosion {
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

    if (this.logger) {
      this.logger.gameEvent(`💥 Вибух типу ${type} створений`, {
        x,
        y,
        size: this.size,
        type,
      });
    }

    console.log(`💥 Вибух типу ${type} створений в позиції:`, x, y);
  }

  /**
   * Отримання розміру вибуху залежно від типу
   */
  getSizeByType(type, baseSize = 25) {
    switch (type) {
      case 'small':
        return baseSize * 0.8; // Менший розмір для дерева
      case 'medium':
        return baseSize * 1.2; // Середній розмір для цегли
      case 'large':
        return baseSize * 1.8; // Більший розмір для бетону
      default:
        return baseSize;
    }
  }

  /**
   * Отримання тривалості вибуху залежно від типу
   */
  getDurationByType(type) {
    switch (type) {
      case 'small':
        return 100; // 0.6 секунди для дерева
      case 'medium':
        return 1000; // 1 секунда для цегли
      case 'large':
        return 2200; // 1.8 секунди для бетону
      default:
        return 800;
    }
  }

  /**
   * Створення частинок для вибуху
   */
  createParticles() {
    const particleCount = this.getParticleCountByType();
    const colors = this.getColorsByType();

    for (let i = 0; i < particleCount; i++) {
      // Випадковий кут для напрямку частинки
      const angle = (i / particleCount) * Math.PI * 2;

      // Випадкова швидкість залежно від типу
      const speed = this.getSpeedByType();

      // Випадковий розмір частинки
      const particleSize = this.getParticleSizeByType();

      // Випадковий колір
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: particleSize,
        color: color,
        life: 1.0,
        decay: this.getDecayByType(),
      });
    }
  }

  /**
   * Отримання кількості частинок залежно від типу
   */
  getParticleCountByType() {
    switch (this.type) {
      case 'small':
        return 8;
      case 'medium':
        return 12;
      case 'large':
        return 20;
      default:
        return 8;
    }
  }

  /**
   * Отримання кольорів залежно від типу
   */
  getColorsByType() {
    switch (this.type) {
      case 'small':
        return ['#f39c12', '#e67e22', '#f1c40f', '#f7dc6f']; // Жовто-помаранчеві для дерева
      case 'medium':
        return ['#e74c3c', '#c0392b', '#d35400', '#e67e22', '#f39c12']; // Червоно-помаранчеві для цегли
      case 'large':
        return [
          '#e74c3c',
          '#c0392b',
          '#8e44ad',
          '#2c3e50',
          '#f39c12',
          '#f1c40f',
        ]; // Різноманітні для бетону
      default:
        return ['#f39c12', '#e67e22', '#e74c3c', '#f1c40f'];
    }
  }

  /**
   * Отримання швидкості частинок залежно від типу
   */
  getSpeedByType() {
    switch (this.type) {
      case 'small':
        return 1.5 + Math.random() * 2.5; // Повільніше для дерева
      case 'medium':
        return 2.5 + Math.random() * 3.5; // Середня швидкість для цегли
      case 'large':
        return 3.5 + Math.random() * 5.5; // Швидше для бетону
      default:
        return 2 + Math.random() * 3;
    }
  }

  /**
   * Отримання розміру частинок залежно від типу
   */
  getParticleSizeByType() {
    switch (this.type) {
      case 'small':
        return 2 + Math.random() * 3; // Менші частинки для дерева
      case 'medium':
        return 3 + Math.random() * 4; // Середні частинки для цегли
      case 'large':
        return 4 + Math.random() * 6; // Більші частинки для бетону
      default:
        return 3 + Math.random() * 4;
    }
  }

  /**
   * Отримання швидкості згасання залежно від типу
   */
  getDecayByType() {
    switch (this.type) {
      case 'small':
        return 0.025 + Math.random() * 0.035; // Швидше згасає для дерева
      case 'medium':
        return 0.02 + Math.random() * 0.03; // Середня швидкість згасання для цегли
      case 'large':
        return 0.015 + Math.random() * 0.025; // Повільніше згасає для бетону
      default:
        return 0.02 + Math.random() * 0.03;
    }
  }

  /**
   * Оновлення вибуху
   */
  update(deltaTime) {
    if (!this.isActive) return;

    // Оновлюємо час життя вибухуs
    this.age += deltaTime;

    // Перевіряємо чи вибух закінчився
    if (this.age >= this.duration) {
      this.isActive = false;
      return;
    }

    // Оновлюємо кожну частинку
    this.particles.forEach((particle) => {
      // Рухаємо частинку
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Зменшуємо життя частинки
      particle.life -= particle.decay;

      // Зменшуємо розмір частинки
      particle.size *= 0.98;
    });

    // Видаляємо частинки з нульовим життям
    this.particles = this.particles.filter((particle) => particle.life > 0);

    // Якщо всі частинки зникли, деактивуємо вибух
    if (this.particles.length === 0) {
      this.isActive = false;
    }
  }

  /**
   * Малювання вибуху
   */
  render(ctx) {
    if (!this.isActive) return;

    ctx.save();

    // Додаємо спеціальні ефекти залежно від типу вибуху
    this.renderSpecialEffects(ctx);

    // Малюємо кожну частинку
    this.particles.forEach((particle) => {
      // Встановлюємо колір з прозорістю
      const alpha = particle.life;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;

      // Малюємо частинку як коло
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Додаємо світіння залежно від типу
      this.addGlowEffect(ctx, particle);
    });

    ctx.restore();
  }

  /**
   * Додавання світіння залежно від типу вибуху
   */
  addGlowEffect(ctx, particle) {
    switch (this.type) {
      case 'small':
        // Слабке світіння для дерева
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 1.5;
        break;
      case 'medium':
        // Середнє світіння для цегли
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        break;
      case 'large':
        // Сильне світіння для бетону
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 3;
        break;
    }

    // Малюємо частинку зі світінням
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Малювання спеціальних ефектів залежно від типу вибуху
   */
  renderSpecialEffects(ctx) {
    const agePercent = this.age / this.duration;

    switch (this.type) {
      case 'small':
        // Дерев'яні тріски
        this.renderWoodSplinters(ctx, agePercent);
        break;
      case 'medium':
        // Цегляні уламки
        this.renderBrickDebris(ctx, agePercent);
        break;
      case 'large':
        // Бетонні осколки
        this.renderConcreteShards(ctx, agePercent);
        break;
    }
  }

  /**
   * Малювання дерев'яних трісок
   */
  renderWoodSplinters(ctx, agePercent) {
    if (agePercent < 0.3) {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - agePercent * 3;

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const length = 15 + Math.random() * 10;
        const x1 = this.x + Math.cos(angle) * 5;
        const y1 = this.y + Math.sin(angle) * 5;
        const x2 = this.x + Math.cos(angle) * length;
        const y2 = this.y + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }

  /**
   * Малювання цегляних уламків
   */
  renderBrickDebris(ctx, agePercent) {
    if (agePercent < 0.4) {
      ctx.fillStyle = '#CD5C5C';
      ctx.globalAlpha = 1 - agePercent * 2.5;

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 8 + Math.random() * 12;
        const x = this.x + Math.cos(angle) * distance;
        const y = this.y + Math.sin(angle) * distance;
        const size = 3 + Math.random() * 4;

        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  }

  /**
   * Малювання бетонних осколків
   */
  renderConcreteShards(ctx, agePercent) {
    if (agePercent < 0.5) {
      ctx.fillStyle = '#708090';
      ctx.globalAlpha = 1 - agePercent * 2;

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 10 + Math.random() * 20;
        const x = this.x + Math.cos(angle) * distance;
        const y = this.y + Math.sin(angle) * distance;
        const size = 4 + Math.random() * 6;

        // Малюємо трикутні осколки
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  /**
   * Перевірка чи вибух активний
   */
  isExplosionActive() {
    return this.isActive;
  }
}
