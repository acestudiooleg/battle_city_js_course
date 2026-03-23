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
| 3 | `lessons/03-tank-class/` | — | ❌ Не створено |
| 4 | `lessons/04-movement/` | — | ❌ Не створено |
| 5 | `lessons/05-shooting/` | — | ❌ Не створено |
| 6 | `lessons/06-game-field/` | — | ❌ Не створено |
| 7 | `lessons/07-collisions/` | — | ❌ Не створено |
| 8 | `lessons/08-explosions/` | — | ❌ Не створено |
| 9 | `lessons/09-eagle-gamestate/` | — | ❌ Не створено |
| 10 | `lessons/10-enemies/` | — | ❌ Не створено |
| 11 | `lessons/11-sprites/` | — | ❌ Не створено |
| 12 | `lessons/12-sound-ui/` | — | ❌ Не створено |
| 13 | `lessons/13-powerups-multiplayer/` | — | ❌ Не створено |
| 14 | `lessons/14-title-final/` | — | ❌ Не створено |

### Демо-папки (інтерактивні приклади)

| День | Папка | Статус |
|------|-------|--------|
| 1 | `public/demos/lesson-01/` | ✅ Готово (game.html, main.js, styles.css, variables.css) |
| 2 | `public/demos/lesson-02/` | ✅ Готово (game.html, main.js, constants.js, colors.js) |
| 3–14 | `public/demos/lesson-03/` ... | ❌ Не створено |

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

## Наступний крок

**Створити День 3: Малюємо танк** — 5 підуроків + демо.

Дивись `course-roadmap.md` → "День 3" для деталей:
- 3.1: Що таке ООП (клас, конструктор, методи)
- 3.2: `Tank.js` (властивості)
- 3.3: `render()` (корпус, гусениці)
- 3.4: `_drawBarrel()` (дуло за напрямком)
- 3.5: `Player.js` (жовтий танк на полі)

Демо має містити: constants.js, colors.js, Tank.js, Player.js, main.js, game.html

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
