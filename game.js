
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Original game coordinate system
const GAME_WIDTH = 900;
const GAME_HEIGHT = 500;

// Canvas resolution and scaling
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    ctx.setTransform(
        canvas.width / GAME_WIDTH,
        0,
        0,
        canvas.height / GAME_HEIGHT,
        0,
        0
    );
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Images
const playerImage = new Image();
playerImage.src = 'assets/spaceship.png';

const enemyImage = new Image();
enemyImage.src = 'assets/enemy.png';

// Game variables
let bullets = [];
let stars = [];
let enemies = [];
let explosions = [];

let score = 0;
let health = 100;
let gameOver = false;

let shootCooldown = 0;
let enemySpawnTimer = 0;

let flameSize = 40;
let flameDirection = 1;

let playerX = 450;
let playerY = 400;
let playerSpeed = 5;

let gameState = 'menu';
let keys = {};

// Generate stars
for (let index = 0; index < 100; index++) {
    stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 2 + 1
    });
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;

    if (event.code === 'Space') {
        event.preventDefault();
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Mouse click handling
canvas.addEventListener('click', (event) => {

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) * GAME_WIDTH / rect.width;

    const mouseY =
        (event.clientY - rect.top) * GAME_HEIGHT / rect.height;

    // RESTART button
    if (
        gameOver &&
        mouseX >= GAME_WIDTH / 2 - 75 &&
        mouseX <= GAME_WIDTH / 2 + 75 &&
        mouseY >= GAME_HEIGHT / 2 + 90 &&
        mouseY <= GAME_HEIGHT / 2 + 135
    ) {
        restartGame('playing');
        return;
    }

    // PLAY button
    if (
        gameState === 'menu' &&
        mouseX >= GAME_WIDTH / 2 - 90 &&
        mouseX <= GAME_WIDTH / 2 + 90 &&
        mouseY >= GAME_HEIGHT / 2 + 50 &&
        mouseY <= GAME_HEIGHT / 2 + 100
    ) {
        gameState = 'playing';
        return;
    }

    // CONTROLS button
    if (
        gameState === 'menu' &&
        mouseX >= GAME_WIDTH / 2 - 90 &&
        mouseX <= GAME_WIDTH / 2 + 90 &&
        mouseY >= GAME_HEIGHT / 2 + 120 &&
        mouseY <= GAME_HEIGHT / 2 + 170
    ) {
        gameState = 'controls';
        return;
    }

    // BACK button
    if (
        gameState === 'controls' &&
        mouseX >= GAME_WIDTH / 2 - 60 &&
        mouseX <= GAME_WIDTH / 2 + 60 &&
        mouseY >= 430 &&
        mouseY <= 470
    ) {
        gameState = 'menu';
        return;
    }

    // PAUSE button
    if (
        gameState === 'playing' &&
        mouseX >= GAME_WIDTH - 210 &&
        mouseX <= GAME_WIDTH - 120 &&
        mouseY >= 20 &&
        mouseY <= 60
    ) {
        gameState = 'paused';
        drawPause();
        return;
    }

    // EXIT button
    if (
        gameState === 'playing' &&
        mouseX >= GAME_WIDTH - 110 &&
        mouseX <= GAME_WIDTH - 20 &&
        mouseY >= 20 &&
        mouseY <= 60
    ) {
        restartGame('menu');
        return;
    }

    // RESUME button
    if (
        gameState === 'paused' &&
        mouseX >= GAME_WIDTH / 2 - 90 &&
        mouseX <= GAME_WIDTH / 2 + 90 &&
        mouseY >= GAME_HEIGHT / 2 - 40 &&
        mouseY <= GAME_HEIGHT / 2 + 5
    ) {
        gameState = 'playing';
        return;
    }

    // PAUSE RESTART button
    if (
        gameState === 'paused' &&
        mouseX >= GAME_WIDTH / 2 - 90 &&
        mouseX <= GAME_WIDTH / 2 + 90 &&
        mouseY >= GAME_HEIGHT / 2 + 20 &&
        mouseY <= GAME_HEIGHT / 2 + 65
    ) {
        restartGame('playing');
        return;
    }

    // MAIN MENU button
    if (
        gameState === 'paused' &&
        mouseX >= GAME_WIDTH / 2 - 90 &&
        mouseX <= GAME_WIDTH / 2 + 90 &&
        mouseY >= GAME_HEIGHT / 2 + 80 &&
        mouseY <= GAME_HEIGHT / 2 + 125
    ) {
        restartGame('menu');
        return;
    }
});

// Draw player
function drawPlayer() {

    if (playerImage.complete && playerImage.naturalWidth > 0) {
        ctx.drawImage(
            playerImage,
            playerX - 30,
            playerY - 30,
            60,
            60
        );
    }
}

