# Battle City JS Course — Контекст сесії

## Статус проєкту

**Фінальна гра:** Повністю завершена (v8), `/public/final-game/` — 14 файлів, повна механіка NES Battle City з 2 гравцями, артефактами, звуками, спрайтовою графікою, меню вибору.

**Курс:** Створюємо 14-денний курс з підуроками.

---

## Що вже зроблено

### Уроки (markdown)

| День | Папка | Підуроки | Статус |
|------|-------|----------|--------|
| 1 | `lessons/01-getting-started/` | 6 файлів (1-1 — 1-6) | ✅ Готово |
| 2 | `lessons/02-canvas-and-coordinates/` | 5 файлів (2-1 — 2-5) | ✅ Готово |
| 3 | `lessons/03-drawing-tank/` | 5 файлів (3-1 — 3-5) | ✅ Готово |
| 4 | `lessons/04-movement/` | 5 файлів (4-1 — 4-5) | ✅ Готово |
| 5 | `lessons/05-shooting/` | 5 файлів (5-1 — 5-5) | ✅ Готово |
| 6 | `lessons/06-game-field/` | 4 файли (6-1 — 6-4) | ✅ Готово |
| 7 | `lessons/07-collisions/` | 5 файлів (7-1 — 7-5) | ✅ Готово |
| 8 | `lessons/08-explosions/` | 4 файли (8-1 — 8-4) | ✅ Готово |
| 9 | `lessons/09-eagle-gamestate/` | 4 файли (9-1 — 9-4) | ✅ Готово |
| 10 | `lessons/10-enemies/` | 5 файлів (10-1 — 10-5) | ✅ Готово |
| 11 | `lessons/11-sprites/` | 5 файлів (11-1 — 11-5) | ✅ Готово |
| 12 | `lessons/12-sound-ui/` | 4 файли (12-1 — 12-4) | ✅ Готово |
| 13 | `lessons/13-powerups-multiplayer/` | 5 файлів (13-1 — 13-5) | ✅ Готово |
| 14 | `lessons/14-title-final/` | 4 файли (14-1 — 14-4) | ✅ Готово |

### Демо-папки (інтерактивні приклади)

| День | Папка | Статус |
|------|-------|--------|
| 1 | `public/demos/lesson-01/` | ✅ Готово (game.html, main.js, styles.css, variables.css) |
| 2 | `public/demos/lesson-02/` | ✅ Готово (game.html, main.js, constants.js, colors.js) |
| 3 | `public/demos/lesson-03/` | ✅ Готово (game.html, main.js, constants.js, colors.js, Tank.js, Player.js) |
| 4 | `public/demos/lesson-04/` | ✅ Готово (game.html, main.js, Tank.js, Player.js, InputManager.js, constants.js, colors.js) |
| 5 | `public/demos/lesson-05/` | ✅ Готово (game.html, main.js, Tank.js, Player.js, Bullet.js, InputManager.js, constants.js, colors.js) |
| 6 | `public/demos/lesson-06/` | ✅ Готово (+levels.js, GameField.js) |
| 7 | `public/demos/lesson-07/` | ✅ Готово (+CollisionManager.js) |
| 8 | `public/demos/lesson-08/` | ✅ Готово (+Explosion.js, destroyBrickPair) |
| 9 | `public/demos/lesson-09/` | ✅ Готово (+Player lives/respawn/shield, CollisionManager v2) |
| 10 | `public/demos/lesson-10/` | ✅ Готово (+Enemy.js, spawn system) |
| 11 | `public/demos/lesson-11/` | ✅ Готово (+SpriteSheet.js, NES sprites) |
| 12 | `public/demos/lesson-12/` | ✅ Готово (+SoundManager.js, NES sidebar) |
| 13 | `public/demos/lesson-13/` | ✅ Готово (+PowerUp.js, 2 players) |
| 14 | `public/demos/lesson-14/` | ✅ Готово (= final game with title screen) |

### Інші файли

- `course-roadmap.md` — повний план 14 днів з деталями кожного підуроку ✅
- `golden-master-report.md` — опис фінальної гри (v8) ✅
- `manifest.md` — початковий маніфест проєкту ✅
- `.vitepress/config.mjs` — sidebar з усіма 14 днями (посилання на дні 3-14 вказують на ще не створені папки) ✅
- `lessons/*_backup.md` — бекапи старих уроків (22 файли) ✅

---

## Формат уроків

### Структура імен файлів
```
lessons/{NN}-{folder-name}/{N}-{M}-{topic-name}.md
```
Приклад: `lessons/02-canvas-and-coordinates/2-3-colors-js.md`

### Формат підуроку
- Заголовок з emoji: `# 🎮 Урок 2.1: Назва`
- Вступне пояснення з аналогією (для дітей 10-14 років)
- Покрокові інструкції з кодом
- Блоки "Розбираємо код" з поясненнями
- Підсумок з чекбоксами ✅
- iframe демо в першому підуроці дня (650×500, src `/battle_city_js_course/demos/lesson-NN/game.html`)
- Посилання на демо в останньому підуроці дня

### Формат демо
- `game.html` — мінімальний HTML з Canvas та CSS (без scale, адаптивний через `width: 100%`)
- JS-файли з модулями (export/import)
- Кожне демо автономне (копіює попереднє + нові файли)

---

## Статус

**КУРС ЗАВЕРШЕНО!** Всі 14 уроків (66 підуроків) + 14 демо створені.

Наступні кроки:
- Перевірити всі демо на працездатність
- Прорев'ювити якість уроків
- Публікація

---

## Еталонний код (для написання уроків)

Фінальна гра в `/public/final-game/`:
```
Game.js, GameField.js, Player.js, Enemy.js, Tank.js, Bullet.js,
Explosion.js, CollisionManager.js, InputManager.js, SpriteSheet.js,
SoundManager.js, PowerUp.js, constants.js, colors.js, levels.js
```

Для кожного уроку бери **спрощену версію** відповідного класу з final-game.

---

## Як продовжити

```bash
claude "Прочитай session-context.md та course-roadmap.md, потім створи День 3 (уроки + демо)"
```
