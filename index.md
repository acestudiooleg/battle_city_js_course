---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "BattleCity JS Course"
  text: "Згадати дитинство"
  image:
    src: /logo.png
    alt: Tanks
  tagline: Марафон з розробки класичної гри "Танчики" на JavaScript. За 14 днів створимо повноцінну гру з нуля — від налаштування Canvas до оригінальної NES графіки, звуків та мультиплеєру. Кожен урок — нова папка з повним робочим кодом.
  actions:
    - theme: brand
      text: Почати курс
      link: /lessons/01-getting-started/1-1-install-vscode

features:
  - title: 🛠️ День 1 <br> Готуємося до гри
    details: Налаштовуємо VS Code, Live Server. Створюємо HTML + CSS + Canvas. Малюємо титульний екран BATTLE CITY.
  - title: 📐 День 2 <br> Canvas та координати NES
    details: Геометрія екрану NES — поле 26×26 тайлів, рамка, sidebar. Палітра кольорів та координатна система.
  - title: 🚗 День 3 <br> Малюємо танк
    details: Знайомство з ООП. Клас Tank — корпус, гусениці з анімацією, дуло за напрямком. Клас Player.
  - title: ⌨️ День 4 <br> Рух танка
    details: InputManager для клавіатури. Ігровий цикл requestAnimationFrame. Grid Snapping — вирівнювання по сітці.
  - title: 💣 День 5 <br> Стрільба
    details: Клас Bullet — політ снаряда. Метод shoot() з кулдауном. Деактивація за межами поля.
  - title: 🧱 День 6 <br> Ігрове поле з даних
    details: "Карта 13×13 блоків → 26×26 тайлів. Матеріали: цегла, бетон, вода, ліс. GameField з рівня LEVEL_1."
  - title: 💥 День 7 <br> Колізії
    details: "Теорія AABB. CollisionManager: куля↔стіна, куля↔танк, танк↔стіна. Руйнування тайлів."
  - title: ✨ День 8 <br> Вибухи та деструкція
    details: Система частинок Explosion. NES-руйнування цегли — 2 тайли з боку влучання кулі.
  - title: 🦅 День 9 <br> Штаб та стан гри
    details: "Орел (Eagle) з захисною стінкою. Game Over при знищенні штабу. Перемога, пауза, рестарт."
  - title: 🤖 День 10 <br> Вороги
    details: "4 типи ворогів (basic/fast/power/armor). AI патрулювання та стрільба. Черга спавну: 20 ворогів, 3 точки."
  - title: 🖼️ День 11 <br> NES графіка
    details: "Спрайт-лист battlecity_general.png. SpriteSheet.js — оригінальні NES спрайти танків, тайлів, орла."
  - title: 🔉 День 12 <br> Звуки та UI
    details: "SoundManager: стрільба, вибухи, двигун, інтро. Sidebar в NES-стилі. CSS масштаб 2×."
  - title: ⭐ День 13 <br> Артефакти та мультиплеєр
    details: "6 power-ups: каска, зірка, граната, лопата, таймер, танк. P1 (WASD) + P2 (стрілки)."
  - title: 🚀 День 14 <br> Титульний екран та фінал
    details: "Меню вибору 1/2 PLAYER з курсором-танком. Інтро музика. Фінальна збірка — повна гра як на NES!"
