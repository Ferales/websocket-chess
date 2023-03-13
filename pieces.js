export class Piece {
  constructor(color, squareID) {
    this.color = color;
    this.squareID = squareID;
    this.legalMoves = [];
  }

  moveTo(squareID) {
    let oldID = this.squareID;
    this.squareID = squareID;
    return oldID;
  }
}

export class Pawn extends Piece {}

class Knight extends Piece {}

class Bishop extends Piece {}

class Rook extends Piece {}

class Queen extends Piece {}

class King extends Piece {}
