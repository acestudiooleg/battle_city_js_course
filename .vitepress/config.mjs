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
          { text: 'Урок 1: Налаштування середовища', link: '/lessons/lesson1' },
          { text: 'Урок 2: Малювання поля та танків', items: [
            { text: '2.1: Оновлення HTML структури та стилів', link: '/lessons/lesson2-1' },
            { text: '2.2: Базовий танк', link: '/lessons/lesson2-2' },
            { text: '2.3: Танк гравця', link: '/lessons/lesson2-3' },
            { text: '2.4: Танк ворога', link: '/lessons/lesson2-4' },
            { text: '2.5: Ігрове поле', link: '/lessons/lesson2-5' },
            { text: '2.6: Журнал дій', link: '/lessons/lesson2-6' },
            { text: '2.7: Мотор гри', link: '/lessons/lesson2-7' },
            { text: '2.8: Головний файл гри', link: '/lessons/lesson2-8' },
          ] },
          { text: 'Урок 3: Рух та стрільба', link: '/lessons/lesson3' },
          { text: 'Урок 4: Вибухи та анімації', link: '/lessons/lesson4' },
          { text: 'Урок 5: Перешкоди та карти рівнів', link: '/lessons/lesson5' },
          { text: 'Урок 6: Мультиплеєр для двох гравців', link: '/lessons/lesson6' },
          { text: 'Урок 7: Фінальні штрихи та публікація', link: '/lessons/lesson7' },
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
      { icon: 'instagram', link: 'https://www.instagram.com/ai_magic_ua/' },
      { icon: 'telegram', link: 'https://t.me/acestudiooleg_channel' },
    ],

    footer: {
      message: 'Усі права захищені',
      copyright: '© Олег Судавний, 2025',
    },
  },
});
