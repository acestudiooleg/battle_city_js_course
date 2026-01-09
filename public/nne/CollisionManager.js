/**
 * 🎮 Клас CollisionManager - система колізій
 *
 * Відповідає за:
 * - Перевірку зіткнень між об'єктами
 * - Обробку пошкоджень
 * - Видалення зіткнутих об'єктів
 * - Створення різних типів вибухів
 */

export class CollisionManager {
  constructor(logger, game = null) {
    // Статистика колізій
    this.stats = {
      totalCollisions: 0,
      playerHits: 0,
      enemyHits: 0,
      bulletCollisions: 0,
      wallDestructions: 0,
    };

    // Логгер для запису подій
    this.logger = logger;

    // Посилання на гру для створення вибухів
    this.game = game;

    this.logger.gameEvent('Система колізій ініціалізована');
  }

  /**
   * Перевірка всіх колізій в грі
   * @param {Object} gameObjects - Об'єкти гри
   */
  checkAllCollisions(gameObjects) {
    const { player, enemy, gameField } = gameObjects;

    if (!player || !enemy) return;

    // Перевіряємо колізії куль гравця з ворогом
    this.checkPlayerBulletsCollisions(player, enemy, gameField);

    // Перевіряємо колізії куль ворога з гравцем
    this.checkEnemyBulletsCollisions(enemy, player, gameField);

    // Перевіряємо колізії куль ворога зі штабом
    this.checkEnemyBulletsWithBaseCollisions(enemy, gameField);

    // Перевіряємо колізії куль між собою
    this.checkBulletToBulletCollisions(player, enemy);

    // Перевіряємо колізії з межами поля
    this.checkBoundaryCollisions(player, enemy, gameField);

    // Перевіряємо колізії куль зі стінами
    this.checkBulletWallCollisions(player, enemy, gameField);
  }

