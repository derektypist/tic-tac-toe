$(document).ready(function() {
    // Set Up Global Variables
    let gameInPlay = false;
    let secondPlayer;
    let turn;
    let game;
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
    let playerOneSymbol = null;
    let playerTwoSymbol = null;
    let timeOuts = [];
    let numFilledIn = 0;
    let currentBoard = {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:''};

    initializeGame();

    // Function to Initialise Game
    function initializeGame() {
        numFilledIn = 0;
        currentBoard = {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:''};
        drawBoard();
    }

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
        $('.player-one-turn').animate({top:'-45px'},500);
    }

    // Function to Hide Player One Prompt
    function hidePlayerOnePrompt() {
        $('.player-one-turn').animate({top:'0'},500);
    }

    // Function to Show Player Two Prompt
    function showPlayerTwoPrompt() {
        if (secondPlayer) {
            $('.player-two-turn p').text('Go Player 2!');
        } else {
            $('.player-two-turn p').text(`Computer's turn`);
        }
        $('.player-two-turn').animate({top:'-45px'},500);
    }

    // Function to Hide Player Two Prompt
    function hidePlayerTwoPrompt() {
        $('.player-two-turn').animate({top:'0'},500);
    }

    // Function to Show Draw Message
    function showDrawMessage() {
        timeOuts.push(setTimeout(function() {
            $('.draw-message').fadeIn(500);
        }, 1500));
    }

    // Function to Hide Draw Message
    function hideDrawMessage() {
        $('.draw-message').fadeOut(1000);
    }

    // Function to Show Lose Message
    function showLoseMessage() {
        timeOuts.push(setTimeout(function() {
            $('.lose-message').fadeIn(500);
        }, 1500));
    }

    // Function to Hide Lose Message
    function hideLoseMessage() {
        $('.lose-message').fadeOut(1000);
    }

    // Function to Show Win Message
    function showWinMessage() {
        timeOuts.push(setTimeout(function() {
            $('.win-message').fadeIn(500).children('p').text(`Player ${turn} wins!!`)
        }, 1500));
    }

    // Function to Hide Win Message
    function hideWinMessage() {
        $('.win-message').fadeOut(1000);
    }

    // Function to draw board
    function drawBoard() {
        timeOuts.push(setTimeout(function() {
            let c = document.getElementById("my-canvas");
            let canvas = c.getContext("2d");
            canvas.lineWidth = 1;
            canvas.strokeStyle = "#fff";

            // Draw Vertical Lines
            canvas.beginPath();
            canvas.moveTo(100,0);
            canvas.lineTo(100,146.5);
            canvas.closePath();
            canvas.stroke();
            canvas.beginPath();
            canvas.moveTo(200,0);
            canvas.lineTo(200,146.5);
            canvas.closePath();
            canvas.stroke();

            // Draw Horizontal Lines
            canvas.lineWidth = 0.5;
            canvas.beginPath();
            canvas.moveTo(4,48.5);
            canvas.lineTo(296,48.5);
            canvas.closePath();
            canvas.stroke();

            canvas.beginPath();
            canvas.moveTo(4,98.5);
            canvas.lineTo(296,98.5);
            canvas.closePath();
            canvas.stroke();

        }, 1500));
    }

    // Function to Reset Squares
    function resetSquares() {
        $('.boxes').html('');
        for (let i=1;i<=9;i++) {
            let box = `<li class="${i}"><i class="letter"><span></span></i></li>`;
            $(box).appendTo($('.boxes'));
        }
    }

    // Function to Show Score
    function showScore() {
        if (secondPlayer) {
            $('.score-1').children('.name').text('player 1');
            $('.score-2').children('.name').text('player 2');
        } else {
            $('.score-1').children('.name').text('player 1');
            $('.score-2').children('.name').text('computer');
        }

        $('.score-1, .score-2').children('.points').text('0');
        $('.score-1, .score-2, .points-divider').fadeIn();
    }

    // Function to Update Score
    function updateScore(turn) {
        let currentScore = turn === 1 ? playerOneScore : playerTwoScore;
        $(`.score-${turn}`).children('.points').text(currentScore);
    }

    /*
        Game Logic Functions
    */

    // Function to See Who Starts
    function whoStarts() {
        let random = Math.floor(Math.random() * 2 + 1);
        return random;
    }

    // Function for Game Selection
    function gameSelection(item) {
        if ($(item).text() === 'One Player') {
            // Return what Second Value to Get
            return false;
        } else {
            return true;
        }
    }

    // Function for First Game
    function firstGame() {
        playerOneSymbol = $(this).text();
        playerTwoSymbol = playerOneSymbol == 'X' ? 'O' : 'X';
        turn = whoStarts();
        hideGameStarter();
        $('#my-canvas').animate({opacity:'1'},1200);
        $('.hard-reset').fadeIn(600);
        showScore();
        resetSquares();
        play();
    }

    // Function to Play Game
    function play() {
        gameInPlay = true;
        $('.boxes li').click(function() {
            playerTurn(this);
        });

        timeOuts.push(setTimeout(function() {
            if (turn === 1) {
                showPlayerOnePrompt();
            } else {
                showPlayerTwoPrompt();
            }
        }, 1500), setTimeout(function() {
            if (turn === 2 && secondPlayer) {
                computerPlay();
            }
        }, 1200));
    }

    // Function to Decide Player Turn
    function playerTurn(square) {
        let symbol = turn === 1 ? playerOneSymbol : playerTwoSymbol;
        let box = $(square).children('i').children('span');
        if (box.text() === '' && gameInPlay && (turn === 1 || (turn === 2 && secondPlayer))) {
            box.text(symbol);
            let number = $(square).attr('class');
            updateSquare(number,symbol);
            endTurn(symbol);
        }
        
    }

    // Function for Computer Play
    function computerPlay() {
        // Test Computer Move Suggestion
        let boxNumber;
        if (computerWhichMove(game) && turn === 2) {
            boxNumber = computerWhichMove(game);
            let currentBox = $(`.${boxNumber}`).children('i');
            let symbol = playerTwoSymbol;
            timeOuts.push(setTimeout(function() {
                currentBox.children('span').text(symbol);
                updateSquare(boxNumber, playerTwoSymbol);
                endTurn(symbol);
            }, 1000));
        }
    }

    // Function to End Turn
    function endTurn(symbol) {
        numFilledIn += 1;
        if (gameInPlay) {
            if (checkWin(symbol)[0]) {
                updateGameScore(turn);
                if (secondPlayer) {
                    showWinMessage();
                } else {
                    turn === 1 ? showWinMessage() : showLoseMessage();
                }
                gameInPlay = false;
                showWinningCombination();
                hidePlayerOnePrompt();
                hidePlayerTwoPrompt();
                reset();
            }

            // Stop If It is a draw
            else if (numFilledIn >=9) {
                gameInPlay = false;
                hidePlayerOnePrompt();
                hidePlayerTwoPrompt();
                showDrawMessage();
                turn = whoStarts();
                reset();
            }

            else {
                if (turn === 1) {
                    hidePlayerOnePrompt();
                    showPlayerTwoPrompt();
                    turn = 2;
                    // Call Computer Turn if no second player
                    if (!secondPlayer) {
                        computerPlay();
                    }
                } else if (turn === 2) {
                    showPlayerOnePrompt();
                    hidePlayerTwoPrompt();
                    turn = 1;
                }
            }
        }
    }

    // Function to Update Square
    function updateSquare(number, symbol) {
        currentBoard[number] = symbol;
    }

    // Function to Check Win
    function checkWin(symbol) {
        let wins = winCombos;
        let winningCombo = [];
        let winner = wins.some(function(combination) {
            let winning = true;
            for (let i=0; i < combination.length; i++) {
                if (currentBoard[combination[i]] !== symbol) {
                    winning = false;
                }
            }
            if (winning) {
                winningCombo = combination;
            }
            return winning;
        });
        return [winner, winningCombo];
    }

    // Function to Show Winning Combination
    function showWinningCombination() {
        let symbol = turn === 1 ? playerOneSymbol : playerTwoSymbol;
        let combo = checkWin(symbol)[1];
        for (let i=0; i<combo.length;i++) {
            let currentBox = `.${combo[i]}`;
            // Black Box and Rotating Test for Winning Combo
            $(currentBox).children('i').addClass('win').children('span').addClass('rotate');
        }     
    }

    // Function to Update Game Score
    function updateGameScore(turn) {
        turn === 1 ? playerOneScore += 1 : playerTwoScore += 1;
        updateScore(turn);
    }

    // Function to Reset
    function reset() {
        numFilledIn = 0;
        currentBoard = {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:''};
        timeOuts.push(setTimeout(function() {
            hideDrawMessage();
            hideLoseMessage();
            hideWinMessage();
            $('.boxes li').fadeOut();
        }, 5000),
        setTimeout(function() {
            resetSquares();
            $('.boxes li').fadeIn();
            numFilledIn = 0;
        }, 6000),
        /*
            Make sure time for next timeout is long enough to
            not cause problems for next game
        */
        setTimeout(function() {
            gameInPlay = true;
            play();
        }, 6000)
        );
    }

    // Function to Reset Game
    function resetGame() {
        $('#my-canvas').css('opacity','0');
        $('.hard-reset').fadeOut();
        $('.points-divider, .score-1, .score-2').fadeOut();
        playerOneScore = 0;
        playerTwoScore = 0;
        resetSquares();
        numFilledIn = 0;
        currentBoard = {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:''};
        playerOneSymbol = null;
        playerTwoSymbol = null;
        timeOuts.forEach(function(timer) {
            clearTimeout(timer);
        });
        $('.draw-message, .lose-message, .win-message').hide();
        hidePlayerOnePrompt();
        hidePlayerTwoPrompt();
        showGameChoice();
    }

});