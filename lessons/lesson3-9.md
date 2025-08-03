# 3.9: 🔧 Оновлення головного файлу

## 🔧 Що ми будемо робити?

У цьому підрозділі ми оновимо файл `main.js` для з'єднання всіх нових компонентів уроку 3. Це останній крок для створення базової гри з рухом, стрільбою та зіткненнями.

## 🎯 Ключові цілі уроку

- 🔧 **З'єднання всіх компонентів** - об'єднання всіх класів в одну систему
- 🎮 **Система керування** - підключення InputManager до гравця
- 🎯 **Механіки стрільби** - налаштування затримок між пострілами
- 🛡️ **Система пошкоджень** - використання методів з базового класу Tank
- 📊 **Базове логування** - запис основних подій гри

## 📝 Оновлення файлу main.js

Оновіть файл `main.js`:

```javascript
/**
 * 🎮 Головний файл гри - Танчики
 *
 * Урок 3: Рух та стрільба
 *
 * Відповідає за:
 * - Запуск всіх компонентів гри
 * - Запуск ігрового циклу
 * - Керування станом гри
 */

// Отримуємо Canvas та контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Конфігурація гри
const GAME_CONFIG = {
  // Розміри Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Розмір тайла
  TILE_SIZE: 32,

  // Налаштування гри
  GAME_SPEED: 60, // FPS
  DEBUG_MODE: false,
};

// Імпортуємо всі необхідні класи
import { Game } from './Game.js';
import { GameLogger } from './GameLogger.js';
import { InputManager } from './InputManager.js';

// Глобальні змінні
let game;
let logger;
let inputManager;

/**
 * Запуск гри
 */
function initGame() {
  console.log('🎮 Запуск гри...');

  // Створюємо логер
  logger = new GameLogger();

  // Створюємо систему керування
  inputManager = new InputManager(logger);

  // Створюємо гру
  game = new Game(logger);

  game.init();

  // Підключаємо систему керування до гравця
  game.player.setInputManager(inputManager);

  // Встановлюємо межі руху
  game.player.setBounds({
    maxX: GAME_CONFIG.CANVAS_WIDTH,
    maxY: GAME_CONFIG.CANVAS_HEIGHT,
  });

  game.enemy.setBounds({
    maxX: GAME_CONFIG.CANVAS_WIDTH,
    maxY: GAME_CONFIG.CANVAS_HEIGHT,
  });

  // Налаштовуємо стрільбу
  game.player.setShootCooldown(500); // 500мс між пострілами
  game.enemy.setShootCooldown(2000); // 2 секунди між пострілами

  // Прослуховуємо події гри
  setupGameEvents();

  // Запускаємо гру
  game.start();

  logger.info('🎮 Гра успішно запущена!');
  logger.info('⌨️ Керування: WASD для руху, Пробіл для стрільби, P для паузи');
}

/**
 * Налаштування подій гри
 */
function setupGameEvents() {
  // Подія паузи
  document.addEventListener('gamePause', (event) => {
    if (event.detail.isPaused) {
      game.pause();
      logger.warning('⏸️ Гра призупинена');
    } else {
      game.resume();
      logger.info('▶️ Гра відновлена');
    }
  });

  // Подія перезапуску
  document.addEventListener('gameRestart', () => {
    restartGame();
  });

  // Подія налагодження
  document.addEventListener('gameDebug', () => {
    toggleDebugMode();
  });

  // Подія завершення гри
  document.addEventListener('gameOver', (event) => {
    handleGameOver(event.detail);
  });
}

/**
 * Перезапуск гри
 */
function restartGame() {
  logger.info('🔄 Перезапуск гри...');

  // Зупиняємо поточну гру
  if (game) {
    game.stop();
  }

  // Очищаємо лог
  logger.clear();

  // Запускаємо гру знову
  setTimeout(() => {
    initGame();
  }, 100);
}

/**
 * Перемикання режиму налагодження
 */
function toggleDebugMode() {
  GAME_CONFIG.DEBUG_MODE = !GAME_CONFIG.DEBUG_MODE;

  if (GAME_CONFIG.DEBUG_MODE) {
    logger.warning('🐛 Режим налагодження увімкнено');
  } else {
    logger.info('🐛 Режим налагодження вимкнено');
  }
}

/**
 * Обробка завершення гри
 * @param {Object} gameOverData - Дані про завершення гри
 */
function handleGameOver(gameOverData) {
  const { winner, reason } = gameOverData;

  logger.warning(`🏁 Гра завершена! ${reason}`);

  if (winner === 'player') {
    logger.success('🎉 Гравець переміг!');
  } else if (winner === 'enemy') {
    logger.error('💀 Ворог переміг!');
  }
}

/**
 * Функція очищення логу
 */
function clearLog() {
  if (logger) {
    logger.clear();
  }
}

/**
 * Отримання статистики гри
 * @returns {Object} - Статистика
 */
function getGameStats() {
  if (!game) return null;

  return {
    player: {
      health: game.player.getHealth(),
      maxHealth: game.player.getMaxHealth(),
      bullets: game.player.getBullets().length,
      position: { x: game.player.x, y: game.player.y },
    },
    enemy: {
      health: game.enemy.getHealth(),
      maxHealth: game.enemy.getMaxHealth(),
      bullets: game.enemy.getBullets().length,
      position: { x: game.enemy.x, y: game.enemy.y },
      aiState: game.enemy.getAIState(),
    },
    collisions: game.getCollisionStats(),
    gameTime: game.getGameTime(),
  };
}

// Експортуємо глобальні змінні для використання в інших модулях
export { canvas, ctx, GAME_CONFIG, logger };

// Функція очищення логу (глобальна)
window.clearLog = clearLog;

// Функція отримання статистики (глобальна)
window.getGameStats = getGameStats;

// Запускаємо гру після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Запуск гри Танчики - Урок 3');
  initGame();
});

// Обробка помилок
window.addEventListener('error', (event) => {
  console.error('❌ Помилка гри:', event.error);
  if (logger) {
    logger.error(`Помилка: ${event.error.message}`);
  }
});

// Обробка завершення роботи сторінки
window.addEventListener('beforeunload', () => {
  if (game) {
    game.stop();
  }
  console.log('👋 Гра завершена');
});
```

