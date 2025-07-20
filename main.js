// ONE global scoped variable as enum
const CELL = { NONE: -1, X: 0, O: 1 }

// gameBoard as IIFE
const gameBoard = (function() {
    // create board array using this weird syntax... thanks google
    let board = Array.from({ length: 3 }, () => new Array(3));  

    // board reset
    const resetBoard = () => { 
        for (var row = 0; row < 3; row++) { for (var col = 0; col < 3; col++) { board[row][col] = CELL.NONE } }
    }

    // print board (debug)
    const printBoard = () => { console.log(board) }

    // getter and setter for board for encapsulation
    const getBoardCell = (row, col) => { return board[row][col] }
    
    const setBoardCell = (row, col, value = 0) => { 
        if (value !== CELL.NONE && value !== CELL.X && value !== CELL.O) return false // return false if value is not valid
        board[row][col] = value 
        return true // return true if assignment was successful (i.e., passed value is valid)
    }
    
    const checkWin = (player) => {
        // check rows
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] === player &&
                board[row][1] === player &&
                board[row][2] === player
            ) return true
        }
        // check cols
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col] === player &&
                board[1][col] === player &&
                board[2][col] === player
            ) return true
        }
        // check diagonals
        if (board[1][1] === player) {
            if (
                (board[0][0] === player && board[2][2] === player) ||
                (board[0][2] === player && board[2][0] === player)
            ) return true
        }
        return false
    }

    const checkTie = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === CELL.NONE) return false    
            }
        }
        return true
    }

    // return relevant object data (as object itself)
    return { resetBoard, printBoard, getBoardCell, setBoardCell, checkWin, checkTie }
})()

// gameManager as IIFE
const gameManager = (function(board) {
    let currentTurn = CELL.X // 0 = X's turn; 1 = O's turn (-1 is empty)

    const newGame = () => {
        currentTurn = CELL.X // set to X's turn
        board.resetBoard() // reset the board to all empty
    }

    const takeTurn = (row, col) => {
        // set board to given move
        if (board.getBoardCell(row, col) === CELL.NONE) { 
            board.setBoardCell(row, col, currentTurn)
            console.log(`player ${currentTurn} moved to position (${row}, ${col})`)
        }
        
        let winner = board.checkWin(currentTurn) // check for a win
        let tie = board.checkTie() // check for a tie

        // return 0 or 1 on win (whoever won), and -1 if tie
        if (winner) return currentTurn
        if (tie) return -1

        if (currentTurn === CELL.X) currentTurn = CELL.O 
        else currentTurn = CELL.X
    }

    // turn getter for display manager
    const getTurn = () => { return currentTurn }

    return { newGame, takeTurn, getTurn }
})(gameBoard)

const displayManager = (function(game) {
    const gameBoardElement = document.querySelector(".game-board")
    const gameCells = Array.from({ length: 3 }, () => new Array(3)); 

    const playerXName = document.querySelector("#player-x-name-input")
    const playerOName = document.querySelector("#player-o-name-input")

    const displayInit = () => {
        // add cells
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                gameCells[row][col] = document.createElement("button")
                gameCells[row][col].classList.add("game-cell")
                gameBoardElement.appendChild(gameCells[row][col])

                // add the event listener right in the loop? sure
                gameCells[row][col].addEventListener("click", () => {
                    displayTurn(gameCells[row][col], row, col, game.getTurn())
                })
            }
        }

        // start a new game
        game.newGame()
    }

    // this is probably bad and inconsistent syntax but I don't want to write all this logic
    // in the displayInit loop
    function displayTurn(btn, row, col, turn) {
        btn.textContent = (turn === 0) ? "❎" : "🅾️"
        btn.disabled = true 
        let gameResult = game.takeTurn(row, col) // will return 0 or 1 if there is a winner or tie
        console.log(gameResult)

        // check game result
        if (gameResult !== undefined) {
            if (gameResult === 0) {
                alert("X wins!")
            } else if (gameResult === 1) {
                alert("O wins!")
            } else {
                alert("Tie!")
            }
        }
    }

    return { displayInit }
})(gameManager)

window.onload = function() { displayManager.displayInit() }