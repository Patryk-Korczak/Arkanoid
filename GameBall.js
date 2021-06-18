//controls balls

class GameBall {
    constructor(x, y, radius, trailColor, baseSpeed, baseTurn) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.trailColor = trailColor;
        this.speedY = baseSpeed;
        if(baseTurn===0) {
            this.speedX = -1 * baseSpeed;
        } else {
            this.speedX = 1 * baseSpeed;
        }
        this.alive = true;
        this.previousPositions = [];

    }

    newPosition() {
        this.previousPositions.unshift([this.x, this.y]);
        this.previousPositions = this.previousPositions.slice(0, 6);
        this.x += this.speedX;
        this.y += this.speedY;
    }

    update() {
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = 'ball.bmp';
        ctx.drawImage(img, this.x - 8, this.y - 8);


        if(this.previousPositions.length >= 5) {
            canvas = myGameArea.canvas;
            ctx = canvas.getContext("2d");
            ctx.globalAlpha=0.50;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.arc(this.previousPositions[i][0],this.previousPositions[i][1], this.radius,2*Math.PI,0);
                ctx.globalAlpha-=0.03;
            }
            ctx.closePath();
            ctx.fillStyle = this.trailColor;
            ctx.fill();
            ctx.globalAlpha=1;
        }

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

        }
    }

    horizontalPlatformCollision(y, x, width) {
        if(this.y + this.radius > y && this.x >= x && this.x <= x+width) {
            this.speedY *= -1;
            let mul = 0;
            if(this.speedX > 0) {
                mul = 1;
            } else if(this.speedX < 0) {
                mul = -1;
            }
            if((this.x >= x) && (this.x <= x + Math.round(1/10 * 128))) {
                this.speedX=3 * Math.abs(this.speedY) * mul;
            } else if((this.x >= x + Math.round(1/10 * 128) ) && (this.x <= x + Math.round(3/10 * 128))) {
                this.speedX= 2*Math.abs(this.speedY) * mul;
            } else if((this.x >= x + Math.round(3/10 * 128) ) && (this.x <= x + Math.round(4/10 * 128))) {
                this.speedX = Math.round(Math.abs(this.speedY) * 1.33) * mul;
            }  else if((this.x >= x + Math.round(4/10 * 128) ) && (this.x <= x + Math.round(6/10 * 128))) {
                this.speedX= Math.abs(this.speedY) * mul;
            } else if((this.x >= x + Math.round(6/10 * 128) ) && (this.x <= x + Math.round(7/10 * 128))) {
                this.speedX = Math.round(Math.abs(this.speedY) * 1.33) * mul;
            } else if((this.x >= x + Math.round(7/10 * 128) ) && (this.x <= x + Math.round(9/10 * 128))) {
                this.speedX=2*Math.abs(this.speedY) * mul;
            } else if((this.x >= x + Math.round(9/10 * 128) ) && (this.x <= x + Math.round(10/10 * 128))) {
                this.speedX=3*Math.abs(this.speedY) * mul;
            }
        }
    }

}