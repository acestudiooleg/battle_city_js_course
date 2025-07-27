# 3.9: Оновлення головного файлу

## Що ми будемо робити?

У цьому підрозділі ми оновимо файл `main.js` для інтеграції всіх нових компонентів уроку 3: системи керування, стрільби, руху та колізій.

## Оновлення файлу main.js

Оновіть файл `main.js`:

```javascript
/**
 * 🎮 Головний файл гри - Танчики
 * 
 * Урок 3: Рух та стрільба
 * 
 * Відповідає за:
 * - Ініціалізацію всіх компонентів гри
 * - Запуск ігрового циклу
 * - Управління станом гри
 */

// Отримуємо Canvas та контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Конфігурація гри
export const GAME_CONFIG = {
    // Розміри Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Розмір тайла
    TILE_SIZE: 32,
    
    // Налаштування гри
    GAME_SPEED: 60, // FPS
    DEBUG_MODE: false
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
 * Ініціалізація гри
 */
function initGame() {
    console.log('🎮 Ініціалізація гри...');
    
    // Створюємо логер
    logger = new GameLogger('logContent');
    
    // Створюємо систему керування
    inputManager = new InputManager();
    
    // Створюємо гру
    game = new Game();
    
    // Підключаємо систему керування до гравця
    game.player.setInputManager(inputManager);
    
    // Встановлюємо межі руху
    game.player.setBounds({
        maxX: GAME_CONFIG.CANVAS_WIDTH,
        maxY: GAME_CONFIG.CANVAS_HEIGHT
    });
    
    game.enemy.setBounds({
        maxX: GAME_CONFIG.CANVAS_WIDTH,
        maxY: GAME_CONFIG.CANVAS_HEIGHT
    });
    
    // Встановлюємо ціль для ворога
    game.enemy.setTarget(game.player);
    
    // Налаштовуємо стрільбу
    game.player.setShootCooldown(500); // 500мс між пострілами
    game.enemy.setShootCooldown(2000); // 2 секунди між пострілами
    game.enemy.setShootingAccuracy(0.8); // 80% точність
    
    // Налаштовуємо пошкодження
    game.player.setDamageResistance(0.1); // 10% стійкості
    game.enemy.setDamageResistance(0.05); // 5% стійкості
    
    // Прослуховуємо події гри
    setupGameEvents();
    
    // Запускаємо гру
    game.start();
    
    logger.info('🎮 Гра успішно ініціалізована!');
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
    
    // Перезапускаємо гру
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
        showDebugInfo();
    } else {
        logger.info('🐛 Режим налагодження вимкнено');
        hideDebugInfo();
    }
}

/**
 * Показ інформації для налагодження
 */
function showDebugInfo() {
    // Створюємо панель налагодження
    let debugPanel = document.getElementById('debugPanel');
    
    if (!debugPanel) {
        debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(debugPanel);
    }
    
    // Оновлюємо інформацію кожен кадр
    function updateDebugInfo() {
        if (!GAME_CONFIG.DEBUG_MODE || !game) return;
        
        const player = game.player;
        const enemy = game.enemy;
        const collisionStats = game.getCollisionStats();
        
        debugPanel.innerHTML = `
            <div><strong>🐛 DEBUG INFO</strong></div>
            <div>FPS: ${Math.round(1000 / game.getDeltaTime())}</div>
            <div>Гравець: (${Math.round(player.x)}, ${Math.round(player.y)})</div>
            <div>Здоров'я: ${player.getHealth()}/${player.getMaxHealth()}</div>
            <div>Кулі: ${player.getBullets().length}</div>
            <div>Ворог: (${Math.round(enemy.x)}, ${Math.round(enemy.y)})</div>
            <div>Здоров'я: ${enemy.getHealth()}/${enemy.getMaxHealth()}</div>
            <div>Стан AI: ${enemy.getAIState().state}</div>
            <div>Кулі: ${enemy.getBullets().length}</div>
            <div>Колізії: ${collisionStats.totalCollisions}</div>
        `;
        
        requestAnimationFrame(updateDebugInfo);
    }
    
    updateDebugInfo();
}

/**
 * Приховування інформації для налагодження
 */
function hideDebugInfo() {
    const debugPanel = document.getElementById('debugPanel');
    if (debugPanel) {
        debugPanel.remove();
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
    
    // Показуємо кнопку перезапуску
    showRestartButton();
}

/**
 * Показ кнопки перезапуску
 */
function showRestartButton() {
    let restartBtn = document.getElementById('restartButton');
    
    if (!restartBtn) {
        restartBtn = document.createElement('button');
        restartBtn.id = 'restartButton';
        restartBtn.textContent = '🔄 Перезапустити гру';
        restartBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            font-size: 18px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        restartBtn.addEventListener('click', restartGame);
        document.body.appendChild(restartBtn);
    }
    
    restartBtn.style.display = 'block';
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
            position: { x: game.player.x, y: game.player.y }
        },
        enemy: {
            health: game.enemy.getHealth(),
            maxHealth: game.enemy.getMaxHealth(),
            bullets: game.enemy.getBullets().length,
            position: { x: game.enemy.x, y: game.enemy.y },
            aiState: game.enemy.getAIState()
        },
        collisions: game.getCollisionStats(),
        gameTime: game.getGameTime()
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

## Що оновлено в main.js?

### Нові імпорти:
- **`InputManager`** - система керування
- **Оновлені класи** з новою функціональністю

### Нові функції:
- **`setupGameEvents()`** - налаштування подій гри
- **`restartGame()`** - перезапуск гри
- **`toggleDebugMode()`** - перемикання режиму налагодження
- **`showDebugInfo()`** - показ інформації для налагодження
- **`handleGameOver()`** - обробка завершення гри
- **`getGameStats()`** - отримання статистики

### Нові налаштування:
- **Система керування** підключена до гравця
- **Межі руху** для обох танків
- **Налаштування стрільби** (затримки, точність)
- **Система пошкоджень** (стійкість)
- **Ціль для ворога** (гравець)

## Система подій

### Підтримувані події:
- **`gamePause`** - пауза/продовження
- **`gameRestart`** - перезапуск гри
- **`gameDebug`** - режим налагодження
- **`gameOver`** - завершення гри

### Обробка подій:
- **Автоматичне логування** всіх подій
- **Візуальні індикатори** стану
- **Кнопка перезапуску** при завершенні

## Режим налагодження

### Показувана інформація:
- **FPS** - частота кадрів
- **Позиції** гравця та ворога
- **Здоров'я** та кількість куль
- **Стан AI** ворога
- **Статистика колізій**

### Керування:
- **F12** - перемикання режиму
- **Автоматичне оновлення** кожен кадр
- **Позиціонування** в лівому верхньому куті

## Глобальні функції

### Доступні через `window`:
- **`clearLog()`** - очищення логу
- **`getGameStats()`** - отримання статистики

### Використання в консолі:
```javascript
// Очистити лог
clearLog();

// Отримати статистику
const stats = getGameStats();
console.log(stats);

// Перезапустити гру
restartGame();
```

## Результат

Після оновлення цього файлу у вас буде:
- ✅ Повноцінна гра з рухом та стрільбою
- ✅ Система керування клавішами
- ✅ Штучний інтелект ворога
- ✅ Система колізій та пошкоджень
- ✅ Режим налагодження
- ✅ Статистика та логування

## Фінальна структура файлів

```
📁 battle_city_js_course
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
└── 📄 CollisionManager.js # Система колізій (новий)
```

## Що далі?

**🎉 Вітаємо! Ви успішно завершили Урок 3: Рух та стрільба!**

У наступному уроці ми додамо:
- ✅ Вибухи та анімації
- ✅ Звукові ефекти
- ✅ Покращену графіку
- ✅ Додаткові можливості

[ДЕМО - Урок 3](/battle_city_js_course/tatu/index.html){target="_blank"} 