//controls balls
class GameBall {
    constructor(x, y, radius, color, baseSpeed, baseTurn) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedY = baseSpeed;
        if(baseTurn===0) {
            this.speedX = -1 * baseSpeed;
        } else {
            this.speedX = 1 * baseSpeed;
        }
        this.alive = true;
    }

    newPosition() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    update() {
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = 'ball.bmp';
        ctx.drawImage(img, this.x, this.y);

    }

    topWallCollision() {
        if(this.y <= 10) {
            this.speedY*=-1;
        }
    }

    leftWallCollision(verticalPlatformAlive){
        if(verticalPlatformAlive) {
            if(this.x <= 8) {
                return true; //ball out of bounds
            }
        } else {
            if(this.x <= 8) {
            this.speedX*= -1;
            return false;
            }
        }

    }

    rightWallCollision() {
        if(this.x >= 632) {
            this.speedX *= -1;
        }
    }

    bottomWallCollision(){
        return this.y >= 451;
    }

    verticalPlatformCollision(x, y, height) {
        if(this.x - this.radius < x && this.y >= y && this.y <= y+height){
            this.speedX *= -1;
        }
    }

    horizontalPlatformCollision(y, x, width) {
        if(this.y + this.radius > y && this.x >= x && this.x <= x+width) {
            this.speedY *= -1;
        }
    }

}