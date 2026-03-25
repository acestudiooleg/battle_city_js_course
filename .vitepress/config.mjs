import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'BattleCity JS Course',
  description: 'Марафон з розробки класичної гри "Танчики" на JavaScript',
  base: '/battle_city_js_course/',
  locales: {
    root: {
      label: 'Українська',
      lang: 'uk',
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Головна', link: '/' }],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Пошук',
                buttonAriaLabel: 'Пошук',
              },
              modal: {
                displayDetails: 'Показати детальний список',
                resetButtonTitle: 'Скинути пошук',
                backButtonTitle: 'Закрити пошук',
                noResultsText: 'Немає результатів',
                footer: {
                  selectText: 'Вибрати',
                  selectKeyAriaLabel: 'Ввести',
                  navigateText: 'Навігація',
                  navigateUpKeyAriaLabel: 'Вгору',
                  navigateDownKeyAriaLabel: 'Вниз',
                  closeText: 'Закрити',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },

    sidebar: [
      {
        text: 'Уроки',
        items: [
          {
            text: 'День 1: Готуємося до гри',
            collapsed: false,
            items: [
              { text: '1.1: Встановлюємо VS Code', link: '/lessons/01-getting-started/1-1-install-vscode' },
              { text: '1.2: Створюємо папку для гри', link: '/lessons/01-getting-started/1-2-create-project' },
              { text: '1.3: Створюємо HTML файл', link: '/lessons/01-getting-started/1-3-html-canvas' },
              { text: '1.4: Додаємо красиві стилі', link: '/lessons/01-getting-started/1-4-css-styles' },
              { text: '1.5: Пишемо JavaScript код', link: '/lessons/01-getting-started/1-5-javascript-code' },
              { text: '1.6: Запускаємо гру', link: '/lessons/01-getting-started/1-6-run-game' },
            ],
          },
          {
            text: 'День 2: Canvas та координати NES',
            collapsed: true,
            items: [
              { text: '2.1: Екран NES Battle City', link: '/lessons/02-canvas-and-coordinates/2-1-nes-screen-layout' },
              { text: '2.2: Константи гри', link: '/lessons/02-canvas-and-coordinates/2-2-constants-js' },
              { text: '2.3: Палітра кольорів NES', link: '/lessons/02-canvas-and-coordinates/2-3-colors-js' },
              { text: '2.4: Малюємо поле та sidebar', link: '/lessons/02-canvas-and-coordinates/2-4-drawing-layout' },
              { text: '2.5: Координатна система', link: '/lessons/02-canvas-and-coordinates/2-5-coordinate-system' },
            ],
          },
          {
            text: 'День 3: Малюємо танк',
            collapsed: true,
            items: [
              { text: '3.1: Знайомство з ООП', link: '/lessons/03-drawing-tank/3-1-oop-intro' },
              { text: '3.2: Клас Tank — властивості', link: '/lessons/03-drawing-tank/3-2-tank-class-properties' },
              { text: '3.3: render() — корпус та гусениці', link: '/lessons/03-drawing-tank/3-3-render-body-treads' },
              { text: '3.4: _drawBarrel() — дуло', link: '/lessons/03-drawing-tank/3-4-draw-barrel' },
              { text: '3.5: Player.js — танк гравця', link: '/lessons/03-drawing-tank/3-5-player-class' },
            ],
          },
          {
            text: 'День 4: Рух танка',
            collapsed: true,
            items: [
              { text: '4.1: Слухаємо клавіатуру', link: '/lessons/04-movement/4-1-input-manager' },
              { text: '4.2: Ігровий цикл', link: '/lessons/04-movement/4-2-game-loop' },
              { text: '4.3: Метод move()', link: '/lessons/04-movement/4-3-tank-move' },
              { text: '4.4: Snap to Grid', link: '/lessons/04-movement/4-4-snap-to-grid' },
              { text: '4.5: Анімація гусениць', link: '/lessons/04-movement/4-5-tread-animation' },
            ],
          },
          {
            text: 'День 5: Стрільба',
            collapsed: true,
            items: [
              { text: '5.1: Клас Bullet', link: '/lessons/05-shooting/5-1-bullet-class' },
              { text: '5.2: Tank.shoot()', link: '/lessons/05-shooting/5-2-tank-shoot' },
              { text: '5.3: Input → Стрільба', link: '/lessons/05-shooting/5-3-input-shoot' },
              { text: '5.4: Деактивація за межами', link: '/lessons/05-shooting/5-4-bullet-bounds' },
              { text: '5.5: Малюємо кулі', link: '/lessons/05-shooting/5-5-render-bullets' },
            ],
          },
          {
            text: 'День 6: Ігрове поле з даних',
            collapsed: true,
            items: [
              { text: '6.1: Формат карти', link: '/lessons/06-game-field/6-1-map-format' },
              { text: '6.2: Дані рівня', link: '/lessons/06-game-field/6-2-levels-js' },
              { text: '6.3: Будуємо рівень', link: '/lessons/06-game-field/6-3-gamefield-js' },
              { text: '6.4: Вода та ліс', link: '/lessons/06-game-field/6-4-water-and-forest' },
            ],
          },
          {
            text: 'День 7: Колізії',
            collapsed: true,
            items: [
              { text: '7.1: Теорія AABB', link: '/lessons/07-collisions/7-1-aabb-theory' },
              { text: '7.2: CollisionManager', link: '/lessons/07-collisions/7-2-collision-manager' },
              { text: '7.3: Танк ↔ стіна', link: '/lessons/07-collisions/7-3-tank-vs-wall' },
              { text: '7.4: Куля ↔ стіна', link: '/lessons/07-collisions/7-4-bullet-vs-wall' },
              { text: '7.5: Куля ↔ танк', link: '/lessons/07-collisions/7-5-bullet-vs-tank' },
            ],
          },
          {
            text: 'День 8: Вибухи та деструкція',
            collapsed: true,
            items: [
              { text: '8.1: Клас Explosion', link: '/lessons/08-explosions/8-1-explosion-class' },
              { text: '8.2: Інтеграція вибухів', link: '/lessons/08-explosions/8-2-integrate-explosions' },
              { text: '8.3: Ланцюжок влучання', link: '/lessons/08-explosions/8-3-bullet-hit-chain' },
              { text: '8.4: NES-руйнування парами', link: '/lessons/08-explosions/8-4-nes-brick-pairs' },
            ],
          },
          {
            text: 'День 9: Штаб та стан гри',
            collapsed: true,
            items: [
              { text: '9.1: Орел (Eagle)', link: '/lessons/09-eagle-gamestate/9-1' },
              { text: '9.2: Куля vs штаб', link: '/lessons/09-eagle-gamestate/9-2' },
              { text: '9.3: Game Over', link: '/lessons/09-eagle-gamestate/9-3' },
              { text: '9.4: Перемога та рестарт', link: '/lessons/09-eagle-gamestate/9-4' },
            ],
          },
          {
            text: 'День 10: Вороги',
            collapsed: true,
            items: [
              { text: '10.1: Клас Enemy', link: '/lessons/10-enemies/10-1' },
              { text: '10.2: Spawn-анімація', link: '/lessons/10-enemies/10-2' },
              { text: '10.3: AI патрулювання', link: '/lessons/10-enemies/10-3' },
              { text: '10.4: AI стрільба', link: '/lessons/10-enemies/10-4' },
              { text: '10.5: Черга спавну', link: '/lessons/10-enemies/10-5' },
            ],
          },
          {
            text: 'День 11: NES графіка',
            collapsed: true,
            items: [
              { text: '11.1: Що таке спрайт-лист', link: '/lessons/11-sprites/11-1' },
              { text: '11.2: SpriteSheet.js', link: '/lessons/11-sprites/11-2' },
              { text: '11.3: Спрайти танків', link: '/lessons/11-sprites/11-3' },
              { text: '11.4: Спрайти тайлів', link: '/lessons/11-sprites/11-4' },
              { text: '11.5: Орел та fallback', link: '/lessons/11-sprites/11-5' },
            ],
          },
          {
            text: 'День 12: Звуки та UI',
            collapsed: true,
            items: [
              { text: '12.1: SoundManager', link: '/lessons/12-sound-ui/12-1' },
              { text: '12.2: Підключення звуків', link: '/lessons/12-sound-ui/12-2' },
              { text: '12.3: Sidebar (NES)', link: '/lessons/12-sound-ui/12-3' },
              { text: '12.4: Масштаб 2×', link: '/lessons/12-sound-ui/12-4' },
            ],
          },
          {
            text: 'День 13: Артефакти та мультиплеєр',
            collapsed: true,
            items: [
              { text: '13.1: Клас PowerUp', link: '/lessons/13-powerups-multiplayer/13-1' },
              { text: '13.2: Спавн артефактів', link: '/lessons/13-powerups-multiplayer/13-2' },
              { text: '13.3: Ефекти артефактів', link: '/lessons/13-powerups-multiplayer/13-3' },
              { text: '13.4: Мультиплеєр', link: '/lessons/13-powerups-multiplayer/13-4' },
              { text: '13.5: Game для 2 гравців', link: '/lessons/13-powerups-multiplayer/13-5' },
            ],
          },
          {
            text: 'День 14: Титульний екран та фінал',
            collapsed: true,
            items: [
              { text: '14.1: Меню вибору', link: '/lessons/14-title-final/14-1' },
              { text: '14.2: Інтро музика', link: '/lessons/14-title-final/14-2' },
              { text: '14.3: Фінальне тестування', link: '/lessons/14-title-final/14-3' },
              { text: '14.4: Підсумок курсу', link: '/lessons/14-title-final/14-4' },
            ],
          },
        ],
      },
    ],

    outline: { label: 'Зміст сторінки' },

    docFooter: {
      prev: 'Попередня сторінка',
      next: 'Наступна сторінка',
    },

    lastUpdated: {
      text: 'Оновлено',
    },

    notFound: {
      title: 'СТОРІНКА НЕ ЗНАЙДЕНА',
      quote:
        'Але якщо ти не змінишь напрямок і продовжишь шукати, ти можеш опинитися там, куди йдеш.',
      linkLabel: 'перейти на головну',
      linkText: 'Відведи мене додому',
    },

    darkModeSwitchLabel: 'Оформлення',
    lightModeSwitchTitle: 'Переключити на світлу тему',
    darkModeSwitchTitle: 'Переключити на темну тему',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Повернутися до початку',
    langMenuLabel: 'Змінити мову',

    socialLinks: [
      { icon: 'instagram', link: 'https://www.instagram.com/acestudiooleg' },
      { icon: 'telegram', link: 'https://t.me/acestudiooleg_channel' },
    ],

    footer: {
      message: 'Усі права захищені',
      copyright: '© Олег Судавний, 2025',
    },
  },
});
