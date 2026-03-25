# 🎮 Урок 8.3: Ланцюжок влучання

## Куля влучає → вибух + пошкодження! 🔗

Давай простежимо повний ланцюжок подій від моменту натискання Space до вибуху на стіні.

---

## Повний ланцюжок

```
1. Гравець натискає Space
   └→ input.isShoot() === true

2. player.shoot(Date.now(), 'player')
   └→ створюється Bullet, додається в player.bullets[]

3. Кожен кадр: player.updateBullets()
   └→ bullet.update() — куля рухається (x += vx, y += vy)

4. collisions.update(player)
   └→ _processBullets(player)
      └→ field.bulletHitWall(bx, by, bw, bh) — перевірка кожного тайла

5. Якщо тайл знайдено:
   ├→ b.active = false (куля зникає)
   ├→ field.damageTile(tile) (HP -= 1, якщо HP = 0 → splice)
   └→ onExplosion(b.x, b.y, 'small') → new Explosion(...)

6. explosions[].update(dt) — частинки розлітаються
   explosions[].render(ctx) — малюємо іскри
```

---

## Що бачить гравець

```
Кадр N:          Кадр N+1:        Кадр N+5:        Кадр N+20:

  ■ → ■ → ■       ■→🧱            💥               (вибух згас)
                   (влучання)     (іскри!)          🧱 зникла!
```

1. Куля летить
2. Куля торкається стіни — зникає
3. Вибух з'являється (частинки розлітаються)
4. Цегла зникає з поля
5. Вибух згасає

---

## Бетон vs Цегла

```javascript
if (tile.material === 'brick') {
    this.field.damageTile(tile); // ✅ руйнуємо!
}
// Бетон: куля зникає, вибух є, але стіна залишається
this.onExplosion(b.x, b.y, 'small'); // вибух в обох випадках
```

Бетон невразливий (HP=99), але вибух все одно показується — як у NES!

---

## Підсумок

- ✅ Ланцюжок: Space → Bullet → update → collision → damage → Explosion
- ✅ Цегла руйнується (HP: 1 → 0 → splice)
- ✅ Бетон — куля зникає, вибух є, стіна залишається
- ✅ Вибухи автоматично згасають та видаляються
