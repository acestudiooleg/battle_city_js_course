/**
 * 🚀 main.js — точка входу з титульним екраном
 *
 * NES-стиль меню:
 * - Логотип "BATTLE CITY"
 * - Курсор-танк вибирає "1 PLAYER" або "2 PLAYERS"
 * - Enter/Space для підтвердження
 */
import { CANVAS_W, CANVAS_H, FIELD_X, FIELD_W } from './constants.js';
import { spriteSheet, PLAYER1_SPRITE, DIR_COL } from './SpriteSheet.js';
import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas елемент #gameCanvas не знайдено');
    return;
  }

  const ctx = canvas.getContext('2d');
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.imageSmoothingEnabled = false;

  let selected = 0; // 0 = 1 player, 1 = 2 players
  let confirmed = false;

  // ─── Малювання титульного екрану ──────────────────────────────────────

  function drawMenu() {
    // Чорний фон
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cx = FIELD_X + FIELD_W / 2;

    // Заголовок
    ctx.fillStyle = '#e04038';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE', cx, 100);
    ctx.fillStyle = '#f8f858';
    ctx.fillText('CITY', cx, 140);

    // Пункти меню
    const menuY = 220;
    const items = ['1 PLAYER', '2 PLAYERS'];

    for (let i = 0; i < items.length; i++) {
      ctx.fillStyle = '#fcfcfc';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(items[i], cx + 16, menuY + i * 36);
    }

    // Курсор-танк (спрайт гравця, напрямок right)
    const cursorY = menuY + selected * 36 - 14;
    const cursorX = cx - 60;

    if (spriteSheet.ready) {
      const col = DIR_COL['right'];
      ctx.drawImage(
        spriteSheet.img,
        PLAYER1_SPRITE.x + col * 16, PLAYER1_SPRITE.y, 16, 16,
        cursorX, cursorY, 20, 20
      );
    } else {
      // Fallback — трикутник
      ctx.fillStyle = '#f8f858';
      ctx.beginPath();
      ctx.moveTo(cursorX, cursorY);
      ctx.lineTo(cursorX + 16, cursorY + 10);
      ctx.lineTo(cursorX, cursorY + 20);
      ctx.closePath();
      ctx.fill();
    }

    // Підказка
    ctx.fillStyle = '#7c7c7c';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↑↓ / W S — вибір   ENTER / SPACE — старт', cx, CANVAS_H - 30);

    // Копірайт
    ctx.fillText('© NAMCO 1985', cx, CANVAS_H - 14);
  }

  // ─── Обробка клавіш ──────────────────────────────────────────────────

  function onKey(e) {
    if (confirmed) return;

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      selected = 0;
      e.preventDefault();
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      selected = 1;
      e.preventDefault();
    }
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') {
      confirmed = true;
      document.removeEventListener('keydown', onKey);
      startGame(selected + 1);
      e.preventDefault();
    }
  }

  document.addEventListener('keydown', onKey);

  // ─── Анімаційний цикл меню ────────────────────────────────────────────

  function menuLoop() {
    if (confirmed) return;
    drawMenu();
    requestAnimationFrame(menuLoop);
  }

  menuLoop();

  // ─── Запуск гри ───────────────────────────────────────────────────────

  function startGame(numPlayers) {
    const game = new Game(canvas, numPlayers);
    game.start();
    window.game = game;
  }
});
