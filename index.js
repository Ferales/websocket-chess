import * as Pieces from "./pieces.js";
import * as Board from "./board.js";

let chessboard = document.getElementById("chessboard");
let moving = false;
let image;
let startX, startY;

function move(e) {
  var newX = e.clientX - startX + 40;
  var newY = e.clientY - startY + 30;
  image.style.left = newX + "px";
  image.style.top = newY + "px";
  console.log(newX, newY);
}

function initialClick(e) {
  if (e.srcElement.firstChild) {
    image = e.srcElement.firstChild;
    startX = e.clientX;
    startY = e.clientY;
    if (moving) {
      document.removeEventListener("mousemove", move);
      moving = !moving;
      return;
    }

    moving = !moving;
    document.addEventListener("mousemove", move, false);
  }
}

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let square = document.createElement("div");
    if (square.srcElement) console.log(square.srcElement.firstChild);
    let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
    square.classList.add(colorClass);
    let squareID = (i * 8 + j).toString();
    square.id = squareID;
    square.addEventListener("mousedown", initialClick);
    chessboard.appendChild(square);
  }
}

let board = new Board.Board().board;

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
      img.addEventListener("mousedown", initialClick);
      img.classList.add("icon");
      square.appendChild(img);
    }
  }
}

console.log(board);
