const gameField = document.getElementById('game-field');
const playerInput = document.getElementById('players-input');
const SCOREBOARD = document.getElementById('scoreboard');
const nextRoundContainer = document.getElementById('end-round');
const gameButton = document.querySelectorAll('.game-button');
const buttonContainer = document.getElementById('game-type');
const inputButton = document.getElementById('player-input-submit');
let listOfPlayers = [];

let PLAYERONE;
let PLAYERTWO;
let currentPlayer = null;


const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]
const displayController = (() => {

    gameButton.forEach((button) => {
        button.addEventListener("click", () => {
            if(button.innerHTML == "Vs. Player "){
                displayController.toggle(playerInput, "show");
                displayController.toggle(buttonContainer, "show");
                displayController.toggle(SCOREBOARD, "show");
            }
            else {
                //logic for Ai but use 2 players for now
                buttonContainer.style.display = "none";
                playerInput.style.display = "block";
            };
            gameBoard.clear();
            gameBoard.setField();
        });

    });

    const toggle = (fieldId, status) => {
        if(status === "show"){
            fieldId.style.display = "block"
        }
        else{
            fieldId.style.display = "none";
        }
    };

    inputButton.addEventListener("click", () => {
        if(document.getElementById('player-one').value === "" ||
         document.getElementById('player-two').value === ""){
            alert("Please enter valid names for player one and player two")
         }
         else{
            PLAYERONE = playGame.Player(document.getElementById('player-one').value, './game-symbols/X.png');
            PLAYERTWO = playGame.Player(document.getElementById('player-two').value, './game-symbols/O.png');
            currentPlayer = PLAYERONE;
            listOfPlayers.push(PLAYERONE, PLAYERTWO);
            updateScoreboard();
            toggle(playerInput, "hide");
            toggle(SCOREBOARD, "show");
         }
    })

    const updateScoreboard = () => {
        SCOREBOARD.children[0].innerText = PLAYERONE.name + ": " + PLAYERONE.score
        SCOREBOARD.children[2].innerText = PLAYERTWO.name + ": " + PLAYERTWO.score
    };

    return {toggle, updateScoreboard}

})();
const gameBoard = (() => {

    const createCell = ((cellId) => {
        this.cellId = cellId;
        let cell = document.createElement('div');
        cell.setAttribute('id', cellId);
        cell.setAttribute('class', 'cell')
        return cell;
    });

    const setField = () => {
        let counter = 0;
        for(let i = 0; i < 3; i++){
            let row = document.createElement('div');
            row.setAttribute('class', 'row');
            row.setAttribute('id', i);
            for(let j = 0; j < 3; j++){
                row.appendChild(createCell(counter));
                counter++;
            }
            gameField.appendChild(row);
        }
        gameField.style.pointerEvents = "";
        cellClick();
    };

    const clear = () => {
        // clear the gamefield logic here
        while (gameField.firstChild) {
            gameField.removeChild(gameField.firstChild);
        }
    }

    const cellClick = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                if(currentPlayer == null){
                    console.log("Please enter names and start the game first");
                    return false
                }
                else if(cell.innerHTML == ""){
                    cell.innerHTML = '<img src="' + currentPlayer.marker+ '">';
                    currentPlayer.fields.push(Number(cell.getAttribute('id')))
                    playGame.checkWin(currentPlayer.fields);
                    if(currentPlayer === PLAYERONE){
                        currentPlayer = PLAYERTWO;
                    }
                    else{
                        currentPlayer = PLAYERONE;
                    }
                }
            });
        });
        };

    return { setField, clear };
})();

const playGame = (() => {
    // insert game logic here //
    const Player = (name, marker) => {
        this.name = name;
        this.marker = marker
        this.score = 0;
        this.fields = [];

        return {name, marker, score, fields, Player};
    }

    const endGame = () => {
        const nextRoundBtn = document.querySelectorAll('.end-game-button')
        // logic to stop the game from continuing
        displayController.toggle(nextRoundContainer, "show");

        gameField.style.pointerEvents = "none";

        // add buttons to pick what happens next
        nextRoundBtn.forEach((button) => {
            button.addEventListener("click", () => {
                if(button.id === "play-again-btn"){
                    gameBoard.clear();
                    gameBoard.setField();
                    gameField.style.pointerEvents = "";
                    PLAYERONE.fields = [];
                    PLAYERTWO.fields = [];
                }
                else if(button.id === "restart-btn"){
                    gameBoard.clear();
                    PLAYERONE.score = 0;
                    PLAYERTWO.score = 0;
                    displayController.updateScoreboard();
                    gameBoard.setField();
                    PLAYERONE.fields = [];
                    PLAYERTWO.fields = [];
                    gameField.style.pointerEvents = "";
                }
                else if(button.id === "end-game-btn"){
                    gameBoard.clear();
                    PLAYERONE = null;
                    PLAYERTWO = null;
                    currentPlayer = null;
                    gameField.style.pointerEvents = "none";
                    displayController.toggle(SCOREBOARD, "hide");
                    displayController.toggle(buttonContainer, "show");
                    displayController.toggle(playerInput, "hide");

                }
                displayController.toggle(nextRoundContainer)
                });
            });
        // logic to play another round

        // logic to announce winner at the end of the game.
    }

    const checkWin = (playerFields) => {
        for(let i = 0; i < WINNING_COMBINATIONS.length; i++) {
            if(WINNING_COMBINATIONS[i].every(elem => playerFields.includes(elem))){
                currentPlayer.score = currentPlayer.score + 1;
                displayController.updateScoreboard();
                console.log("Winner!");
                endGame();
                return true
            };
        };
        if(playerFields.length > 4){
            console.log("Draw!");
            endGame();
            return true;
        };
    }

    return {Player, checkWin}
})();
