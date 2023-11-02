export class Piece {
  constructor(color, squareID) {
    this.color = color;
    this.squareID = squareID;
    this.legalMoves = [];
    this.calculatedLegalMoves = false;
    this.moved = false;
  }

  moveTo(squareID, board) {
    // if (!this.calculatedLegalMoves) {
    this.calculateLegalMoves(board);
    // }
    if (this.legalMoves.includes(squareID)) {
      this.squareID = squareID;
      this.moved = true;
      return true;
    } else {
      return false;
    }
  }

  getIndexes() {
    let row = Math.floor(this.squareID / 8);
    let column = this.squareID % 8;
    return [row, column];
  }

  getSquareId(row, column) {
    return row * 8 + column;
  }
}

export class Pawn extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let [row, column] = this.getIndexes();
    let rowOffset = this.color == "white" ? -1 : 1;
    if (board[row + rowOffset][column] == null) {
      legalSquares.push(this.getSquareId(row + rowOffset, column));
    }
    if (!this.moved && board[row + rowOffset * 2][column] == null) {
      legalSquares.push(this.getSquareId(row + rowOffset * 2, column));
    }

    if (
      board[row + rowOffset][column - 1] != null &&
      board[row + rowOffset][column - 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column - 1));
    }
    if (
      board[row + rowOffset][column + 1] != null &&
      board[row + rowOffset][column + 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column + 1));
    }

    this.calculatedLegalMoves = true;
    this.legalMoves = legalSquares;
  }
}

export class Knight extends Piece {}

export class Bishop extends Piece {}

export class Rook extends Piece {}

export class Queen extends Piece {}

export class King extends Piece {}
