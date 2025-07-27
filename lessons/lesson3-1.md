# 3.1: Оновлення HTML та стилів

## Що ми будемо робити?

У цьому підрозділі ми оновимо HTML структуру та стилі для додавання системи керування та відображення інформації про гру.

## Крок 1: Оновлення заголовка

1. **Оновіть заголовок та опис:**
   ```html
   <title>Танчики - Урок 3: Рух та стрільба</title>
   ```

## Крок 2: Додавання нових стилів

Додайте нові стилі для інформаційної панелі:

```html
<style>
    /* ... існуючі стилі ... */
    
    .info-panel {
        width: 300px;
        height: 600px;
        background-color: #2c3e50;
        border: 2px solid #3498db;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
    }
    
    .info-header {
        background-color: #34495e;
        padding: 10px;
        border-bottom: 1px solid #3498db;
        text-align: center;
    }
    
    .info-header h3 {
        margin: 0;
        font-size: 16px;
        color: #ecf0f1;
    }
    
    .info-content {
        flex: 1;
        padding: 15px;
        color: #ecf0f1;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
    }
    
    .control-info {
        background-color: #34495e;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
    }
    
    .control-info h4 {
        margin: 0 0 8px 0;
        color: #f39c12;
        font-size: 14px;
    }
    
    .control-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
    }
    
    .key {
        background-color: #2c3e50;
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: bold;
        color: #f39c12;
    }
    
    .game-stats {
        background-color: #34495e;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
    }
    
    .game-stats h4 {
        margin: 0 0 8px 0;
        color: #27ae60;
        font-size: 14px;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
    }
    
    .stat-value {
        color: #27ae60;
        font-weight: bold;
    }
</style>
```

## Крок 3: Оновлення HTML контенту

1. **Замініть інформаційний блок:**
   ```html
   <div class="lesson-info">
       <h2>Рух та стрільба</h2>
       <p>У цьому уроці ми додамо:</p>
       <ul style="text-align: left;">
           <li>✅ Систему керування клавішами</li>
           <li>✅ Рух гравця та ворога</li>
           <li>✅ Стрільбу кулями</li>
           <li>✅ Систему колізій</li>
           <li>✅ Інформаційну панель</li>
       </ul>
   </div>
   ```

2. **Оновіть ігровий контейнер:**
   ```html
   <div class="game-container">
       <canvas id="gameCanvas" width="800" height="600"></canvas>
       
       <div class="info-panel">
           <div class="info-header">
               <h3>🎮 Інформація про гру</h3>
           </div>
           <div class="info-content">
               <div class="control-info">
                   <h4>⌨️ Керування</h4>
                   <div class="control-item">
                       <span>Рух:</span>
                       <span class="key">WASD</span>
                   </div>
                   <div class="control-item">
                       <span>Стрільба:</span>
                       <span class="key">ПРОБІЛ</span>
                   </div>
                   <div class="control-item">
                       <span>Пауза:</span>
                       <span class="key">P</span>
                   </div>
               </div>
               
               <div class="game-stats">
                   <h4>📊 Статистика</h4>
                   <div class="stat-item">
                       <span>Здоров'я гравця:</span>
                       <span class="stat-value" id="playerHealth">100</span>
                   </div>
                   <div class="stat-item">
                       <span>Здоров'я ворога:</span>
                       <span class="stat-value" id="enemyHealth">100</span>
                   </div>
                   <div class="stat-item">
                       <span>Кулі гравця:</span>
                       <span class="stat-value" id="playerBullets">0</span>
                   </div>
                   <div class="stat-item">
                       <span>Кулі ворога:</span>
                       <span class="stat-value" id="enemyBullets">0</span>
                   </div>
               </div>
               
               <div class="game-log">
                   <h4>📝 Лог подій</h4>
                   <div class="log-content" id="logContent">
                       <!-- Тут будуть з'являтися записи логу -->
                   </div>
                   <button class="clear-btn" onclick="clearLog()">Очистити лог</button>
               </div>
           </div>
       </div>
   </div>
   ```

## Крок 4: Додавання стилів для логу

Додайте стилі для логу в інформаційній панелі:

```css
.game-log {
    background-color: #34495e;
    padding: 10px;
    border-radius: 4px;
    margin-top: auto;
}

.game-log h4 {
    margin: 0 0 8px 0;
    color: #3498db;
    font-size: 14px;
}

.log-content {
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 8px;
    font-size: 10px;
    line-height: 1.3;
}

.clear-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10px;
    width: 100%;
}

.clear-btn:hover {
    background-color: #c0392b;
}
```

## Результат

Після цих змін у вас буде:
- ✅ Оновлений заголовок сторінки
- ✅ Інформаційна панель замість логу
- ✅ Секція керування з клавішами
- ✅ Статистика гри в реальному часі
- ✅ Компактний лог подій
- ✅ Готовність для додавання функціональності

## Що далі?

У наступному підрозділі ми створимо систему керування, яка буде обробляти натискання клавіш. 