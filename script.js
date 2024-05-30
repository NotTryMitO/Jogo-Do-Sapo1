const frog = document.getElementById('frog');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('currentScore');
const pointSound = document.getElementById('pointSound'); // Elemento de áudio
const restartButton = document.getElementById('restartButton');
const playButton = document.getElementById('playButton');
const highScoreDisplay = document.getElementById('highScore');

let isJumping = false;
let gravity = 1;
let jumpHeight = 80;
let isGameOver = true;
let score = 0;
let obstacleSpeed = 2; // Ajustável para alterar a velocidade do obstáculo
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
                position = position * gravity;
                frog.style.bottom = position + 'px';
                frog.style.background = "url('frog1.png') no-repeat center center / contain";
            }, 20);
        } else {
            position += 5;
            position = position * gravity;
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

function gameOver() {
    clearInterval(gameLoopInterval);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverMessage').classList.remove('hidden');
    isGameOver = true;
    saveHighScore(score); // Salvar pontuação mais alta
    displayHighScore(); // Atualizar exibição da pontuação mais alta
}

function resetGame() {
    // Ocultar a mensagem de game over
    document.getElementById('gameOverMessage').classList.add('hidden');

    // Resetar o estado do jogo
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    isJumping = false;
    frog.style.bottom = '0px';
    obstacle.style.right = '0px';
    obstacle.style.animation = 'none';
    obstacle.offsetHeight;
    obstacle.style.animation = `move ${obstacleSpeed}s infinite linear`;

    // Reiniciar o loop do jogo
    startGameLoop();
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    if (score % 100 === 0) {
        pointSound.play(); // Tocar o som a cada 100 pontos
    }
}

restartButton.addEventListener('click', function() {
    location.reload(); // Recarregar a página ao clicar no botão de recomeçar
});

playButton.addEventListener('click', function() {
    if (isGameOver) {
        playButton.style.display = 'none'; // Ocultar o botão "Jogar"
        document.querySelector('.background').classList.remove('paused'); // Remover a classe "paused" do elemento de fundo
        resetGame(); // Iniciar o jogo apenas se estiver no estado de game over
        displayHighScore(); // Exibir o recorde de pontos
    }
});

function startGameLoop() {
    gameLoopInterval = setInterval(function() {
        if (!isGameOver) {
            checkCollision();
            updateScore();
        }
    }, 100); // Verificar colisões e atualizar pontuação a cada 100ms
}

// Função para salvar o recorde de pontos
function saveHighScore(score) {
    const highScore = loadHighScore();
    if (score > highScore) {
        localStorage.setItem('highScore', score);
    }
}

function loadHighScore() {
    // Verifica se há um recorde de pontos armazenado em localStorage
    const highScore = localStorage.getItem('highScore');

    // Se não houver um recorde de pontos armazenado, retorna 0
    // Caso contrário, retorna o valor do recorde de pontos
    return highScore ? parseInt(highScore) : 0;
}

function displayHighScore() {
    const highScore = loadHighScore();
    highScoreDisplay.textContent = highScore;
}

window.onload = function() {
    displayHighScore();
};

startGameLoop();