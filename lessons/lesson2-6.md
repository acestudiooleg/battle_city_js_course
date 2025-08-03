# 2.6: Створюємо журнал дій! 📝

## Що ми будемо робити сьогодні? 🚀

У цьому уроці ми створимо клас `GameLogger.js`, який буде відповідати за систему логування подій гри та відображення їх на екрані.

## 📝 Створення класу GameLogger.js

Створіть файл `GameLogger.js`:

```javascript
/**
 * 🎮 Клас GameLogger - система логування подій гри
 *
 * Відповідає за:
 * - Запис подій гри
 * - Відображення логів на екрані
 * - Різні типи повідомлень
 */

export class GameLogger {
  constructor() {
    // контейнер для логів в HTML
    this.logContainer = document.getElementById('logContent');
    // максимальна кількість записів в лозі
    this.maxEntries = 50;
  }

  /**
   * Додавання запису в лог
   * @param {string} message - Повідомлення
   * @param {string} type - Тип повідомлення
   * @param {string} details - Додаткові деталі
   */
  addLogEntry(message, type = 'info', details = '') {
    // поточний час
    const timestamp = new Date().toLocaleTimeString();
    // створюємо новий елемент div
    const entry = document.createElement('div');
    // встановлюємо CSS клас
    entry.className = `game_log__entry game_log__entry--${type}`;

    // формуємо текст з часом
    let content = `[${timestamp}] ${message}`;
    if (details) {
      // додаємо їх до тексту
      content += ` - ${details}`;
    }

    // встановлюємо текст елемента
    entry.textContent = content;

    if (!this.logContainer) {
      return;
    }

    // додаємо запис на початок списку
    this.logContainer.insertBefore(entry, this.logContainer.firstChild);

    // видаляємо зайві записи (якщо їх більше maxEntries)
    while (this.logContainer.children.length > this.maxEntries) {
      // видаляємо останній елемент
      this.logContainer.removeChild(this.logContainer.lastChild);
    }

    // автоматично прокручуємо до верху логу
    this.logContainer.scrollTop = 0;
  }

  /**
   * Загальна подія гри
   */
  gameEvent(message, details = '') {
    this.addLogEntry(message, 'game', details);
  }

  /**
   * Інформаційне повідомлення
   */
  info(message, details = '') {
    this.addLogEntry(message, 'info', details);
  }

  /**
   * Успішна операція
   */
  success(message, details = '') {
    this.addLogEntry(message, 'success', details);
  }

  /**
   * Попередження
   */
  warning(message, details = '') {
    this.addLogEntry(message, 'warning', details);
  }

  /**
   * Помилка
   */
  error(message, details = '') {
    this.addLogEntry(message, 'error', details);
  }

  /**
   * Дія гравця
   */
  playerAction(action, details = '') {
    this.addLogEntry(`👤 ${action}`, 'player', details);
  }

  /**
   * Дія ворога
   */
  enemyAction(action, details = '') {
    this.addLogEntry(`👹 ${action}`, 'enemy', details);
  }
}
```

## 🎯 Що робить цей клас?

### Основні властивості:

- **`logContainer`** - HTML елемент для відображення логів
- **`maxEntries`** - максимальна кількість записів (50)

### Основні методи:

- **`addLogEntry()`** - додавання запису в лог
- **`gameEvent()`** - загальні події гри
- **`info()`** - інформаційні повідомлення
- **`success()`** - успішні операції
- **`warning()`** - попередження
- **`error()`** - помилки
- **`playerAction()`** - дії гравця
- **`enemyAction()`** - дії ворога

## 📋 Типи повідомлень

| Тип            | Опис                      | Приклад                                    |
| -------------- | ------------------------- | ------------------------------------------ |
| **game** 🎮    | Загальні події гри        | "Гра запущена", "Рівень завантажено"       |
| **info** ℹ️    | Інформаційні повідомлення | "Розмір Canvas: 800x600"                   |
| **success** ✅ | Успішні операції          | "Гра ініціалізована успішно!"              |
| **warning** ⚠️ | Попередження              | "Низький FPS", "Місце закінчується"        |
| **error** ❌   | Помилки                   | "Помилка завантаження", "Клас не знайдено" |
| **player** 👤  | Дії гравця                | "👤 Гравець створений", "👤 Стріляє"       |
| **enemy** 👹   | Дії ворога                | "👹 Ворог створений", "👹 Рухається"       |

