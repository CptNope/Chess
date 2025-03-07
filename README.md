# Chessboard (HTML, CSS, JavaScript)

This project creates a simple, interactive chessboard using HTML, CSS, and JavaScript. It renders a standard 8x8 chessboard with chess pieces represented by Unicode characters.  It's a basic implementation and does *not* include move logic or game rules.

## Features

*   **Visual Chessboard:** Displays a standard 8x8 chessboard with alternating light and dark squares.
*   **Unicode Chess Pieces:** Uses Unicode characters to represent the chess pieces (e.g., ♔ for a white king, ♞ for a black knight).  This avoids the need for image files.
*   **Responsive Design:** The chessboard scales to fit the screen using `vmin` units, making it adaptable to different viewport sizes.
*   **Clean Code:** The code is well-structured and commented for easy understanding.
*    **No external libraries**: The project does not use external CSS or Javascript libraries.

## Files

*   **`chess.html`:**  The main HTML file containing the structure, styling (CSS), and logic (JavaScript) for the chessboard.  *Rename this file to anything you like.*

## How to Use

1.  **Create a file:** Create a new file and name it e.g. `chess.html`.
2.  **Copy the HTML code:** Copy the HTML code (provided in the previous response) into the `chess.html` file.
3.  **Save the file:** Save the `chess.html` file.
4.  **Open in a browser:** Open the `chess.html` file in any modern web browser (Chrome, Firefox, Safari, Edge, etc.).  You should see the chessboard with the pieces arranged in their starting positions.

## Code Structure

*   **HTML (`chess.html`):**
    *   Sets up the basic HTML structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
    *   Includes a `<style>` tag for the CSS.
    *   Includes a `<script>` tag for the JavaScript.
    *   Contains a `<div>` with the ID `board`, which will hold the chessboard squares.
*   **CSS (within `<style>`):**
    *   Styles the overall page (`body`, `html`).
    *   Styles the chessboard (`#board`).
    *   Styles the individual squares (`.square`, `.white`, `.black`).
    *   Styles the chess pieces (`.piece`, `.white-piece`, `.black-piece`, and individual piece classes).
*   **JavaScript (within `<script>`):**
    *   `createBoard()`:  This function is the core of the chessboard creation.
        *   It creates the 64 `<div>` elements representing the squares.
        *   It adds the appropriate CSS classes for colors and pieces.
        *   It uses a nested loop to iterate through rows and columns.
        *   It uses Unicode characters to set the text content of the piece elements.
        * It populates the board with starting positions.
    * `getPieceSymbol()`: Returns the Unicode character that will be the piece, based on color.

## Future Enhancements (Possible TODOs)

This is a basic chessboard implementation.  Here are some potential improvements that could be added:

*   **Drag-and-Drop:** Implement drag-and-drop functionality to move the pieces. This would involve handling mouse events (mousedown, mousemove, mouseup) and updating the positions of the pieces on the board.
*   **Move Validation:** Add logic to validate moves according to the rules of chess (e.g., ensuring a knight moves in an "L" shape, preventing pieces from moving through other pieces, checking for check and checkmate).
*   **Turn Management:** Implement turn-based gameplay, alternating between white and black.
*   **Piece Capture:** Allow pieces to capture opponent's pieces.
*   **Game State:** Track the game state (e.g., check, checkmate, stalemate).
*   **User Interface:** Add UI elements for things like:
    *   A "New Game" button.
    *   A display of the current turn.
    *   A list of captured pieces.
    *   Potentially, a move history.
*   **AI Opponent:**  (More advanced) Implement an AI opponent to play against.
* **Piece selection/highlighting**: Improve user experience when clicking and selecting pieces.

## Technologies Used

*   HTML
*   CSS
*   JavaScript (Vanilla JavaScript - no libraries or frameworks)

## License

This project is open-source and can be used and modified freely.