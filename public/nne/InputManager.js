export class InputManager {
  constructor(logger) {
    // Стан клавіш (натиснуті/не натиснуті)
    this.keys = {};

    // Клавіші, які були натиснуті в цьому кадрі (для одноразових дій)
    this.pressedThisFrame = {};

    // Налаштування керування
    this.controls = {
      // Рух
      UP: ['KeyW', 'ArrowUp'],
      DOWN: ['KeyS', 'ArrowDown'],
      LEFT: ['KeyA', 'ArrowLeft'],
      RIGHT: ['KeyD', 'ArrowRight'],

      // Дії
      SHOOT: ['Space'],
      PAUSE: ['KeyP'],

      // Додаткові клавіші
      RESTART: ['KeyR'],
      DEBUG: ['F10'],
    };

    // Стан гри
    this.gameState = {
      isPaused: false,
      isGameOver: false,
    };

    // Логгер для запису подій
    this.logger = logger;

    // Ініціалізуємо обробники подій
    this.initEventListeners();

    this.logger.gameEvent('Система керування ініціалізована');
  }

  /**
   * Ініціалізація обробників подій
   */
  initEventListeners() {
    // Обробник натискання клавіш
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });

    // Обробник відпускання клавіш
    document.addEventListener('keyup', (event) => {
      this.handleKeyUp(event);
    });

    // Запобігання стандартним діям браузера
    document.addEventListener('keydown', (event) => {
      if (this.isGameKey(event.code)) {
        event.preventDefault();
      }
    });
  }

  /**
   * Обробка натискання клавіші
   * @param {KeyboardEvent} event - Подія клавіатури
   */
  handleKeyDown(event) {
    const keyCode = event.code;

    // --- ВАЖЛИВО: Ігноруємо авто-повтор клавіш браузером ---
    if (event.repeat) return;

    // Встановлюємо стан клавіші як натиснуту
    this.keys[keyCode] = true;

    // Позначаємо клавішу як натиснуту в цьому кадрі
    this.pressedThisFrame[keyCode] = true;

    // Обробляємо спеціальні клавіші
    this.handleSpecialKeys(keyCode);

    if (this.isGameKey(keyCode)) {
      this.logger.gameEvent(`⌨️ Клавіша натиснута: ${keyCode}`);
    }
  }

  /**
   * Обробка відпускання клавіші
   * @param {KeyboardEvent} event - Подія клавіатури
   */
  handleKeyUp(event) {
    const keyCode = event.code;

    // Встановлюємо стан клавіші як не натиснуту
    this.keys[keyCode] = false;

    // Логуємо тільки ігрові клавіші (не всі)
    if (this.isGameKey(keyCode)) {
      this.logger.gameEvent(`⌨️ Клавіша відпущена: ${keyCode}`);
    }
  }

  /**
   * Обробка спеціальних клавіш
   * @param {string} keyCode - Код клавіші
   */
  handleSpecialKeys(keyCode) {
    // Пауза/продовження гри
    if (this.controls.PAUSE.includes(keyCode)) {
      this.togglePause();
    }

    // Перезапуск гри
    if (this.controls.RESTART.includes(keyCode)) {
      this.restartGame();
    }

    // Режим налагодження
    if (this.controls.DEBUG.includes(keyCode)) {
      this.toggleDebug();
    }
  }

  /**
   * Перевірка чи натиснута клавіша
   * @param {string} action - Дія для перевірки
   * @returns {boolean} - true якщо клавіша натиснута
   */
  isKeyPressed(action) {
    const keys = this.controls[action];
    if (!keys) return false;

    return keys.some((key) => this.keys[key]);
  }

  /**
   * Отримання напрямку руху
   * При одночасному натисканні двох клавіш пріоритет має горизонтальний рух
   * @returns {Object} - Об'єкт з напрямками
   */
  getMovementDirection() {
    const up = this.isKeyPressed('UP');
    const down = this.isKeyPressed('DOWN');
    const left = this.isKeyPressed('LEFT');
    const right = this.isKeyPressed('RIGHT');

    // Якщо натиснуті і горизонтальні і вертикальні клавіші,
    // то пріоритет має горизонтальний рух
    const hasHorizontal = left || right;
    const hasVertical = up || down;

    if (hasHorizontal && hasVertical) {
      // Повертаємо тільки горизонтальний рух
      return {
        up: false,
        down: false,
        left: left,
        right: right,
      };
    }

    // Інакше повертаємо всі натиснуті клавіші
    return {
      up: up,
      down: down,
      left: left,
      right: right,
    };
  }

  /**
   * Перевірка чи натиснута клавіша стрільби (одноразово)
   * @returns {boolean} - true якщо натиснута в цьому кадрі
   */
  isShootPressed() {
    const keys = this.controls.SHOOT;
    if (!keys) return false;

    const result = keys.some((key) => this.pressedThisFrame[key]);
    if (result) {
      this.logger.gameEvent(
        '🎯 Клавіша стрільби натиснута',
        `клавіші: ${keys.join(', ')}`
      );
    }
    return result;
  }

  /**
   * Перемикання паузи
   */
  togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.logger.gameEvent(
      `⏸️ Пауза: ${this.gameState.isPaused ? 'увімкнена' : 'вимкнена'}`
    );

    // Викликаємо подію паузи
    this.emitPauseEvent();
  }

  /**
   * Перезапуск гри
   */
  restartGame() {
    this.logger.gameEvent('🔄 Перезапуск гри');

    // Викликаємо подію перезапуску
    this.emitRestartEvent();
  }

  /**
   * Перемикання режиму налагодження
   */
  toggleDebug() {
    this.logger.gameEvent('🐛 Режим налагодження перемикається');

    // Викликаємо подію налагодження
    this.emitDebugEvent();
  }

  /**
   * Перевірка чи це ігрова клавіша
   * @param {string} keyCode - Код клавіші
   * @returns {boolean} - true якщо ігрова клавіша
   */
  isGameKey(keyCode) {
    const allKeys = Object.values(this.controls).flat();
    return allKeys.includes(keyCode);
  }

  /**
   * Отримання стану гри
   * @returns {Object} - Стан гри
   */
  getGameState() {
    return { ...this.gameState };
  }

  /**
   * Встановлення стану гри
   * @param {Object} state - Новий стан
   */
  setGameState(state) {
    this.gameState = { ...this.gameState, ...state };
  }

  /**
   * Виклик події паузи
   */
  emitPauseEvent() {
    const event = new CustomEvent('gamePause', {
      detail: { isPaused: this.gameState.isPaused },
    });
    document.dispatchEvent(event);
  }

  /**
   * Виклик події перезапуску
   */
  emitRestartEvent() {
    const event = new CustomEvent('gameRestart');
    document.dispatchEvent(event);
  }

  /**
   * Виклик події налагодження
   */
  emitDebugEvent() {
    const event = new CustomEvent('gameDebug');
    document.dispatchEvent(event);
  }

  /**
   * Очищення стану клавіш
   */
  clearKeys() {
    this.keys = {};
  }

  clearShoot() {
    this.keys.shoot = false; // Или тот флаг, который вы используете для Space
  }

  /**
   * Очищення клавіш, натиснутих в цьому кадрі
   * Викликається в кінці кожного кадру
   */
  clearPressedThisFrame() {
    this.pressedThisFrame = {};
  }

  /**
   * Отримання інформації про керування
   * @returns {Object} - Інформація про керування
   */
  getControlsInfo() {
    return {
      movement: 'WASD або стрілки',
      shoot: 'Пробіл',
      pause: 'P',
      restart: 'R',
      debug: 'F12',
    };
  }
}
