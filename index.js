//game area control
gameWidth = 640;
gameHeight = 480;
balls = [];
bricks = [];
let verticalPlatformActive = false;
let pause = false;
let gameStarted = false;
let gameLost = false;
let score = 0;
let time = 0;
let gameType = 0; //0-bricks pushing down //1-bricks reappearing
deadBricksID = [];
let brokenBTypeBricksCounter = 0;
let brokenATypeBricksCounter = 0;
boosts =[];
let platformHorizontal;
let platformVertical;
platformHorizontalWidthBase = 128;
platformHorizontalWidthWide = Math.floor(platformHorizontalWidthBase * 1.2);
platformHorizontalWidthNarrow = Math.floor(platformHorizontalWidthBase * 0.8);

DOWNLOAD_SCORES = 'http://uczelnia.secdev.pl/Testing/Download_Scores';
topScores = [];
sortedTopScores = [];





let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        pause = false;
        gameStarted = true;
        this.canvas.width = gameWidth;
        this.canvas.height = gameHeight;
        document.getElementById("hideThis").hidden = true;
        document.getElementById("temp").appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        interval =  setInterval(updateGameArea, 1000 / 50);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }
}

function gameStart() {
    if(!gameStarted) {
        platformHorizontal = new Platform(128, 23, 256, 457, "red");
        if(verticalPlatformActive) {
            platformVertical = new Platform(23, 100, 0, 170, "red");
        }
        spawnBall();
        loadBricks();
        myGameArea.start();
        document.getElementById("startButton").innerText = "RESTART";
    } else if(gameStarted) {
        window.location.reload();
    }


}


function updateGameArea() {
    if(pause ||gameLost) {
        //do nothing
    } else {
        myGameArea.clear()
        drawBackground();
        showTime();
        showScore();
        adjustPlatformWidth();
        drawx2();
        drawx5();
        drawReversed();
        this.checkPlatformClipping();
        platformHorizontal.newPosition();
        platformHorizontal.update();
        if(verticalPlatformActive) {
            platformVertical.newPosition();
            platformVertical.update();
        }

        for(let i=0; i < this.bricks.length; i++) {
            if(this.bricks[i].alive) {
                this.bricks[i].update();
            }
        }

        for (let i=0; i<this.balls.length; i++) {
            if(this.balls[i].alive) {
                if(verticalPlatformActive) {
                    this.balls[i].verticalPlatformCollision(platformVertical.x + platformVertical.width, platformVertical.y, platformVertical.height);
                }

                this.balls[i].horizontalPlatformCollision(platformHorizontal.y, platformHorizontal.x, platformHorizontal.width);
                this.balls[i].topWallCollision();
                if(this.balls[i].leftWallCollision(verticalPlatformActive)){
                    balls[i].alive = false;
                }
                this.balls[i].rightWallCollision();
                if(this.balls[i].bottomWallCollision()) {
                    balls[i].alive = false;
                }
                for(let j=0; j<this.bricks.length; j++) {
                    collisionBrick(this.balls[i], this.bricks[j]);
                }
                this.balls[i].newPosition();
                this.balls[i].update();
                }

            // for (let j =0; j < this.balls.length; j++) {
            //     if(i===j) {
            //         //nothing
            //     } else {
            //         ballWithBallCollision(this.balls[i], this.balls[j]);
            //     }
            // }
            }

        if(gameType === 0) {
            if(((time/50)%30 === 0) && time !== 0) {
                addBricksRow(getRandomInt(4));
            }
        }

        if(gameType === 1) {
            reviveRandomBrick();
        }

        if(brokenBTypeBricksCounter % 5 === 0 && brokenBTypeBricksCounter !== 0) {
            addBall()
            brokenBTypeBricksCounter =0;
        }

        for(let i=0; i< this.boosts.length; i++) {
            this.boosts[i].update();
            this.boosts[i].collisionWithPlatformHorizontal();
        }

        if(!ballsAlive()) {
            gameLost = true;
            let canvas = myGameArea.canvas;
            let ctx = canvas.getContext("2d");
            ctx.font = "30px Arial";
            ctx.fillText("You lost!", 220, 50);
            saveToLocalDB();
        }

        time++;
    }

}

