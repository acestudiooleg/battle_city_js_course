import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'BattleCity JS Course',
  description: 'Марафон з розробки класичної гри "Танчики" на JavaScript',
  locales: {
    root: {
      label: 'Українська',
      lang: 'uk',
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Головна', link: '/' },
      { text: 'Уроки', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Уроки',
        items: [
          { text: 'Урок 1: Налаштування середовища' },
          { text: 'Урок 2: Малювання поля та танків', link: '/lesson2' },
          { text: 'Урок 3: Рух та стрільба', link: '/lesson3' },
          { text: 'Урок 4: Вибухи та анімації', link: '/lesson4' },
          { text: 'Урок 5: Перешкоди та карти рівнів', link: '/lesson5' },
          { text: 'Урок 6: Мультиплеєр для двох гравців', link: '/lesson6' },
          { text: 'Урок 7: Фінальні штрихи та публікація', link: '/lesson7' },
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],

    footer: {
      message: 'Усі права захищені',
      copyright: '© Олег Судавний, 2025',
    },
  },
});
