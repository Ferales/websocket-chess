export class Piece {
  constructor(color, squareID, moved = false) {
    this.color = color;
    this.squareID = squareID;
    this.moved = moved;
    this.legalMoves = [];
    this.calculatedLegalMoves = false;
    this.name;
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
    if (this.color == "black") {
      row = 7 - row;
      column = 7 - column;
    }
    return [row, column];
  }

  getSquareId(row, column) {
    return row * 8 + column;
  }

  traverseSquares(board, rowOffset, columnOffset) {
    let legalSquares = [];
    let [row, column] = this.getIndexes(this.squareID);
    row += rowOffset;
    column += columnOffset;

    while (row >= 0 && row <= 7 && column >= 0 && column <= 7) {
      if (board[row][column] == "EMPTY") {
        legalSquares.push(this.getSquareId(row, column));
      } else {
        if (board[row][column].color != this.color) {
          legalSquares.push(this.getSquareId(row, column));
        }
        break;
      }
      row += rowOffset;
      column += columnOffset;
    }
    return legalSquares;
  }
}

export class Pawn extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "pawn";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let [row, column] = this.getIndexes();
    let rowOffset = -1;
    if (board[row + rowOffset][column] == "EMPTY") {
      legalSquares.push(this.getSquareId(row + rowOffset, column));
    }
    if (!this.moved && board[row + rowOffset * 2][column] == "EMPTY") {
      legalSquares.push(this.getSquareId(row + rowOffset * 2, column));
    }

    if (
      board[row + rowOffset][column - 1] != "EMPTY" &&
      board[row + rowOffset][column - 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column - 1));
    }
    if (
      board[row + rowOffset][column + 1] != "EMPTY" &&
      board[row + rowOffset][column + 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column + 1));
    }

    this.calculatedLegalMoves = true;
    this.legalMoves = legalSquares;
  }
}

export class Knight extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "knight";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let [row, column] = this.getIndexes();
    let knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (let move of knightMoves) {
      let newRow = row + move[0];
      let newColumn = column + move[1];

      if (newRow >= 0 && newRow <= 7 && newColumn >= 0 && newColumn <= 7) {
        if (
          (board[newRow][newColumn] &&
            board[newRow][newColumn].color != this.color) ||
          !board[newRow][newColumn]
        ) {
          legalSquares.push(this.getSquareId(newRow, newColumn));
        }
      }
    }

    this.legalMoves = legalSquares;
  }
}

export class Bishop extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "bishop";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let bishopMoves = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let move of bishopMoves) {
      legalSquares = legalSquares.concat(
        this.traverseSquares(board, move[0], move[1])
      );
    }
    this.legalMoves = legalSquares;
  }
}

export class Rook extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "rook";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let rookMoves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let move of rookMoves) {
      legalSquares = legalSquares.concat(
        this.traverseSquares(board, move[0], move[1])
      );
    }
    this.legalMoves = legalSquares;
  }
}

export class Queen extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "queen";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let queenMoves = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let move of queenMoves) {
      legalSquares = legalSquares.concat(
        this.traverseSquares(board, move[0], move[1])
      );
    }
    this.legalMoves = legalSquares;
  }
}

export class King extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "king";
  }

  calculateLegalMoves(board) {
    let legalSquares = [];
    let [row, column] = this.getIndexes();

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        if (rowOffset == 0 && columnOffset == 0) {
          continue;
        }

        let targetRow = row + rowOffset;
        let targetColumn = column + columnOffset;

        if (
          targetRow < 0 ||
          targetRow > 7 ||
          targetColumn < 0 ||
          targetColumn > 7
        ) {
          continue;
        }

        if (!board[targetRow][targetColumn]) {
          legalSquares.push(this.getSquareId(targetRow, targetColumn));
        } else if (board[targetRow][targetColumn].color != this.color) {
          legalSquares.push(this.getSquareId(targetRow, targetColumn));
        }
      }
    }
    this.legalMoves = legalSquares;
  }
}