function verticalMoveUp() {
    if(isBoostActive(4)) {
        platformVertical.speedY = -5;
    } else {
        platformVertical.speedY = 5;
    }
}

function verticalMoveDown() {
    if(isBoostActive(4)) {
        platformVertical.speedY = 5;
    } else {
        platformVertical.speedY = -5;
    }
}

function horizontalMoveRight() {
    if(isBoostActive(4)) {
        platformHorizontal.speedX = -5;
    } else {
        platformHorizontal.speedX = 5;
    }

}

function horizontalMoveLeft() {
    if(isBoostActive(4)) {
        platformHorizontal.speedX = 5;
    } else {
        platformHorizontal.speedX = -5;
    }

}

function resetMovePlatformVertical() {
    platformVertical.speedY = 0;
}

function resetMovePlatformHorizontal() {
    platformHorizontal.speedX = 0;
}

function checkPlatformClipping() {
    //horizontal platform vs walls
    if((platformHorizontal.x + platformHorizontal.width >= 640 && platformHorizontal.speedX>0) ||
        (platformHorizontal.x <= 0 && platformHorizontal.speedX <0) ) {
        platformHorizontal.speedX = 0;
    }

    //vertical platform vs walls
    if(verticalPlatformActive)
        {if((platformVertical.y + platformVertical.height >= 480 && platformVertical.speedY>0) ||
             (platformVertical.y <= 0 && platformVertical.speedY <0) ) {
            platformVertical.speedY = 0;
         }
    }


    //horizontal vs vertical
        //todo
    //vertical vs horizontal
        //todo
}

window.addEventListener('keydown', function (event){
    if(event.keyCode === 37) {
        horizontalMoveLeft();
    } else if(event.keyCode === 39) {
        horizontalMoveRight();
    } else if(event.keyCode === 38) {
        verticalMoveDown();
    } else if(event.keyCode === 40) {
        verticalMoveUp();
    }
})