// Draw stars
function drawStar(star) {

    ctx.fillStyle = '#00f5ff';

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f5ff';

    ctx.fill();

    ctx.shadowBlur = 0;
}

// Draw bullets
function drawBullet(bullet) {

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bullet.x, bullet.y, 4, 15);
}

// Draw enemies
function drawEnemies(enemy) {

    ctx.shadowBlur =
        15 + Math.sin(Date.now() * 0.005) * 8;

    ctx.shadowColor = '#ff40d6';

    if (enemyImage.complete && enemyImage.naturalWidth > 0) {
        ctx.drawImage(
            enemyImage,
            enemy.x - 20,
            enemy.y - 20,
            40,
            40
        );
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

// Game Over screen
function drawGameOver() {

    ctx.fillStyle = '#080816';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#ff40d6';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff40d6';

    ctx.fillText(
        'GAME OVER',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2
    );

    ctx.fillStyle = '#00f5ff';
    ctx.font = '24px Arial';

    ctx.fillText(
        'Final Score: ' + score,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 50
    );

    // RESTART button
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f5ff';

    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        GAME_WIDTH / 2 - 75,
        GAME_HEIGHT / 2 + 90,
        150,
        45
    );

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#080816';
    ctx.font = 'bold 20px Arial';

    ctx.fillText(
        'RESTART',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 120
    );

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.textAlign = 'left';
}

// Restart game
function restartGame(nextState) {

    score = 0;
    health = 100;
    gameOver = false;

    bullets = [];
    enemies = [];
    explosions = [];

    shootCooldown = 0;
    enemySpawnTimer = 0;

    playerX = GAME_WIDTH / 2;
    playerY = 400;

    flameSize = 40;
    flameDirection = 1;

    keys = {};

    gameState = nextState;
}

// Main menu
function drawMenu() {

    ctx.fillStyle = '#080816';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // STARFALL title
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'STARFALL',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2
    );

    // PLAY button
    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        GAME_WIDTH / 2 - 90,
        GAME_HEIGHT / 2 + 50,
        180,
        50
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 24px Arial';

    ctx.fillText(
        'PLAY',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 82
    );

    // CONTROLS button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        GAME_WIDTH / 2 - 90,
        GAME_HEIGHT / 2 + 120,
        180,
        50
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 24px Arial';

    ctx.fillText(
        'CONTROLS',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 152
    );

    ctx.textAlign = 'left';
}

// Controls screen
function drawControls() {

    ctx.fillStyle = '#080816';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'CONTROLS',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 100
    );

    ctx.fillText('W / ↑ - Move Up', GAME_WIDTH / 2, 230);
    ctx.fillText('S / ↓ - Move Down', GAME_WIDTH / 2, 270);
    ctx.fillText('A / ← - Move Left', GAME_WIDTH / 2, 310);
    ctx.fillText('D / → - Move Right', GAME_WIDTH / 2, 350);
    ctx.fillText('SPACE - Shoot', GAME_WIDTH / 2, 390);

    // BACK button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        GAME_WIDTH / 2 - 60,
        430,
        120,
        40
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 20px Arial';

    ctx.fillText(
        'BACK',
        GAME_WIDTH / 2,
        456
    );

    ctx.textAlign = 'left';
}

// Pause screen
function drawPause() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#ff40d6';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'PAUSED',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 100
    );

    // RESUME button
    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        GAME_WIDTH / 2 - 90,
        GAME_HEIGHT / 2 - 40,
        180,
        45
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 18px Arial';

    ctx.fillText(
        'RESUME',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 10
    );

    // RESTART button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        GAME_WIDTH / 2 - 90,
        GAME_HEIGHT / 2 + 20,
        180,
        45
    );

    ctx.fillStyle = '#080816';

    ctx.fillText(
        'RESTART',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 50
    );

    // MAIN MENU button
    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        GAME_WIDTH / 2 - 90,
        GAME_HEIGHT / 2 + 80,
        180,
        45
    );

    ctx.fillStyle = '#080816';

    ctx.fillText(
        'MAIN MENU',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 110
    );

    ctx.textAlign = 'left';
}

// Create explosion
function createExplosion(x, y) {

    for (let i = 0; i < 12; i++) {

        explosions.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 8,
            speedY: (Math.random() - 0.5) * 8,
            alpha: 1,
            color: Math.random() < 0.5
                ? '#ff40d6'
                : '#00f5ff'
        });

    }
}

// Update explosions
function updateExplosions() {

    for (let explosion of explosions) {

        explosion.x += explosion.speedX;
        explosion.y += explosion.speedY;

        explosion.alpha -= 0.03;

    }

    explosions = explosions.filter(
        explosion => explosion.alpha > 0
    );

}

