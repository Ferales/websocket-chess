import * as Pieces from "./pieces.js";
import * as Board from "./board.js";

let chessboard = document.getElementById("chessboard");
let currentPiece;
let selectedPiece;
let selectedPieceSquareId;
let targetSquareId;
let selectedPieceColor;
let color = "white";
let row;
let column;
let board = new Board.Board().board;

let resetBorders = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.getElementById((i * 8 + j).toString());
      square.style.border = "";
    }
  }
};

let squareClick = (e) => {
  resetBorders();
  let square = e.target;
  currentPiece = square.firstChild;

  if (!selectedPiece) {
    if (currentPiece) {
      selectedPieceColor = currentPiece.src.includes("white")
        ? "white"
        : "black";

      if (selectedPieceColor == color) {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = square.id;
      }
    }
  } else {
    if (currentPiece) {
      selectedPieceColor = currentPiece.src.includes("white")
        ? "white"
        : "black";

      if (selectedPieceColor != color) {
        row = Math.floor(selectedPieceSquareId / 8);
        column = selectedPieceSquareId % 8;
        targetSquareId = parseInt(currentPiece.parentNode.id);
        if (board[row][column].moveTo(targetSquareId, board)) {
          selectedPiece = board[row][column];
          board[row][column] = null;
          board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
            selectedPiece;
          selectedPiece = null;
          renderBoard();
        }
      } else {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = square.id;
      }
    } else {
      row = Math.floor(selectedPieceSquareId / 8);
      column = selectedPieceSquareId % 8;
      targetSquareId = parseInt(square.id);
      if (board[row][column].moveTo(targetSquareId, board)) {
        selectedPiece = board[row][column];
        board[row][column] = null;
        board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
          selectedPiece;
        selectedPiece = null;
        renderBoard();
      }
    }
  }
};

let renderBoard = () => {
  clearBoard();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != null) {
        let squareID = (i * 8 + j).toString();
        let square = document.getElementById(squareID);
        let color = board[i][j].color;
        let piece = board[i][j].constructor.name.toLowerCase();
        let fileName = `icons/${color}_${piece}.png`;
        let img = document.createElement("img");
        img.src = fileName;
        img.classList.add("icon");
        square.appendChild(img);
      }
    }
  }
};

let clearBoard = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let squareID = (i * 8 + j).toString();
      let square = document.getElementById(squareID);
      if (square.firstChild) {
        square.removeChild(square.firstChild);
      }
    }
  }
};

let rotateChessboard = (board) => {
  const reversedRows = board.slice().reverse();
  const rotatedBoard = reversedRows.map((row) => row.slice().reverse());

  return rotatedBoard;
};

let startGame = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.createElement("div");
      let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
      square.classList.add(colorClass);
      let squareID = (i * 8 + j).toString();
      square.id = squareID;
      square.addEventListener("click", squareClick);
      chessboard.appendChild(square);
    }
  }

  renderBoard();
};

startGame();
