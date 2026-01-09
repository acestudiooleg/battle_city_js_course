# 2.6: Створюємо журнал дій! 📝

## Що ми будемо робити сьогодні? 🚀

У цьому уроці ми створимо клас `GameLogger.js`, який буде відповідати за систему логування подій гри.

## 📝 Створення класу GameLogger.js

Створіть файл `GameLogger.js`:

```javascript
/**
 * 🎮 Клас GameLogger - система логування подій гри в консоль з кольорами
 *
 * Відповідає за:
 * - Запис подій гри в консоль
 * - Кольорова розпізнавання типів повідомлень
 * - Кешування та групування повідомлень
 */

export class GameLogger {
  constructor() {
    // Кеш для різних типів подій
    this.eventCache = new Map();

    // Черги для кожного типу події
    this.eventQueues = new Map();

    // Інтервал рендерингу (500мс = 2 рази на секунду)
    this.renderInterval = 500;

    // Кольори для різних типів повідомлень
    this.colors = {
      game: { bg: '#2c3e50', color: '#ecf0f1' },
      info: { bg: '#3498db', color: '#fff' },
      warning: { bg: '#f39c12', color: '#fff' },
      error: { bg: '#e74c3c', color: '#fff' },
      success: { bg: '#27ae60', color: '#fff' },
      player: { bg: '#9b59b6', color: '#fff' },
      enemy: { bg: '#c0392b', color: '#fff' },
    };

    // Запускаємо періодичний рендеринг
    this.startPeriodicRender();
  }

  /**
   * Запуск періодичного рендерингу
   */
  startPeriodicRender() {
    setInterval(() => {
      this.renderQueuedEvents();
    }, this.renderInterval);
  }

  /**
   * Додавання події в чергу
   * @param {string} message - Повідомлення
   * @param {string} type - Тип повідомлення
   * @param {string} details - Додаткові деталі
   */
  addEventToQueue(message, type = 'info', details = '') {
    const eventKey = `${type}:${message}:${details}`;

    // Створюємо чергу для цього типу події, якщо її немає
    if (!this.eventQueues.has(type)) {
      this.eventQueues.set(type, new Map());
    }

    const typeQueue = this.eventQueues.get(type);

    // Перевіряємо чи вже є така подія в черзі
    if (typeQueue.has(eventKey)) {
      // Якщо є, збільшуємо лічильник
      const existingEvent = typeQueue.get(eventKey);
      existingEvent.count++;
      existingEvent.timestamp = Date.now(); // Оновлюємо час
    } else {
      // Якщо немає, додаємо нову подію
      typeQueue.set(eventKey, {
        message,
        type,
        details,
        timestamp: Date.now(),
        count: 1,
      });
    }
  }

  /**
   * Рендеринг подій з черг
   */
  renderQueuedEvents() {
    // Проходимо по всіх типах подій
    for (const [type, typeQueue] of this.eventQueues.entries()) {
      // Проходимо по всіх подіях цього типу
      for (const [eventKey, event] of typeQueue.entries()) {
        // Логуємо подію в консоль
        this.logToConsole(event.message, event.type, event.details, event.count);

        // Видаляємо подію з черги
        typeQueue.delete(eventKey);
      }
    }
  }

  /**
   * Логування в консоль з кольорами
   * @param {string} message - Повідомлення
   * @param {string} type - Тип повідомлення
   * @param {string} details - Додаткові деталі
   * @param {number} count - Кількість повторень
   */
  logToConsole(message, type = 'info', details = '', count = 1) {
    // поточний час
    const timestamp = new Date().toLocaleTimeString();

    // формуємо текст з часом
    let content = `[${timestamp}] ${message}`;
    if (details) {
      // додаємо їх до тексту
      content += ` - ${details}`;
    }

    // Додаємо кількість повторень, якщо більше 1
    if (count > 1) {
      content += ` (${count} разів)`;
    }

    // Отримуємо кольори для типу повідомлення
    const styleConfig = this.colors[type] || this.colors.info;
    const style = `background: ${styleConfig.bg}; color: ${styleConfig.color}; padding: 4px 8px; border-radius: 3px; font-weight: bold;`;

    // Логуємо в консоль з кольорами
    console.log(`%c${content}`, style);
  }

  /**
   * Загальна подія гри
   */
  gameEvent(message, details = '') {
    this.addEventToQueue(message, 'game', details);
  }

  /**
   * Інформаційне повідомлення
   */
  info(message, details = '') {
    this.addEventToQueue(message, 'info', details);
  }

  /**
   * Попередження
   */
  warning(message, details = '') {
    this.addEventToQueue(message, 'warning', details);
  }

  /**
   * Помилка
   */
  error(message, details = '') {
    this.addEventToQueue(message, 'error', details);
  }

  /**
   * Успішна дія
   */
  success(message, details = '') {
    this.addEventToQueue(message, 'success', details);
  }

  /**
   * Дія гравця
   */
  playerAction(message, details = '') {
    this.addEventToQueue(message, 'player', details);
  }

  /**
   * Дія ворога
   */
  enemyAction(message, details = '') {
    this.addEventToQueue(message, 'enemy', details);
  }

  /**
   * Очищення логу
   */
  clear() {
    // Очищаємо кеш та черги
    this.eventCache.clear();
    this.eventQueues.clear();
    console.clear();
  }

  /**
   * Встановлення інтервалу рендерингу
   * @param {number} interval - Інтервал в мілісекундах
   */
  setRenderInterval(interval) {
    this.renderInterval = interval;
  }

  /**
   * Отримання статистики черг
   */
  getQueueStats() {
    const stats = {};
    for (const [type, typeQueue] of this.eventQueues.entries()) {
      stats[type] = typeQueue.size;
    }
    return stats;
  }
}
```

## 🎯 Що робить цей клас?

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

## 🎉 Результат

Після створення цього класу у тебе буде:

- ✅ Система логування з різними типами повідомлень
- ✅ Автоматичне відображення часу
- ✅ Емодзі для дій персонажів

## 🚀 Що далі?

У наступному уроці ми створимо головний клас гри, який буде координувати всі компоненти.

**Ти молодець! 🌟 Продовжуй в тому ж дусі!**
