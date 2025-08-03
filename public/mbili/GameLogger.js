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
