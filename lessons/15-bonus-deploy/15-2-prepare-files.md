# 📁 Бонус 15.2: Підготовка файлів

## Структура проєкту для публікації

GitHub Pages шукає файл `index.html` в корені репозиторію. Тому нам потрібно підготувати файли:

---

## Крок 1: Створюємо папку

Створи нову папку `battle-city` в зручному місці (наприклад, на Робочому столі):

```bash
mkdir battle-city
cd battle-city
```

---

## Крок 2: Копіюємо файли гри

Скопіюй всі JS-файли з фінальної гри в цю папку. Ось повний список:

```
battle-city/
├── index.html          ← ГОЛОВНИЙ файл (перейменований game.html)
├── main.js             ← точка входу (меню + запуск)
├── Game.js             ← ігровий цикл
├── GameField.js        ← поле з тайлами
├── Player.js           ← танк гравця
├── Enemy.js            ← ворожий танк
├── Tank.js             ← базовий клас танка
├── Bullet.js           ← куля
├── Explosion.js        ← вибухи
├── CollisionManager.js ← зіткнення
├── InputManager.js     ← клавіатура
├── SpriteSheet.js      ← NES спрайти
├── SoundManager.js     ← звуки
├── PowerUp.js          ← артефакти
├── constants.js        ← константи
├── colors.js           ← палітра кольорів
├── levels.js           ← дані рівня
└── assets/             ← ресурси
    ├── battlecity_general.png
    ├── bullet.mp3
    ├── explosion.mp3
    ├── explosion2.mp3
    ├── engine-run.mp3
    ├── drive.mp3
    ├── new-life.mp3
    └── intro.mp3
```

---

## Крок 3: Перейменовуємо game.html → index.html

Файл `game.html` потрібно перейменувати в `index.html` — це стандартна назва головної сторінки сайту. Браузер автоматично шукає саме `index.html`.

---

## Крок 4: Виправляємо шляхи до ресурсів

В нашій папці `assets/` лежить поруч з JS-файлами, тому шляхи мають бути `assets/`:

**SpriteSheet.js** — знайди рядок з `img.src` і зміни:
```js
// БУЛО (для demos):
this.img.src = '../../assets/battlecity_general.png';

// СТАЛО (для публікації):
this.img.src = 'assets/battlecity_general.png';
```

**SoundManager.js** — знайди `const base` і зміни:
```js
// БУЛО:
const base = '../../assets/';

// СТАЛО:
const base = 'assets/';
```

---

## Крок 5: Перевіряємо локально

Відкрий `index.html` через Live Server у VS Code (правий клік → **Open with Live Server**).

Переконайся що:
- [ ] Меню з'являється ("1 PLAYER / 2 PLAYERS")
- [ ] Гра запускається після Enter
- [ ] Спрайти NES відображаються
- [ ] Звуки працюють

Якщо щось не так — перевір шляхи в SpriteSheet.js та SoundManager.js.

---

## Підсумок

- ✅ Створили папку `battle-city` зі всіма файлами
- ✅ Перейменували `game.html` → `index.html`
- ✅ Виправили шляхи до `assets/`
- ✅ Перевірили що все працює локально

**Далі:** завантажуємо на GitHub!
