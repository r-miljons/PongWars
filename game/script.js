// menu screen ----------------------------------------------------

//pressing play pulls the menu upwards revealing the game

const playButton = document.getElementById("play-btn");
const startMenu = document.querySelector(".start-menu-container");

function pullMenuUp () {
    startMenu.style.transition = "margin-top 1s ease-in";
    startMenu.style.marginTop = "-110vh";
    setTimeout(() => {
        startMenu.style.display = "none";
    }, 1000);
}

function pullMenuUpSpacebar (event) {
    let keypressed = event.code;
    if (keypressed == "Space") {
        pullMenuUp();
        document.removeEventListener("keypress", pullMenuUpSpacebar);
    }
}

playButton.addEventListener("click", pullMenuUp);
document.addEventListener("keydown", pullMenuUpSpacebar);

// choose the color of your paddle by clicking on ">" or "<" or "a" and "d" for player one and "←" or "→" for player two

const previousLeft = document.querySelector(".previous-left");
const leftPaddleMenu = document.getElementById("left-paddle-color");
const nextLeft = document.querySelector(".next-left");
const playerOneColorText = document.getElementById("player-one-color");

const previousRight = document.querySelector(".previous-right");
const rightPaddleMenu = document.getElementById("right-paddle-color");
const nextRight = document.querySelector(".next-right");
const playerTwoColorText = document.getElementById("player-two-color");

// these objects store the color data of paddles

const leftPaddleColor = {
    availableColors: ["rgb(225, 225, 225)", "rgb(0, 255, 8)", "rgb(0, 174, 255)", "rgb(204, 0, 255)", "rgb(255, 0, 13)", "rgb(255, 234, 0)"],
    colorName: ["white", "green", "blue", "purple", "red", "yellow"],
    colorIndex: 0
}

const rightPaddleColor = {
    availableColors: ["rgb(225, 225, 225)", "rgb(0, 255, 8)", "rgb(0, 174, 255)", "rgb(204, 0, 255)", "rgb(255, 0, 13)", "rgb(255, 234, 0)"],
    colorName: ["white", "green", "blue", "purple", "red", "yellow"],
    colorIndex: 0
}

function changeLeft(colorObject) {
    if (colorObject.colorIndex == 0) {
        colorObject.colorIndex = colorObject.availableColors.length - 1;
    } else {
        colorObject.colorIndex -= 1;
    }
}

function changeRight(colorObject) {
    if (colorObject.colorIndex == colorObject.availableColors.length - 1) {
        colorObject.colorIndex = 0;
    } else {
        colorObject.colorIndex += 1;
    }
}

function updateLeftPaddleColor() {
    leftPaddleMenu.style.backgroundColor = leftPaddleColor.availableColors[leftPaddleColor.colorIndex];
    playerOneColorText.textContent = leftPaddleColor.colorName[leftPaddleColor.colorIndex];
    console.log(leftPaddleColor.colorIndex);
}

function updateRightPaddleColor() {
    rightPaddleMenu.style.backgroundColor = rightPaddleColor.availableColors[rightPaddleColor.colorIndex];
    playerTwoColorText.textContent = rightPaddleColor.colorName[rightPaddleColor.colorIndex];
    console.log(rightPaddleColor.colorIndex);
}

function changePaddleColorKeyboard(event) {
    let keypressed = event.code;
    if (keypressed == "KeyA") {
        changeLeft(leftPaddleColor);
        updateLeftPaddleColor();
    } else if (keypressed == "KeyD") {
        changeRight(leftPaddleColor);
        updateLeftPaddleColor();
    } else if (keypressed == "ArrowLeft") {
        changeLeft(rightPaddleColor);
        updateRightPaddleColor();
    } else if (keypressed == "ArrowRight") {
        changeRight(rightPaddleColor);
        updateRightPaddleColor();
    }
}

document.addEventListener("keydown", changePaddleColorKeyboard);

previousLeft.addEventListener("click", function () {
    changeLeft(leftPaddleColor);
    updateLeftPaddleColor();
});

nextLeft.addEventListener("click", function () {
    changeRight(leftPaddleColor);
    updateLeftPaddleColor();
});

previousRight.addEventListener("click", function () {
    changeLeft(rightPaddleColor);
    updateRightPaddleColor();
});