window.addEventListener('keyup', function (event){
    if(event.keyCode === 37) {
        resetMovePlatformHorizontal();
    } else if(event.keyCode === 39) {
        resetMovePlatformHorizontal();
    } else if(event.keyCode === 38) {
        resetMovePlatformVertical();
    } else if(event.keyCode === 40) {
        resetMovePlatformVertical();
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function ballsAlive() {
    let x = 0;
    for (let i = 0; i < balls.length; i++) {
        if(balls[i].alive) {
            x++;
        }
    }

    return x > 0;

}

function gamePause() {
    if(!gameLost) {
        if(gameStarted) {
            pause = !pause;
            if(pause) {
                let canvas = myGameArea.canvas;
                let ctx = canvas.getContext("2d");
                ctx.font = "30px Arial";
                ctx.fillText("Game paused!", 240, 50);
                let btn = document.getElementById("pauseButton").innerText = "Unpause";
            } else {
                let btn = document.getElementById("pauseButton").innerText = "Pause";
            }
        }
    }
}

function activateVerticalPlatform() {
    if(!gameLost && !gameStarted && !pause) {
        verticalPlatformActive = !verticalPlatformActive;
        if (verticalPlatformActive) {
            platformVertical = new Platform(23, 128, 0, 270, "red");
        } else {
            platformVertical = null;
        }
        let text = "";
        if (verticalPlatformActive) text = "Vertical platform: ON";
        if (!verticalPlatformActive) text = "Vertical platform: OFF";
        let btn = document.getElementById("verticalPlatformButton").innerText = text;
    }
}

function changeGameType() {
        if(!gameLost && !gameStarted && !pause) {
            let text = "";
            if(gameType === 0) {
                gameType = 1;
                text = "Game type: Reappearing";
            } else if(gameType === 1) {
                gameType = 0;
                text = "Game type: Pushing down";
            }
            let btn = document.getElementById("gameTypeButton").innerText = text;
        }

}

function showScore() {
    let canvas = myGameArea.canvas;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.font = "14px Arial";
    ctx.fillText("Score: " + score, 550, 15);
}

function showTime() {
    let showTimeCurrent = Math.floor(time/50);
    let canvas = myGameArea.canvas;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.font = "14px Arial";
    ctx.fillText("Time: " + showTimeCurrent, 550, 30);
}

function drawBackground() {
    let canvas = myGameArea.canvas;
    let ctx = canvas.getContext("2d");
    let image = new Image();
    image.src = 'back.bmp';
    ctx.drawImage(image, 0, 0);
}



function loadBricks() {
    this.bricks.push(new Brick( 70, 100, "blue", 1, 1));
    this.bricks.push(new Brick(120, 100, "blue", 1, 2));
    this.bricks.push(new Brick(170, 100, "blue", 1, 1));
    this.bricks.push(new Brick(220, 100, "blue", 1, 2));
    this.bricks.push(new Brick(270, 100, "blue", 1, 1));
    this.bricks.push(new Brick(320, 100, "blue", 1, 2));
    this.bricks.push(new Brick(370, 100, "blue", 1, 1));
    this.bricks.push(new Brick(420, 100, "blue", 1, 2));
    this.bricks.push(new Brick(470, 100, "blue", 1, 1));
    this.bricks.push(new Brick(520, 100, "blue", 1, 2));

    this.bricks.push(new Brick( 70, 120, "yellow", 1, 1));
    this.bricks.push(new Brick(120, 120, "yellow", 1, 2));
    this.bricks.push(new Brick(170, 120, "yellow", 1, 1));
    this.bricks.push(new Brick(220, 120, "yellow", 1, 2));
    this.bricks.push(new Brick(270, 120, "yellow", 1, 1));
    this.bricks.push(new Brick(320, 120, "yellow", 1, 2));
    this.bricks.push(new Brick(370, 120, "yellow", 1, 1));
    this.bricks.push(new Brick(420, 120, "yellow", 1, 2));
    this.bricks.push(new Brick(470, 120, "yellow", 1, 1));
    this.bricks.push(new Brick(520, 120, "yellow", 1, 2));

    this.bricks.push(new Brick( 70, 140, "purple", 1, 2));
    this.bricks.push(new Brick(120, 140, "purple", 1, 1));
    this.bricks.push(new Brick(170, 140, "purple", 1, 2));
    this.bricks.push(new Brick(220, 140, "purple", 1, 1));
    this.bricks.push(new Brick(270, 140, "purple", 1, 2));
    this.bricks.push(new Brick(320, 140, "purple", 1, 1));
    this.bricks.push(new Brick(370, 140, "purple", 1, 2));
    this.bricks.push(new Brick(420, 140, "purple", 1, 1));
    this.bricks.push(new Brick(470, 140, "purple", 1, 2));
    this.bricks.push(new Brick(520, 140, "purple", 1, 1));
}

function addBricksRow(number) {
    for(let i=0; i < this.bricks.length; i++) {
        this.bricks[i].moveDown(20);
    }
    let color = "";
    if(number === 0) {
        color = "green";
    } else if(number === 1) {
        color = "yellow";
    } else if(number === 2) {
        color = "blue";
    } else if(number === 3) {
        color = "purple";
    }

    this.bricks.push(new Brick( 70, 100, color, 1, 1));
    this.bricks.push(new Brick(120, 100, color, 1, 2));
    this.bricks.push(new Brick(170, 100, color, 1, 1));
    this.bricks.push(new Brick(220, 100, color, 1, 2));
    this.bricks.push(new Brick(270, 100, color, 1, 1));
    this.bricks.push(new Brick(320, 100, color, 1, 2));
    this.bricks.push(new Brick(370, 100, color, 1, 1));
    this.bricks.push(new Brick(420, 100, color, 1, 2));
    this.bricks.push(new Brick(470, 100, color, 1, 1));
    this.bricks.push(new Brick(520, 100, color, 1, 2));
}

function reviveRandomBrick() {
    for(let i=0; i <this.bricks.length; i++) {
        if(this.bricks[i].alive === false) {
            this.deadBricksID.push(i);
        }
    }


     if(this.deadBricksID.length > 5) {
         if (((time / 50) % 3 === 0) && time !== 0) {
             let temp = getRandomInt(this.deadBricksID.length);
             let temp2 = this.deadBricksID[temp];
             this.bricks[temp2].alive = true;
         }
     }

     if(this.deadBricksID.length > 25) {
         let temp = getRandomInt(this.deadBricksID.length);
         let temp2 = this.deadBricksID[temp];
         this.bricks[temp2].alive = true;
     }


     this.deadBricksID = [];
}

function spawnBall() {
    this.balls.push(new GameBall(200 + getRandomInt(200), 300, 8, "green", 3, getRandomInt(2)));
}

function addBall() {
    this.balls.push(new GameBall(40 + getRandomInt(10), 300, 8, "green", 3, getRandomInt(2)));
}

function collisionBrick(ball, brick) {
    if(brick.alive){
        if((ball.y - ball.radius <= brick.y + brick.height)
            && (ball.y + ball.radius >= brick.y)
                && (ball.x >= brick.x)
                    && (ball.x <= brick.x + brick.width)) {

            ball.speedY *= -1;
            brick.alive = false;
            addScore();
            if(brick.type === 2) {
                brokenBTypeBricksCounter++;
            }
            if(brick.type === 1) {
                brokenATypeBricksCounter++;
            }
            if(brokenATypeBricksCounter%5 === 0 && brokenATypeBricksCounter !== 0) {
                this.boosts.push(new Boost(getRandomInt(5), brick.x, brick.y, brick.color));
                brokenATypeBricksCounter =0;
            }

        } else if ((ball.x - ball.radius <= brick.x + brick.width)
                    && (ball.x + ball.radius >= brick.x)
                        && (ball.y <= brick.y + brick.height)
                            && (ball.y >= brick.y)) {

            ball.speedX *= -1;
            brick.alive = false;
            addScore();
            if(brick.type === 1) {
                brokenATypeBricksCounter++;
            }
            if(brokenATypeBricksCounter%5 === 0 && brokenATypeBricksCounter !== 0) {
                this.boosts.push(new Boost(3, brick.x, brick.y, brick.color));
                brokenATypeBricksCounter =0;
            }
        }
    }
}

function ballWithBallCollision(ballA, ballB) {
    if((Math.abs(ballA.x- ballB.x) + Math.abs(ballA.y - ballB.y)) <= 16) {
        let tempX = ballA.speedX;
        let tempY = ballA.speedY;
        ballA.speedX = ballB.speedX;
        ballA.speedY = ballB.speedY;
        ballB.speedX = tempX;
        ballB.speedY = tempY;
    }
}

function addScore() {
    let base = 1;
    if(isBoostActive(0)) { // x5 boost
        base*=5;
    }

    if(isBoostActive(1)) { // x2 boost
        base*=2;
    }

    score +=base;
}

function adjustPlatformWidth() {
    if(isBoostActive(2) && isBoostActive(3)) {
        if(activeBoosts[2].activeTimeStart > activeBoosts[3].activeTimeStart) {
            platformHorizontal.width = platformHorizontalWidthWide;
        } else {
            platformHorizontal.width = platformHorizontalWidthNarrow;
        }
    } else if(isBoostActive(2)) {
        platformHorizontal.width = platformHorizontalWidthWide;
    } else if(isBoostActive(3)) {
        platformHorizontal.width = platformHorizontalWidthNarrow;
    } else {
        platformHorizontal.width = platformHorizontalWidthBase;
    }
}





