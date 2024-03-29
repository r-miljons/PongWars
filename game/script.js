

// menu screen ----------------------------------------------------

//pressing play pulls the menu upwards revealing the game

const playButton = document.getElementById("play-btn");
const startMenu = document.querySelector(".start-menu-container");
const playerOneName = document.getElementById("username-one");
const playerTwoName = document.getElementById("username-two");
const announcementText = document.querySelector(".announcement-text");
const idleText = document.querySelector(".info");


function pullMenuUp () {
    startMenu.style.transition = "margin-top 1s ease-in";
    startMenu.style.marginTop = "-110vh";
    setTimeout(() => {
        startMenu.style.display = "none";
    }, 1000);
}

function pullMenuUpSpacebar (event) {
    if (document.activeElement != playerOneName && document.activeElement != playerTwoName) {
        let keypressed = event.code;
        if (keypressed == "Space" && comingFromEndScreen == false /* very shitty way of fixing this firing when not needed */ ) {
            pullMenuUp();
            document.removeEventListener("keypress", pullMenuUpSpacebar);
            document.removeEventListener("keydown", changePaddleColorKeyboard);
            setTimeout(() => {
                document.addEventListener("keydown", startGame);
                document.addEventListener("keyup", stopPaddle);
                document.addEventListener("keydown", moveLeftPaddleUp);
                document.addEventListener("keydown", moveLeftPaddleDown);
                document.addEventListener("keydown", moveRightPaddleUp);
                document.addEventListener("keydown", moveRightPaddleDown);
            }, 1000);
        }
    }
}

playButton.addEventListener("click", ()=> {
    pullMenuUp();
    document.removeEventListener("keypress", pullMenuUpSpacebar);
    document.removeEventListener("keydown", changePaddleColorKeyboard);
    setTimeout(() => {
        document.addEventListener("keydown", startGame);
        document.addEventListener("keyup", stopPaddle);
        document.addEventListener("keydown", moveLeftPaddleUp);
        document.addEventListener("keydown", moveLeftPaddleDown);
        document.addEventListener("keydown", moveRightPaddleUp);
        document.addEventListener("keydown", moveRightPaddleDown);
    }, 1000);
});




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

//change the color of paddles

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
    leftPaddle.style.backgroundColor = leftPaddleColor.availableColors[leftPaddleColor.colorIndex];
}

function updateRightPaddleColor() {
    rightPaddleMenu.style.backgroundColor = rightPaddleColor.availableColors[rightPaddleColor.colorIndex];
    playerTwoColorText.textContent = rightPaddleColor.colorName[rightPaddleColor.colorIndex];
    rightPaddle.style.backgroundColor = rightPaddleColor.availableColors[rightPaddleColor.colorIndex];
}

function changePaddleColorKeyboard(event) {
    if (document.activeElement != playerOneName && document.activeElement != playerTwoName) {
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

// change player one and two names


function updateNameOne() {
    document.querySelector(".player-one-name").textContent = playerOneName.value.trim() + ":";
    playerOneName.placeholder = `${playerOneName.value.trim()}`
}

function updateNameTwo() {
    document.querySelector(".player-two-name").textContent = playerTwoName.value.trim() + ":";
    playerTwoName.placeholder = `${playerTwoName.value.trim()}`
}

playerOneName.addEventListener("keyup", updateNameOne);
playerTwoName.addEventListener("keyup", updateNameTwo);




// game section ----------------------------------------------------------------

// elements

const gameBox = document.querySelector(".game");
const ball = document.querySelector(".ball");
const trail = document.querySelector(".ball-trail");
const leftPaddle = document.querySelector(".left-paddle");
const rightPaddle = document.querySelector(".right-paddle");

// data objects and variables

const playerOne = {
    score: 0,
    hits: 0,
    roundsWon: 0,
    updateScore() {
        this.score += 1;
        document.querySelector(".player-one-score").textContent = this.score;
    },
    resetScore() {
        this.score = 0;
        document.querySelector(".player-one-score").textContent = this.score;
    },
    reset() {
        this.score = 0;
        this.hits = 0;
        this.roundsWon = 0;
    }
}

playerTwo = {
    score: 0,
    hits: 0,
    roundsWon: 0,
    updateScore() {
        this.score += 1;
        document.querySelector(".player-two-score").textContent = this.score;
    },
    resetScore() {
        this.score = 0;
        document.querySelector(".player-two-score").textContent = this.score;
    },
    reset() {
        this.score = 0;
        this.hits = 0;
        this.roundsWon = 0;
    }
}

const ballData = {
    _radius: 12,
    _X: gameBox.clientWidth/2,
    _Y: gameBox.clientHeight/2,
    _speed: 0.4, 
    _direction: 0, 
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
    },
    resetSpeed() {
        this._speed = 0.4;
    },
}

const leftPaddleData = {
    _height: 128,
    _speed: 0.8,
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
    },
    reset() {
        this._height = 128;
        this._speed = 0.8;
    }
}