nextRight.addEventListener("click", function () {
    changeRight(rightPaddleColor);
    updateRightPaddleColor();
});

// ball movement, paddle movement collision detection ----------------------------------------------------------------

const gameBox = document.querySelector(".game");
const ball = document.querySelector(".ball");
const trail = document.querySelector(".ball-trail");
const leftPaddle = document.querySelector(".left-paddle");
const rightPaddle = document.querySelector(".right-paddle");

// ball movement -------------------------------

const ballData = {
    _radius: 12,
    _X: gameBox.clientWidth/2,
    _Y: gameBox.clientHeight/2,
    _speed: 0.25, // currently only 0.25++ works properly 
    _direction: 0, // degrees from top of y axis (from 0 to 360)
    get radius() {
        return this._radius;
    },
    get X() {
        return this._X;
    },
    get Y() {
        return this._Y;
    },
    get speed() {
        return this._speed;
    },
    get direction() {
        return this._direction;
    },
    set radius(radius) {
        this._radius = radius;
    },
    set X(number) {
        this._X = number;
    },
    set Y(number) {
        this._Y = number;
    },
    set speed(number) {
        this._speed = number;
    },
    set direction(degrees) {
        this._direction = degrees;
    }
}

// function for positioning the ball
// use moveBall(X, Y) input values from 0 to 100 relative to the top left corner

function moveBall(percentX, percentY) {
    let X;
    if (percentX > -1 && percentX <= 101) {
        X = (percentX/100) * (gameBox.clientWidth - (ballData.radius*2));
        ballData.X = X;
        ball.style.left = X + "px";
        trail.style.left = X + "px";
    }
    let Y;
    if (percentY > -1 && percentY <= 101) {
        Y = (percentY/100) * (gameBox.clientHeight -(ballData.radius*2))
        ballData.Y = Y;
        ball.style.top =  Y + "px";
        trail.style.top = Y + "px";
    }  
}


// values to feed the moveBall function (starting point set to center of screen)
let ballCurrentY = 50;
let ballCurrentX = 50;

function updateBallVector(degrees = ballData.direction, speed = ballData.speed) {
    ballData.speed = speed;
    ballData.direction = degrees;
    // calculate x y from movement direction
    // handle each right angle case separately
    switch (degrees) {
        case 0 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY -= ballData.speed);
                if (ballCurrentY <= 0) {
                    detectCollision();
                    clearInterval(move);
                    updateBallVector();
                }
            }, 1);
        }; break;
        case 90 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX += ballData.speed, ballCurrentY);
                if (ballCurrentX >= 100) {
                    detectCollision();
                    clearInterval(move);
                    updateBallVector();
                }
            }, 1);
        }; break;
        case 180 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY += ballData.speed);
                if (ballCurrentY >= 100) {
                    detectCollision();
                    clearInterval(move);
                    updateBallVector();
                }
            }, 1);
        }; break;
        case 270 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX -= ballData.speed, ballCurrentY);
                if (ballCurrentX <= 0) {
                    detectCollision();
                    clearInterval(move);
                    updateBallVector();
                }
            }, 1);
        }; break;
        case 360 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY -= ballData.speed);
                if (ballCurrentY <= 0) {
                    detectCollision();
                    clearInterval(move);
                    updateBallVector();
                }
            }, 1);
        }; break;
    }
    // non-right angles
    if (degrees > 0 && degrees < 90) {
        let radians = degrees * (Math.PI / 180);
        let x = ballData.speed * Math.sin(radians);
        let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
        let move = setInterval(() => {
            moveBall(ballCurrentX += x, ballCurrentY -= y);
            
            if (ballCurrentY <= 0 || ballCurrentX >= 100) {
                detectCollision();
                clearInterval(move);
                updateBallVector();
            }
        }, 1);
    }
    if (degrees > 270 && degrees < 360) {
        let radians = degrees * (Math.PI / 180);
        let x = ballData.speed * Math.sin(radians);
        let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
        let move = setInterval(() => {
            moveBall(ballCurrentX += x, ballCurrentY -= y);
            
            if (ballCurrentY <= 0 || ballCurrentX <= 0) {
                clearInterval(move);
                detectCollision();
                updateBallVector();
            }
        }, 1);
    }
    if (degrees > 90 && degrees < 180) {
        let radians = degrees * (Math.PI / 180);
        let x = ballData.speed * Math.sin(radians);
        let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
        let move = setInterval(() => {
            moveBall(ballCurrentX += x, ballCurrentY += y);
            
            if (ballCurrentY >= 100 || ballCurrentX >= 100) {
                clearInterval(move);
                detectCollision();
                updateBallVector();
            }
        }, 1);
    }
    if (degrees > 180 && degrees < 270) {
        let radians = degrees * (Math.PI / 180);
        let x = ballData.speed * Math.sin(radians);
        let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
        let move = setInterval(() => {
            moveBall(ballCurrentX += x, ballCurrentY += y);
            if (ballCurrentY >= 100 || ballCurrentX <= 0) {
                clearInterval(move);
                detectCollision();
                updateBallVector();
            }
        }, 1);
    }

}

