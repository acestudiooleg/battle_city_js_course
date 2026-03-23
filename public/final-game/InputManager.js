/**
 * ⌨️ Клас InputManager — зчитування вводу з клавіатури
 *
 * Підтримує:
 * - WASD / Стрілки для руху
 * - SPACE для стрільби
 * - P для паузи
 * - R для рестарту
 */
export class InputManager {
  constructor() {
    /** Стан утримуваних клавіш */
    this.held = {};

    /** Клавіші, натиснуті цього кадру (для одноразових дій) */
    this.justPressed = {};

    this._onDown = (e) => {
      if (e.repeat) return;
      this.held[e.code] = true;
      this.justPressed[e.code] = true;
      if (this._isGameKey(e.code)) e.preventDefault();
    };

    this._onUp = (e) => {
      this.held[e.code] = false;
    };

    document.addEventListener('keydown', this._onDown);
    document.addEventListener('keyup', this._onUp);
  }

  /** Напрямок руху: повертає 'up'|'down'|'left'|'right' або null */
  getMovement() {
    if (this.held['ArrowUp']    || this.held['KeyW']) return 'up';
    if (this.held['ArrowDown']  || this.held['KeyS']) return 'down';
    if (this.held['ArrowLeft']  || this.held['KeyA']) return 'left';
    if (this.held['ArrowRight'] || this.held['KeyD']) return 'right';
    return null;
  }

  /** Чи натиснута клавіша стрільби (утримувана) */
  isShoot() {
    return !!this.held['Space'];
  }

  /** Чи щойно натиснута пауза */
  justPause() {
    return !!this.justPressed['KeyP'];
  }

  /** Чи щойно натиснутий рестарт */
  justRestart() {
    return !!this.justPressed['KeyR'];
  }

  /** Скидання одноразових натискань (викликати в кінці кадру) */
  clearFrame() {
    this.justPressed = {};
  }

  /** Перевірка чи клавіша ігрова */
  _isGameKey(code) {
    return [
      'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
      'KeyW','KeyA','KeyS','KeyD',
      'Space','KeyP','KeyR',
    ].includes(code);
  }

  /** Прибрати слухачів */
  destroy() {
    document.removeEventListener('keydown', this._onDown);
    document.removeEventListener('keyup', this._onUp);
  }
}
