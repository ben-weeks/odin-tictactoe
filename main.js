/* 
    Game:
        Variables:
            - board[2][2] (rows and cols - 0: none, 1: X, 2: O)
        Functions:
            - getBoardState(row, col) - get board state at given row/col
            - setBoardState(row, col, value) - set board state at given row/col
            - checkWin(player) - check if a player has won
    Player:
        Variables:
        Functions:
            - playTurn(row, col) - try to play at a given position
*/

// main game object as IIFE
const game = (function() {
    // create enum for board state
    const cell = { NONE: 0, X: 1, O: 2 }
    // create board array using this weird syntax... thanks google
    let board = Array.from({ length: 3 }, () => new Array(3).fill(cell.NONE));  

    // getter and setter for board for encapsulation
    const getBoardState = (row, col) => { return board[row][col] }
    const setBoardState = (row, col, value = 0) => { 
        if (value < 0 || value > 2) return false // return false if value is not valid
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

    // return relevant object data (as object itself)
    return { getBoardState, setBoardState, checkWin }
})();

function player(type, turn) {
    // getter for type
    getType = () => { return type }
    getTurn = () => { return turn }

    return { getType }
}

// game.setBoardState(0,0,1)
// game.setBoardState(0,1,1)
// game.setBoardState(0,2,1)
// console.log(game.checkWin(1))