## 🔄 Що оновлено в main.js?

### 📦 Нові імпорти:

- **`InputManager`** - система керування клавішами
- **Оновлені класи** з новою функціональністю (Tank, Player, Enemy, Game)

### ⚙️ Нові функції:

- **`setupGameEvents()`** - налаштування подій гри (пауза, перезапуск, налагодження)
- **`restartGame()`** - перезапуск гри з очищенням стану
- **`toggleDebugMode()`** - перемикання режиму налагодження
- **`handleGameOver()`** - обробка завершення гри з визначенням переможця
- **`getGameStats()`** - отримання детальної статистики гри

### 🎛️ Нові налаштування:

- **Система керування** підключена до гравця через `setInputManager()`
- **Межі руху** для обох танків через `setBounds()` (методи з базового класу Tank)
- **Налаштування стрільби** через `setShootCooldown()` (затримки між пострілами)

## 🔗 Використання методів з базового класу Tank

### 🗺️ Встановлення меж руху:

```javascript
// Використовуємо методи з базового класу Tank
game.player.setBounds({
  maxX: GAME_CONFIG.CANVAS_WIDTH,
  maxY: GAME_CONFIG.CANVAS_HEIGHT,
});

game.enemy.setBounds({
  maxX: GAME_CONFIG.CANVAS_WIDTH,
  maxY: GAME_CONFIG.CANVAS_HEIGHT,
});
```

### 📊 Отримання статистики:

```javascript
// Використовуємо методи з базового класу Tank
const playerHealth = game.player.getHealth();
const playerMaxHealth = game.player.getMaxHealth();
const playerBullets = game.player.getBullets().length;
```

## 📡 Система подій

### 🎮 Підтримувані події:

