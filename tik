// დაფის მნიშვნელობა
var origBoard;

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
    [0, 4, 8], // დიაგონალი მარცხნიდან მარჯვნივ
    [6, 4, 2]  // დიაგონალი მარცხნიდან მარჯვნივ
];

// HTML-ის უჯრის ელემენტები
const cells = document.querySelectorAll('.cell');

// ტამაშის დაწყება
startGame();

function startGame() {
    // მალავს წინა შედეგის სედეგს
    document.querySelector(".endgame").style.display = "none";
    // ქმნის მასივს 9 ელემენტიით (0-8)
    origBoard = Array.from(Array(9).keys());
    // განვაახლოთ დადა და დავაყენოთ Event listen-ერები ყოველი უჯრისათვის
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    // თუ დაჭერილი უჯრა ცარიელია შეასრულე შემდეგი
    if (typeof origBoard[square.target.id] == 'number') {
        // მოთამაშე ასრულებს მოქმედებას
        turn(square.target.id, huPlayer);
        // თუ თამაში ფრე ან მოგებული არ არის, კომპიუტერი ასრულებს სვლას
        if (!checkWin(origBoard, huPlayer) && !checkTie()) {
            aiTurn();
        }
    }
}

function turn(squareId, player) {
    // განვაახლოტ დაფა შესრულებული მოქმედების მიხედვით
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    // ვამოწმებთ მორჩა თამაში თუ არა
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function aiTurn() {
    while (!checkWin(origBoard, aiPlayer) && !checkTie()) {
        turn(bestSpot(), aiPlayer);
        if (checkWin(origBoard, aiPlayer) || checkTie()) {
            break;
        }
        turn(bestSpot(), huPlayer);
    }
}

function checkWin(board, player) {
    // შევაგროვოთ ყველა უჯრის კორდინატი რომელიც მოთამაშეს აქვს მონიშნული
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    // ვამოწმებთ მოთამაშის დაკავებული უჯრებიდან რომელიმე თუ ავსებს მომგებიან კომბინაციებს
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    // მკვეთრად გამოვაჩინოთ მომგებიანი კომბინაცია
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "red";
    }
    //მოვაშოროთ უჯრაზე დაჭერის listen-ერები
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    // გამოვაცხადოთ მოიგო თუ წააგო მოთამაშემ
    declareWinner(gameWon.player == huPlayer ? "მოიგე!" : "წააგე :(");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    // დავაბრუნოთ ყველა დაკავებული უჯრა
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    // ვიპოვოთ საუკეთესო სვლა მინი მაქს ალგორითმის საშვალებით
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    // ვამოწმებთ თუ არც მოგებული გვყავს და არც ცარიელი ადგილები ფრეა
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("ფრე!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    // ყველა თავისუფალი უჯრა
    var emptySpots = emptySquares();

    // შევამოწმოთ თამაშის სიტუაცია
    if (checkWin(newBoard, huPlayer)) {
        return {score: -10}; // ადამიანმა მოიგო
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10}; // კომპიუტერმა მოიგო
    } else if (emptySpots.length === 0) {
        return {score: 0}; // ფრე
    }

    var moves = [];
    // შემოვუაროთ თავისუფალ უჯრებს
    for (var i = 0; i < emptySpots.length; i++) {
        var move = {};
        move.index = newBoard[emptySpots[i]];
        newBoard[emptySpots[i]] = player;

        // რეკურსიულად გამოვიძახოთ მინი მაქსის ალგორითმი შემდეგი მოთამაშესთვის
        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        // განვაახლოთ დათა
        newBoard[emptySpots[i]] = move.index;
        moves.push(move);
    }

    // ავარჩიოთ საუკეთესო სვლა
    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
