export class Piece {
  constructor(color) {
    this.color = color;
    this.legalMoves = [];
    this.squareID;
  }

  moveTo(squareID) {
    let oldID = this.squareID;
    this.squareID = squareID;
    return oldID;
  }
}

export class Pawn extends Piece {}

export class Knight extends Piece {}

export class Bishop extends Piece {}

export class Rook extends Piece {}

export class Queen extends Piece {}

export class King extends Piece {}
