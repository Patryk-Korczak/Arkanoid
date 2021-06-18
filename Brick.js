//controls bricks

class Brick {
    constructor (x, y, color, hp, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.hp = hp;
        this.type = type;
        this.alive = true;
        this.width = 50;
        this.height = 20;
    }

    moveDown(height) {
        this.y += height;
    }

    update() {
        if(this.alive) {
            let canvas = myGameArea.canvas;
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 50, 20);

            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, 50, 20);
        }
    }
}