- **`gamePause`** - пауза/продовження гри (клавіша P)
- **`gameRestart`** - перезапуск гри (клавіша R)
- **`gameDebug`** - режим налагодження (клавіша F12)
- **`gameOver`** - завершення гри (автоматично при перемозі/поразці)

### ⚡ Обробка подій:

- **Автоматичне логування** всіх подій через GameLogger
- **Візуальні індикатори** стану гри (пауза, перемога, поразка)
- **Кнопка перезапуску** при завершенні гри
- **Збереження статистики** для аналізу

## 🌐 Глобальні функції

### 🔧 Доступні через `window`:

- **`clearLog()`** - очищення логу гри (видаляє всі повідомлення)
- **`getGameStats()`** - отримання детальної статистики гри
- **`restartGame()`** - перезапуск гри з початковими налаштуваннями

### 🖥️ Використання в консолі браузера:

```javascript
// Очистити лог гри
clearLog();

// Отримати поточну статистику
const stats = getGameStats();
console.log('Статистика гри:', stats);

// Перезапустити гру
restartGame();

// Перевірити стан гравця
const playerStats = getGameStats().player;
console.log('Здоров\'я гравця:', playerStats.health);
```

## ✅ Результат

Після оновлення цього файлу у вас буде:

- ✅ **Базова гра** з рухом та стрільбою
- ✅ **Система керування** клавішами (WASD + Пробіл)
- ✅ **Базова поведінка ворога** - патрулювання та стрільба
- ✅ **Система колізій** та пошкоджень з фізикою
- ✅ **Логування** основних подій гри
- ✅ **Використання спільних методів** з базового класу Tank
- ✅ **Система подій** для розширення функціональності

## 📁 Фінальна структура файлів

```
📁 lesson3
├── 📄 index.html          # HTML сторінка з оновленим інтерфейсом
├── 📄 main.js             # Головний файл (оновлений)
├── 📄 InputManager.js     # Система керування (новий)
├── 📄 Bullet.js           # Клас кулі (новий)
├── 📄 Player.js           # Клас гравця (оновлений)
├── 📄 Enemy.js            # Клас ворога (оновлений)
├── 📄 Tank.js             # Базовий клас танка (оновлений)
├── 📄 GameField.js        # Ігрове поле (оновлений)
├── 📄 GameLogger.js       # Система логування (оновлений)
├── 📄 Game.js             # Мотор гри (оновлений)
├── 📄 CollisionManager.js # Система колізій (новий)
├── 📄 styles.css          # Основні стилі (оновлений)
├── 📄 variables.css       # CSS змінні (оновлений)
└── 📄 colors.js           # Кольорова схема (новий)
```

## 🚀 Що далі?

**🎉 Вітаємо! Ви успішно завершили Урок 3: Рух та стрільба!**

### 🏆 Що ви досягли в Уроці 3:

- **3.1** - Підготовка структури та HTML інтерфейсу
- **3.2** - Система керування InputManager з обробкою клавіш
- **3.3** - Клас Bullet для куль з рухом та життєвим циклом
- **3.4** - Рух гравця з інтеграцією InputManager
- **3.5** - Стрільба гравця з затримками та життями
- **3.6** - Базова поведінка ворога з патрулюванням
- **3.7** - Стрільба ворога з автоматичними пострілами
- **3.8** - Система колізій CollisionManager з пошкодженнями
- **3.9** - Інтеграція всіх компонентів в main.js

### 🎯 У наступному уроці ми додамо:

- ✅ **Вибухи та анімації** - візуальні ефекти з примітивами
- ✅ **Звукові ефекти** - аудіо супровід
- ✅ **Покращені примітиви** - кольорові ефекти та геометрія
- ✅ **Додаткові можливості** - бонуси та power-ups

### 🎨 Спрайти та текстури:

Будуть додані в **бонусному останньому уроці** для повної реалізації графіки.

### 🎮 Спробуйте гру зараз:

[Подивитись ТУТ як має виглядати твій результат](/battle_city_js_course/tatu/index.html){target="_blank"}
