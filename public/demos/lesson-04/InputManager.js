// InputManager.js — зчитування клавіатури
// Урок 4: Рух танка

export class InputManager {
    constructor() {
        this.held = {};

        this._onDown = (e) => {
            if (e.repeat) return;
            this.held[e.code] = true;
            if (this._isGameKey(e.code)) e.preventDefault();
        };

        this._onUp = (e) => {
            this.held[e.code] = false;
        };

        document.addEventListener('keydown', this._onDown);
        document.addEventListener('keyup', this._onUp);
    }

    getMovement() {
        if (this.held['KeyW']) return 'up';
        if (this.held['KeyS']) return 'down';
        if (this.held['KeyA']) return 'left';
        if (this.held['KeyD']) return 'right';
        return null;
    }

    _isGameKey(code) {
        return ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(code);
    }
}
