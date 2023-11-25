import * as Pieces from "./pieces.js";

export class Board {
  constructor() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      if (i == 0 || i == 7) {
        let color = i == 0 ? "black" : "white";
        let row = [
          new Pieces.Rook(color, i * 8 + 0),
          new Pieces.Knight(color, i * 8 + 1),
          new Pieces.Bishop(color, i * 8 + 2),
          new Pieces.Queen(color, i * 8 + 3),
          new Pieces.King(color, i * 8 + 4),
          new Pieces.Bishop(color, i * 8 + 5),
          new Pieces.Knight(color, i * 8 + 6),
          new Pieces.Rook(color, i * 8 + 7),
        ];
        this.board.push(row);
      } else {
        this.board.push(Array(8).fill("EMPTY"));
      }
      for (let j = 0; j < 8; j++) {
        if (i == 1) {
          this.board[i][j] = new Pieces.Pawn("black", i * 8 + j);
        } else if (i == 6) {
          this.board[i][j] = new Pieces.Pawn("white", i * 8 + j);
        }
      }
    }
  }
}
