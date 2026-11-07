const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bullets = [];
let stars = [];
let enemies = [];

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
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
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

// All mouse click handling
canvas.addEventListener('click', (event) => {

    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    // RESTART button
    if (
        gameOver &&
        mouseX >= canvas.width / 2 - 75 &&
        mouseX <= canvas.width / 2 + 75 &&
        mouseY >= canvas.height / 2 + 90 &&
        mouseY <= canvas.height / 2 + 135
    ) {
        restartGame();
        return;
    }

    // PLAY button
    if (
        gameState === 'menu' &&
        mouseX >= canvas.width / 2 - 90 &&
        mouseX <= canvas.width / 2 + 90 &&
        mouseY >= canvas.height / 2 + 50 &&
        mouseY <= canvas.height / 2 + 100
    ) {
        gameState = 'playing';
        return;
    }

    // CONTROLS button
    if (
        gameState === 'menu' &&
        mouseX >= canvas.width / 2 - 90 &&
        mouseX <= canvas.width / 2 + 90 &&
        mouseY >= canvas.height / 2 + 120 &&
        mouseY <= canvas.height / 2 + 170
    ) {
        gameState = 'controls';
        return;
    }

    // BACK button
    if (
        gameState === 'controls' &&
        mouseX >= canvas.width / 2 - 60 &&
        mouseX <= canvas.width / 2 + 60 &&
        mouseY >= 430 &&
        mouseY <= 470
    ) {
        gameState = 'menu';
        return;
    }
});

// Draw player spaceship
function drawPlayer() {

    ctx.fillStyle = '#00f5ff';

    ctx.beginPath();
    ctx.moveTo(playerX, playerY - 30);
    ctx.lineTo(playerX - 25, playerY + 20);
    ctx.lineTo(playerX + 25, playerY + 20);
    ctx.closePath();

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f5ff';

    ctx.fill();

    ctx.fillStyle = '#ff40d6';

    ctx.beginPath();
    ctx.moveTo(playerX - 10, playerY + 20);
    ctx.lineTo(playerX + 10, playerY + 20);
    ctx.lineTo(playerX, playerY + flameSize);
    ctx.closePath();

    ctx.fill();

    ctx.shadowBlur = 0;
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

    ctx.fillStyle = '#ff40d6';

    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);

    ctx.fill();
}

// Game Over screen
function drawGameOver() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff40d6';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';

    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff40d6';

    ctx.fillText(
        'GAME OVER',
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.fillStyle = '#00f5ff';
    ctx.font = '24px Arial';

    ctx.fillText(
        'Final Score: ' + score,
        canvas.width / 2,
        canvas.height / 2 + 50
    );

    // RESTART button
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f5ff';

    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        canvas.width / 2 - 75,
        canvas.height / 2 + 90,
        150,
        45
    );

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#080816';
    ctx.font = 'bold 20px Arial';

    ctx.fillText(
        'RESTART',
        canvas.width / 2,
        canvas.height / 2 + 120
    );

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.textAlign = 'left';
}

// Restart game
function restartGame() {

    score = 0;
    health = 100;
    gameOver = false;

    bullets = [];
    enemies = [];

    shootCooldown = 0;
    enemySpawnTimer = 0;

    playerX = 450;
    playerY = 400;

    flameSize = 40;
    flameDirection = 1;

    keys = {};

    gameState = 'playing';

    gameLoop();
}

// Main menu
function drawMenu() {

    ctx.fillStyle = '#080816';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // STARFALL title
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'STARFALL',
        canvas.width / 2,
        canvas.height / 2
    );

    // PLAY button
    ctx.fillStyle = '#00f5ff';

    ctx.fillRect(
        canvas.width / 2 - 90,
        canvas.height / 2 + 50,
        180,
        50
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 24px Arial';

    ctx.fillText(
        'PLAY',
        canvas.width / 2,
        canvas.height / 2 + 82
    );

    // CONTROLS button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        canvas.width / 2 - 90,
        canvas.height / 2 + 120,
        180,
        50
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 24px Arial';

    ctx.fillText(
        'CONTROLS',
        canvas.width / 2,
        canvas.height / 2 + 152
    );

    ctx.textAlign = 'left';
}

// Controls screen
function drawControls() {

    ctx.fillStyle = '#080816';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
        'CONTROLS',
        canvas.width / 2,
        canvas.height / 2 - 100
    );

    ctx.fillText('W / ↑ - Move Up', canvas.width / 2, 230);
    ctx.fillText('S / ↓ - Move Down', canvas.width / 2, 270);
    ctx.fillText('A / ← - Move Left', canvas.width / 2, 310);
    ctx.fillText('D / → - Move Right', canvas.width / 2, 350);
    ctx.fillText('SPACE - Shoot', canvas.width / 2, 390);

    // BACK button
    ctx.fillStyle = '#ff40d6';

    ctx.fillRect(
        canvas.width / 2 - 60,
        430,
        120,
        40
    );

    ctx.fillStyle = '#080816';
    ctx.font = 'bold 20px Arial';

    ctx.fillText(
        'BACK',
        canvas.width / 2,
        456
    );

    ctx.textAlign = 'left';
}

// Main game loop
function gameLoop() {

    if (gameState === 'menu') {
        drawMenu();
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameState === 'controls') {
        drawControls();
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameOver) {
        drawGameOver();
        return;
    }

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
        Math.min(canvas.width - 25, playerX)
    );

    playerY = Math.max(
        30,
        Math.min(canvas.height - 20, playerY)
    );

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'left';

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 35);

    // Health
    ctx.fillStyle = '#ff40d6';
    ctx.font = '24px Arial';
    ctx.fillText('Health: ' + health, 20, 65);

    // Stars
    for (let star of stars) {

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        drawStar(star);
    }

    // Bullets
    for (let bullet of bullets) {

        bullet.y -= bullet.speed;

        drawBullet(bullet);
    }

    bullets = bullets.filter(bullet => bullet.y >= 0);

    // Enemy spawning
    if (enemySpawnTimer <= 0) {

        enemies.push({
            x: Math.random() * canvas.width,
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

    enemies = enemies.filter(enemy => enemy.y < canvas.height);

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

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 17) {

                enemyHit = true;
                bullet.hit = true;

                score += 10;
            }
        }

        if (!enemyHit) {
            remainingEnemies.push(enemy);
        }
    }

    remainingBullets = bullets.filter(bullet => !bullet.hit);

    bullets = remainingBullets;
    enemies = remainingEnemies;

    // Player-enemy collision
    let survivingEnemies = [];

    for (let enemy of enemies) {

        let dx = enemy.x - playerX;
        let dy = enemy.y - playerY;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 35) {

            health = Math.max(0, health - 20);

        } else {

            survivingEnemies.push(enemy);
        }
    }

    enemies = survivingEnemies;

    if (health <= 0) {
        gameOver = true;
    }

    // Flame animation
    flameSize += flameDirection;

    if (flameSize === 50) {
        flameDirection = -1;
    }

    if (flameSize === 30) {
        flameDirection = 1;
    }

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
