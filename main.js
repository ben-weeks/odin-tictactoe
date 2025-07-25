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
    let Xscore = 0
    let Oscore = 0

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
    const getXScore = () => { return Xscore }
    const getOScore = () => { return Oscore }
    const updateXScore = () => { Xscore++ }
    const updateOScore = () => { Oscore++ }
    const resetScores = () => { Xscore = 0; Oscore = 0 }

    return { newGame, takeTurn, getTurn, getXScore, getOScore, updateXScore, updateOScore, resetScores }
})(gameBoard)

const displayManager = (function(game) {
    const gameBoardElement = document.querySelector(".game-board")
    const gameCells = Array.from({ length: 3 }, () => new Array(3))
    const playerTurn = document.querySelector(".player-turn") 
    const gameResetButton = document.querySelector(".game-reset")
    const scoreResetButton = document.querySelector(".score-reset")

    const playerXNameInput = document.querySelector("#player-x-name-input")
    const playerONameInput = document.querySelector("#player-o-name-input")

    const playerXScore = document.querySelector(".player-x-score")
    const playerOScore = document.querySelector(".player-o-score")

    // I don't like having these global scoped within the displayManager but I'm too lazy to come up with an alternate solution
    playerXNameInput.addEventListener("change", (e) => { e.preventDefault(); playerXName = playerXNameInput.value; displayScore() })
    playerONameInput.addEventListener("change", (e) => { e.preventDefault(); playerOName = playerONameInput.value; displayScore() })
    
    gameResetButton.addEventListener("click", (e) => { e.preventDefault(); game.newGame(); displayReset() })
    scoreResetButton.addEventListener("click", (e) => { 
        e.preventDefault()
        game.resetScores()
        game.newGame() 
        displayReset() 
    })

    // defaults
    let playerXName = playerXNameInput.value || "X"
    let playerOName = playerONameInput.value || "O"

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
        displayScore()
        playerTurn.textContent = ` ${playerXName}`
    }

    function displayReset() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                gameCells[row][col].textContent = ""
                gameCells[row][col].disabled = false
            }
        }
        playerTurn.textContent = ` ${playerXName}`
        displayScore()
    }

    function displayScore() {
        playerXScore.textContent = `${playerXName}: ${game.getXScore()}`
        playerOScore.textContent = `${playerOName}: ${game.getOScore()}`
    }

    function updateScore(player) {
        if (player === CELL.X) game.updateXScore()
        else game.updateOScore()
        displayScore()
    }

    // this is probably bad and inconsistent syntax but I don't want to write all this logic
    // in the displayInit loop
    async function displayTurn(btn, row, col, turn) {
        btn.textContent = (turn === CELL.X) ? "❎" : "🅾️"
        btn.disabled = true 
        playerTurn.textContent = (turn === 0) ? ` ${playerOName}` : ` ${playerXName}`
        let gameResult = game.takeTurn(row, col) // will return 0 or 1 if there is a winner or tie
        await new Promise(r => setTimeout(r, 100));

        // check game result
        if (gameResult !== undefined) {
            if (gameResult === CELL.X) {
                alert(`${playerXName} wins!`)
                updateScore(turn) // I hate this solution but it works
            } else if (gameResult === CELL.O) {
                alert(`${playerOName} wins!`)
                updateScore(turn)
            } else {
                alert("Tie!")
            }
            game.newGame()
            displayReset()
        }
    }

    return { displayInit }
})(gameManager)

window.onload = function() { displayManager.displayInit() }