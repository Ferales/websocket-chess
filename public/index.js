import * as Pieces from "./pieces.js";
import * as Board from "./board.js";

let chessboard = document.getElementById("chessboard");
let currentPiece;
let selectedPiece;
let selectedPieceColor;
let color = "white";

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
  if (square.firstChild) {
    selectedPiece = square.firstChild;
    selectedPieceColor = selectedPiece.src.includes("white")
      ? "white"
      : "black";
    if (selectedPieceColor != color) {
      selectedPiece = null;
      return;
    }
    square.style.border = "3px solid green";
  } else if (selectedPiece) {
    square.appendChild(selectedPiece);
  }
  //selectedPiece = null;
};

let renderBoard = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != null) {
        let squareID = (i * 8 + j).toString();
        board[i][j].squareID = squareID;
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

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let square = document.createElement("div");
    if (square.srcElement) console.log(square.srcElement.firstChild);
    let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
    square.classList.add(colorClass);
    let squareID = (i * 8 + j).toString();
    square.id = squareID;
    square.addEventListener("click", squareClick);
    chessboard.appendChild(square);
  }
}

let board = new Board.Board().board;

renderBoard();

console.log(board);
