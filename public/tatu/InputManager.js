/**
 * 🎮 Клас InputManager - управління введенням
 * 
 * Відповідає за:
 * - Відстеження натиснутих клавіш
 * - Обробку подій клавіатури
 * - Надання інформації про стан керування
 */

export class InputManager {
    constructor() {
        // Об'єкт для зберігання стану клавіш
        this.keys = {};
        
        // Налаштовуємо обробники подій
        this.setupEventListeners();
        
        console.log('⌨️ Менеджер введення створений');
    }
    
    /**
     * Налаштування обробників подій клавіатури
     */
    setupEventListeners() {
        // Обробник натискання клавіші
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
            
            // Запобігаємо прокрутці сторінки при натисканні пробілу
            if (event.key === ' ') {
                event.preventDefault();
            }
        });
        
        // Обробник відпускання клавіші
        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
        
        // Обробник втрати фокусу вікном (зупиняємо всі клавіші)
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
    
    /**
     * Перевірка чи натиснута клавіша
     * @param {string} key - Клавіша для перевірки
     * @returns {boolean} - true якщо клавіша натиснута
     */
    isKeyPressed(key) {
        return this.keys[key] === true;
    }
    
    /**
     * Перевірка чи натиснута клавіша руху вгору
     * @returns {boolean} - true якщо натиснута W або ArrowUp
     */
    isMoveUp() {
        return this.isKeyPressed('w') || this.isKeyPressed('W') || this.isKeyPressed('ArrowUp');
    }
    
    /**
     * Перевірка чи натиснута клавіша руху вниз
     * @returns {boolean} - true якщо натиснута S або ArrowDown
     */
    isMoveDown() {
        return this.isKeyPressed('s') || this.isKeyPressed('S') || this.isKeyPressed('ArrowDown');
    }
    
    /**
     * Перевірка чи натиснута клавіша руху вліво
     * @returns {boolean} - true якщо натиснута A або ArrowLeft
     */
    isMoveLeft() {
        return this.isKeyPressed('a') || this.isKeyPressed('A') || this.isKeyPressed('ArrowLeft');
    }
    
    /**
     * Перевірка чи натиснута клавіша руху вправо
     * @returns {boolean} - true якщо натиснута D або ArrowRight
     */
    isMoveRight() {
        return this.isKeyPressed('d') || this.isKeyPressed('D') || this.isKeyPressed('ArrowRight');
    }
    
    /**
     * Перевірка чи натиснута клавіша стрільби
     * @returns {boolean} - true якщо натиснутий пробіл
     */
    isShooting() {
        return this.isKeyPressed(' ');
    }
    
    /**
     * Отримання напрямку руху на основі натиснутих клавіш
     * @returns {string|null} - Напрямок руху або null якщо немає руху
     */
    getMovementDirection() {
        if (this.isMoveUp()) return 'up';
        if (this.isMoveDown()) return 'down';
        if (this.isMoveLeft()) return 'left';
        if (this.isMoveRight()) return 'right';
        return null;
    }
    
    /**
     * Очищення стану клавіш
     */
    clearKeys() {
        this.keys = {};
    }
    
    /**
     * Отримання всіх натиснутих клавіш
     * @returns {Object} - Об'єкт з натиснутими клавішами
     */
    getPressedKeys() {
        return { ...this.keys };
    }
} 