//depending on the current movement direction, this function calculates the new direction of the ball
// takes in degrees and returns updated degrees for the updateBallVector function


function recalculateDirection(degrees = ballData.direction) {
    wallDetected = false;
        if (ballCurrentX >= 100) {
                ballData.direction = 360 - degrees;
        }
        if (ballCurrentY <= 0) {
            if (degrees >= 180) {
                ballData.direction = 360 - (degrees - 180);
            } else if (degrees < 180) {
                ballData.direction = 360 - degrees - 180;
            }
        }
        if (ballCurrentX <= 0) {
            ballData.direction = 360 - degrees;
        }
        if (ballCurrentY >= 100) {
            if (degrees >= 180) {
                    ballData.direction = 360 - (degrees - 180);
            } else if (degrees < 180) {
                ballData.direction = 360 - degrees - 180;
            }
        }
}


// paddle movement --------------------------------

// data about the paddles

const leftPaddleData = {
    _height: 128,
    _speed: 0.5,
    _Y: [],
    get height() {
        return this._height;
    },
    get speed() {
        return this._speed;
    },
    get Y() {
        return this._Y;
    },
    set height(number) {
        this._height = number;
        leftPaddle.style.height = number + "px";
    },
    set speed(number) {
        this._speed = number;
    },
    set Y(number) {
        this._Y = number;
    }
}

const rightPaddleData = {
    _height: 128,
    _speed: 0.5,
    _Y: [],
    get height() {
        return this._height;
    },
    get speed() {
        return this._speed;
    },
    get Y() {
        return this._Y;
    },
    set height(number) {
        this._height = number;
        rightPaddle.style.height = number + "px";
    },
    set speed(number) {
        this._speed = number;
    },
    set Y(number) {
        this._Y = number;
    }
}

// setting initial Y position for paddles

leftPaddleData.Y = leftPaddle.offsetTop + leftPaddleData.height/2;
rightPaddleData.Y = rightPaddle.offsetTop + rightPaddleData.height/2;

// change the Y position of the paddles and save the data
// input 0-100 to position the paddles relative to the top of the screen
// returns: height from top to the center of the paddles

function leftPaddleY(percent) {
    let Y;
    if (percent == 0) {
        Y = 0;
        leftPaddle.style.top = Y + "px";
        leftPaddleData.Y = Y + leftPaddleData.height/2;
        return Y + leftPaddleData.height/2;
    } else if (percent > 0 && percent <= 100) {
        Y = (percent/100) * (gameBox.clientHeight - (leftPaddleData.height));
        leftPaddle.style.top = Y + "px";
        leftPaddleData.Y = Y + leftPaddleData.height/2;
        return Y + leftPaddleData.height/2;
    }
}

function rightPaddleY(percent) {
    let Y;
    if (percent == 0) {
        Y = 0;
        rightPaddle.style.top = Y + "px";
        rightPaddleData.Y = Y + rightPaddleData.height/2;
        return Y + rightPaddleData.height/2;
    } else if (percent > 0 && percent <= 100) {
        Y = (percent/100) * (gameBox.clientHeight - (rightPaddleData.height));
        rightPaddle.style.top = Y + "px";
        rightPaddleData.Y = Y + rightPaddleData.height/2;
        return Y + rightPaddleData.height/2;
    }
}

// move the paddles using "w" and "s" or "↑" and "↓"

