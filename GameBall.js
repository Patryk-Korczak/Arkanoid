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
        this.ctx = myGameArea.context;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        this.ctx.fill();

    }

    topWallCollision() {
        if(this.y <= 10) {
            this.speedY*=-1;
        }
    }

    leftWallCollision(verticalPlatformAlive){
        if(verticalPlatformAlive) {
            if(this.x <= 10) {
                return true; //ball out of bounds
            }
        } else {
            if(this.x <= 10) {
            this.speedX*= -1;
            return false;
            }
        }

    }

    rightWallCollision() {
        if(this.x >= 590) {
            this.speedX *= -1;
        }
    }

    bottomWallCollision(){
        //todo Death screen
        if(this.y >= 390) {
            return true;
        }

        return false;
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