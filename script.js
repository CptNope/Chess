var board;            // Global board instance
var game;             // Global Chess.js instance
var gameMode = 'ai';  // Default game mode is "Play vs AI"

// Mapping for piece themes (for future expansion)
var themeOptions = {
wikipedia: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

window.onload = function() {
// Initialize the Chess.js game engine
game = new Chess();

// Timer variables: each side gets 5 minutes (300 seconds)
var whiteTime = 300;
var blackTime = 300;
var timerInterval;

// Convert total seconds to mm:ss format
function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var sec = seconds % 60;
  return (minutes < 10 ? "0" + minutes : minutes) + ":" + (sec < 10 ? "0" + sec : sec);
}

// Update the timers on screen
function updateTimersDisplay() {
  document.getElementById('white-timer').innerHTML = formatTime(whiteTime);
  document.getElementById('black-timer').innerHTML = formatTime(blackTime);
}

// Start the clock and decrement the current player's time
function startTimer() {
  timerInterval = setInterval(function() {
    // If the game is over, stop the timer
    if (game.game_over()) {
      clearInterval(timerInterval);
      return;
    }

    // Decrement time for whoever's turn it is
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

// Prevent illegal piece drags
function onDragStart(source, piece, position, orientation) {
  // If the game is already over, or it's not the piece's turn, return false
  if (game.game_over() ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

// Handle a piece drop on a new square
function onDrop(source, target) {
  // Attempt to make the move, always promote to queen for simplicity
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  // If it's an illegal move, snap back
  if (move === null) return 'snapback';

  // Update status and history after the player's move
  updateStatus();
  updateHistory();

  // If playing vs AI and it's now Black's turn, make an AI move
  if (gameMode === 'ai' && game.turn() === 'b' && !game.game_over()) {
    setTimeout(makeAIMove, 500);
  }
}

// After a piece is dropped and snaps to the new square, update board position
function onSnapEnd() {
  board.position(game.fen());
}

// Display the current game status
function updateStatus(customMessage) {
  if (customMessage) {
    document.getElementById('status').innerHTML = customMessage;
    return;
  }

  var status = '';
  var moveColor = game.turn() === 'w' ? 'White' : 'Black';

  // Check various game-over conditions
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  } 
  else if (game.in_stalemate && game.in_stalemate()) {
    status = 'Game over, stalemate.';
  } 
  else if (game.in_threefold_repetition && game.in_threefold_repetition()) {
    status = 'Game over, threefold repetition.';
  } 
  else if (game.in_draw()) {
    // Chess.js lumps several draw conditions under in_draw():
    // - insufficient material
    // - 50-move rule
    // - stalemate (if in_stalemate() is not used)
    status = 'Game over, drawn position.';
  } 
  else {
    // Game is ongoing
    status = moveColor + ' to move';
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check.';
    }
  }

  document.getElementById('status').innerHTML = status;
}

// Update the move history display
function updateHistory() {
  var history = game.history();
  var historyHtml = history.map(function(move, index) {
    return (index + 1) + '. ' + move;
  }).join('<br>');
  document.getElementById('history-list').innerHTML = historyHtml;
}

// Undo the last move
function undoMove() {
  if (game.history().length > 0) {
    // In local multiplayer, just undo one move.
    // In AI mode, if an AI move was just made, undo twice to revert to the human's turn.
    if (gameMode === 'ai' && game.history().length % 2 === 0) {
      game.undo();
    }
    game.undo();
  }
  board.position(game.fen());
  updateStatus();
  updateHistory();
}

// Simple AI: makes a random legal move for Black
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

// Change the game mode (AI vs Local)
document.getElementById('mode').addEventListener('change', function(e) {
  gameMode = e.target.value;
});

// Change the piece theme
document.getElementById('theme').addEventListener('change', function(e) {
  var selectedTheme = e.target.value;
  var newThemeUrl = themeOptions[selectedTheme] || themeOptions.wikipedia;
  board.option('pieceTheme', newThemeUrl);
});

// Chessboard.js configuration
var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: themeOptions.wikipedia
};

// Create the chessboard
board = window.Chessboard('board', config);

// Initialize everything
updateStatus();
updateHistory();
updateTimersDisplay();
startTimer();
};