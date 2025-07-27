# 2.1: Оновлення HTML структури та стилів

## Що ми будемо робити?

У цьому підрозділі ми оновимо HTML структуру та додамо нові стилі для ігрового контейнера та системи логування.

## Крок 1: Оновлення заголовка

1. **Оновіть заголовок та опис:**
   ```html
   <title>Танчики - Урок 2: Малювання поля та танків</title>
   ```

## Крок 2: Додавання нових стилів

Додайте нові стилі для ігрового контейнера:

```html
<style>
    /* ... існуючі стилі ... */
    
    .game-container {
        display: flex;
        gap: 20px;
        justify-content: center;
        align-items: flex-start;
        margin-bottom: 20px;
    }
    
    .game-log {
        width: 300px;
        height: 600px;
        background-color: #2c3e50;
        border: 2px solid #3498db;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
    }
    
    .log-header {
        background-color: #34495e;
        padding: 10px;
        border-bottom: 1px solid #3498db;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .log-header h3 {
        margin: 0;
        font-size: 16px;
    }
    
    .clear-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .clear-btn:hover {
        background-color: #c0392b;
    }
    
    .log-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
    }
    
    .log-entry {
        margin-bottom: 8px;
        padding: 5px;
        border-radius: 4px;
        word-wrap: break-word;
    }
</style>
```

## Крок 3: Оновлення HTML контенту

1. **Замініть інформаційний блок:**
   ```html
   <div class="lesson-info">
       <h2>Малювання поля та танків</h2>
       <p>У цьому уроці ми створимо:</p>
       <ul style="text-align: left;">
           <li>✅ Ігрове поле з сіткою</li>
           <li>✅ Танк гравця (жовтий)</li>
           <li>✅ Ворожого танка (червоний)</li>
           <li>✅ Систему логування подій</li>
       </ul>
   </div>
   ```

2. **Додайте ігровий контейнер:**
   ```html
   <div class="game-container">
       <canvas id="gameCanvas" width="800" height="600"></canvas>
       
       <div class="game-log">
           <div class="log-header">
               <h3>🎮 Ігровий лог</h3>
               <button class="clear-btn" onclick="clearLog()">Очистити</button>
           </div>
           <div class="log-content" id="logContent">
               <!-- Тут будуть з'являтися записи логу -->
           </div>
       </div>
   </div>
   ```

## Результат

Після цих змін у вас буде:
- ✅ Оновлений заголовок сторінки
- ✅ Новий макет з ігровим полем та панеллю логування
- ✅ Стилізована панель логування з кнопкою очищення
- ✅ Готовий контейнер для відображення логів

## Що далі?

У наступному підрозділі ми створимо базовий клас танка, який буде основою для всіх танків у грі. 