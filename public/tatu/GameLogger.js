/**
 * 🎮 Клас GameLogger - система логування подій гри
 *
 * Відповідає за:
 * - Запис подій гри
 * - Відображення логів на екрані
 * - Різні типи повідомлень
 * - Кешування та групування повідомлень
 * - Періодичний рендеринг (2 рази на секунду)
 */

export class GameLogger {
  constructor() {
    // контейнер для логів в HTML
    this.logContainer = document.getElementById('logContent');
    // максимальна кількість записів в лозі
    this.maxEntries = 50;
    
    // Кеш для різних типів подій
    this.eventCache = new Map();
    
    // Черги для кожного типу події
    this.eventQueues = new Map();
    
    // Час останнього рендерингу
    this.lastRenderTime = 0;
    
    // Інтервал рендерингу (500мс = 2 рази на секунду)
    this.renderInterval = 500;
    
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
        count: 1
      });
    }
  }

  /**
   * Рендеринг подій з черг
   */
  renderQueuedEvents() {
    const now = Date.now();
    
    // Проходимо по всіх типах подій
    for (const [type, typeQueue] of this.eventQueues.entries()) {
      // Проходимо по всіх подіях цього типу
      for (const [eventKey, event] of typeQueue.entries()) {
        // Додаємо подію в лог
        this.addLogEntry(event.message, event.type, event.details, event.count);
        
        // Видаляємо подію з черги
        typeQueue.delete(eventKey);
      }
    }
  }

  /**
   * Додавання запису в лог
   * @param {string} message - Повідомлення
   * @param {string} type - Тип повідомлення
   * @param {string} details - Додаткові деталі
   * @param {number} count - Кількість повторень
   */
  addLogEntry(message, type = 'info', details = '', count = 1) {
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
    
    // Додаємо кількість повторень, якщо більше 1
    if (count > 1) {
      content += ` (${count} разів)`;
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
    if (this.logContainer) {
      this.logContainer.innerHTML = '';
    }
    // Очищаємо кеш та черги
    this.eventCache.clear();
    this.eventQueues.clear();
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
