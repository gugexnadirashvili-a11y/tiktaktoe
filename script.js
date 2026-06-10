// დაფის მნიშვნელობა
let origBoard;

// მოთამაშეები
const huPlayer = 'O';
const aiPlayer = 'X';

// მომგებიანი კომბინაციები
const winCombos = [
    [0, 1, 2], // ზედა ხაზი
    [3, 4, 5], // შუა ხაზი
    [6, 7, 8], // ქვედა ხაზი
    [0, 3, 6], // მარცხენა სვეტი
    [1, 4, 7], // შუა სვეტი
    [2, 5, 8], // მარჯვენა სვეტი
    [0, 4, 8], // დიაგონალი
    [6, 4, 2]  // დიაგონალი
];

// HTML-ის უჯრის ელემენტები
const cells = document.querySelectorAll('.cell');

// თამაშის დაწყება
startGame();

function startGame() {
    // მალავს წინა შედეგს
    document.querySelector(".endgame").style.display = "none";

    // ქმნის ცარიელ დაფას (0-8)
    origBoard = Array.from(Array(9).keys());

    // ვასუფთავებთ დაფას და ვამატებთ click listener-ებს
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');

        // რომ არ დაემატოს ორჯერ
        cells[i].removeEventListener('click', turnClick, false);
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {

    // თუ უჯრა თავისუფალია
    if (typeof origBoard[square.target.id] === 'number') {

        // ადამიანის სვლა
        turn(square.target.id, huPlayer);

        // თუ თამაში არ დასრულდა, კომპიუტერი აკეთებს სვლას
        if (!checkWin(origBoard, huPlayer) && !checkTie()) {
            aiTurn();
        }
    }
}

function turn(squareId, player) {

    // განვაახლოთ დაფა
    origBoard[squareId] = player;

    // განვაახლოთ HTML
    document.getElementById(squareId).innerText = player;

    // შევამოწმოთ მოგება
    let gameWon = checkWin(origBoard, player);

    if (gameWon) {
        gameOver(gameWon);
    }
}

function aiTurn() {

    // კომპიუტერი აკეთებს მხოლოდ ერთ სვლას
    if (!checkWin(origBoard, aiPlayer) && !checkTie()) {
        turn(bestSpot(), aiPlayer);
    }
}

function checkWin(board, player) {

    // მოთამაშის დაკავებული უჯრები
    let plays = board.reduce(
        (a, e, i) => (e === player ? a.concat(i) : a),
        []
    );

    let gameWon = null;

    // ვამოწმებთ მომგებიან კომბინაციებს
    for (let [index, win] of winCombos.entries()) {

        if (win.every(elem => plays.indexOf(elem) > -1)) {

            gameWon = {
                index: index,
                player: player
            };

            break;
        }
    }

    return gameWon;
}

function gameOver(gameWon) {

    // გამოვაჩინოთ მომგებიანი კომბინაცია
    for (let index of winCombos[gameWon.index]) {

        document.getElementById(index).style.backgroundColor =
            gameWon.player === huPlayer ? "blue" : "red";
    }

    // მოვაშოროთ click listener-ები
    for (let i = 0; i < cells.length; i++) {

        cells[i].removeEventListener('click', turnClick, false);
    }

    // შედეგის გამოცხადება
    declareWinner(
        gameWon.player === huPlayer ? "მოიგე!" : "წააგე :("
    );
}

function declareWinner(who) {

    document.querySelector(".endgame").style.display = "block";

    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(board) {

    // ვაბრუნებთ თავისუფალ უჯრებს
    return board.filter(s => typeof s === 'number');
}

function bestSpot() {

    // საუკეთესო სვლა minimax-ით
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {

    // თუ თავისუფალი უჯრები აღარ დარჩა
    if (emptySquares(origBoard).length === 0) {

        for (let i = 0; i < cells.length; i++) {

            cells[i].style.backgroundColor = "green";

            cells[i].removeEventListener('click', turnClick, false);
        }

        declareWinner("ფრე!");

        return true;
    }

    return false;
}

function minimax(newBoard, player) {

    // თავისუფალი უჯრები მოცემულ დაფაზე
    let emptySpots = emptySquares(newBoard);

    // საბოლოო მდგომარეობების შემოწმება
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    }

    if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    }

    if (emptySpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    // ყველა შესაძლო სვლის გამოცდა
    for (let i = 0; i < emptySpots.length; i++) {

        let move = {};

        move.index = newBoard[emptySpots[i]];

        // დროებით ვასრულებთ სვლას
        newBoard[emptySpots[i]] = player;

        // რეკურსიული გამოძახება
        if (player === aiPlayer) {

            let result = minimax(newBoard, huPlayer);

            move.score = result.score;

        } else {

            let result = minimax(newBoard, aiPlayer);

            move.score = result.score;
        }

        // ვაბრუნებთ საწყის მდგომარეობას
        newBoard[emptySpots[i]] = move.index;

        moves.push(move);
    }

    // საუკეთესო სვლის არჩევა
    let bestMove;

    if (player === aiPlayer) {

        let bestScore = -10000;

        for (let i = 0; i < moves.length; i++) {

            if (moves[i].score > bestScore) {

                bestScore = moves[i].score;

                bestMove = i;
            }
        }

    } else {

        let bestScore = 10000;

        for (let i = 0; i < moves.length; i++) {

            if (moves[i].score < bestScore) {

                bestScore = moves[i].score;

                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
