// InputManager.js — оновлений для уроку 9
// Додано: justPause(), justRestart(), clearFrame()

export class InputManager {
    constructor() {
        this.held = {};
        this._justPressed = {};
        this._onKeyDown = (e) => {
            this.held[e.key.toLowerCase()] = true;
            this._justPressed[e.key.toLowerCase()] = true;
        };
        this._onKeyUp = (e) => { this.held[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    getMovement() {
        if (this.held['w']) return 'up';
        if (this.held['s']) return 'down';
        if (this.held['a']) return 'left';
        if (this.held['d']) return 'right';
        return null;
    }

    isShoot()     { return !!this.held[' ']; }
    justPause()   { return !!this._justPressed['p']; }
    justRestart() { return !!this._justPressed['r']; }
    clearFrame()  { this._justPressed = {}; }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
