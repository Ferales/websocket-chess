import * as Pieces from "./pieces.js";

let chessboard = document.getElementById("chessboard");

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let square = document.createElement("div");
    let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
    square.classList.add(colorClass);
    square.addEventListener("mouseup", (event) => {
      event.preventDefault();
      console.log("huj");
    });
    chessboard.appendChild(square);
  }
}

let test = document.getElementsByClassName("square-black")[0];
let img = document.createElement("img");
img.src = "/icons/white_queen.png";
img.classList.add("icon");
test.appendChild(img);
