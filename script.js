const X_CLASS = 'x';
const O_CLASS = 'o';
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('#board');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const twoPlayersButton = document.getElementById('twoPlayersButton');
const computerButton = document.getElementById('computerButton');
const gameOptions = document.getElementById('gameOptions');
let oTurn;
let vsComputer = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

twoPlayersButton.addEventListener('click', () => {
    vsComputer = false;
    startGame();
});

computerButton.addEventListener('click', () => {
    vsComputer = true;
    startGame();
});

restartButton.addEventListener('click', showPlayerOptions);

function showPlayerOptions() {
    board.style.display = 'none';
    restartButton.style.display = 'none';
    gameOptions.style.display = 'flex';
    messageElement.innerText = '';
}

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerText = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.innerText = '';
    board.style.display = 'grid';
    restartButton.style.display = 'block';
    gameOptions.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (vsComputer && !oTurn) {
            setTimeout(computerMove, 500); // Add a small delay for better UX
        }
    }
}

function endGame(draw) {
    if (draw) {
        messageElement.innerText = 'Draw!';
    } else {
        messageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    }
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerText = currentClass === X_CLASS ? 'X' : 'O';
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function computerMove() {
    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];
    placeMark(cell, X_CLASS);
    if (checkWin(X_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}
