const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = 450;
let playerY = 400;
let playerSpeed = 5;

let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
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
    
    ctx.fill();
}

function gameLoop() {
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

    drawPlayer();

    requestAnimationFrame(gameLoop);
}
gameLoop();