## 🎨 CSS змінні для кольорів

**Файл:** `lesson2/variables.css`

Для консистентності дизайну використовуємо CSS змінні:

### 🎮 Кольори гри:

```css
--game-color: #34495e; /* Основний колір гри */
--game-color-hover: #2c3e50; /* Колір при наведенні */
--game-color-bg: #4a5f7a; /* Фоновий колір */
```

### 👤 Кольори гравця:

```css
--player-color: #f1c40f; /* Основний колір гравця (жовтий) */
--player-color-hover: #f39c12; /* Колір при наведенні */
--player-color-bg: #f7dc6f; /* Фоновий колір */
--player-text: #2c3e50; /* Колір тексту */
```

### 👹 Кольори ворога:

```css
--enemy-color: #e74c3c; /* Основний колір ворога (червоний) */
--enemy-color-hover: #c0392b; /* Колір при наведенні */
--enemy-color-bg: #ec7063; /* Фоновий колір */
--enemy-text: #ffffff; /* Колір тексту */
```

## 🎨 Особливості роботи

### Формат запису:

```
[12:34:56] 👤 Гравець створений - позиція: (100, 100)
```

### Структура:

1. **Часовий штамп** - поточний час
2. **Емодзі** (для дій гравця/ворога) - 👤 або 👹
3. **Повідомлення** - опис події
4. **Деталі** (опціонально) - додаткова інформація

### Автоматичні дії:

- **Додавання на початок** - нові записи з'являються зверху
- **Обмеження кількості** - максимум 50 записів
- **Автопрокрутка** - автоматичне прокручування до верху
- **Очищення** - видалення старих записів

## 🎨 CSS стилі для логів

**Файл:** `lesson2/styles.css`

Додайте стилі для різних типів логів (використовуючи CSS змінні):

```css
/* 📋 Елемент журналу - як робимо елемент для вікна */
.game_log__entry {
  margin-bottom: 8px;
  padding: 5px;
  border-radius: 4px;
  word-wrap: break-word;
}
/* 📋 Інформація про подію - як робимо інформацію для вікна */
.game_log__entry--info {
  background-color: var(--primary);
  color: var(--white);
}
/* 📋 Успіх - як робимо успіх для вікна */
.game_log__entry--success {
  background-color: var(--success);
  color: var(--white);
}
/* 📋 Попередження - як робимо попередження для вікна */
.game_log__entry--warning {
  background-color: var(--warning);
  color: var(--white);
}
/* 📋 Помилка - як робимо помилку для вікна */
.game_log__entry--error {
  background-color: var(--danger);
  color: var(--white);
}
/* 📋 Інформація для відладки - як робимо інформацію для відладки для вікна */
.game_log__entry--debug {
  background-color: var(--gray);
  color: var(--white);
}

.game_log__entry--game {
  background-color: var(--game-color);
  color: var(--white);
}

.game_log__entry--player {
  background-color: var(--player-color);
  color: var(--player-text);
}

.game_log__entry--enemy {
  background-color: var(--enemy-color);
  color: var(--enemy-text);
}
```

## 🎮 Використання

```javascript
// Створення логера
const logger = new GameLogger();

// Різні типи повідомлень
logger.gameEvent('Гра запущена');
logger.info('Розмір Canvas: 800x600');
logger.success('Гравець створений успішно!');
logger.warning('Низький FPS: 30');
logger.error('Помилка завантаження ресурсу');

// Дії персонажів
logger.playerAction('Гравець створений', 'позиція: (100, 100)');
logger.enemyAction('Ворог знищений', 'координати: (300, 200)');
```

## 🧹 Функція очищення логу

**Файл:** `public/mbili/main.js`

Додайте функцію для очищення логу:

```javascript
function clearLog() {
  // знаходимо контейнер логу
  const logContent = document.getElementById('logContent');
  // очищаємо весь вміст
  logContent.innerHTML = '';
}
```

## 🎉 Результат

Після створення цього класу у тебе буде:

- ✅ Система логування з різними типами повідомлень
- ✅ Автоматичне відображення часу
- ✅ Емодзі для дій персонажів
- ✅ Обмеження кількості записів
- ✅ Автоматичне прокручування

## 🚀 Що далі?

У наступному уроці ми створимо головний клас гри, який буде координувати всі компоненти.

**Ти молодець! 🌟 Продовжуй в тому ж дусі!**
