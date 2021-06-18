// controls boosts

class Boost {
    constructor(type, x, y, color) {
        this.type = type; //type can take values 0-4 indicating boost power up ID
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speedY = 1;
        this.alive = true;
        this.color = color; //todo replace with graphic for each boost type
    }

    newPosition() {
        this.y += this.speedY;
    }

    update() {
        if(this.alive) {
            this.newPosition();
            let canvas = myGameArea.canvas;
            let ctx = canvas.getContext("2d");
            let img = new Image();
            if(this.type === 0) {
                img.src = 'X5.bmp';
            } else if(this.type === 1) {
                img.src = 'X2.bmp';
            } else if(this.type === 2) {
                img.src = 'plus.bmp';
            } else if(this.type === 3) {
                img.src = 'minus.bmp';
            } else if(this.type === 4) {
                img.src = 'reverse.bmp';
            }

            ctx.drawImage(img, this.x, this.y);
        }

    }

    collisionWithPlatformHorizontal() {
        if(this.alive) {
            if(this.y + this.height === platformHorizontal.y) {
                if(this.x + this.width >= platformHorizontal.x && this.x <= platformHorizontal.x + platformHorizontal.width) {
                    this.alive = false;
                    activeBoosts[this.type].activeTimeStart = time/50;
                    activeBoosts[this.type].activeTimeFinish = time/50 + 5; //extra 5 seconds
                }
            }
        }
    }


}

activeBoosts = [
    {
        name: "Points x 5",
        activeTimeStart: 0,
        activeTimeFinish: 0,
    },
    {
        name: "Points x 2",
        activeTimeStart: 0,
        activeTimeFinish: 0,
    },
    {
        name: "Wide platform",
        activeTimeStart: 0,
        activeTimeFinish: 0,
    },
    {
        name: "Narrow platform",
        activeTimeStart: 0,
        activeTimeFinish: 0,
    },
    {
        name: "Reverse",
        activeTimeStart: 0,
        activeTimeFinish: 0,
    },

]

function isBoostActive(number) {
    let tempTime = time/50;
    if(tempTime!== 0) {
        if(tempTime > activeBoosts[number].activeTimeStart && tempTime < activeBoosts[number].activeTimeFinish) {
            return true;
        }
    }
}

function drawx5() {
    if(isBoostActive(0)) {
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.font = "14px Arial";
        ctx.fillText("Score X5", 5, 20);
    }
}

function drawx2() {
    if(isBoostActive(1)) {
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.font = "14px Arial";
        ctx.fillText("Score X2", 5, 35);
    }
}

function drawReversed() {
    if(isBoostActive(4)) {
        let canvas = myGameArea.canvas;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.font = "14px Arial";
        ctx.fillText("Steering reversed", 5, 50);
    }
}

