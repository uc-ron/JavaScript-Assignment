// *************** CONSTANTS *****************

const newGame = document.getElementById("new-game");
const endGame = document.getElementById("end-game");
const showButton = document.getElementById("show");
const helpButton = document.getElementById("help");
const timer = document.getElementsByClassName("timer")[0];

const buttons = document.getElementsByClassName("game-buttons")[0];

const game = document.getElementById("game-block");
const backdrop = document.getElementsByClassName("backdrop")[0];
let options = document.querySelectorAll("input[type='radio']");
let fieldset = document.querySelector("fieldset");

let option = 2;
let firstTime = true;
let timeOuts = [];
let timeInSec = 60;

// all blocks that will be unmasked will be stored here
let unMaskedElements = [];
// this array will be used as final images array and will be updated using updateArrayElement function
let updateArray = [];

// images 
let images = ["./images/lime.jpg", "./images/cherries.jpg",
"./images/apple.jpg", "./images/orange.jpg",
"./images/arbutus.jpg", "./images/pineapple.jpg",
"./images/raspberries.jpg", "./images/pomegranate.jpg",
"./images/strawberry.jpg", "./images/macarons.jpg",
"./images/apricots.jpg", "./images/kiwi.jpg"];


// *************** FUNCTION DEFINATIONS *****************
    
    
// This function is responsible for providing the array of images that will finally be used
function updateArrayElements(series) {
    let distinctElements = 24 / series;
    let distictImagesArray = images.slice(0, distinctElements);
    let finalArray = [];
    for (let i = 0; i < series; i++) {
        finalArray.push(...distictImagesArray);
    }
    return finalArray;
}

// This function updates the hidden images when user changes series option
function updateImages() {
    let shuffled_images = updateArray.sort(() => (Math.random() > 0.5) ? 2 : -1);
    
    if (firstTime) {
        // Will run if game is loaded for first time 
        for (let i = 0; i < shuffled_images.length; i++) {
            // creates element and append to grid
            let box = document.createElement('div');
            box.className = "img";
            box.style.background = "url(" + shuffled_images[i] + ")";
            box.addEventListener("click", onBlockClick);
            document.getElementById("game-block").appendChild(box);
            firstTime = false;
        }
    } else {
        // replace old images with new images
        let child = document.getElementById("game-block").children;
        for (let i = 0; i < shuffled_images.length; i++) {
            child[i + 1].style.background = "url(" + shuffled_images[i] + ")";
            child[i + 1].classList.remove("removeMask");
        }
    }
}

// updates UI for first time as well as for a new game
function updateUI() {
    if (firstTime) {
        backdrop.innerHTML = "<h1 class='message'>Select series option & click on new Game.</h1>";
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("click", () => {
                option = document.querySelector("input:checked").value;
            });
        }
    }
    while (unMaskedElements.length !== 0) {
        let lastEle = unMaskedElements.pop();
        lastEle.addEventListener("click", onBlockClick);
    }
    updateArray = updateArrayElements(option);
    updateImages();
}

// this function will render UI for very first time
function renderUI() {
    updateUI();
    showNewGameButton();
}

// remove-mask from blocks and also compare blocks
function onBlockClick(e) {
    e.target.classList.add("removeMask");
    compareImage(e.target);
}

// start game function
function startGame() {
    removeBackdrop();
    disableElement(fieldset);
    for (let i = 0; i <= timeInSec; i++) {
        timeOuts.push(setTimeout(() => {
            timer.innerHTML = timeInSec - i;
        }, i * 1000));
    }
    showEndGameButton();
    timeOuts.push(setTimeout(() => {
        gameOver();
    }, timeInSec * 1000));
};

// This function compares blocks style.background property 
function compareImage(ele) {
    if (unMaskedElements.length === 0 || unMaskedElements.length % option === 0) {
        ele.removeEventListener("click", onBlockClick);
        unMaskedElements.push(ele);
    }
    else {
        if (unMaskedElements.at(unMaskedElements.length - 1).style.background === ele.style.background) {
            ele.removeEventListener("click", onBlockClick);
            unMaskedElements.push(ele);
        } else {
            while (unMaskedElements.length % option !== 0) {
                let lastEle = unMaskedElements.pop();
                lastEle.addEventListener("click", onBlockClick);
                setTimeout(() => {
                    lastEle.classList.remove("removeMask");
                    ele.classList.remove("removeMask");
                }, 500);
            }
        }
    }
    if (unMaskedElements.length === 24) {
        userWon();
    }
}

// This function will run when user end game or time-limit gets over
function gameOver() {
    timer.innerHTML = "<span class='message lose'>Game Over<span>";
    backdrop.innerHTML = "<h3 class='message lose'>Game Over.<br> You un-masked " + unMaskedElements.length + " out of 24 blocks.</h3>";
    clearTimeouts();
    show(backdrop);
    showNewGameButton();
}

// This function will run when user wins
function userWon() {
    backdrop.innerHTML = "<h3 class='message'>YOU WON.</h3>";
    timer.innerHTML = "<span class='message'>You Win</span>";
    show(backdrop);
    clearTimeouts();
    showNewGameButton();
}

// this function will un-mask all blocks
function unMaskAll() {
    alert("This will show the solution and terminate the game. You unmasked " + unMaskedElements.length + " blocks.");
    let elements = document.getElementById("game-block").children;
    for (let i = 1; i < elements.length; i++) {
        elements[i].classList.add("removeMask");
    }
    timer.innerHTML = "<span class='message lose'>Game Over</span>";
    clearTimeouts();
    showNewGameButton();
}

function disableElement(ele) {
    ele.disabled = true;
}
function enableElement(ele) {
    ele.disabled = false;
}
function removeBackdrop() {
    backdrop.style.display = "none";
}
function hide(ele) {
    ele.style.display = "none";
}
function show(ele) {
    ele.style.display = "flex";
}
// will clear all setTimeouts 
function clearTimeouts() {
    while (timeOuts.length !== 0) {
        clearTimeout(timeOuts.pop());
    }
}

function showNewGameButton() {
    show(newGame);
    hide(endGame);
    enableElement(fieldset);
    disableElement(showButton);
    disableElement(helpButton);
}
function showEndGameButton() {
    show(endGame);
    hide(newGame);
    disableElement(fieldset);
    enableElement(showButton);
    enableElement(helpButton);
}

// ************* EVENT LISTENERS ********************

// adding functionality to new game button
newGame.addEventListener("click", () => {
    updateUI();
    backdrop.innerHTML = "<h3 class='message'>Loading...</h3>";
    setTimeout(() => {
        startGame();
    }, 500);
});

// this will end game after one sec of clicking in end game
endGame.addEventListener("click", () => {
    gameOver();
    showNewGameButton();
});

// 
// adding functionality to show button
showButton.addEventListener("click", unMaskAll);

// adding functionality to help button
helpButton.addEventListener("click", () => {
    backdrop.innerHTML = "<h3 class='message help'>You are required to un-mask all the blocks to win this game.<br> This game contains " + option + " copies of each elements.</h3>";
    show(backdrop);
    setTimeout(() => {
        hide(backdrop);
    }, 4000);
});

// *************** FUNCTION CALLS *****************

// Will render UI for very first time
renderUI();