const rightPaddleData = {
    _height: 128,
    _speed: 0.8,
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
    },
    reset() {
        this._height = 128;
        this._speed = 0.8;
    }
}

let gameStarted = false;
let playerScored = false;
let currentRound = 0;
let lastToTouchBall; //used for surprise box

// setting initial Y position for paddles

leftPaddleData.Y = leftPaddle.offsetTop + leftPaddleData.height/2;
rightPaddleData.Y = rightPaddle.offsetTop + rightPaddleData.height/2;

let ballCurrentY = 50;
let ballCurrentX = 50;

const leftPaddleWall = 40; //pixels from wall to paddle collision wall
const rightPaddleWall = gameBox.clientWidth - (ballData.radius*2) - 40;

let wallDetected = false;

// these tell the recalculateDirection function which side of the ball got hit
let leftSide = false;
let rightSide = false;
let topSide = false;
let bottomSide = false;

let leftPaddleCurrentY = 50;
let rightPaddleCurrentY = 50;
let leftPaddleGoingUp = false;
let leftPaddleGoingDown = false;
let rightPaddleGoingUp = false;
let rightPaddleGoingDown = false;


// pressing spacebar starts the game by throwing the ball in a random players direction
function startGame(event) {
    if (!gameStarted) {
        if (event.code == "Space") {
            document.removeEventListener("keydown", startGame);
            gameStarted = true;
            currentRound ++;
            playerOne.resetScore();
            playerTwo.resetScore();
            announcementText.style.display = "block";
            idleText.style.display = "none";
            announcementText.textContent = "Round " + currentRound;
            setTimeout(() => {
                announcementText.style.display = "none";
                let randomBallAngle;
                let randomPlayer = 1 + Math.floor(Math.random()*2);
                if (randomPlayer == 1) {
                    randomBallAngle = 205 + Math.floor(Math.random()*131);
                } else if (randomPlayer == 2) {
                    randomBallAngle = 25 + Math.floor(Math.random()*131);
                }
                updateBallVector(randomBallAngle);
            },1000); 
        }
    }
}

comingFromEndScreen = false;

function endGame() {
    document.querySelector(".end-game-screen").style.display = "flex";
    document.removeEventListener("keydown", startGame);
    document.removeEventListener("keyup", stopPaddle);
    document.removeEventListener("keydown", moveLeftPaddleUp);
    document.removeEventListener("keydown", moveLeftPaddleDown);
    document.removeEventListener("keydown", moveRightPaddleUp);
    document.removeEventListener("keydown", moveRightPaddleDown);
    
    if (playerOne.roundsWon == 3) {
        document.querySelector(".winner").style.backgroundColor = leftPaddleColor.availableColors[leftPaddleColor.colorIndex];
        document.querySelector(".winner-name").textContent = playerOneName.placeholder;
        document.querySelector(".hits").textContent = "Total hits: " + playerOne.hits;
    }
    if (playerTwo.roundsWon == 3) {
        document.querySelector(".winner").style.backgroundColor = rightPaddleColor.availableColors[rightPaddleColor.colorIndex];
        document.querySelector(".winner-name").textContent = playerTwoName.placeholder;
        document.querySelector(".hits").textContent = "Total hits: " + playerTwo.hits;
    }
    currentRound = 0;
    playerOne.reset();
    playerTwo.reset();
    playerOne.resetScore();
    playerTwo.resetScore();
    comingFromEndScreen = true;
    document.addEventListener("keydown", exitGame);
    document.getElementById("back").addEventListener("click", exitGame);
}


