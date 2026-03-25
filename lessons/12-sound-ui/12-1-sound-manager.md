# 🔊 Урок 12.1: SoundManager — звуки гри

## Ось що ми зробимо сьогодні:

<iframe width="100%" height="500" src="/battle_city_js_course/demos/lesson-12/game.html" frameborder="0" allowfullscreen></iframe>

---

## 🤔 Навіщо звуки?

Уяви гру без звуку — як мультик з вимкненим телевізором! Звуки роблять гру **живою**:
- Постріл — гравець розуміє, що стрільнув
- Вибух — підтвердження, що влучив
- Двигун — відчуття руху

В NES Battle City є такі звуки:
| Подія | Файл | Коли грає |
|-------|------|-----------|
| Постріл | `bullet.mp3` | Танк стріляє |
| Вибух маленький | `explosion.mp3` | Куля влучає у стіну |
| Вибух великий | `explosion2.mp3` | Танк знищено |
| Двигун | `engine-run.mp3` | Танк рухається (петля) |
| Інтро | `intro.mp3` | Початок гри |
| Нове життя | `new-life.mp3` | Гравець підібрав артефакт |

---

## 🔧 Створюємо SoundManager.js

```js
/**
 * 🔊 Клас SoundManager — управління звуками
 *
 * Відповідає за:
 * - Завантаження аудіо-файлів (mp3)
 * - Відтворення звуків подій (постріл, вибух, двигун)
 * - Регулювання гучності
 */
export class SoundManager {
  constructor() {
    /**
     * Словник усіх звуків: ключ → Audio об'єкт
     * Наприклад: { shoot: Audio, explodeS: Audio, ... }
     */
    this.sounds = {};

    /** Чи ввімкнені звуки (true = грають) */
    this.enabled = true;

    // Завантажуємо всі звуки одразу при створенні
    this._loadAll();
  }

  /**
   * Завантажує всі звуки з папки assets.
   * Кожен звук — це об'єкт Audio, як музичний плеєр в JavaScript.
   * Audio вміє: play(), pause(), і має властивості volume та loop.
   */
  _loadAll() {
    // Шлях до папки з файлами звуків
    const base = '../../assets/';

    // Таблиця: ключ → назва файлу
    // Ключ — це ім'я, яке ми будемо використовувати в коді
    const files = {
      shoot:    'bullet.mp3',       // постріл
      explodeS: 'explosion.mp3',    // маленький вибух (стіна)
      explodeL: 'explosion2.mp3',   // великий вибух (танк)
      engine:   'engine-run.mp3',   // двигун (петля)
      drive:    'drive.mp3',        // звук руху
      newLife:  'new-life.mp3',     // підібрали артефакт
      intro:    'intro.mp3',        // інтро музика
    };

    // Цикл for...of по парах [ключ, файл]
    // Object.entries перетворює об'єкт у масив пар:
    // { shoot: 'bullet.mp3' } → [['shoot', 'bullet.mp3']]
    for (const [key, file] of Object.entries(files)) {
      // new Audio() — створюємо аудіо-плеєр
      const audio = new Audio(base + file);

      // preload = 'auto' — браузер завантажить файл заздалегідь
      audio.preload = 'auto';

      // Зберігаємо в словнику
      this.sounds[key] = audio;
    }

    // Двигун — особливий: грає безперервно в петлі
    if (this.sounds.engine) {
      this.sounds.engine.loop = true;     // петля (повторює знову і знову)
      this.sounds.engine.volume = 0.3;    // тихіше — щоб не заглушити інші звуки
    }
  }
}
```

---

## 📖 Розбираємо код

### Що таке `Audio`?

`Audio` — це вбудований в JavaScript об'єкт для відтворення звуків. Він як музичний плеєр:

```js
// Створюємо плеєр і вказуємо файл
const sound = new Audio('explosion.mp3');

// Граємо!
sound.play();

// Зупиняємо
sound.pause();

// Властивості:
sound.volume = 0.5;  // гучність від 0.0 (тиша) до 1.0 (макс)
sound.loop = true;    // повторювати безкінечно
sound.currentTime = 0; // перемотати на початок
```

### Що таке `Object.entries()`?

Це спосіб пройтися по всіх парах "ключ-значення" об'єкта:

```js
const obj = { a: 1, b: 2, c: 3 };
// Object.entries(obj) → [['a', 1], ['b', 2], ['c', 3]]

for (const [key, value] of Object.entries(obj)) {
    console.log(key, value); // 'a' 1, 'b' 2, 'c' 3
}
```

---

## Підсумок

- ✅ Дізнались, як працює `Audio` в JavaScript
- ✅ Створили клас `SoundManager` з завантаженням звуків
- ✅ Налаштували двигун як петлю (`loop = true`)

**Далі:** додамо методи `play()` та `setEngineSound()` для відтворення!
