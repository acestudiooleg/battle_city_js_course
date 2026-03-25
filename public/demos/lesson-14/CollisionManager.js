/**
 * 💥 Клас CollisionManager — система зіткнень
 *
 * Відповідає за:
 * - Кулі ↔ стіни       (пошкодження / руйнування)
 * - Кулі ↔ танки        (влучання)
 * - Кулі ↔ штаб (Орел)  (game over)
 * - Кулі ↔ кулі         (взаємне знищення)
 * - Кулі за межами поля  (деактивація)
 * - Танки ↔ танки        (не проходять одне через одного)
 */
import { FIELD_W, FIELD_H } from './constants.js';

export class CollisionManager {
  /**
   * @param {GameField} field
   * @param {Function} onExplosion - (fx, fy, type) callback для створення вибуху
   * @param {Function} onSound     - (key) callback для звуку
   */
  constructor(field, onExplosion, onSound) {
    this.field = field;
    this.onExplosion = onExplosion ?? (() => {});
    this.onSound = onSound ?? (() => {});
  }

  /**
   * Основний метод — викликається щокадру.
   * @param {Player}   player
   * @param {Enemy[]}  enemies
   */
  update(player, enemies) {
    const allTanks = [player, ...enemies].filter((t) => t.alive && !t.isRespawning && !t.spawnFlash);

    // 1. Кулі гравця
    this._processBullets(player, enemies, allTanks, 'player');

    // 2. Кулі кожного ворога
    for (const enemy of enemies) {
      this._processBullets(enemy, [player], allTanks, 'enemy');
    }

    // 3. Кулі ↔ кулі (гравець vs ворог)
    this._bulletVsBullet(player, enemies);
  }

  // ─── Обробка куль одного танка ────────────────────────────────────────────

  _processBullets(shooter, targets, allTanks, ownerType) {
    for (let i = shooter.bullets.length - 1; i >= 0; i--) {
      const b = shooter.bullets[i];
      if (!b.active) continue;

      const bx = b.x - b.width / 2;
      const by = b.y - b.height / 2;

      // Межі поля
      if (bx < 0 || by < 0 || bx + b.width > FIELD_W || by + b.height > FIELD_H) {
        b.active = false;
        this.onExplosion(b.x, b.y, 'small');
        this.onSound('explodeS');
        continue;
      }

      // Стіни
      const tile = this.field.bulletHitWall(bx, by, b.width, b.height);
      if (tile) {
        b.active = false;
        if (tile.material === 'brick') {
          // NES-стиль: руйнуємо пару тайлів з боку влучання
          this.field.destroyBrickPair(tile, b.direction);
          this.onExplosion(b.x, b.y, 'small');
        } else {
          // Бетон — не руйнується, просто вибух
          this.onExplosion(b.x, b.y, 'small');
        }
        this.onSound('explodeS');
        continue;
      }

      // Штаб (Орел)
      if (this.field.bulletHitEagle(bx, by, b.width, b.height)) {
        b.active = false;
        this.field.destroyEagle();
        this.onExplosion(
          this.field.eagle.x + this.field.eagle.width / 2,
          this.field.eagle.y + this.field.eagle.height / 2,
          'large'
        );
        this.onSound('explodeL');
        continue;
      }

      // Танки-цілі
      for (const target of targets) {
        if (!target.alive) continue;
        if (target.isRespawning) continue;
        if (target.spawnFlash) continue;

        if (this._aabb(bx, by, b.width, b.height, target.x, target.y, target.width, target.height)) {
          b.active = false;

          if (ownerType === 'player') {
            // Гравець влучив у ворога
            const killed = target.takeDamage(1);
            this.onExplosion(
              target.x + target.width / 2,
              target.y + target.height / 2,
              killed ? 'large' : 'medium'
            );
            this.onSound(killed ? 'explodeL' : 'explodeS');
          } else {
            // Ворог влучив у гравця
            if (target.shieldActive) {
              // Щит поглинає удар
              this.onExplosion(b.x, b.y, 'small');
            } else {
              const gameOver = target.hit();
              this.onExplosion(
                target.x + target.width / 2,
                target.y + target.height / 2,
                'large'
              );
              this.onSound('explodeL');
            }
          }
          break;
        }
      }
    }
  }

  // ─── Куля ↔ Куля ─────────────────────────────────────────────────────────

  _bulletVsBullet(player, enemies) {
    // Кулі рухаються швидко (5px/кадр кожна = 10px зближення),
    // тому збільшуємо зону зіткнення щоб не пролітали одна через одну
    const PAD = 6;
    for (let pi = player.bullets.length - 1; pi >= 0; pi--) {
      const pb = player.bullets[pi];
      if (!pb.active) continue;
      const pbx = pb.x - pb.width / 2 - PAD;
      const pby = pb.y - pb.height / 2 - PAD;
      const pbw = pb.width + PAD * 2;
      const pbh = pb.height + PAD * 2;

      for (const enemy of enemies) {
        for (let ei = enemy.bullets.length - 1; ei >= 0; ei--) {
          const eb = enemy.bullets[ei];
          if (!eb.active) continue;
          const ebx = eb.x - eb.width / 2 - PAD;
          const eby = eb.y - eb.height / 2 - PAD;
          const ebw = eb.width + PAD * 2;
          const ebh = eb.height + PAD * 2;

          if (this._aabb(pbx, pby, pbw, pbh, ebx, eby, ebw, ebh)) {
            pb.active = false;
            eb.active = false;
            this.onExplosion(pb.x, pb.y, 'small');
            this.onSound('explodeS');
          }
        }
      }
    }
  }

  // ─── Танк ↔ Танк ─────────────────────────────────────────────────────────

  /**
   * Перевіряє, чи новий прямокутник танка не перекриває інші танки.
   * Використовується Game.js як додаткова перевірка до field.canTankMove.
   */
  tankOverlap(tank, nx, ny, allTanks) {
    for (const other of allTanks) {
      if (other === tank || !other.alive) continue;
      if (other.isRespawning || other.spawnFlash) continue;
      if (this._aabb(nx, ny, tank.width, tank.height, other.x, other.y, other.width, other.height)) {
        return true;
      }
    }
    return false;
  }

  // ─── Утиліти ──────────────────────────────────────────────────────────────

  _aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }
}
