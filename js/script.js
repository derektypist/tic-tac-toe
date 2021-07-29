$(document).ready(function() {
    // Set Up Global Variables
    let gameInPlay = false;
    let secondPlayer;
    let winCombos = [[1,2,3],
                    [4,5,6],
                    [7,8,9],
                    [1,4,7],
                    [2,5,8],
                    [3,6,9],
                    [1,5,9],
                    [7,5,3]];
    let playerOneScore = 0;
    let playerTwoScore = 0;
    let timeOuts = [];
    let numFilledIn = 0;
    let currentBoard = {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:''};

    /* 
        Display Functions
    */

    // Function to Hide Game Starter
    function hideGameStarter() {
        $('.game-starter').fadeOut();
    }

    // Function to Show Game Starter
    function showGameStarter(isTwoPlayer) {
        let message;
        if (isTwoPlayer) {
            message = "Player 1 : Would you like X or O?";
        } else {
            message = "Would you like to be X or O?"
        }

        timeOuts.push(setTimeout(function() {
            $('.game-starter').fadeIn(500).children('p').text(message);
        }, 700));
    }

    // Function to Show Game Choice
    function showGameChoice() {
        $('.game-choice').fadeIn(600);
    }

    // Function to Hide Game Choice
    function hideGameChoice() {
        $('.game-choice').fadeOut(600);
    }

    // Function to Show Player One Prompt
    function showPlayerOnePrompt() {
        if (secondPlayer) {
            $('.player-one-turn p').text('Go Player 1!');
        } else {
            $('.player-one-turn p').text('Your turn!');
        }
    }
});