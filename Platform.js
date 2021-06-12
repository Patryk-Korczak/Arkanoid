//Platform control

class Platform {
    constructor(width, height, x, y, color) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
    }

    newPosition() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }


}