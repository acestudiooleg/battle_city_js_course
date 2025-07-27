# 2.6: Журнал дій

## Що ми будемо робити?

У цьому підрозділі ми створимо клас `GameLogger.js`, який буде відповідати за систему логування подій гри та відображення їх на екрані.

## Створення класу GameLogger.js

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
        entry.className = `log-entry log-${type}`;
        
        // формуємо текст з часом
        let content = `[${timestamp}] ${message}`;
        if (details) { // якщо є деталі
            // додаємо їх до тексту
            content += ` - ${details}`;
        }
        
        // встановлюємо текст елемента
        entry.textContent = content;
        
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
        this.addLogEntry(message, 'game', details); // додаємо запис з типом 'game'
    }
    
    /**
     * Інформаційне повідомлення
     */
    info(message, details = '') {
        this.addLogEntry(message, 'info', details); // додаємо запис з типом 'info'
    }
    
    /**
     * Успішна операція
     */
    success(message, details = '') {
        this.addLogEntry(message, 'success', details); // додаємо запис з типом 'success'
    }
    
    /**
     * Попередження
     */
    warning(message, details = '') {
        this.addLogEntry(message, 'warning', details); // додаємо запис з типом 'warning'
    }
    
    /**
     * Помилка
     */
    error(message, details = '') {
        this.addLogEntry(message, 'error', details); // додаємо запис з типом 'error'
    }
    
    /**
     * Дія гравця
     */
    playerAction(action, details = '') {
        this.addLogEntry(`👤 ${action}`, 'player', details); // додаємо запис з емодзі гравця
    }
    
    /**
     * Дія ворога
     */
    enemyAction(action, details = '') {
        this.addLogEntry(`👹 ${action}`, 'enemy', details); // додаємо запис з емодзі ворога
    }
}
```

## Що робить цей клас?

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

## Типи повідомлень

| Тип | Опис | Приклад |
|-----|------|---------|
| **game** | Загальні події гри | "Гра запущена", "Рівень завантажено" |
| **info** | Інформаційні повідомлення | "Розмір Canvas: 800x600" |
| **success** | Успішні операції | "Гра ініціалізована успішно!" |
| **warning** | Попередження | "Низький FPS", "Місце закінчується" |
| **error** | Помилки | "Помилка завантаження", "Клас не знайдено" |
| **player** | Дії гравця | "👤 Гравець створений", "👤 Стріляє" |
| **enemy** | Дії ворога | "👹 Ворог створений", "👹 Рухається" |

## Особливості роботи

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

## CSS стилі для логів

Додайте стилі для різних типів логів:

```css
.log-entry {
    margin-bottom: 8px;
    padding: 5px;
    border-radius: 4px;
    word-wrap: break-word;
}

.log-game {
    background-color: #34495e;
    color: #ecf0f1;
}

.log-info {
    background-color: #3498db;
    color: white;
}

.log-success {
    background-color: #27ae60;
    color: white;
}

.log-warning {
    background-color: #f39c12;
    color: white;
}

.log-error {
    background-color: #e74c3c;
    color: white;
}

.log-player {
    background-color: #f1c40f;
    color: #2c3e50;
}

.log-enemy {
    background-color: #e74c3c;
    color: white;
}
```

## Використання

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

## Функція очищення логу

Додайте функцію для очищення логу:

```javascript
function clearLog() {
    // знаходимо контейнер логу
    const logContent = document.getElementById('logContent');
    // очищаємо весь вміст
    logContent.innerHTML = '';
}
```

## Результат

Після створення цього класу у вас буде:
- ✅ Система логування з різними типами повідомлень
- ✅ Автоматичне відображення часу
- ✅ Емодзі для дій персонажів
- ✅ Обмеження кількості записів
- ✅ Автоматичне прокручування

## Що далі?

У наступному підрозділі ми створимо головний клас гри, який буде координувати всі компоненти. 