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

// function gamePlayer(type) {
//     let turn = false // private variable representing turn

//     getType = () => { return type }
//     setTurn = () => { turn = isTurn }
//     getTurn = () => { return turn }

//     return { getType, getTurn, setTurn }
// }

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
        if (winner) { console.log(`player ${currentTurn} wins!`); return }
        let tie = board.checkTie()
        if (tie) { console.log(`it's a tie!`); return }

        if (currentTurn === CELL.X) currentTurn = CELL.O 
        else currentTurn = CELL.X
    }

    return { newGame, takeTurn }
})(gameBoard)

// mock game
// gameManager.newGame()
// gameManager.takeTurn(0, 0) // x
// gameManager.takeTurn(0, 1) // o
// gameManager.takeTurn(1, 1) // x
// gameManager.takeTurn(0, 2) // o
// gameManager.takeTurn(1, 2) // x
// gameManager.takeTurn(1, 0) // o
// gameManager.takeTurn(2, 0) // x
// gameManager.takeTurn(2, 2) // o
// gameManager.takeTurn(2, 1) // x