<template>
    <canvas ref="gameCanvas" width="800" height="600" class="game-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Game configuration
const gameConfig = ref({
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 32,
    FPS: 60
})

// Reactive state
const gameCanvas = ref(null)
const gameStatus = ref('Ініціалізація...')
const currentFPS = ref(0)
const isAnimating = ref(false)
const animationId = ref(null)
const lastFrameTime = ref(0)
const frameCount = ref(0)
const lastFPSUpdate = ref(0)

// Game context
let ctx = null

// Initialize game
function initGame() {
    if (!gameCanvas.value) return

    ctx = gameCanvas.value.getContext('2d')
    gameStatus.value = 'Гра ініціалізована!'

    console.log('🎮 Гра "Танчики" ініціалізована!')
    console.log('📐 Розмір Canvas:', gameConfig.value.CANVAS_WIDTH, 'x', gameConfig.value.CANVAS_HEIGHT)
    console.log('🔲 Розмір клітинки:', gameConfig.value.TILE_SIZE, 'пікселів')

    drawWelcomeMessage()
}

// Draw welcome message
function drawWelcomeMessage() {
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)

    // Draw title
    ctx.fillStyle = '#3498db'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('ТАНЧИКИ', gameCanvas.value.width / 2, gameCanvas.value.height / 2 - 50)

    // Draw subtitle
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '24px Arial'
    ctx.fillText('Урок 1: Налаштування середовища', gameCanvas.value.width / 2, gameCanvas.value.height / 2)

    // Draw instruction
    ctx.fillStyle = '#95a5a6'
    ctx.font = '18px Arial'
    ctx.fillText('Canvas готовий для розробки!', gameCanvas.value.width / 2, gameCanvas.value.height / 2 + 50)

    // Draw demo square
    ctx.fillStyle = '#e74c3c'
    ctx.fillRect(gameCanvas.value.width / 2 - 25, gameCanvas.value.height / 2 + 80, 50, 50)

    // Draw square border
    ctx.strokeStyle = '#f39c12'
    ctx.lineWidth = 3
    ctx.strokeRect(gameCanvas.value.width / 2 - 25, gameCanvas.value.height / 2 + 80, 50, 50)
}

// Game loop
function gameLoop(currentTime) {
    if (!isAnimating.value) return

    // Calculate FPS
    frameCount.value++
    if (currentTime - lastFPSUpdate >= 1000) {
        currentFPS.value = Math.round((frameCount.value * 1000) / (currentTime - lastFPSUpdate))
        frameCount.value = 0
        lastFPSUpdate.value = currentTime
    }

    // Draw frame
    drawWelcomeMessage()

    // Continue loop
    animationId.value = requestAnimationFrame(gameLoop)
}

// Toggle animation
function toggleAnimation() {
    isAnimating.value = !isAnimating.value

    if (isAnimating.value) {
        gameStatus.value = 'Анімація запущена'
        lastFrameTime.value = performance.now()
        lastFPSUpdate.value = performance.now()
        frameCount.value = 0
        animationId.value = requestAnimationFrame(gameLoop)
    } else {
        gameStatus.value = 'Анімація зупинена'
        if (animationId.value) {
            cancelAnimationFrame(animationId.value)
        }
    }
}

// Lifecycle hooks
onMounted(() => {
    console.log('🚀 Компонент змонтований, ініціалізуємо гру...')
    initGame()
})

onUnmounted(() => {
    if (animationId.value) {
        cancelAnimationFrame(animationId.value)
    }
})
</script>

<style scoped>
.lesson-container {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: #2c3e50;
    color: white;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
}

h1 {
    color: #3498db;
    margin-bottom: 10px;
}

.lesson-info {
    background-color: #34495e;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.lesson-info ul {
    text-align: left;
    display: inline-block;
}

.game-canvas {
    border: 3px solid #3498db;
    border-radius: 8px;
    background-color: #000;
    display: block;
    margin: 0 auto;
}

.controls {
    margin-top: 20px;
    background-color: #34495e;
    padding: 15px;
    border-radius: 8px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.game-controls {
    margin: 20px 0;
}

.control-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 0 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.control-btn:hover {
    background-color: #2980b9;
}

.debug-info {
    background-color: #2c3e50;
    padding: 10px;
    border-radius: 5px;
    margin-top: 15px;
    text-align: left;
}

.debug-info p {
    margin: 5px 0;
}
</style>
