// Bullet.js — клас кулі
// Урок 5: Стрільба

import { FIELD_W, FIELD_H } from './constants.js';

export class Bullet {
    constructor(fx, fy, direction, owner) {
        this.x = fx;
        this.y = fy;
        this.width  = 4;
        this.height = 4;
        this.direction = direction;
        this.owner = owner;
        this.speed = 5;
        this.active = true;

        const dirs = {
            up:    { vx:  0, vy: -1 },
            down:  { vx:  0, vy:  1 },
            left:  { vx: -1, vy:  0 },
            right: { vx:  1, vy:  0 },
        };
        this.vx = dirs[direction].vx * this.speed;
        this.vy = dirs[direction].vy * this.speed;
    }

    update() {
        if (!this.active) return;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > FIELD_W ||
            this.y < 0 || this.y > FIELD_H) {
            this.active = false;
        }
    }

    render(ctx, ox, oy) {
        if (!this.active) return;
        ctx.fillStyle = '#fcfcfc';
        ctx.fillRect(
            Math.round(this.x - this.width / 2) + ox,
            Math.round(this.y - this.height / 2) + oy,
            this.width,
            this.height
        );
    }
}