  /**
   * Перевірка колізій куль гравця з ворогом
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   */
  checkPlayerBulletsCollisions(player, enemy, gameField) {
    if (!player.isAlive || !enemy.isAlive || player.isPlayerRespawning())
      return;

    const playerBullets = player.getBullets();

    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const bullet = playerBullets[i];

      // Перевіряємо колізію кулі з ворогом
      if (this.checkCollision(bullet, enemy)) {
        this.handlePlayerHitEnemy(player, enemy, bullet);
        break; // Виходимо після першого попадання
      }

      // Перевіряємо чи куля вийшла за межі поля
      if (this.isBulletOutOfBounds(bullet, gameField)) {
        player.removeBullet(bullet);
      }
    }
  }

  /**
   * Перевірка колізій куль ворога з гравцем
   * @param {Enemy} enemy - Ворог
   * @param {Player} player - Гравець
   * @param {GameField} gameField - Ігрове поле
   */
  checkEnemyBulletsCollisions(enemy, player, gameField) {
    if (!enemy.isAlive || !player.isAlive || player.isPlayerRespawning())
      return;

    const enemyBullets = enemy.getBullets();

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const bullet = enemyBullets[i];

      // Перевіряємо колізію кулі з гравцем
      if (this.checkCollision(bullet, player)) {
        this.handleEnemyHitPlayer(enemy, player, bullet);
        break; // Виходимо після першого попадання
      }

      // Перевіряємо чи куля вийшла за межі поля
      if (this.isBulletOutOfBounds(bullet, gameField)) {
        enemy.removeBullet(bullet);
      }
    }
  }

  /**
   * Перевірка колізій куль ворога зі штабом
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   */
  checkEnemyBulletsWithBaseCollisions(enemy, gameField) {
    if (!enemy.isAlive) return;

    const enemyBullets = enemy.getBullets();
    const base = gameField.getBase();

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const bullet = enemyBullets[i];

      if (this.checkBulletBaseCollision(bullet, base)) {
        this.handleEnemyHitBase(enemy, gameField, bullet);
        break;
      }
    }
  }

  /**
   * Перевірка колізій куль між собою
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   */
  checkBulletToBulletCollisions(player, enemy) {
    if (!player.isAlive || !enemy.isAlive) return;

    const playerBullets = player.getBullets();
    const enemyBullets = enemy.getBullets();

    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const playerBullet = playerBullets[i];

      for (let j = enemyBullets.length - 1; j >= 0; j--) {
        const enemyBullet = enemyBullets[j];

        if (this.checkCollision(playerBullet, enemyBullet)) {
          this.handleBulletCollision(playerBullet, enemyBullet, player, enemy);
          break;
        }
      }
    }
  }

  /**
   * Перевірка колізій з межами поля
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   */
  checkBoundaryCollisions(player, enemy, gameField) {
    if (this.isTankOutOfBounds(player, gameField)) {
      this.handleTankOutOfBounds(player, gameField);
    }

    if (this.isTankOutOfBounds(enemy, gameField)) {
      this.handleTankOutOfBounds(enemy, gameField);
    }
  }

  /**
   * Перевірка колізії між двома об'єктами
   * @param {Object} obj1 - Перший об'єкт
   * @param {Object} obj2 - Другий об'єкт
   * @returns {boolean} - true якщо є колізія
   */
  checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  /**
   * Обробка попадання гравця по ворогу
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {Bullet} bullet - Куля
   */
  handlePlayerHitEnemy(player, enemy, bullet) {
    this.stats.totalCollisions++;
    this.stats.enemyHits++;

    const playerStrength = 25;
    const enemyHealth = enemy.getHealth();
    let explosionType = 'small';

    if (enemyHealth <= 50 && enemyHealth > 25) {
      explosionType = 'medium';
    } else if (enemyHealth <= 25) {
      explosionType = 'large';
    }

    // Створюємо вибух типу 'tank' (найбільший)
    if (this.game) {
      this.game.createExplosion(
        enemy.x + enemy.width / 2,
        enemy.y + enemy.height / 2,
        explosionType
      );
    }

    // Знищуємо кулю
    player.removeBullet(bullet);

    // Наносимо пошкодження ворогу
    enemy.takeDamage(playerStrength);

    // Перевіряємо чи ворог знищений
    if (!enemy.isAlive) {
      this.logger.gameEvent('🎯 Ворог знищений гравцем!');
      this.stats.enemyHits++;
    } else {
      this.logger.gameEvent('💥 Ворог пошкоджений!');
    }
  }

  /**
   * Обробка попадання ворога по гравцю
   * @param {Enemy} enemy - Ворог
   * @param {Player} player - Гравець
   * @param {Bullet} bullet - Куля
   */
  handleEnemyHitPlayer(enemy, player, bullet) {
    this.stats.totalCollisions++;
    this.stats.playerHits++;

    // Створюємо вибух типу 'armor' (середній)
    if (this.game) {
      this.game.createExplosion(
        player.x + player.width / 2,
        player.y + player.height / 2,
        'large'
      );
    }

    // Знищуємо кулю
    enemy.removeBullet(bullet);

    // Наносимо пошкодження гравцю
    player.takeDamage(bullet.damage || 1);

    this.logger.gameEvent('💥 Гравець пошкоджений!');
  }

  /**
   * Обробка попадання ворога по штабу
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   * @param {Bullet} bullet - Куля
   */
  handleEnemyHitBase(enemy, gameField, bullet) {
    this.stats.totalCollisions++;

    // Створюємо вибух типу 'tank' (найбільший)
    if (this.game) {
      this.game.createExplosion(bullet.x, bullet.y, 'large');
    }

    // Знищуємо кулю
    enemy.removeBullet(bullet);

    // Знищуємо штаб
    gameField.destroyBase();

    this.logger.gameEvent('💥 Штаб знищений! Гра закінчена!');
  }

  /**
   * Обробка зіткнення куль між собою
   * @param {Bullet} bullet1 - Перша куля
   * @param {Bullet} bullet2 - Друга куля
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   */
  handleBulletCollision(bullet1, bullet2, player, enemy) {
    this.stats.bulletCollisions++;

    // Створюємо вибух типу 'wall' (малий)
    if (this.game) {
      this.game.createExplosion(bullet1.x, bullet1.y, 'small');
    }

    // Знищуємо обидві кулі
    player.removeBullet(bullet1);
    enemy.removeBullet(bullet2);

    this.logger.gameEvent('💥 Кулі зіткнулися!');
  }

  /**
   * Перевірка чи куля вийшла за межі поля
   * @param {Bullet} bullet - Куля
   * @param {GameField} gameField - Ігрове поле
   * @returns {boolean} - true якщо куля за межами
   */
  isBulletOutOfBounds(bullet, gameField) {
    const bounds = gameField.getBounds();

    return (
      bullet.x < bounds.minX ||
      bullet.x + bullet.width > bounds.maxX ||
      bullet.y < bounds.minY ||
      bullet.y + bullet.height > bounds.maxY
    );
  }

  /**
   * Перевірка чи танк вийшов за межі поля
   * @param {Tank} tank - Танк
   * @param {GameField} gameField - Ігрове поле
   * @returns {boolean} - true якщо танк за межами
   */
  isTankOutOfBounds(tank, gameField) {
    const bounds = gameField.getBounds();

    return (
      tank.x < bounds.minX ||
      tank.x + tank.width > bounds.maxX ||
      tank.y < bounds.minY ||
      tank.y + tank.height > bounds.maxY
    );
  }

  /**
   * Обробка виходу танка за межі поля
   * @param {Tank} tank - Танк
   * @param {GameField} gameField - Ігрове поле
   */
  handleTankOutOfBounds(tank, gameField) {
    const bounds = gameField.getBounds();

    // Повертаємо танк в межі поля
    if (tank.x < bounds.minX) tank.x = bounds.minX;
    if (tank.x + tank.width > bounds.maxX) tank.x = bounds.maxX - tank.width;
    if (tank.y < bounds.minY) tank.y = bounds.minY;
    if (tank.y + tank.height > bounds.maxY) tank.y = bounds.maxY - tank.height;

    this.logger.gameEvent('🚫 Танк повернуто в межі поля');
  }

  /**
   * Перевірка колізії кулі зі штабом
   * @param {Bullet} bullet - Куля
   * @param {Object} base - Штаб
   * @returns {boolean} - true якщо є колізія
   */
  checkBulletBaseCollision(bullet, base) {
    const collision =
      bullet.x < base.x + base.width / 2 &&
      bullet.x + bullet.width > base.x - base.width / 2 &&
      bullet.y < base.y + base.height / 2 &&
      bullet.y + bullet.height > base.y - base.height / 2;

    return collision;
  }

  // CollisionManager.js

  /**
   * Перевірка чи шлях для танка вільний
   * @param {Tank} tank - Об'єкт танка
   * @param {number} nextX - Координата X, куди танк хоче переміститися
   * @param {number} nextY - Координата Y, куди танк хоче переміститися
   * @param {GameField} gameField - Об'єкт ігрового поля
   * @returns {boolean} - true якщо шлях вільний
   */
  /**
   * Перевірка чи шлях для танка вільний
   */
  canTankMove(tank, nextX, nextY, gameField) {
    // 1. Створюємо уявну позицію танка для перевірки зіткнення
    const futurePos = {
      x: nextX,
      y: nextY,
      width: tank.width,
      height: tank.height,
    };

    // 2. Перевірка меж екрана (використовуємо метод з Tank.js)
    if (!tank.checkBounds(nextX, nextY)) {
      return false;
    }

    // 3. Перевірка зіткнення з усіма стінами
    const walls = gameField.getWalls();
    for (const wall of walls) {
      if (this.checkCollision(futurePos, wall)) {
        return false; // Попереду стіна!
      }
    }

    // 4. Перевірка зіткнення зі штабом
    const base = gameField.getBase();
    if (this.checkBulletBaseCollision(futurePos, base)) {
      return false; // Попереду база!
    }

    return true; // Шлях вільний
  }
  /**
   * Отримання статистики колізій
   * @returns {Object} - Статистика
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Скидання статистики
   */
  resetStats() {
    this.stats = {
      totalCollisions: 0,
      playerHits: 0,
      enemyHits: 0,
      bulletCollisions: 0,
      wallDestructions: 0,
    };
  }

  /**
   * Перевірка колізій куль зі стінами
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   */
  checkBulletWallCollisions(player, enemy, gameField) {
    const walls = gameField.getWalls();

    // Перевіряємо кулі гравця
    this.checkBulletsWithWalls(
      player.getBullets(),
      walls,
      player,
      'player',
      gameField
    );

    // Перевіряємо кулі ворога
    this.checkBulletsWithWalls(
      enemy.getBullets(),
      walls,
      enemy,
      'enemy',
      gameField
    );
  }

  /**
   * Перевірка колізій куль зі стінами
   * @param {Array} bullets - Масив куль
   * @param {Array} walls - Масив стін
   * @param {Object} owner - Власник куль
   * @param {string} ownerType - Тип власника ('player' або 'enemy')
   * @param {GameField} gameField - Ігрове поле
   */
  checkBulletsWithWalls(bullets, walls, owner, ownerType, gameField) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];

      for (let j = walls.length - 1; j >= 0; j--) {
        const wall = walls[j];

        if (this.checkCollision(bullet, wall)) {
          // Отримуємо тип вибуху залежно від матеріалу стіни
          const explosionType = gameField.getWallExplosionType
            ? gameField.getWallExplosionType(wall)
            : 'small';

          // Створюємо вибух відповідного типу
          if (this.game) {
            this.game.createExplosion(bullet.x, bullet.y, explosionType);
          }

          // Знищуємо кулю
          owner.removeBullet(bullet);

          // Пошкоджуємо стіну
          if (wall.type !== 'base') {
            const destroyed = gameField.damageWall(wall, 1);
            if (destroyed) {
              this.stats.wallDestructions++;
              // Логуємо тип зруйнованої стіни
              this.logger.gameEvent(
                `Стіна зруйнована: ${wall.material} (${wall.explosionType} вибух)`
              );
            }
          }

          // Логуємо подію
          this.logger.gameEvent(
            `Куля ${ownerType} зіткнулася зі стіною (${wall.material}) - створено ${explosionType} вибух`
          );
          break; // Виходимо після першого зіткнення
        }
      }
    }
  }
}
