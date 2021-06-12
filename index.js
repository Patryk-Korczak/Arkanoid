//game area control
gameWidth = 640;
gameHeight = 480;
balls = [];
let verticalPlatformActive = false;
let pause = false;
let gameStarted = false;
let gameLost = false;
let score = 0;
let time = 0;




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
        interval =  setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }
}

function gameStart() {
    if(!gameStarted) {
        this.platformHorizontal = new Platform(128, 23, 256, 457, "red");
        if(verticalPlatformActive) {
            this.platformVertical = new Platform(23, 100, 0, 170, "red");
        }
        this.balls.push(new GameBall(200 + getRandomInt(200), 300, 8, "blue", 3, getRandomInt(2)));
        this.balls.push(new GameBall(200 + getRandomInt(200), 300, 8, "blue", 3, getRandomInt(2)));
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
        this.checkPlatformClipping();
        this.platformHorizontal.newPosition();
        this.platformHorizontal.update();
        if(verticalPlatformActive) {
            this.platformVertical.newPosition();
            this.platformVertical.update();
        }

        for (let i=0; i<this.balls.length; i++) {
            if(balls[i].alive) {
                if(verticalPlatformActive) {
                    this.balls[i].verticalPlatformCollision(this.platformVertical.x + this.platformVertical.width, this.platformVertical.y, this.platformVertical.height);
                }

                this.balls[i].horizontalPlatformCollision(this.platformHorizontal.y, this.platformHorizontal.x, this.platformHorizontal.width);
                this.balls[i].topWallCollision();
                if(this.balls[i].leftWallCollision(verticalPlatformActive)){
                    balls[i].alive = false;
                }
                this.balls[i].rightWallCollision();
                if(this.balls[i].bottomWallCollision()) {
                    balls[i].alive = false;
                }
                this.balls[i].newPosition();
                this.balls[i].update();
                }
            }


        if(!ballsAlive()) {
            gameLost = true;
            let canvas = myGameArea.canvas;
            let ctx = canvas.getContext("2d");
            ctx.font = "30px Arial";
            ctx.fillText("You lost!", 10, 50);
        }

        time++;
        showTime();
        showScore();
    }

}

function verticalMoveUp() {
    this.platformVertical.speedY = 5;
}

function verticalMoveDown() {
    this.platformVertical.speedY = -5;
}

function horizontalMoveRight() {
    this.platformHorizontal.speedX = 5;
}

function horizontalMoveLeft() {
    this.platformHorizontal.speedX = -5;
}

function resetMovePlatformVertical() {
    this.platformVertical.speedY = 0;
}

function resetMovePlatformHorizontal() {
    this.platformHorizontal.speedX = 0;
}

function checkPlatformClipping() {
    //horizontal platform vs walls
    if((this.platformHorizontal.x + this.platformHorizontal.width >= 640 && this.platformHorizontal.speedX>0) ||
        (this.platformHorizontal.x <= 0 && this.platformHorizontal.speedX <0) ) {
        this.platformHorizontal.speedX = 0;
    }

    //vertical platform vs walls
    if(verticalPlatformActive)
        {if((this.platformVertical.y + this.platformVertical.height >= 480 && this.platformVertical.speedY>0) ||
             (this.platformVertical.y <= 0 && this.platformVertical.speedY <0) ) {
            this.platformVertical.speedY = 0;
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
                ctx.fillText("Game paused!", 10, 50);
                let btn = document.getElementById("pauseButton").innerText = "Unpause";
            } else {
                let btn = document.getElementById("pauseButton").innerText = "Pause";
            }
        }
    }
}

function activateVerticalPlatform() {
        verticalPlatformActive =!verticalPlatformActive;
        if(verticalPlatformActive) {
            this.platformVertical = new Platform(23, 128, 0, 270, "red");
        } else {
            this.platformVertical = null;
        }
        let text = "";
        if(verticalPlatformActive) text = "Vertical platform: ON";
        if(!verticalPlatformActive) text = "Vertical platform: OFF";
        let btn = document.getElementById("verticalPlatformButton").innerText = text;


}

function showScore() {
    let canvas = myGameArea.canvas;
    let ctx = canvas.getContext("2d");
    ctx.font = "14px Arial";
    ctx.fillText("Score: " + score, 550, 15);
}

function showTime() {
    let showTimeCurrent = Math.floor(time/50);
    let canvas = myGameArea.canvas;
    let ctx = canvas.getContext("2d");
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