function exitGame(event) {
    if (event.code == "Space") {
        startMenu.style.marginTop = "0";
        startMenu.style.display = "flex";
        document.querySelector(".end-game-screen").style.display = "none";
        idleText.textContent = 'Press "Space" to start.';
        document.removeEventListener("keydown", exitGame);
        setTimeout(() => {comingFromEndScreen = false}, 1000);
    }
}
 

function restartGame() {
    playerScored = false;
    ballData.X = gameBox.clientWidth/2;
    ballData.Y = gameBox.clientHeight/2;
    ballCurrentX = 50;
    ballCurrentY = 50;
    ball.style.left = (ballData.X - ballData.radius) + "px";
    trail.style.left = (ballData.X - ballData.radius) + "px";
    ball.style.top =  (ballData.Y - ballData.radius) + "px";
    trail.style.top = (ballData.Y - ballData.radius) + "px";
    rightSide = false;
    leftSide = false;
    topSide = false;
    bottomSide = false; 
    leftPaddleData.reset();
    rightPaddleData.reset();
    lastToTouchBall = 0;

    //next round

    if (playerOne.score == 5 || playerTwo.score == 5) {
        gameStarted = false;
        document.addEventListener("keydown", startGame);
        if (playerOne.score == 5) {
            announcementText.textContent = `${playerOneName.placeholder} Wins Round!`;
            announcementText.style.display = "block";
            playerOne.roundsWon += 1;
            // game ends and winner is announced
            if (playerOne.roundsWon == 3 || playerTwo.roundsWon == 3) {
                endGame();
            }
            setTimeout(() => {
                announcementText.style.display = "none";
            },1000);
        }
        if (playerTwo.score == 5) {
            announcementText.textContent = `${playerTwoName.placeholder} Wins Round!`;
            announcementText.style.display = "block";
            playerTwo.roundsWon += 1;
            // game ends and winner is announced
            if (playerOne.roundsWon == 3 || playerTwo.roundsWon == 3) {
                endGame();
            }
            setTimeout(() => {
                announcementText.style.display = "none";
            },1000);
        }
        idleText.textContent = 'Press "Space" to continue.';
        idleText.style.display = "block";
    } else {
        setTimeout(() => {
            if (playerOne.score > playerTwo.score) {
                updateBallVector(205 + Math.floor(Math.random()*131));
            } else if (playerOne.score < playerTwo.score) {
                updateBallVector(25 + Math.floor(Math.random()*131));
            } else if (playerOne.score == playerTwo.score) {
                let randomBallAngle;
                let randomPlayer = 1 + Math.floor(Math.random()*2);
                if (randomPlayer == 1) {
                    randomBallAngle = 205 + Math.floor(Math.random()*131);
                } else if (randomPlayer == 2) {
                    randomBallAngle = 25 + Math.floor(Math.random()*131);
                }
                updateBallVector(randomBallAngle); 
            }
        }, 500);
    }
}



// ball movement -------------------------------


// function for positioning the ball
// use moveBall(X, Y) input values from 0 to 100 relative to the top left corner

function moveBall(percentX, percentY) {
    let X;
        X = (percentX/100) * (gameBox.clientWidth - (ballData.radius*2));
        ballData.X = X;
        ball.style.left = X + "px";
        trail.style.left = X + "px";
    let Y;
        Y = (percentY/100) * (gameBox.clientHeight -(ballData.radius*2))
        ballData.Y = Y;
        ball.style.top =  Y + "px";
        trail.style.top = Y + "px"; 
}

const spawnTrail = setInterval(() => {
    if (gameStarted == true) {
        let trailElement = trail.cloneNode(true);
        gameBox.appendChild(trailElement);
        setTimeout(()=>{gameBox.removeChild(trailElement);}, 1000);
    }
}, 50) 



