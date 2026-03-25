/**
 * 💥 Клас Explosion — система частинок вибуху
 *
 * Три типи:
 * - 'small'  — дерево / куля+куля
 * - 'medium' — цегла / легкий танк
 * - 'large'  — бетон / танк / штаб
 */
export class Explosion {
  constructor(x, y, type = 'small') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.age = 0;
    this.duration = this._duration();
    this.isActive = true;
    this.particles = [];
    this._spawnParticles();
  }

  _duration() {
    return { small: 400, medium: 700, large: 1200 }[this.type] ?? 500;
  }

  _particleCount() {
    return { small: 8, medium: 14, large: 22 }[this.type] ?? 8;
  }

  _colors() {
    switch (this.type) {
      case 'small':  return ['#f39c12','#e67e22','#f1c40f'];
      case 'medium': return ['#e74c3c','#c0392b','#d35400','#f39c12'];
      case 'large':  return ['#e74c3c','#8e44ad','#f1c40f','#2c3e50','#e67e22'];
      default:       return ['#f39c12'];
    }
  }

  _spawnParticles() {
    const count  = this._particleCount();
    const colors = this._colors();
    const speeds = { small: [1.5, 3], medium: [2.5, 5], large: [3.5, 7] }[this.type] ?? [2,4];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const spd   = speeds[0] + Math.random() * (speeds[1] - speeds[0]);
      const sz    = (this.type === 'large' ? 4 : this.type === 'medium' ? 3 : 2) + Math.random() * 3;

      this.particles.push({
        x: this.x, y: this.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: sz,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
      });
    }
  }

  update(dt) {
    if (!this.isActive) return;
    this.age += dt;
    if (this.age >= this.duration) { this.isActive = false; return; }

    for (const p of this.particles) {
      p.x    += p.vx;
      p.y    += p.vy;
      p.life -= p.decay;
      p.size *= 0.97;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    if (this.particles.length === 0) this.isActive = false;
  }

  render(ctx) {
    if (!this.isActive) return;
    ctx.save();

    // Центральний спалах на початку
    const pct = this.age / this.duration;
    if (pct < 0.2) {
      const r = (this.type === 'large' ? 20 : this.type === 'medium' ? 12 : 6) * (1 - pct / 0.2);
      ctx.globalAlpha = 0.7 * (1 - pct / 0.2);
      ctx.fillStyle   = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Частинки
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      if (this.type === 'large') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = p.size * 2;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  isExplosionActive() { return this.isActive; }
}
