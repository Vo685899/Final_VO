let gameStarted = false;

class Snake {
    constructor() {
        this.headX = floor(width / 2);
        this.headY = floor(height / 2);
        this.tail = [];
        this.total = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.obstacles = [];
    }

    setDirection(x, y) {
        this.xSpeed = x;
        this.ySpeed = y;
    }

    eat(pos) {
        return this.headX === pos.x && this.headY === pos.y;
    }

    move() {
        if (this.total === this.tail.length) {
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1].slice();
            }
        }

        if (this.total > 0) {
            this.tail[this.total - 1] = [this.headX, this.headY];
        }

        this.headX += this.xSpeed * gridSize;
        this.headY += this.ySpeed * gridSize;
        this.headX = constrain(this.headX, 0, width - gridSize);
        this.headY = constrain(this.headY, 0, height - gridSize);
    }

    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            let segment = this.tail[i];
            if (this.headX === segment[0] && this.headY === segment[1]) {
                this.gameOver();
            }
        }
    }

    checkObstacleCollision() {
        for (let obstacle of this.obstacles) {
            if (this.headX === obstacle.x && this.headY === obstacle.y) {
                this.gameOver();
            }
        }
    }

    generateObstacle() {
        let obstacleX = floor(random(width / gridSize)) * gridSize;
        let obstacleY = floor(random(height / gridSize)) * gridSize;
        let lifespan = 100; 

        this.obstacles.push({ x: obstacleX, y: obstacleY, lifespan: lifespan });
    }

    gameOver() {
        gameOver = true;
    }

    update() {
        
    }

    display() {
        fill(0, 255, 0); //Snake colo
        noStroke();

        ellipse(this.headX + gridSize / 2, this.headY + gridSize / 2, gridSize, gridSize);

        fill(0); // Eye color
        let eyeSize = gridSize / 5;
        ellipse(this.headX + gridSize / 2.8, this.headY + gridSize / 2.5, eyeSize, eyeSize);

        for (let i = 0; i < this.total; i++) {
            fill(0, 255, 0); // Green color
            ellipse(this.tail[i][0] + gridSize / 2, this.tail[i][1] + gridSize / 2, gridSize, gridSize);
        }
    }

    displayObstacles() {
        fill(0); // Black obstacles
        noStroke();

        for (let obstacle of this.obstacles) {
            rect(obstacle.x, obstacle.y, gridSize, gridSize);

            obstacle.lifespan--;
        }

        this.obstacles = this.obstacles.filter((obstacle) => obstacle.lifespan > 0);
    }

    reset() {
        this.headX = floor(width / 2);
        this.headY = floor(height / 2);
        this.tail = [];
        this.total = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.obstacles = [];
        score = 0;
    }
}

let snake;
let food;
let gridSize = 20;
let score = 0;
let highScore;
let gameOver = false;

function setup() {
    createCanvas(400, 400);
    frameRate(10);
    snake = new Snake();
    createNewFood();
    highScore = localStorage.getItem("highScore");
    if (highScore === null) {
        highScore = 0;
    }
}

function draw() {
    background(255);

    if (!gameStarted) {
        drawIntroduction();
    } else if (gameOver) {
        drawGameOver();
    } else {
        snake.move();
        snake.checkCollision();
        snake.checkObstacleCollision();
        snake.update();
        snake.display();

        if (snake.eat(food)) {
            createNewFood();
            snake.total++;
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
        }

        snake.displayObstacles();
        if (frameCount % 60 === 0) {
            snake.generateObstacle();
        }

        drawFood();
        drawScore();
        drawHighScore();
    }
}

function keyPressed() {
    if (!gameStarted) {
        if (keyCode === ENTER) {
            gameStarted = true;
        }
    } else if (gameOver) {
        if (keyCode === ENTER) {
            restartGame();
        }
    } else {
        if (keyCode === UP_ARROW && snake.ySpeed === 0) {
            snake.setDirection(0, -1);
        } else if (keyCode === DOWN_ARROW && snake.ySpeed === 0) {
            snake.setDirection(0, 1);
        } else if (keyCode === LEFT_ARROW && snake.xSpeed === 0) {
            snake.setDirection(-1, 0);
        } else if (keyCode === RIGHT_ARROW && snake.xSpeed === 0) {
            snake.setDirection(1, 0);
        }
    }
}

function drawIntroduction() {
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text('Welcome to Snake Game!', width / 2, height / 2 - 40);
    textSize(16);
    text('Use arrow keys to control the snake.', width / 2, height / 2 - 20);
    text('Eat circles (food) to grow longer.', width / 2, height / 2);
    text('Avoid squares (obstacles) to stay alive.', width / 2, height / 2 + 20);
    text('Press ENTER to start the game.', width / 2, height / 2 + 60);
}


function createNewFood() {
    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);

    // Generate new food position so no overlap with snake
    do {
        food = {
            x: floor(random(cols)) * gridSize,
            y: floor(random(rows)) * gridSize,
            diameter: gridSize,
            color: color(random(255), random(255), random(255)),
        };
    } while (snakeCollidesWith(food) || obstacleCollidesWith(food));

}

function generateObstacle() {
    let obstacleX, obstacleY;

    // Generate new obstacle position so no overlap with the snake obstacles
    do {
        obstacleX = floor(random(width / gridSize)) * gridSize;
        obstacleY = floor(random(height / gridSize)) * gridSize;
    } while (snakeCollidesWith({ x: obstacleX, y: obstacleY }) || obstacleCollidesWith({ x: obstacleX, y: obstacleY }));

    let lifespan = 100; // lifespan

    this.obstacles.push({ x: obstacleX, y: obstacleY, lifespan: lifespan });
}

function snakeCollidesWith(pos) {
    return (
        pos.x === snake.headX && pos.y === snake.headY ||
        snake.tail.some(segment => segment[0] === pos.x && segment[1] === pos.y)
    );
}

function obstacleCollidesWith(pos) {
    return snake.obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
}

function drawFood() {
    fill(food.color);
    noStroke();
    ellipse(food.x + food.diameter / 2, food.y + food.diameter / 2, food.diameter, food.diameter);
}

function drawScore() {
    fill(0);
    textSize(16);
    textAlign(RIGHT);
    text('Score: ' + score, width - 10, 20);
}

function drawHighScore() {
    fill(0);
    textSize(16);
    textAlign(RIGHT);
    text('High Score: ' + highScore, width - 10, 40);
}

function drawGameOver() {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text('You Died!', width / 2, height / 2 - 20);
    textSize(16);
    text('Press ENTER to Restart', width / 2, height / 2 + 20);
}

function restartGame() {
    gameOver = false;
    snake.reset();
    score = 0;
    createNewFood();
}

