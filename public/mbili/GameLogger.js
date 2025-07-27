/**
 * 📋 GameLogger - Система логування подій гри
 * 
 * Цей клас замінює console.log та виводить всі події
 * у вікно логів біля канвасу
 */

export class GameLogger {
    constructor() {
        this.logContainer = document.getElementById('logContent');
        this.clearButton = document.getElementById('clearLog');
        this.maxEntries = 100; // Максимальна кількість записів
        this.entries = [];
        
        this.init();
    }
    
    init() {
        // Додаємо обробник для кнопки очищення
        this.clearButton.addEventListener('click', () => {
            this.clear();
        });
        
        
        this.log('🔧 GameLogger ініціалізовано', 'info');
    }
    
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            message: `[${timestamp}] ${message}`,
            type: type,
            timestamp: Date.now()
        };
        
        this.entries.push(entry);
        
        // Обмежуємо кількість записів
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
        }
        
        this.render();
    }
    
    render() {
        if (!this.logContainer) return;
        
        this.logContainer.innerHTML = '';
        
        this.entries.forEach(entry => {
            const logElement = document.createElement('div');
            logElement.className = `log-entry ${entry.type}`;
            logElement.textContent = entry.message;
            this.logContainer.appendChild(logElement);
        });
        
        // Прокручуємо до останнього запису
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    
    clear() {
        this.entries = [];
        this.render();
        this.log('🧹 Лог очищено', 'info');
    }
    
    // Зручні методи для різних типів подій
    info(message) {
        this.log(message, 'info');
    }
    
    success(message) {
        this.log(message, 'success');
    }
    
    warning(message) {
        this.log(message, 'warning');
    }
    
    error(message) {
        this.log(message, 'error');
    }
    
    debug(message) {
        this.log(message, 'debug');
    }
    
    // Спеціальні методи для ігрових подій
    gameEvent(event, details = '') {
        const message = details ? `${event} - ${details}` : event;
        this.log(`🎮 ${message}`, 'info');
    }
    
    playerAction(action, details = '') {
        const message = details ? `${action} - ${details}` : action;
        this.log(`👤 ${message}`, 'success');
    }
    
    enemyAction(action, details = '') {
        const message = details ? `${action} - ${details}` : action;
        this.log(`👹 ${message}`, 'warning');
    }
    
    collision(object1, object2) {
        this.log(`💥 Зіткнення: ${object1} ↔ ${object2}`, 'warning');
    }
    
    scoreUpdate(points, total) {
        this.log(`📊 Очки: +${points} (всього: ${total})`, 'success');
    }
} 