let leftPaddleCurrentY = 50;
let rightPaddleCurrentY = 50;
let leftPaddleGoingUp = false;
let leftPaddleGoingDown = false;
let rightPaddleGoingUp = false;
let rightPaddleGoingDown = false;

// moves the paddles by setting an interval that increments the top position

function moveLeftPaddleUp(event) {
    if (!leftPaddleGoingUp) {
        if (event.code == "KeyW") {
            leftPaddleGoingUp = true;
            let move = setInterval(()=>{
                if (leftPaddleCurrentY > 0) {
                    leftPaddleY(leftPaddleCurrentY -= leftPaddleData.speed);
                }
                if (!leftPaddleGoingUp) {
                    clearInterval(move);
                }
            }, 1)
        }
    }

}

function moveLeftPaddleDown(event) {
    if (!leftPaddleGoingDown) {
        if (event.code == "KeyS") {
            leftPaddleGoingDown = true;
            let move = setInterval(()=>{
                if (leftPaddleCurrentY < 100) {
                    leftPaddleY(leftPaddleCurrentY += leftPaddleData.speed);
                }
                if (!leftPaddleGoingDown) {
                    clearInterval(move);
                }
            }, 1)
        }
    }

}

function moveRightPaddleUp(event) {
    if (!rightPaddleGoingUp) {
        if (event.code == "ArrowUp") {
            rightPaddleGoingUp = true;
            let move = setInterval(()=>{
                if (rightPaddleCurrentY > 0) {
                    rightPaddleY(rightPaddleCurrentY -= rightPaddleData.speed);
                }
                if (!rightPaddleGoingUp) {
                    clearInterval(move);
                }
            }, 1)
        }
    }
}

function moveRightPaddleDown(event) {
    if (!rightPaddleGoingDown) {
        if (event.code == "ArrowDown") {
            rightPaddleGoingDown = true;
            let move = setInterval(()=>{
                if (rightPaddleCurrentY < 100) {
                    rightPaddleY(rightPaddleCurrentY += rightPaddleData.speed);
                }
                if (!rightPaddleGoingDown) {
                    clearInterval(move);
                }
            }, 1)
        }
    }
}

// clears the specific interval set by the move function whenever the key is released

function stopPaddle(event) {
    let keyreleased = event.code;
    if (keyreleased == "KeyW") {
        leftPaddleGoingUp = false;
    } else if (keyreleased == "KeyS") {
        leftPaddleGoingDown = false;
    } else if (keyreleased == "ArrowUp") {
        rightPaddleGoingUp = false;
    } else if (keyreleased == "ArrowDown") {
        rightPaddleGoingDown = false;
    }
}

document.addEventListener("keyup", stopPaddle);
document.addEventListener("keydown", moveLeftPaddleUp);
document.addEventListener("keydown", moveLeftPaddleDown);
document.addEventListener("keydown", moveRightPaddleUp);
document.addEventListener("keydown", moveRightPaddleDown);

// collision detection

const leftPaddleWall = 40; //pixels from wall to paddle collision wall
const rightPaddleWall = gameBox.clientWidth - (ballData.radius*2) - 40;

// checks whether the x and y coordinates of ball and paddles and game walls intersect
// must be called whenever changing the position of the ball

let wallDetected = false;



