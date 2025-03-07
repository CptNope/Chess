var board;           // Global board instance
var game;            // Global Chess.js instance
var gameMode = 'ai'; // Default game mode is "Play vs AI"
// Mapping for themes (for future expansion)
var themeOptions = {
  wikipedia: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

window.onload = function() {
  game = new Chess();

  // Timer variables: each side gets 5 minutes (300 seconds)
  var whiteTime = 300;
  var blackTime = 300;
  var timerInterval;

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function updateTimersDisplay() {
    document.getElementById('white-timer').innerHTML = formatTime(whiteTime);
    document.getElementById('black-timer').innerHTML = formatTime(blackTime);
  }

  function startTimer() {
    timerInterval = setInterval(function() {
      if (game.game_over()) {
        clearInterval(timerInterval);
        return;
      }
      if (game.turn() === 'w') {
        whiteTime--;
        if (whiteTime <= 0) {
          whiteTime = 0;
          updateStatus("White ran out of time. Black wins!");
          clearInterval(timerInterval);
        }
      } else {
        blackTime--;
        if (blackTime <= 0) {
          blackTime = 0;
          updateStatus("Black ran out of time. White wins!");
          clearInterval(timerInterval);
        }
      }
      updateTimersDisplay();
    }, 1000);
  }

  function onDragStart(source, piece, position, orientation) {
    // Prevent moves if the game is over or if the piece doesn't belong to the moving player.
    if (game.game_over() ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  }

  function onDrop(source, target) {
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });
    if (move === null) return 'snapback';
    updateStatus();
    updateHistory();

    // If game mode is vs AI, trigger an AI move after a short delay.
    if (gameMode === 'ai' && game.turn() === 'b' && !game.game_over()) {
      setTimeout(makeAIMove, 500);
    }
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  function updateStatus(customMessage) {
    if (customMessage) {
      document.getElementById('status').innerHTML = customMessage;
      return;
    }
    var status = '';
    var moveColor = game.turn() === 'w' ? 'White' : 'Black';
    if (game.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
      status = 'Game over, drawn position.';
    } else {
      status = moveColor + ' to move';
      if (game.in_check()) {
        status += ', ' + moveColor + ' is in check.';
      }
    }
    document.getElementById('status').innerHTML = status;
  }

  function updateHistory() {
    var history = game.history();
    var historyHtml = history.map(function(move, index) {
      return (index + 1) + '. ' + move;
    }).join('<br>');
    document.getElementById('history-list').innerHTML = historyHtml;
  }

  function undoMove() {
    if (game.history().length > 0) {
      // In local multiplayer, simply undo one move.
      // In AI mode, if an AI move was made, undo twice to return control to the human.
      if (gameMode === 'ai' && game.history().length % 2 === 0) {
        game.undo();
      }
      game.undo();
    }
    board.position(game.fen());
    updateStatus();
    updateHistory();
  }

  document.getElementById('undo-btn').addEventListener('click', undoMove);

  // Simple AI that makes a random legal move for Black.
  function makeAIMove() {
    if (game.game_over()) return;
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
    updateHistory();
  }

  // Listen for changes on the game mode selector.
  document.getElementById('mode').addEventListener('change', function(e) {
    gameMode = e.target.value;
  });

  // Listen for changes on the theme selector.
  document.getElementById('theme').addEventListener('change', function(e) {
    var selectedTheme = e.target.value;
    var newThemeUrl = themeOptions[selectedTheme] || themeOptions.wikipedia;
    board.option('pieceTheme', newThemeUrl);
  });

  // Configure the chessboard.
  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: themeOptions.wikipedia
  };

  board = window.Chessboard('board', config);

  updateStatus();
  updateHistory();
  updateTimersDisplay();
  startTimer();
};