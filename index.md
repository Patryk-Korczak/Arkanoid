<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        canvas {
            border: 1px solid #d3d3d3;
            background-color: #f1f1f1;
            display: block;
            margin: 0 auto;
        }

         .movement {
             display: block;
             margin: 0 auto;
             text-align: center;
         }

        .gameControl {
            display: block;
            margin: 0 auto;
            text-align: center;
        }


    </style>
</head>
<body onload="loadGame()">
<script>

    var isGameStopped = false;
    var ballTempX;
    var ballTempY;
    var platformTempX;

    function loadGame() {
        myGameArea.start();
        myPlatform = new component(100, 20, "green", 190, 250); //movable, bounces
        myLeftWall = new component(10, 480, "blue", 0, 0);      //not movable,
        myRightWall = new component(10, 480, "blue", 470, 0);   //not movable
        myTopWall = new component(480, 10, "blue", 0, 0);       ///not movable
        myBottom = new component(480, 10, "yellow", 0, 270);    //touching this results in death
        myBall = new component(10, 10, "red", 235, 130);        //moves constantly, bounces of walls and platform
        myTopWall.isTopOrBottom = true;
        myPlatform.isTopOrBottom = true;
        myBall.speedX = 1;
        myBall.speedY = 1;
    }

    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 480;
            this.canvas.height = 270;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20);
            window.addEventListener('keydown', function (e) {
                myGameArea.key = e.keyCode;
            })
            window.addEventListener('keyup', function (e) {
                myGameArea.key = false;
            })
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function() {
            clearInterval(this.interval);
        }
    }

    function component(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.isTopOrBottom = false;
        this.x = x;
        this.y = y;

        this.update = function() {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.newPos = function() {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        this.bounce = function(otherobj) {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);
            if ((mybottom < othertop) ||
                (mytop > otherbottom) ||
                (myright < otherleft) ||
                (myleft > otherright)) {
                if(otherobj.isTopOrBottom) {
                    this.speedY *= -1;
                } else {
                    this.speedX *= -1;
                }

            }
        }

        this.crashWith = function(otherobj) {
            var mybottom = this.y + (this.height);
            var othertop = otherobj.y;
            var crash = true;
            if ((mybottom < othertop)) {
                crash = false;
            }
            return crash;
        }

    }

    function stop() {
        if (!isGameStopped) {
            ballTempX= myBall.speedX;
            ballTempY = myBall.speedY;
            platformTempX = myPlatform.speedX;
            myBall.speedX = 0;
            myBall.speedY = 0;
            myPlatform.speedX = 0;
            isGameStopped = true;
        }
    }

    function start() {
        if (isGameStopped) {
            myBall.speedY = ballTempY;
            myBall.speedX = ballTempX;
            myPlatform.speedX = platformTempX;
            isGameStopped = false;
        }
    }

    function moveleft() {
        myPlatform.speedX = -2;
    }

    function moveright() {
        myPlatform.speedX = 2;
    }

    function stopmove() {
        myPlatform.speedX = 0;
    }

    function updateGameArea() {
        if(myBall.crashWith(myBottom)) {
            myGameArea.stop();
        }


        if (myGameArea.key && myGameArea.key == 37) {myPlatform.speedX = -2; }
        if (myGameArea.key && myGameArea.key == 39) {myPlatform.speedX = 2; }

        myBall.bounce(myPlatform);
        myBall.bounce(myTopWall);
        myBall.bounce(myLeftWall);
        myBall.bounce(myRightWall);

        myGameArea.clear();
        myPlatform.newPos();
        myPlatform.update();
        myLeftWall.update();
        myRightWall.update();
        myTopWall.update();
        myBottom.update();
        myBall.newPos();
        myBall.update();

        if(myPlatform.crashWith(myLeftWall)) {
            myPlatform.speedX = 0;
        }

        if(myPlatform.crashWith(myRightWall)) {
            myPlatform.speed
        }

    }

</script>
<div class="movement">
    <button id="left" onmousedown="moveleft()" onmouseup="stopmove()" ontouchstart="moveleft()">LEFT</button>
    <button id="right" onmousedown="moveright()" onmouseup="stopmove()" ontouchstart="moveright()">RIGHT</button>
</div>

<div class="gameControl">
    <button id="start" onclick="start()">START</button>
    <button id="stop" onclick="stop()">STOP</button>
</div>




</body>
</html>