// Draw explosions
function drawExplosions() {

    for (let explosion of explosions) {

        ctx.globalAlpha = explosion.alpha;

        // Outer neon particle
        ctx.fillStyle = explosion.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = explosion.color;

        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // White inner highlight
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';

        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.size / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

// Main game loop
function gameLoop() {

    // Main menu
    if (gameState === 'menu') {
        drawMenu();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Controls screen
    if (gameState === 'controls') {
        drawControls();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Pause screen
    if (gameState === 'paused') {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Game Over
    if (gameOver) {
        drawGameOver();
        requestAnimationFrame(gameLoop);
        return;
    }

    // Clear previous frame
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.textAlign = 'left';

    // Shooting
    if (keys[' ']) {

        if (shootCooldown <= 0) {

            bullets.push({
                x: playerX,
                y: playerY - 30,
                speed: 7
            });

            shootCooldown = 10;
        }
    }

    if (shootCooldown > 0) {
        shootCooldown--;
    }

    // Player movement
    if (keys['arrowleft'] || keys['a']) {
        playerX -= playerSpeed;
    }

    if (keys['arrowright'] || keys['d']) {
        playerX += playerSpeed;
    }

    if (keys['arrowup'] || keys['w']) {
        playerY -= playerSpeed;
    }

    if (keys['arrowdown'] || keys['s']) {
        playerY += playerSpeed;
    }

    // Player boundaries
    playerX = Math.max(
        25,
        Math.min(GAME_WIDTH - 25, playerX)
    );

    playerY = Math.max(
        30,
        Math.min(GAME_HEIGHT - 20, playerY)
    );

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 35);

    // Health
    ctx.fillStyle = '#ff40d6';
    ctx.font = '24px Arial';
    ctx.fillText('Health: ' + health, 20, 65);

    // EXIT button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        GAME_WIDTH - 110,
        20,
        90,
        40
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'EXIT',
        GAME_WIDTH - 65,
        46
    );

    // PAUSE button
    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        GAME_WIDTH - 210,
        20,
        90,
        40
    );

    ctx.fillStyle = '#080816';

    ctx.fillText(
        'PAUSE',
        GAME_WIDTH - 165,
        46
    );

    ctx.textAlign = 'left';

    // Stars
    for (let star of stars) {

        star.y += star.speed;

        if (star.y > GAME_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * GAME_WIDTH;
        }

        drawStar(star);
    }

    // Bullets
    for (let bullet of bullets) {

        bullet.y -= bullet.speed;

        drawBullet(bullet);
    }

    bullets = bullets.filter(
        bullet => bullet.y >= 0
    );

    // Enemy spawning
    if (enemySpawnTimer <= 0) {

        enemies.push({
            x: Math.random() * (GAME_WIDTH - 40) + 20,
            y: 0,
            speed: Math.random() * 2 + 1
        });

        enemySpawnTimer = 60;
    }

    if (enemySpawnTimer > 0) {
        enemySpawnTimer--;
    }

    // Move and draw enemies
    for (let enemy of enemies) {

        enemy.y += enemy.speed;

        drawEnemies(enemy);
    }

    enemies = enemies.filter(
        enemy => enemy.y < GAME_HEIGHT
    );

    // Bullet-enemy collision
    let remainingBullets = [];
    let remainingEnemies = [];

    for (let enemy of enemies) {

        let enemyHit = false;

        for (let bullet of bullets) {

            if (bullet.hit) {
                continue;
            }

            let dx = bullet.x - enemy.x;
            let dy = bullet.y - enemy.y;

            let distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance < 17) {

                enemyHit = true;
                bullet.hit = true;

                createExplosion(enemy.x, enemy.y);

                score += 10;
            }
        }

        if (!enemyHit) {
            remainingEnemies.push(enemy);
        }
    }

    remainingBullets = bullets.filter(
        bullet => !bullet.hit
    );

    bullets = remainingBullets;
    enemies = remainingEnemies;

    // Player-enemy collision
    let survivingEnemies = [];

    for (let enemy of enemies) {

        let dx = enemy.x - playerX;
        let dy = enemy.y - playerY;

        let distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance < 35) {

            createExplosion(enemy.x, enemy.y);

            health = Math.max(0, health - 20);

        } else {

            survivingEnemies.push(enemy);
        }
    }

    enemies = survivingEnemies;

    // Check health
    if (health <= 0) {
        gameOver = true;
    }

    // Explosion animation
    updateExplosions();
    drawExplosions();

    // Flame animation
    flameSize += flameDirection;

    if (flameSize >= 50) {
        flameDirection = -1;
    }

    if (flameSize <= 30) {
        flameDirection = 1;
    }

    // Draw player
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
