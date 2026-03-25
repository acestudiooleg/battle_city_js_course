/**
 * 🔊 Клас SoundManager — управління звуками
 */
export class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this._loadAll();
  }

  _loadAll() {
    const base = '../../assets/';
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
    if (this.sounds.engine) {
      this.sounds.engine.loop = true;
      this.sounds.engine.volume = 0.3;
    }
  }

  play(key, volume = 0.6) {
    if (!this.enabled) return;
    const src = this.sounds[key];
    if (!src) return;
    const clone = src.cloneNode();
    clone.volume = volume;
    clone.play().catch(() => {});
  }

  setEngineSound(moving) {
    if (!this.enabled) return;
    const eng = this.sounds.engine;
    if (!eng) return;
    if (moving) { eng.play().catch(() => {}); }
    else { eng.pause(); eng.currentTime = 0; }
  }

  setEnabled(value) {
    this.enabled = value;
    if (!value) Object.values(this.sounds).forEach(s => s.pause());
  }
}
