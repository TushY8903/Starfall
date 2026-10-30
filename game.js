const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let star = {
    x: 100,
    y: 50,
    speed: 2
};

let bullets = [];

let stars = [];

let shootCooldown = 0;

let flameSize = 40;
let flameDirection = 1;

let playerX = 450;
let playerY = 400;
let playerSpeed = 5;

let keys = {};

for (let index = 0; index < 100; index++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 2 + 1
    });
    
}

document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;

    if (event.code === 'Space' && !event.repeat) {
        bullets.push({
            x: playerX,
            y: playerY - 30,
            speed: 7
        });
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
})

function drawPlayer() {

    ctx.fillStyle = '#00f5ff';
    
    ctx.beginPath();
    ctx.moveTo(playerX, playerY - 30);
    ctx.lineTo(playerX - 25, playerY + 20);
    ctx.lineTo(playerX + 25, playerY + 20);
    ctx.closePath();

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00f5ff";
    
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

function drawStar(star) {
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f5ff";
    
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawBullet(bullet) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.fillRect(bullet.x, bullet.y, 4, 15);
}

function gameLoop() {
    if(keys[' ']) {
        if(shootCooldown <= 0) {
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

    if(keys['arrowleft'] || keys['a']) {
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

    playerX = Math.max(25, Math.min(canvas.width - 25, playerX));
    playerY = Math.max(30, Math.min(canvas.height - 20, playerY));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        drawStar(star);
    }

    for (let bullet of bullets) {
        bullet.y -= bullet.speed;

        
        drawBullet(bullet);
    }
    bullets = bullets.filter(bullet => bullet.y >= 0);

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