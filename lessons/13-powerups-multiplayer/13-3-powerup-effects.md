# ⭐ Урок 13.3: Ефекти артефактів

## 🔧 Метод `_collectPowerUp()`

Коли гравець підбирає артефакт, ми визначаємо його тип і застосовуємо відповідний ефект:

```js
/**
 * Застосовує ефект артефакту.
 * Викликається коли гравець наїхав на артефакт.
 *
 * switch/case — це як кілька if/else, але зручніше:
 * switch(тип) → case 'tank': → виконати → break
 *
 * @param {Player} player - гравець, що підібрав
 * @param {PowerUp} pu    - артефакт
 */
_collectPowerUp(player, pu) {
    // Деактивуємо артефакт (він зникає з поля)
    pu.active = false;
    this.powerUp = null;

    // Звук підбирання
    this.sound.play('newLife');

    // switch — перевіряємо тип артефакту
    switch (pu.type) {

        case 'tank':
            // 🔶 Додаткове життя: просто +1
            player.lives++;
            break;

        case 'helmet':
            // 🛡️ Тимчасовий щит на 10 секунд (10000 мс)
            // Поки щит активний — гравець невразливий
            player.activateHelmet(10000);
            break;

        case 'star':
            // ⭐ Підвищення рангу (покращує танк)
            // Ранг 0 → 1: швидший рух + менший кулдаун
            // Ранг 1 → 2: ще швидший + ще менший кулдаун
            player.upgradeRank();
            break;

        case 'grenade':
            // 💣 БАБАХ! Знищуємо ВСІХ ворогів на полі!
            // Проходимо по кожному ворогу
            for (const e of this.enemies) {
                // Перевіряємо що ворог живий і вже народився
                // (не ще мигає зіркою спавну)
                if (e.alive && !e.spawnFlash) {
                    // Наносимо 999 шкоди (вбиває навіть armor з 4 HP)
                    e.takeDamage(999);
                    // Створюємо великий вибух на місці ворога
                    this._spawnExplosion(
                        e.x + e.width / 2,   // центр ворога по X
                        e.y + e.height / 2,   // центр ворога по Y
                        'large'               // великий вибух
                    );
                }
            }
            // Грандіозний звук вибуху!
            this.sound.play('explodeL');
            break;

        case 'timer':
            // ⏱️ Заморозка ворогів на 10 секунд
            // Просто ставимо таймер — в _update() вороги не будуть оновлюватись
            this.freezeTimer = 10000;
            break;

        case 'shovel':
            // 🪓 Бетон навколо штабу на 20 секунд
            // fortifyEagle() замінює цеглу на бетон навколо орла
            this.field.fortifyEagle();
            this.shovelActive = true;
            this.shovelTimer  = 20000;
            break;
    }
}
```

---

## 🔧 Як працює заморозка?

В `_update()` додаємо перевірку:

```js
// Вороги рухаються і стріляють тільки якщо НЕ заморожені
if (this.freezeTimer <= 0) {
    // Нормальне оновлення ворогів
    for (const e of enemies) {
        e.update(dt, canMove, now);
    }
}
// Якщо freezeTimer > 0 — вороги просто стоять на місці!
```

---

## 🔧 Методи Player для артефактів

Додаємо в `Player.js`:

```js
/**
 * Активувати щит (helmet артефакт).
 * Під час дії щита — гравець невразливий.
 *
 * @param {number} duration - тривалість у мс (10000 = 10 сек)
 */
activateHelmet(duration = 10000) {
    this.shieldActive = true;   // щит увімкнено
    this.shieldTimer  = duration; // скільки мс залишилось
}

/**
 * Підвищити ранг (star артефакт).
 * Кожен ранг покращує характеристики танка.
 *
 * Ранг 0: кулдаун 400мс, швидкість 1.5
 * Ранг 1: кулдаун 250мс, швидкість 2.0
 * Ранг 2: кулдаун 150мс, швидкість 2.5
 */
upgradeRank() {
    // Math.min — не дозволяє рангу перевищити 2
    this.rank = Math.min(this.rank + 1, 2);

    // Масив значень для кожного рангу [ранг0, ранг1, ранг2]
    this.shootCooldown = [400, 250, 150][this.rank];
    this.speed         = [1.5, 2.0, 2.5][this.rank];
}
```

---

## 🔧 Методи GameField для лопати

Додаємо в `GameField.js`:

```js
/**
 * Замінити цеглу навколо штабу на бетон (shovel артефакт).
 * Спочатку видаляємо старі тайли, потім ставимо бетонні.
 */
fortifyEagle() {
    this._removeEagleWall();           // видалити існуючу стінку
    this._buildEagleWallMaterial('concrete'); // побудувати з бетону
}

/**
 * Повернути цегляну стінку (коли ефект лопати закінчується).
 */
unfortifyEagle() {
    this._removeEagleWall();   // видалити бетон
    this._buildEagleWall();    // побудувати цеглу
}
```

---

## 📖 Розбираємо: `switch/case`

`switch` — зручна заміна для багатьох `if/else`:

```js
// Без switch (довго і повторюється):
if (type === 'tank') {
    player.lives++;
} else if (type === 'helmet') {
    player.activateHelmet(10000);
} else if (type === 'star') {
    player.upgradeRank();
}

// З switch (читабельніше):
switch (type) {
    case 'tank':
        player.lives++;
        break;        // ОБОВ'ЯЗКОВО! Без break — виконається наступний case
    case 'helmet':
        player.activateHelmet(10000);
        break;
    case 'star':
        player.upgradeRank();
        break;
}
```

**Важливо:** після кожного `case` потрібен `break;`, інакше код "провалиться" в наступний case!

---

## Підсумок

- ✅ 6 типів артефактів з різними ефектами
- ✅ `_collectPowerUp()` з `switch/case`
- ✅ Заморозка ворогів через `freezeTimer`
- ✅ Лопата: `fortifyEagle()` / `unfortifyEagle()`
- ✅ Гравець: `activateHelmet()` та `upgradeRank()`

**Далі:** додаємо другого гравця!
