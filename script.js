const frog = document.getElementById('frog');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('currentScore');
const pointSound = document.getElementById('pointSound');
const restartButton = document.getElementById('restartButton');
const playButton = document.getElementById('playButton');
const highScoreDisplay = document.getElementById('highScore');
const loseSound = document.getElementById('loseSound');
const backgroundSound = document.getElementById('backgroundSound');

backgroundSound.volume = 0.2;

let isJumping = false;
let gravity = 1;
let jumpHeight = 80;
let isGameOver = true;
let score = 0;
let obstacleSpeed = 2;
let gameLoopInterval;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping && !isGameOver) {
        jump();
    }
});

function jump() {
    let position = 0;
    isJumping = true;

    let upTimer = setInterval(function() {
        if (position >= jumpHeight) {
            clearInterval(upTimer);
            let downTimer = setInterval(function() {
                if (position <= 0) {
                    clearInterval(downTimer);
                    isJumping = false;
                }
                position -= 5;
                frog.style.bottom = position + 'px';
                frog.style.background = "url('frog1.png') no-repeat center center / contain";
            }, 20);
        } else {
            position += 5;
            frog.style.bottom = position + 'px';
            frog.style.background = "url('frog1.png') no-repeat center center / contain";
        }
    }, 20);
}

function checkCollision() {
    const frogRect = frog.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    const frogPadding = 10;
    const obstaclePadding = 15;

    const frogCollisionRect = {
        left: frogRect.left + frogPadding,
        top: frogRect.top + frogPadding,
        right: frogRect.right - frogPadding,
        bottom: frogRect.bottom - frogPadding
    };

    const obstacleCollisionRect = {
        left: obstacleRect.left + obstaclePadding,
        top: obstacleRect.top + obstaclePadding,
        right: obstacleRect.right - obstaclePadding,
        bottom: obstacleRect.bottom - obstaclePadding
    };

    if (
        frogCollisionRect.left < obstacleCollisionRect.right &&
        frogCollisionRect.right > obstacleCollisionRect.left &&
        frogCollisionRect.top < obstacleCollisionRect.bottom &&
        frogCollisionRect.bottom > obstacleCollisionRect.top
    ) {
        gameOver();
    }
}

function playLoseSound() {
    loseSound.play();
}

function gameOver() {

    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    
    clearInterval(gameLoopInterval);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverMessage').classList.remove('hidden');
    isGameOver = true;
    saveHighScore(score);
    displayHighScore();
}

function resetGame() {
    document.getElementById('gameOverMessage').classList.add('hidden');

    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    isJumping = false;
    frog.style.bottom = '0px';
    obstacle.style.right = '0px';
    obstacle.style.animation = 'none';
    obstacle.offsetHeight;
    obstacle.style.animation = `move ${obstacleSpeed}s infinite linear`;

    startGameLoop();

    backgroundSound.play();
    backgroundSound.reset()
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    if (score % 100 === 0) {
        pointSound.play();
    }
}

restartButton.addEventListener('click', function() {
    location.reload();
});

playButton.addEventListener('click', function() {
    if (isGameOver) {
        playButton.style.display = 'none';
        document.querySelector('.background').classList.remove('paused');
        resetGame();
        displayHighScore();
    }
});

function startGameLoop() {
    gameLoopInterval = setInterval(function() {
        if (!isGameOver) {
            checkCollision();
            updateScore();
        }
    }, 100);
}

function saveHighScore(score) {
    const highScore = loadHighScore();
    if (score > highScore) {
        localStorage.setItem('highScore', score);
    }
}

function loadHighScore() {
    const highScore = localStorage.getItem('highScore');
    return highScore ? parseInt(highScore) : 0;
}

function displayHighScore() {
    const highScore = loadHighScore();
    highScoreDisplay.textContent = highScore;
}

window.onload = function() {
    displayHighScore();
    backgroundSound.play();
};

startGameLoop();
