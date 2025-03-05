// Tic Tac Toe consists of two players and a 3x3 gameboard
// Player 1 is X's and Player 2 is O's
// A Player wins when there is 3 consecutive X's or O's eihter horizontally, vertically, or diagonally

/**
 * Objects needed:
 *      Player(name, marker)
 *          name - stores player name
 *          score - holds the number of times the player has won
 *          marker - stores the type of marker (either X or O)
 *          isCurrentTurn - tracks if it is the player's current turn
 *          toggleTurn() - toggles the player's turn value between true and false
 *      GameBoard(player1, player2)
 *          spaces[] - holds the spaces of the gameboard in an array
 *          initiliazeBoard() - creates a 3x3 gameboard in the DOM
 *          placeMarker() - places a marker, either an X or an O, on a space in the gameboard
 *          checkIfWinner() - check if there are 3 consecutive markers either horizontally, vertically, or diagonally
 *          announceWinner() - announce winner once there are 3 consecutive markers and increase the winning Player's score by 1
 *          clearBoard() - clears the board of all markers
 *      Round(player1Choice, player2Choice)
 *          currentRound - holds the current round number
 *          player1Choice[] - stores the position of the marker Player 1 placed this round
 *          player2Choice[] - stores the position of the marker Player 2 placed this round
 *          startNextRound() - resets values of player1Choice and player2Choice and increments currentRound by 1
 */

const gameContainer = document.querySelector('.game');
const content = document.querySelector('.content');
const newGameButton = document.querySelector('#newGame');
const resetGameButton = document.querySelector('#resetGame');
const playerOneScoreText = document.querySelector('.playerOneScore');
const playerTwoScoreText = document.querySelector('.playerTwoScore');
const winnerMessage = document.querySelector('.winnerMessage');
let globalPlayer1, globalPlayer2, gameboard, gamestate;


// Player Object
function Player(name, marker, playerNumber) {
    this.name = name;
    this.marker = marker;
    this.playerNumber = playerNumber;
    this.isCurrentTurn = false;

    // Used to track if it is the player's turn
    this.toggleTurn = function() {
        this.isCurrentTurn = !this.isCurrentTurn;
    };

    // Reset's turn to default value of false. Used when resetting score and game
    this.resetTurn = function() {
        this.isCurrentTurn = false;
    }
}

function GameBoard(player1, player2) {

    // Create the gameboard on the DOM
    this.initializeBoard = function() {
        for (i = 0; i < 9; i++) {
            const gameColumn = document.createElement('div');
            gameColumn.id = 'col' + (i);
            gameColumn.classList.add('game-col');
            gameContainer.appendChild(gameColumn);
        }
    };

    this.placeMarker = function(position, player) {
        /**
         * Place marker on the game board and update the spaces array to hold the marker value
         * in the correct spot
         */
        if (position.textContent == '') {
            let markerEl = document.createElement('p');
            markerEl.classList.add('marker');
            markerEl.textContent = player.marker;
            position.appendChild(markerEl);
            return true;
        } else {
            return false;
        }
    };

    this.clearBoard = function() {
        /**
         * clear the board and prepare for a new game
         */
        const gameCols = document.querySelectorAll('.game-col');
        for (i = 0; i < gameCols.length; i++) {
            gameCols[i].textContent = '';
        }
    };
}

