/**
 * 🔊 Клас SoundManager — управління звуками
 *
 * Відповідає за:
 * - Завантаження аудіо-файлів
 * - Відтворення звуків подій (постріл, вибух, двигун)
 * - Регулювання гучності
 */
export class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this._loadAll();
  }

  /**
   * Завантажує всі звуки з папки assets
   */
  _loadAll() {
    const base = '../assets/';
    const files = {
      shoot:    'bullet.mp3',
      explodeS: 'explosion.mp3',
      explodeL: 'explosion2.mp3',
      engine:   'engine-run.mp3',
      drive:    'drive.mp3',
      newLife:  'new-life.mp3',
      intro:    'intro.mp3',
    };

    for (const [key, file] of Object.entries(files)) {
      const audio = new Audio(base + file);
      audio.preload = 'auto';
      this.sounds[key] = audio;
    }

    // Двигун грає в петлі
    if (this.sounds.engine) {
      this.sounds.engine.loop = true;
      this.sounds.engine.volume = 0.3;
    }
  }

  /**
   * Відтворює звук за ключем
   * @param {string} key - Ключ звуку
   * @param {number} volume - Гучність (0.0 – 1.0)
   */
  play(key, volume = 0.6) {
    if (!this.enabled) return;
    const src = this.sounds[key];
    if (!src) return;

    // Клонуємо Audio, щоб один і той самий звук міг грати кілька разів
    const clone = src.cloneNode();
    clone.volume = volume;
    clone.play().catch(() => {}); // ігноруємо помилки автовідтворення
  }

  /**
   * Запускає/зупиняє звук двигуна
   * @param {boolean} moving - чи рухається танк
   */
  setEngineSound(moving) {
    if (!this.enabled) return;
    const eng = this.sounds.engine;
    if (!eng) return;
    if (moving) {
      eng.play().catch(() => {});
    } else {
      eng.pause();
      eng.currentTime = 0;
    }
  }

  /**
   * Вмикає або вимикає всі звуки
   * @param {boolean} value
   */
  setEnabled(value) {
    this.enabled = value;
    if (!value) {
      Object.values(this.sounds).forEach((s) => s.pause());
    }
  }
}
