import * as Pieces from "./pieces.js";
import * as Board from "./board.js";
import { socket, playerColor } from "./client.js";

let chessboard = document.getElementById("chessboard");
let currentPiece;
let selectedPiece;
let selectedPieceSquareId;
let targetSquareId;
let selectedPieceColor;
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

      if (selectedPieceColor == playerColor) {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = parseInt(square.id);
      }
    }
  } else {
    if (currentPiece) {
      selectedPieceColor = currentPiece.src.includes("white")
        ? "white"
        : "black";
      if (selectedPieceColor != playerColor) {
        row = Math.floor(selectedPieceSquareId / 8);
        column = selectedPieceSquareId % 8;
        targetSquareId = parseInt(currentPiece.parentNode.id);
        if (board[row][column].moveTo(targetSquareId, board)) {
          selectedPiece = board[row][column];
          board[row][column] = "EMPTY";
          board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
            selectedPiece;
          socket.emit("sendBoard", board);
          selectedPiece = "EMPTY";
          renderBoard();
        }
      } else {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = parseInt(square.id);
      }
    } else {
      row = Math.floor(selectedPieceSquareId / 8);
      column = selectedPieceSquareId % 8;
      targetSquareId = parseInt(square.id);
      if (board[row][column].moveTo(targetSquareId, board)) {
        selectedPiece = board[row][column];
        board[row][column] = "EMPTY";
        board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
          selectedPiece;
        if (selectedPiece.name == "king") {
          if (targetSquareId == selectedPieceSquareId - 2) {
            board[row][column - 1] = board[row][0];
            board[row][column - 1].squareID = row * 8 + column - 1;
            board[row][0] = "EMPTY";
          } else if (targetSquareId == selectedPieceSquareId + 2) {
            board[row][column + 1] = board[row][7];
            board[row][column + 1].squareID = row * 8 + column + 1;
            board[row][7] = "EMPTY";
          }
        }
        socket.emit("sendBoard", board);
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
      if (board[i][j] != "EMPTY") {
        let squareID = board[i][j].squareID.toString();
        let square = document.getElementById(squareID);
        let color = board[i][j].color;
        let piece = board[i][j].name;
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

let updateBoard = (newBoard) => {
  board = newBoard;
};

let startGame = () => {
  console.log(playerColor);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.createElement("div");
      let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
      square.classList.add(colorClass);
      let squareID = (i * 8 + j).toString();
      if (playerColor == "black") {
        squareID = 63 - squareID;
      }
      square.id = squareID;
      square.addEventListener("click", squareClick);
      chessboard.appendChild(square);
    }
  }
  renderBoard();
};

export { startGame, renderBoard, updateBoard };