function GameState(player1, player2) {
    this.spaces = ['','','','','','','','',''];
    this.winner;
    this.score = [0, 0];

    // Track the X's and O's on the gameboard via an array with 9 empty values. If there is a horizontal,
    // vertical, or diagonal match, announce the winner
    this.addPlayerChoice = function(position, player) {
        const positionId = position.id.replace(/[a-z]/g, '');
        this.spaces[positionId] = player.marker;

        if (player.playerNumber == 1) {
            for (i = 0; i < this.spaces.length; i++) {
                if (this.spaces[i] == 'X' && this.spaces[i+3] == 'X' && this.spaces[i+6] == 'X') {
                    this.winner = player1;
                    this.score[0]++;
                }
                if (this.spaces[i] == 'X' && this.spaces[i+1] == 'X' && this.spaces[i+2] == 'X') {
                    this.winner = player1;
                    this.score[0]++;
                }
                if (this.spaces[i] == 'X' && this.spaces[i+4] == 'X' && this.spaces[i+8] == 'X') {
                    this.winner = player1;
                    this.score[0]++;
                }
                if (this.spaces[i+2] == 'X' && this.spaces[i+4] == 'X' && this.spaces[i+6] == 'X') {
                    this.winner = player1;
                    this.score[0]++;
                }
            }
        } else {
            for (i = 0; i < this.spaces.length; i++) {
                if (this.spaces[i] == 'O' && this.spaces[i+3] == 'O' && this.spaces[i+6] == 'O') {
                    this.winner = player2;
                    this.score[1]++;
                }
                if (this.spaces[i] == 'O' && this.spaces[i+1] == 'O' && this.spaces[i+2] == 'O') {
                    this.winner = player2;
                    this.score[1]++;
                }
                if (this.spaces[i] == 'O' && this.spaces[i+4] == 'O' && this.spaces[i+8] == 'O') {
                    this.winner = player2;
                    this.score[1]++;
                }
                if (this.spaces[i+2] == 'O' && this.spaces[i+4] == 'O' && this.spaces[i+6] == 'O') {
                    this.winner = player2;
                    this.score[1]++;
                }
            }
        }
        
        if (this.winner) {
            winnerMessage.textContent = this.winner.name + ' is the winner!';
            playerOneScoreText.textContent = this.score[0];
            playerTwoScoreText.textContent = this.score[1];
        }
    };

    // Start a new round by erasing the gameboard an resetting the value of winner
    this.nextRound = function() {
        this.winner = null;
        this.spaces = ['','','','','','','','',''];
        winnerMessage.textContent = '';
    };

    // Reset the score and delete the player objects so that new players can play
    this.resetScore = function() {
        this.score = [0, 0];
        globalPlayer1, globalPlayer2 = null;
        playerOneScoreText.textContent = '';
        playerTwoScoreText.textContent = '';
    }
}

// Handle the form used to create new players
const playerForm = document.querySelector('#playerForm');
playerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(playerForm);
    globalPlayer1 = new Player(formData.get('playerOneName'), 'X', 1);
    globalPlayer2 = new Player(formData.get('playerTwoData'), 'O', 2);

    gameboard = new GameBoard(globalPlayer1, globalPlayer2);
    gamestate = new GameState(globalPlayer1, globalPlayer2);
});

// Adds the correct marker to the gameboard space that is clicked depending upon 
// which player's turn it is
const gameCols = document.querySelectorAll('.game-col');
gameCols.forEach(el => {
    el.addEventListener('click', function() {
        if (globalPlayer1 && globalPlayer2) {
            if (globalPlayer2.isCurrentTurn) {
                if (gameboard.placeMarker(el, globalPlayer2)) {
                    if (!gamestate.winner) {
                        gamestate.addPlayerChoice(el, globalPlayer2);
                    }
    
                    globalPlayer1.toggleTurn();
                    globalPlayer2.toggleTurn();
                }
            } else {
                if (gameboard.placeMarker(el, globalPlayer1)) {
                    gamestate.addPlayerChoice(el, globalPlayer1);
                    globalPlayer2.toggleTurn();
                    globalPlayer1.toggleTurn();
                }
            }
        }
    });
});

// Starts a new game
newGameButton.addEventListener('click', function() {
    gamestate.nextRound();
    gameboard.clearBoard();

    if (globalPlayer1 && globalPlayer2) {
        globalPlayer1.resetTurn();
        globalPlayer2.resetTurn();
    }
});

// Reset's the game so new players can play
resetGameButton.addEventListener('click', function() {
    gamestate.nextRound();
    gameboard.clearBoard();
    gamestate.resetScore();

    if (globalPlayer1 && globalPlayer2) {
        globalPlayer1.resetTurn();
        globalPlayer2.resetTurn();
    }
});
