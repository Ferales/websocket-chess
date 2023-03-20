import * as Pieces from "./pieces.js";

class Square {
  constructor(piece) {
    this.piece = piece;
  }
}

export class Board {
  constructor() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      if (i == 0 || i == 7) {
        let color = i == 0 ? "black" : "white";
        let row = [
          new Pieces.Rook(color),
          new Pieces.Knight(color),
          new Pieces.Bishop(color),
          new Pieces.Queen(color),
          new Pieces.King(color),
          new Pieces.Bishop(color),
          new Pieces.Knight(color),
          new Pieces.Rook(color),
        ];
        this.board.push(row);
      } else {
        this.board.push([]);
      }
      for (let j = 0; j < 8; j++) {
        if (i == 1) {
          this.board[i][j] = new Pieces.Pawn("black");
        } else if (i == 6) {
          this.board[i][j] = new Pieces.Pawn("white");
        }
      }
    }
  }
}
