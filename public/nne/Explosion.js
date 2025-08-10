/**
 * 💥 Клас Explosion - анімація вибуху
 * 
 * Створює ефект вибуху з частинками, які розлітаються в різні сторони
 */

export class Explosion {
    constructor(x, y, size = 20, logger = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.particles = [];
        this.isActive = true;
        this.duration = 1000; // 1 секунда
        this.age = 0;
        this.logger = logger;
        
        // Створюємо частинки вибуху
        this.createParticles();
        
        if (this.logger) {
            this.logger.gameEvent('Вибух створений', { x, y, size });
        }
        
        console.log('💥 Вибух створений в позиції:', x, y);
    }
    
    /**
     * Створення частинок для вибуху
     */
    createParticles() {
        const particleCount = 8; // Кількість частинок
        
        for (let i = 0; i < particleCount; i++) {
            // Випадковий кут для напрямку частинки
            const angle = (i / particleCount) * Math.PI * 2;
            
            // Випадкова швидкість
            const speed = 2 + Math.random() * 3;
            
            // Випадковий розмір частинки
            const particleSize = 3 + Math.random() * 4;
            
            // Випадковий колір (від жовтого до червоного)
            const colors = ['#f39c12', '#e67e22', '#e74c3c', '#f1c40f'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed, // Швидкість по X
                vy: Math.sin(angle) * speed, // Швидкість по Y
                size: particleSize,
                color: color,
                life: 1.0, // Життя частинки (від 1 до 0)
                decay: 0.02 + Math.random() * 0.03 // Швидкість згасання
            });
        }
    }
    
    /**
     * Оновлення вибуху
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Оновлюємо час життя вибуху
        this.age += deltaTime;
        
        // Перевіряємо чи вибух закінчився
        if (this.age >= this.duration) {
            this.isActive = false;
            return;
        }
        
        // Оновлюємо кожну частинку
        this.particles.forEach(particle => {
            // Рухаємо частинку
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Зменшуємо життя частинки
            particle.life -= particle.decay;
            
            // Зменшуємо розмір частинки
            particle.size *= 0.98;
        });
        
        // Видаляємо частинки з нульовим життям
        this.particles = this.particles.filter(particle => particle.life > 0);
        
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
        
        // Малюємо кожну частинку
        this.particles.forEach(particle => {
            // Встановлюємо колір з прозорістю
            const alpha = particle.life;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            
            // Малюємо частинку як коло
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Додаємо світіння
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = particle.size * 2;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        ctx.restore();
    }
    
    /**
     * Перевірка чи вибух активний
     */
    isExplosionActive() {
        return this.isActive;
    }
}