function updateBallVector(degrees = ballData.direction, speed = ballData.speed) {
    ballData.speed = speed;
    ballData.direction = degrees;
    switch (degrees) {
        case 0 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY -= ballData.speed);
                    detectCollision();
                if (wallDetected) {
                    clearInterval(move);
                    wallDetected = false;
                    if (!playerScored) {
                        recalculateDirection()
                        updateBallVector();
                    } else {
                        restartGame();
                    }
                }
            }, 1);
        }; break;
        case 90 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX += ballData.speed, ballCurrentY);
                    detectCollision();
                if (wallDetected) {
                    clearInterval(move);
                    wallDetected = false;
                    if (!playerScored) {
                        recalculateDirection()
                        updateBallVector();
                    } else {
                        restartGame();
                    }
                }
            }, 1);
        }; break;
        case 180 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY += ballData.speed);
                    detectCollision();
                if (wallDetected) {
                    clearInterval(move);
                    wallDetected = false;
                    if (!playerScored) {
                        recalculateDirection()
                        updateBallVector();
                    } else {
                        restartGame();
                    }
                }
            }, 1);
        }; break;
        case 270 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX -= ballData.speed, ballCurrentY);
                    detectCollision();
                if (wallDetected) {
                    clearInterval(move);
                    wallDetected = false;
                    if (!playerScored) {
                        recalculateDirection()
                        updateBallVector();
                    } else {
                        restartGame();
                    }
                }
            }, 1);
        }; break;
        case 360 : {
            let move = setInterval(() => {
                    moveBall(ballCurrentX, ballCurrentY -= ballData.speed);
                    detectCollision();
                if (wallDetected) {
                    clearInterval(move);
                    wallDetected = false;
                    if (!playerScored) {
                        recalculateDirection()
                        updateBallVector();
                    } else {
                        restartGame();
                    }
                }
            }, 1);
        }; break;
    }
    // non-right angles
    if (degrees > 0 && degrees < 90) {
        let radians = degrees * (Math.PI / 180);
        let move = setInterval(() => {
            let x = ballData.speed * Math.sin(radians);
            let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
            moveBall(ballCurrentX += x, ballCurrentY -= y);
            detectCollision();
            if (wallDetected) {
                clearInterval(move);
                wallDetected = false;
                if (!playerScored) {
                    recalculateDirection()
                    updateBallVector();
                } else {
                    restartGame();
                }
            }
        }, 1);
    }
    if (degrees > 270 && degrees < 360) {
        let radians = degrees * (Math.PI / 180);
        let move = setInterval(() => {
            let x = ballData.speed * Math.sin(radians);
            let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
            moveBall(ballCurrentX += x, ballCurrentY -= y);
            detectCollision();
            if (wallDetected) {
                clearInterval(move);
                wallDetected = false;
                if (!playerScored) {
                    recalculateDirection()
                    updateBallVector();
                } else {
                    restartGame();
                }
            }
        }, 1);
    }
    if (degrees > 90 && degrees < 180) {
        let radians = degrees * (Math.PI / 180);
        let move = setInterval(() => {
            let x = ballData.speed * Math.sin(radians);
            let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
            moveBall(ballCurrentX += x, ballCurrentY += y);
            detectCollision();
            if (wallDetected) {
                clearInterval(move);
                wallDetected = false;
                if (!playerScored) {
                    recalculateDirection()
                    updateBallVector();
                } else {
                    restartGame();
                }
            }
        }, 1);
    }
    if (degrees > 180 && degrees < 270) {
        let radians = degrees * (Math.PI / 180);
        let move = setInterval(() => {
            let x = ballData.speed * Math.sin(radians);
            let y = Math.sqrt((ballData.speed * ballData.speed) - (x * x));
            moveBall(ballCurrentX += x, ballCurrentY += y);
            detectCollision();
            if (wallDetected) {
                clearInterval(move);
                wallDetected = false;
                if (!playerScored) {
                    recalculateDirection()
                    updateBallVector();
                } else {
                    restartGame();
                }
            }
        }, 1);
    }

}

