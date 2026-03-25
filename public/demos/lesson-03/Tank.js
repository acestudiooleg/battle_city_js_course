// Tank.js — базовий клас для всіх танків
// Урок 3: Малюємо танк

import { TILE, TANK_SIZE, FIELD_W, FIELD_H } from './constants.js';
import { darkGray } from './colors.js';

export class Tank {
    constructor(fx, fy, color, speed = 2, hp = 1) {
        // Позиція у координатах поля (не Canvas!)
        this.x = fx;
        this.y = fy;

        // Розмір (завжди 32×32)
        this.width  = TANK_SIZE;
        this.height = TANK_SIZE;

        // Зовнішній вигляд
        this.color = color;

        // Напрямок: 'up' | 'down' | 'left' | 'right'
        this.direction = 'up';

        // Швидкість (пікселів за кадр)
        this.speed = speed;

        // Здоров'я
        this.hp    = hp;
        this.alive = true;

        // Анімація гусениць (0 або 1 — два кадри)
        this.animFrame = 0;
        this.animTimer = 0;
    }

    // ─── Малювання ─────────────────────────────────────────────────────────────

    /**
     * Малюємо танк на Canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} ox — зсув поля по X (FIELD_X)
     * @param {number} oy — зсув поля по Y (FIELD_Y)
     */
    render(ctx, ox, oy) {
        if (!this.alive) return;

        const sx = Math.round(this.x) + ox;
        const sy = Math.round(this.y) + oy;
        const sz = this.width; // 32

        ctx.save();

        // Крок 1: гусениці
        this._drawTreads(ctx, sx, sy, sz);

        // Крок 2: корпус
        ctx.fillStyle = this.color;
        ctx.fillRect(sx + 4, sy + 4, sz - 8, sz - 8);

        // Крок 3: дуло
        this._drawBarrel(ctx, sx, sy, sz);

        ctx.restore();
    }

    _drawTreads(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;
        const af = this.animFrame; // 0 або 1

        if (this.direction === 'up' || this.direction === 'down') {
            // Ліва гусениця
            ctx.fillRect(sx,          sy + af * 4,            4, sz / 2 - 2);
            ctx.fillRect(sx,          sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2);
            // Права гусениця
            ctx.fillRect(sx + sz - 4, sy + af * 4,            4, sz / 2 - 2);
            ctx.fillRect(sx + sz - 4, sy + sz / 2 + (1-af)*4, 4, sz / 2 - 2);
        } else {
            // Верхня гусениця
            ctx.fillRect(sx + af * 4,           sy,           sz / 2 - 2, 4);
            ctx.fillRect(sx + sz/2 + (1-af)*4,  sy,           sz / 2 - 2, 4);
            // Нижня гусениця
            ctx.fillRect(sx + af * 4,           sy + sz - 4,  sz / 2 - 2, 4);
            ctx.fillRect(sx + sz/2 + (1-af)*4,  sy + sz - 4,  sz / 2 - 2, 4);
        }
    }

    _drawBarrel(ctx, sx, sy, sz) {
        ctx.fillStyle = darkGray;

        const barrelLen = sz * 0.55;
        const barrelW   = sz * 0.2;
        const cx = sx + sz / 2 - barrelW / 2;
        const cy = sy + sz / 2 - barrelW / 2;

        switch (this.direction) {
            case 'up':    ctx.fillRect(cx,         sy - barrelLen, barrelW, barrelLen); break;
            case 'down':  ctx.fillRect(cx,         sy + sz,        barrelW, barrelLen); break;
            case 'left':  ctx.fillRect(sx - barrelLen, cy,         barrelLen, barrelW); break;
            case 'right': ctx.fillRect(sx + sz,    cy,             barrelLen, barrelW); break;
        }
    }
}
