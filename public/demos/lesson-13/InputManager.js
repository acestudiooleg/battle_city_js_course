/**
 * ⌨️ Клас InputManager — 2 гравці
 */
export class InputManager {
  constructor() {
    this.held = {};
    this.justPressed = {};
    this._onDown = (e) => {
      if (e.repeat) return;
      this.held[e.code] = true;
      this.justPressed[e.code] = true;
      if (this._isGameKey(e.code)) e.preventDefault();
    };
    this._onUp = (e) => { this.held[e.code] = false; };
    document.addEventListener('keydown', this._onDown);
    document.addEventListener('keyup', this._onUp);
  }

  // P1: WASD + Space
  getMovementP1() {
    if (this.held['KeyW']) return 'up';
    if (this.held['KeyS']) return 'down';
    if (this.held['KeyA']) return 'left';
    if (this.held['KeyD']) return 'right';
    return null;
  }
  isShootP1() { return !!this.held['Space']; }

  // P2: Arrows + Enter
  getMovementP2() {
    if (this.held['ArrowUp'])    return 'up';
    if (this.held['ArrowDown'])  return 'down';
    if (this.held['ArrowLeft'])  return 'left';
    if (this.held['ArrowRight']) return 'right';
    return null;
  }
  isShootP2() { return !!this.held['Enter'] || !!this.held['NumpadEnter']; }

  // Backwards compat
  getMovement() { return this.getMovementP1(); }
  isShoot()     { return this.isShootP1(); }

  justPause()   { return !!this.justPressed['KeyP']; }
  justRestart() { return !!this.justPressed['KeyR']; }
  clearFrame()  { this.justPressed = {}; }

  _isGameKey(code) {
    return ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','Enter','NumpadEnter','KeyP','KeyR'].includes(code);
  }
  destroy() {
    document.removeEventListener('keydown', this._onDown);
    document.removeEventListener('keyup', this._onUp);
  }
}