// collision detection

// checks whether the x and y coordinates of ball and paddles and game walls intersect
// must be called whenever changing the position of the ball





function detectCollision() {
    
        if (ballData.Y >= gameBox.clientHeight - (ballData.radius*2)) {
            wallDetected = true;
            bottomSide = true;
            console.log("ball hits bottom");
        }
        if (ballData.Y <= 0) {
            wallDetected = true;
            topSide = true;
            console.log("ball hits top");
            
        }
        if (ballData.X <= 0) {
            wallDetected = true;
            leftSide = true;
            playerTwo.updateScore();
            playerScored = true;
            console.log("player two scores");
        }
        if (ballData.X >= gameBox.clientWidth - (ballData.radius*2)) {
            wallDetected = true;
            rightSide = true;
            playerOne.updateScore();
            playerScored = true;
            console.log("player one scores");
        }
        
        if (ballData.X <= leftPaddleWall) {
            // check wether the ball is touching the left paddle
            if (leftPaddleData.Y - leftPaddleData.height/2 <= ballData.Y + (ballData.radius*2) && leftPaddleData.Y + leftPaddleData.height/2 >= ballData.Y) {
                lastToTouchBall = 1;
                wallDetected = true;
                addHit(1);
                const topOfPaddle = leftPaddleData.Y - ballData.radius - (leftPaddleData.height/2);
                const bottomOfPaddle = leftPaddleData.Y + ballData.radius + (leftPaddleData.height/2);
                const centerOfBall = ballData.Y + ballData.radius;
                // if the ball hits the top part of the paddle, calculate the percentage of distance from center of paddle that the ball hits
                if (centerOfBall >= topOfPaddle && centerOfBall <= leftPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - topOfPaddle) / ((leftPaddleData.height/2) + ballData.radius)) * 100;
                    percentFromCenter = 100 - percentFromCenter;
                    console.log("From center: "+percentFromCenter+"%");
                    ballData.direction = 90 - ((percentFromCenter/100) * 65);
                }
                // same for the bottom part of the padddle
                if (centerOfBall <= bottomOfPaddle && centerOfBall > leftPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - leftPaddleData.Y) / ((leftPaddleData.height/2) + ballData.radius)) * 100;
                    console.log("From center: "+percentFromCenter+"%");
                    ballData.direction = 90 + ((percentFromCenter/100) * 65);
                }
            }   
        }
        
        if (ballData.X >= rightPaddleWall) {
            // same for the right paddle
            if (rightPaddleData.Y - rightPaddleData.height/2 <= ballData.Y + (ballData.radius*2) && rightPaddleData.Y + rightPaddleData.height/2 >= ballData.Y) {
                lastToTouchBall = 2;
                wallDetected = true;
                addHit(2);
                const topOfPaddle = rightPaddleData.Y - ballData.radius - (rightPaddleData.height/2);
                const bottomOfPaddle = rightPaddleData.Y + ballData.radius + (rightPaddleData.height/2);
                const centerOfBall = ballData.Y + ballData.radius;
                // if the ball hits the top part of the paddle, calculate the percentage of distance from center of paddle that the ball hits
                if (centerOfBall >= topOfPaddle && centerOfBall <= rightPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - topOfPaddle) / ((rightPaddleData.height/2) + ballData.radius)) * 100;
                    percentFromCenter = 100 - percentFromCenter;
                    console.log("From center: "+percentFromCenter+"%");
                    ballData.direction = 270 + ((percentFromCenter/100) * 65);
                }
                // same for the bottom part of the padddle
                if (centerOfBall <= bottomOfPaddle && centerOfBall > rightPaddleData.Y) {
                    let percentFromCenter = ((centerOfBall - rightPaddleData.Y) / ((rightPaddleData.height/2) + ballData.radius)) * 100;
                    console.log("From center: "+percentFromCenter+"%");
                    ballData.direction = 270 - ((percentFromCenter/100) * 65);
                }
            }
        }

        // wait to spawn surpise box
        if ((playerOne.hits > 0 && playerOne.hits % 5 == 0 && surpriseObject.boxAvailableForPickup == false && surpriseObject.effectActive == false) || (playerTwo.hits > 0 && playerTwo.hits % 5 == 0 && surpriseObject.boxAvailableForPickup == false && surpriseObject.effectActive == false)) {
            surpriseObject.boxAvailableForPickup = true;
            surpriseObject.spawnRandom();
        }

        // ball hits surprise box

        if (ballData.X + (ballData.radius*2) >= surpriseBox.offsetLeft && ballData.X <= surpriseBox.offsetLeft + surpriseBox.clientWidth) {
            if (ballData.Y + (ballData.radius*2) >= surpriseBox.offsetTop && ballData.Y <= surpriseBox.offsetTop + surpriseBox.clientHeight) {
                surpriseObject.boxAvailableForPickup = false;
                surpriseObject.applyEffect();
                console.log("Picked up surprise!");
            }
        }

        
}

