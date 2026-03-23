/**
 * 🚀 main.js — точка входу
 *
 * Ініціалізує канвас та запускає гру.
 */
import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas елемент #gameCanvas не знайдено');
    return;
  }

  const game = new Game(canvas);
  game.start();

  // Глобальний доступ для налагодження
  window.game = game;
});
