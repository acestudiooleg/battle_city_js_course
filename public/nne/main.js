import { Game } from './Game.js';
import { GameLogger } from './GameLogger.js';
import { InputManager } from './InputManager.js';

/**
 * 1. ЕКСПОРТ КОНСТАНТ (ПЕРШИМ ЧЕРГОЮ)
 * Ці змінні мають бути доступні іншим файлам негайно.
 */
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const logger = new GameLogger();

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TILE_SIZE: 32,
  GAME_SPEED: 60,
  DEBUG_MODE: false,
};

/**
 * 2. КЛАС ДОДАТКА
 */
class BattleCityApp {
  constructor() {
    // Системи
    this.inputManager = new InputManager(logger);
    this.game = null;

    // Прив'язка до вікна
    this.bindGlobalMethods();
    this.initSystemEvents();

    // Початок гри
    this.startNewGame();
  }

  startNewGame() {
    if (this.game) {
      this.game.stop();
    }

    // Повне очищення перед стартом
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.game = new Game(logger);
    this.game.init();

    this.setupTanks();
    this.game.start();

    logger.info('🎮 Гра ініціалізована та запущена!');
  }

  setupTanks() {
    const { player, enemy } = this.game;
    player.setInputManager(this.inputManager);

    const bounds = {
      maxX: GAME_CONFIG.CANVAS_WIDTH,
      maxY: GAME_CONFIG.CANVAS_HEIGHT,
    };

    player.setBounds(bounds);
    enemy.setBounds(bounds);

    player.setShootCooldown(500);
    enemy.setShootCooldown(2000);
  }

  restart() {
    this.logger.info('🔄 Перезавантаження сторінки...');
    window.location.reload();
  }

  initSystemEvents() {
    document.addEventListener('gamePause', (e) => {
      if (e.detail.isPaused) this.game.pause();
      else this.game.resume();
    });

    // Просто викликаємо рестарт браузера
    document.addEventListener('gameRestart', () => this.restart());

    document.addEventListener('gameDebug', () => this.toggleDebug());
  }

  bindGlobalMethods() {
    window.clearLog = () => logger.clear();
    window.getGameStats = () => (this.game ? this.game.getGameStats() : null);
    window.restartGame = () => this.restart();
  }
}

// 3. ЗАПУСК ПІСЛЯ ЗАВАНТАЖЕННЯ СТОРІНКИ
document.addEventListener('DOMContentLoaded', () => {
  window.app = new BattleCityApp();
});
