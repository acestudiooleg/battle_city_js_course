/**
 * 🎮 Клас CollisionManager - система колізій
 *
 * Відповідає за:
 * - Перевірку зіткнень між об'єктами
 * - Обробку пошкоджень
 * - Видалення зіткнутих об'єктів
 */

export class CollisionManager {
  constructor(logger) {
    // Статистика колізій
    this.stats = {
      totalCollisions: 0,
      playerHits: 0,
      enemyHits: 0,
      bulletCollisions: 0,
    };

    // Логгер для запису подій
    this.logger = logger;

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
  }

  /**
   * Перевірка колізій куль гравця з ворогом
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   */
  checkPlayerBulletsCollisions(player, enemy, gameField) {
    if (!player.isAlive || !enemy.isAlive || player.isPlayerRespawning()) return;

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
    if (!enemy.isAlive || !player.isAlive || player.isPlayerRespawning()) return;

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
    if (!enemy.isAlive || gameField.isBaseDestroyed()) return;

    const enemyBullets = enemy.getBullets();
    const base = gameField.getBase();

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const bullet = enemyBullets[i];

      // Перевіряємо колізію кулі зі штабом
      if (this.checkBulletBaseCollision(bullet, base)) {
        this.handleEnemyHitBase(enemy, gameField, bullet);
        break; // Виходимо після першого попадання
      }
    }
  }

  /**
   * Перевірка колізій куль між собою
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   */
  checkBulletToBulletCollisions(player, enemy) {
    // Не перевіряємо колізії куль якщо гравець відроджується
    if (player.isPlayerRespawning()) return;
    
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
    // Перевіряємо чи танки не вийшли за межі поля
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
    const collision =
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y;

    return collision;
  }

  /**
   * Обробка попадання гравця по ворогу
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   * @param {Bullet} bullet - Куля
   */
  handlePlayerHitEnemy(player, enemy, bullet) {
    // Видаляємо кулю
    player.removeBullet(bullet);

    // Наносимо пошкодження ворогу
    enemy.takeDamage(25); // 25 очок пошкодження

    // Оновлюємо статистику
    this.stats.totalCollisions++;
    this.stats.playerHits++;

    // Логуємо подію
    this.logger.gameEvent('🎯 Гравець попав по ворогу!');

    // Перевіряємо чи ворог знищений
    if (!enemy.isAlive) {
      this.logger.gameEvent('💀 Ворог знищений!');
    }
  }

  /**
   * Обробка попадання ворога по гравцю
   * @param {Enemy} enemy - Ворог
   * @param {Player} player - Гравець
   * @param {Bullet} bullet - Куля
   */
  handleEnemyHitPlayer(enemy, player, bullet) {
    // Видаляємо кулю
    enemy.removeBullet(bullet);

    // Наносимо пошкодження гравцю (одним попаданням вбиваємо)
    player.takeDamage(100); // 100 очок пошкодження - смерть з першого попадання

    // Оновлюємо статистику
    this.stats.totalCollisions++;
    this.stats.enemyHits++;

    // Логуємо подію
    this.logger.gameEvent('💥 Ворог попав по гравцю!');

    // Перевіряємо чи гра закінчена
    if (player.isGameOver()) {
      this.logger.gameEvent('💀 Гра закінчена! У гравця не залишилось життів');
    }
  }

  /**
   * Обробка попадання ворога по штабу
   * @param {Enemy} enemy - Ворог
   * @param {GameField} gameField - Ігрове поле
   * @param {Bullet} bullet - Куля
   */
  handleEnemyHitBase(enemy, gameField, bullet) {
    // Видаляємо кулю
    enemy.removeBullet(bullet);

    // Знищуємо штаб
    gameField.destroyBase();

    // Оновлюємо статистику
    this.stats.totalCollisions++;

    // Логуємо подію
    this.logger.gameEvent('💥 Ворог знищив штаб!');
  }

  /**
   * Обробка зіткнення куль
   * @param {Bullet} bullet1 - Перша куля
   * @param {Bullet} bullet2 - Друга куля
   * @param {Player} player - Гравець
   * @param {Enemy} enemy - Ворог
   */
  handleBulletCollision(bullet1, bullet2, player, enemy) {
    // Видаляємо обидві кулі
    player.removeBullet(bullet1);
    enemy.removeBullet(bullet2);

    // Оновлюємо статистику
    this.stats.bulletCollisions++;

    // Логуємо подію
    this.logger.gameEvent('💥 Кулі зіткнулися!');
  }

  /**
   * Перевірка чи куля вийшла за межі поля
   * @param {Bullet} bullet - Куля
   * @param {GameField} gameField - Ігрове поле
   * @returns {boolean} - true якщо куля за межами
   */
  isBulletOutOfBounds(bullet, gameField) {
    if (!gameField) return false;

    const bounds = gameField.getBounds();
    return (
      bullet.x < bounds.minX ||
      bullet.x > bounds.maxX ||
      bullet.y < bounds.minY ||
      bullet.y > bounds.maxY
    );
  }

  /**
   * Перевірка чи танк вийшов за межі поля
   * @param {Tank} tank - Танк
   * @param {GameField} gameField - Ігрове поле
   * @returns {boolean} - true якщо танк за межами
   */
  isTankOutOfBounds(tank, gameField) {
    if (!gameField) return false;

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
    };
  }
}
