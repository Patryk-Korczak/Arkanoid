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
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = 'paddle.bmp';
        ctx.drawImage(img, this.x, this.y);
    }


}