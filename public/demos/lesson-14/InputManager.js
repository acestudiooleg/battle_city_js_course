/**
 * ⌨️ Клас InputManager — зчитування вводу з клавіатури
 *
 * Підтримує двох гравців:
 * - P1: WASD для руху, Space для стрільби
 * - P2: Стрілки для руху, Enter для стрільби
 * - P — пауза, R — рестарт (спільні)
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

  // ─── P1: WASD + Space ────────────────────────────────────────────────────

  /** Напрямок руху P1 */
  getMovementP1() {
    if (this.held['KeyW']) return 'up';
    if (this.held['KeyS']) return 'down';
    if (this.held['KeyA']) return 'left';
    if (this.held['KeyD']) return 'right';
    return null;
  }

  /** Чи стріляє P1 */
  isShootP1() {
    return !!this.held['Space'];
  }

  // ─── P2: Arrows + Enter ──────────────────────────────────────────────────

  /** Напрямок руху P2 */
  getMovementP2() {
    if (this.held['ArrowUp'])    return 'up';
    if (this.held['ArrowDown'])  return 'down';
    if (this.held['ArrowLeft'])  return 'left';
    if (this.held['ArrowRight']) return 'right';
    return null;
  }

  /** Чи стріляє P2 */
  isShootP2() {
    return !!this.held['Enter'] || !!this.held['NumpadEnter'];
  }

  // ─── Спільні ─────────────────────────────────────────────────────────────

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
      'Space','Enter','NumpadEnter','KeyP','KeyR',
    ].includes(code);
  }

  /** Прибрати слухачів */
  destroy() {
    document.removeEventListener('keydown', this._onDown);
    document.removeEventListener('keyup', this._onUp);
  }
}
