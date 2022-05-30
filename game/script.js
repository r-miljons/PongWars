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
    console.log(keypressed);
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







