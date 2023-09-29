const newGame = document.getElementById("new-game");
const endGame = document.getElementById("end-game");
const showButton = document.getElementById("show");
const help = document.getElementById("help");
const timer = document.getElementsByClassName("timer")[0];
let gameOn = false;

const buttons = document.getElementsByClassName("game-buttons")[0];

const game = document.getElementById("game-block");
const backdrop = document.getElementsByClassName("backdrop")[0];
const modal = document.getElementsByClassName("modal")[0];
let options = document.querySelectorAll("input[type='radio']");

let option = 2;
let firstTime = true;
let countdown;

let unMaskedElements = [];

let images = ["./images/lime.jpg", "./images/cherries.jpg",
    "./images/apple.jpg", "./images/orange.jpg",
    "./images/arbutus.jpg", "./images/pineapple.jpg",
    "./images/raspberries.jpg", "./images/pomegranate.jpg",
    "./images/strawberry.jpg", "./images/macarons.jpg",
    "./images/apricots.jpg", "./images/kiwi.jpg"];

let updateArray = [];

function renderUI() {

    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", () => {
            option = document.querySelector("input:checked").value;
            updateArray = updateArrayElements(option);
            updateImages();
        });
    }
    updateArray = updateArrayElements(option);
    updateImages();
    disableElement(showButton);
    disableElement(help);
    hide(endGame);
}

renderUI();
// start.addEventListener("click", () => {
//     enableElement(help);
//     const userInput = confirm("You have 60 seconds to solve the Game! (series " + option + " )");
//     if (userInput) {
//         backdrop.style.display = "none";
//         modal.style.display = "none";
//         document.querySelector("fieldset").disabled = true;
//     }
// });

newGame.addEventListener("click", () => {
    gameOn = true;
    removeBackdrop();
    for (let i = 0; i < 60; i++) {
        countdown = setTimeout(() => {
            timer.innerHTML = i < 10 ? '0' + i : i;
        }, i * 1000);
    }
    show(endGame);
    hide(newGame);
    enableElement(showButton);
    enableElement(help);
    disableElement(document.querySelector("fieldset"));
    setTimeout(() => {
        gameOver();
        // window.location.reload();
    }, 60000);
});

endGame.addEventListener("click", () => {
    endGame.innerHTML = "<b style='color:red'>ENDING...</b>";
    setTimeout(() => {
        window.location.reload();
        show(newGame);
        hide(endGame);
    }, 1000);
});

showButton.addEventListener("click", unMaskAll);

help.addEventListener("click", () => {
    clearTimeout();
    alert("You need to unMask all the matching blocks to win the game. In this game there are " + option + " copies of each item. All the best!");
});


function updateArrayElements(series) {
    let distinctElements = 24 / series;
    let distictImagesArray = images.slice(0, distinctElements);
    let finalArray = [];
    for (let i = 0; i < series; i++) {
        finalArray.push(...distictImagesArray);
    }
    return finalArray;
}


function updateImages() {
    let shuffled_images = updateArray.sort(() => (Math.random() > 0.5) ? 2 : -1);

    if (firstTime) {
        for (let i = 0; i < shuffled_images.length; i++) {
            let box = document.createElement('div');
            box.className = "img";
            box.style.background = "url(" + shuffled_images[i] + ")";
            box.addEventListener("click", (e) => {
                box.classList.add("removeMask");
                compareImage(e.target);
            });
            document.getElementById("game-block").appendChild(box);
            firstTime = false;
        }
    } else {
        let child = document.getElementById("game-block").children;
        for (let i = 0; i < shuffled_images.length; i++) {
            child[i + 1].style.background = "url(" + shuffled_images[i] + ")";
            child[i + 1].classList.remove("removeMask");
        }
    }

}

function compareImage(ele) {
    if (unMaskedElements.length === 0 || unMaskedElements.length % option === 0) {
        unMaskedElements.push(ele);
    }
    else {
        if (unMaskedElements.at(unMaskedElements.length - 1).style.background === ele.style.background) {
            unMaskedElements.push(ele);
        } else {
            while (unMaskedElements.length % option !== 0) {
                // console.log(unMaskedElements.at())
                let lastEle = unMaskedElements.pop();
                setTimeout(() => {
                    lastEle.classList.remove("removeMask");
                    ele.classList.remove("removeMask");
                }, 800);
            }
        }
    }
    console.log(unMaskedElements);
    if (unMaskedElements.length === 24) {
        alert("WOOHOOO, You Win!!");
        setTimeout(() => {
            gameOver();
        }, 1000);
    }

}

function gameOver() {
    alert("GAME OVER!!! You were able to unmask " + unMaskedElements.length + " blocks.");
    window.location.reload();
}

function unMaskAll() {
    alert("This will show the solution and terminate the game. You unmasked " + unMaskedElements.length + " blocks.");
    let elements = document.getElementById("game-block").children;
    for (let i = 1; i < elements.length; i++) {
        elements[i].classList.add("removeMask");
    }
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}
function disableElement(ele) {
    ele.disabled = true;
}
function enableElement(ele) {
    ele.disabled = false;
}
function removeBackdrop() {
    backdrop.classList.toggle("hidden");
}
function hide(ele) {
    ele.style.display = "none";
}
function show(ele) {
    ele.style.display = "block";
}