// adds a hit point on each successful hit of the ball, this is shown at the end of the game
let ballHit = false
function addHit(player) {
    if (!ballHit) {
        ballHit = true;
        if (player == 1) {
            playerOne.hits += 1;
        }
        if (player == 2) {
            playerTwo.hits += 1;
        }
        setTimeout(() => {ballHit = false;}, 100);
    }
}

// gives the surprise box effect to the player who last touched the ball
const surpriseBox = document.querySelector(".surprise-box");


const surpriseObject = {
    effects: ["smallPaddle", "bouncyPaddle"],
    location: [0,0],
    currentEffect: "",
    effectDuration: 10000,
    effectActive: false,
    boxAvailableForPickup: false,
    remove() {
        surpriseBox.style.display = "none";
    },
    spawnRandom() {
            if (this.effectActive == false || this.effectActive == false) {
                this.currentEffect = this.effects[Math.floor(Math.random() * this.effects.length)];
                this.location[0] = (gameBox.clientWidth * 0.2) + (Math.floor(Math.random() * ((gameBox.clientWidth * 0.6) - surpriseBox.clientWidth)));
                this.location[1] = Math.floor(Math.random() * (gameBox.clientHeight - surpriseBox.clientHeight*1.5));
                surpriseBox.style.left = `${this.location[0]}px`;
                surpriseBox.style.top = `${this.location[1]}px`;
                surpriseBox.style.display = "block";
                setTimeout(() => {
                    this.remove();
                    this.boxAvailableForPickup = false;
                }, 10000);
            }
    },
    smallPaddle() {
        this.remove();
        this.effectActive = true;
        if (lastToTouchBall == 1) {
            leftPaddleData.height = leftPaddleData.height/2;
            leftPaddle.style.boxShadow = "0 0 1rem rgb(226, 32, 2)";
            setTimeout(() => {
                this.effectActive = false;
                leftPaddleData.height = 128;
                leftPaddle.style.boxShadow = "";
            }, this.effectDuration);
        } else if (lastToTouchBall == 2) {
            rightPaddleData.height = rightPaddleData.height/2;
            rightPaddle.style.boxShadow = "0 0 1rem rgb(226, 32, 2)";
            setTimeout(() => {
                this.effectActive = false;
                rightPaddleData.height = 128;
                rightPaddle.style.boxShadow = "";
            }, this.effectDuration);
        }
    },
    bouncyPaddle() {
        this.remove();
        this.effectActive = true;
        let ongoing = false;
        if (lastToTouchBall == 1) {
            leftPaddle.style.boxShadow = "0 0 2rem rgb(0, 149, 255)";
            let waitForTurn = setInterval(() => { if (lastToTouchBall == 2) { 
                clearInterval(waitForTurn);
                let checkForPaddle = setInterval(() => {
                    if (lastToTouchBall == 1) {
                        if (!ongoing) {
                            ongoing = true;
                            ballData.speed = ballData.speed*2;
                            trail.style.boxShadow = "0 0 1rem rgb(0, 149, 255)";
                            trail.style.backgroundColor = "rgb(0, 149, 255)";
                        }
                    } else if (lastToTouchBall == 2) {
                        if (ongoing) {
                            ongoing = false;
                            ballData.resetSpeed();
                            trail.style.boxShadow = "";
                            trail.style.backgroundColor = "";
                        }
                    }
                    if (lastToTouchBall == 0) {
                        ongoing = false;
                        ballData.resetSpeed();
                        trail.style.boxShadow = "";
                        trail.style.backgroundColor = "";
                    }
                },1);
                setTimeout(() => {
                    try {
                        clearInterval(checkForPaddle);
                    } catch {
                        console.log("Effect was discarded");
                    }
                    this.effectActive = false;
                    ballData.resetSpeed();
                    leftPaddle.style.boxShadow = "none";
                    trail.style.boxShadow = "";
                    trail.style.backgroundColor = "";
                }, this.effectDuration);
            }
            },1);
        } else if (lastToTouchBall == 2) {
            rightPaddle.style.boxShadow = "0 0 2rem rgb(0, 149, 255)";
            let waitForTurn = setInterval(() => { if (lastToTouchBall == 1) {
                clearInterval(waitForTurn);
                let checkForPaddle = setInterval(() => {
                    if (lastToTouchBall == 2) {
                        if (!ongoing) {
                            ongoing = true;
                            ballData.speed = ballData.speed*2;
                            trail.style.boxShadow = "0 0 1rem rgb(0, 149, 255)";
                            trail.style.backgroundColor = "rgb(0, 149, 255)";
                        }
                    } else if (lastToTouchBall == 1) {
                        if (ongoing) {
                            ongoing = false;
                            ballData.resetSpeed();
                            trail.style.boxShadow = "";
                            trail.style.backgroundColor = "";
                        }
                    }
                    if (lastToTouchBall == 0) {
                        ongoing = false;
                        ballData.resetSpeed();
                        trail.style.boxShadow = "";
                        trail.style.backgroundColor = "";
                    }
                },1);
                setTimeout(() => {
                    try {
                        clearInterval(checkForPaddle);
                    } catch {
                        console.log("Effect was discarded - Player scored");
                    }
                    this.effectActive = false;
                    ballData.resetSpeed();
                    rightPaddle.style.boxShadow = "none";
                    trail.style.boxShadow = "";
                    trail.style.backgroundColor = "";
                }, this.effectDuration);
            }
            },1);
        } else {
            this.bouncyPaddle();
        }
    },
    applyEffect() {
        switch(this.currentEffect) {
            case "smallPaddle": this.smallPaddle(); break;
            case "bouncyPaddle": this.bouncyPaddle(); break;
        }
    },
}



