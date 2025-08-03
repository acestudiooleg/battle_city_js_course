# 3.2: Система керування

## Що ми будемо робити?

У цьому підрозділі ми створимо клас `InputManager.js`, який буде відповідати за обробку натискань клавіш та керування грою.

## Створення класу InputManager.js

Створіть файл `InputManager.js`:

```javascript
/**
 * 🎮 Клас InputManager - система керування
 * 
 * Відповідає за:
 * - Обробку натискань клавіш
 * - Відстеження стану клавіш
 * - Керування грою
 */

export class InputManager {
    constructor(logger) {
        // Стан клавіш (натиснуті/не натиснуті)
        this.keys = {};
        
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
            DEBUG: ['F12']
        };
        
        // Стан гри
        this.gameState = {
            isPaused: false,
            isGameOver: false
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
        
        // Встановлюємо стан клавіші як натиснуту
        this.keys[keyCode] = true;
        
        // Обробляємо спеціальні клавіші
        this.handleSpecialKeys(keyCode);
        
        console.log('⌨️ Клавіша натиснута:', keyCode);
    }
    
    /**
     * Обробка відпускання клавіші
     * @param {KeyboardEvent} event - Подія клавіатури
     */
    handleKeyUp(event) {
        const keyCode = event.code;
        
        // Встановлюємо стан клавіші як не натиснуту
        this.keys[keyCode] = false;
        
        console.log('⌨️ Клавіша відпущена:', keyCode);
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
        
        return keys.some(key => this.keys[key]);
    }
    
    /**
     * Отримання напрямку руху
     * @returns {Object} - Об'єкт з напрямками
     */
    getMovementDirection() {
        return {
            up: this.isKeyPressed('UP'),
            down: this.isKeyPressed('DOWN'),
            left: this.isKeyPressed('LEFT'),
            right: this.isKeyPressed('RIGHT')
        };
    }
    
    /**
     * Перевірка чи натиснута клавіша стрільби
     * @returns {boolean} - true якщо натиснута
     */
    isShootPressed() {
        return this.isKeyPressed('SHOOT');
    }
    
    /**
     * Перемикання паузи
     */
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        console.log('⏸️ Пауза:', this.gameState.isPaused ? 'увімкнена' : 'вимкнена');
        
        // Викликаємо подію паузи
        this.emitPauseEvent();
    }
    
    /**
     * Перезапуск гри
     */
    restartGame() {
        console.log('🔄 Перезапуск гри');
        
        // Викликаємо подію перезапуску
        this.emitRestartEvent();
    }
    
    /**
     * Перемикання режиму налагодження
     */
    toggleDebug() {
        console.log('🐛 Режим налагодження перемикається');
        
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
            detail: { isPaused: this.gameState.isPaused }
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
            debug: 'F12'
        };
    }
}
```

## Що робить цей клас?

### Основні властивості:
- **`keys`** - об'єкт зі станом клавіш
- **`controls`** - налаштування керування
- **`gameState`** - стан гри (пауза, кінець гри)

### Основні методи:
- **`initEventListeners()`** - ініціалізація обробників подій
- **`handleKeyDown()`** - обробка натискання клавіш
- **`handleKeyUp()`** - обробка відпускання клавіш
- **`isKeyPressed()`** - перевірка натискання клавіші
- **`getMovementDirection()`** - отримання напрямку руху
- **`togglePause()`** - перемикання паузи

## Система керування

### Клавіші руху:
- **W** або **↑** - рух вгору
- **S** або **↓** - рух вниз
- **A** або **←** - рух вліво
- **D** або **→** - рух вправо

### Клавіші дій:
- **Пробіл** - стрільба
- **P** - пауза/продовження
- **R** - перезапуск гри
- **F12** - режим налагодження

## Особливості роботи

### Обробка подій:
- **Запобігання стандартним діям** браузера для ігрових клавіш
- **Відстеження стану** натиснутих клавіш
- **Підтримка одночасного** натискання кількох клавіш

### Події гри:
- **`gamePause`** - подія паузи
- **`gameRestart`** - подія перезапуску
- **`gameDebug`** - подія налагодження

## Використання

```javascript
// Створення системи керування з логгером
const inputManager = new InputManager(logger);

// Перевірка натискання клавіш
if (inputManager.isKeyPressed('UP')) {
    // Рух вгору
}

// Отримання напрямку руху
const direction = inputManager.getMovementDirection();
if (direction.up) {
    // Рух вгору
}

// Перевірка стрільби
if (inputManager.isShootPressed()) {
    // Стрільба
}

// Прослуховування подій
document.addEventListener('gamePause', (event) => {
    console.log('Гра призупинена:', event.detail.isPaused);
});
```

## 📝 Параметр logger

**`logger`** - це об'єкт системи логування, який передається в конструктор для запису подій керування:

- **Тип**: `GameLogger` або `null`
- **Призначення**: Запис подій керування та дій користувача
- **Методи**:
  - `gameEvent(message, details)` - запис ігрових подій
  - `info(message, details)` - інформаційні повідомлення
  - `warning(message, details)` - попередження
  - `error(message, details)` - помилки

**Приклад використання**:
```javascript
// Створення логгера
const logger = new GameLogger();

// Створення системи керування з логгером
const inputManager = new InputManager(logger);

// Автоматичне логування ініціалізації
// logger.gameEvent('Система керування ініціалізована')
```

## Результат

Після створення цього класу у вас буде:
- ✅ Повноцінна система керування
- ✅ Обробка всіх ігрових клавіш
- ✅ Система подій для комунікації
- ✅ Готовність для інтеграції з грою

## Що далі?

У наступному підрозділі ми створимо клас кулі, який буде відповідати за стрільбу. 