function detectCollision() {
    if (!wallDetected) {
        wallDetected = true;
        if (ballData.Y >= gameBox.clientHeight - (ballData.radius*2)) {
            console.log("ball hits bottom");
            recalculateDirection();
        }
        if (ballData.Y <= 0) {
            console.log("ball hits top");
            recalculateDirection();
        }
        if (ballData.X <= 0) {
            console.log("player two scores");
            recalculateDirection();
        }
        if (ballData.X >= gameBox.clientWidth - (ballData.radius*2)) {
            console.log("player one scores");
            recalculateDirection();
        }
        if (ballData.X <= leftPaddleWall) {
            // check wether the ball is touching the left paddle
            if (leftPaddleData.Y - leftPaddleData.height/2 <= ballData.Y + (ballData.radius*2) && leftPaddleData.Y + leftPaddleData.height/2 >= ballData.Y) {
                const topOfPaddle = leftPaddleData.Y - ballData.radius - (leftPaddleData.height/2);
                const bottomOfPaddle = leftPaddleData.Y + ballData.radius + (leftPaddleData.height/2);
                const centerOfBall = ballData.Y + ballData.radius;
                // if the ball hits the top part of the paddle, calculate the percentage of distance from center of paddle that the ball hits
                if (centerOfBall >= topOfPaddle && centerOfBall <= leftPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - topOfPaddle) / ((leftPaddleData.height/2) + ballData.radius)) * 100;
                    percentFromCenter = 100 - percentFromCenter;
                    console.log("From center: "+percentFromCenter+"%");
                }
                // same for the bottom part of the padddle
                if (centerOfBall <= bottomOfPaddle && centerOfBall > leftPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - leftPaddleData.Y) / ((leftPaddleData.height/2) + ballData.radius)) * 100;
                    console.log("From center: "+percentFromCenter+"%");
                }
                console.log("leftPaddleWall");
            }   
        }
        if (ballData.X >= rightPaddleWall) {
            // same for the right paddle
            if (rightPaddleData.Y - rightPaddleData.height/2 <= ballData.Y + (ballData.radius*2) && rightPaddleData.Y + rightPaddleData.height/2 >= ballData.Y) {
                const topOfPaddle = rightPaddleData.Y - ballData.radius - (rightPaddleData.height/2);
                const bottomOfPaddle = rightPaddleData.Y + ballData.radius + (rightPaddleData.height/2);
                const centerOfBall = ballData.Y + ballData.radius;
                // if the ball hits the top part of the paddle, calculate the percentage of distance from center of paddle that the ball hits
                if (centerOfBall >= topOfPaddle && centerOfBall <= rightPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - topOfPaddle) / ((rightPaddleData.height/2) + ballData.radius)) * 100;
                    percentFromCenter = 100 - percentFromCenter;
                    console.log("From center: "+percentFromCenter+"%");
                }
                // same for the bottom part of the padddle
                if (centerOfBall <= bottomOfPaddle && centerOfBall > rightPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - rightPaddleData.Y) / ((rightPaddleData.height/2) + ballData.radius)) * 100;
                    console.log("From center: "+percentFromCenter+"%");
                }
                console.log("rightPaddleWall");
            }
        }
    }
}




// functions for testing purposes
/*

function logPressedKey(event) {
    console.log(event.code);
}

document.addEventListener("keypress", logPressedKey);

*/

// moves ball around using numpad (for testing purposes)

let noClipActive = false;
let noClipSpeed = 0.1;

function ballNoClip(event) {
    if (!noClipActive) {
        if (event.code == "Numpad8") {
            noClipActive = true;
            let move = setInterval(() => {
                if (ballCurrentY > 0) {
                    moveBall(ballCurrentX, ballCurrentY -= noClipSpeed);
                    detectCollision();
                }
                if (!noClipActive) {
                    clearInterval(move);
                }
            }, 1);
        }
        if (event.code == "Numpad2") {
            noClipActive = true;
            let move = setInterval(() => {
                if (ballCurrentY < 100) {
                    moveBall(ballCurrentX, ballCurrentY += noClipSpeed);
                    detectCollision();
                }
                if (!noClipActive) {
                    clearInterval(move);
                }
            }, 1);
        }
        if (event.code == "Numpad6") {
            noClipActive = true;
            let move = setInterval(() => {
                if (ballCurrentX < 100) {
                    moveBall(ballCurrentX += noClipSpeed, ballCurrentY);
                    detectCollision();
                }
                if (!noClipActive) {
                    clearInterval(move);
                }
            }, 1);
        }
        if (event.code == "Numpad4") {
            noClipActive = true;
            let move = setInterval(() => {
                if (ballCurrentX > 0) {
                    moveBall(ballCurrentX -= noClipSpeed, ballCurrentY);
                    detectCollision();
                }
                if (!noClipActive) {
                    clearInterval(move);
                }
            }, 1);
        }
    }
}

function stopBallNoClip(event) {
    if (event.code == "Numpad8" || event.code == "Numpad6" || event.code == "Numpad2" || event.code == "Numpad4") {
        noClipActive = false;
    }
}


document.addEventListener("keydown", ballNoClip);
document.addEventListener("keyup", stopBallNoClip);








console.log("center of screen:", gameBox.clientWidth/2, gameBox.clientHeight/2);
console.log("ball X:",ballData.X,"ballY:", ballData.Y);