//depending on which side the ball hit, this function calculates the new direction of the ball


function recalculateDirection(degrees = ballData.direction) { 
        if (rightSide) {
                ballData.direction = 360 - degrees;
                rightSide = false;
        }
        if (topSide) {
            if (degrees >= 180) {
                ballData.direction = 360 - (degrees - 180);
                topSide = false;
            } else if (degrees < 180) {
                ballData.direction = 360 - degrees - 180;
                topSide = false;
            }
        }
        if (leftSide) {
            ballData.direction = 360 - degrees;
            leftSide = false;
        }
        if (bottomSide) {
            if (degrees >= 180) {
                ballData.direction = 360 - (degrees - 180);
                bottomSide = false;
            } else if (degrees < 180) {
                ballData.direction = 360 - degrees - 180;
                bottomSide = false;
            }
        }
}


// paddle movement --------------------------------

// data about the paddles



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

/*
document.addEventListener("keyup", stopPaddle);
document.addEventListener("keydown", moveLeftPaddleUp);
document.addEventListener("keydown", moveLeftPaddleDown);
document.addEventListener("keydown", moveRightPaddleUp);
document.addEventListener("keydown", moveRightPaddleDown);
*/



// functions for testing purposes
/*

function logPressedKey(event) {
    console.log(event.code);
}

document.addEventListener("keypress", logPressedKey);

*/

// moves ball around using numpad (for testing purposes)

let noClipActive = false;
let noClipSpeed = 0.5;

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












