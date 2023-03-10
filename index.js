let chessboard = document.getElementById("chessboard");
console.log(chessboard);

for(let i=0; i<8; i++){
    for(let j=0; j < 8; j++){
        let square = document.createElement("div");
        let colorClass = (i + j) % 2 == 0 ? "square-black" : "square-white";
        square.classList.add(colorClass);
        chessboard.appendChild(square);
    }
}