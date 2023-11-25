export class Piece {
  constructor(color, squareID, moved = false) {
    this.color = color;
    this.squareID = squareID;
    this.moved = moved;
    this.legalMoves = [];
    this.name;
  }

  static checkForCheck(board, color) {
    let king;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          board[i][j] != "EMPTY" &&
          board[i][j].name == "king" &&
          board[i][j].color == color
        ) {
          king = board[i][j];
          break;
        }
      }
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] != "EMPTY" && board[i][j].color != color) {
          let piece = board[i][j];
          if (piece.name == "king") {
            piece.calculateLegalMoves(board, false);
          } else {
            piece.calculateLegalMoves(board);
          }
          if (piece.legalMoves.includes(king.squareID)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveTo(squareID, board) {
    this.calculateLegalMoves(board);
    if (this.legalMoves.includes(squareID)) {
      let tmpBoard = structuredClone(board);
      deserializeBoard(tmpBoard);
      let checkingRow = Math.floor(squareID / 8);
      let checkingColumn = squareID % 8;
      let [row, column] = this.getIndexes();
      tmpBoard[checkingRow][checkingColumn] = tmpBoard[row][column];
      tmpBoard[checkingRow][checkingColumn].squareID = squareID;
      tmpBoard[row][column] = "EMPTY";
      if (Piece.checkForCheck(tmpBoard, this.color)) {
        return false;
      }
      this.squareID = squareID;
      this.moved = true;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (board[i][j] != "EMPTY") {
            board[i][j].legalMoves = [];
          }
        }
      }
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
    if (this.legalMoves.length) {
      return;
    }
    let legalSquares = [];
    let [row, column] = this.getIndexes();
    let rowOffset = this.color == "white" ? -1 : 1;
    if (board[row + rowOffset][column] == "EMPTY") {
      legalSquares.push(this.getSquareId(row + rowOffset, column));
    }
    if (!this.moved && board[row + rowOffset * 2][column] == "EMPTY") {
      legalSquares.push(this.getSquareId(row + rowOffset * 2, column));
    }

    if (
      column != 0 &&
      board[row + rowOffset][column - 1] != "EMPTY" &&
      board[row + rowOffset][column - 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column - 1));
    }
    if (
      column != 7 &&
      board[row + rowOffset][column + 1] != "EMPTY" &&
      board[row + rowOffset][column + 1].color != this.color
    ) {
      legalSquares.push(this.getSquareId(row + rowOffset, column + 1));
    }

    this.legalMoves = legalSquares;
  }
}

export class Knight extends Piece {
  constructor(color, squareID) {
    super(color, squareID);
    this.name = "knight";
  }

  calculateLegalMoves(board) {
    if (this.legalMoves.length) {
      return;
    }
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
    if (this.legalMoves.length) {
      return;
    }
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
    if (this.legalMoves.length) {
      return;
    }
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
    if (this.legalMoves.length) {
      return;
    }
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

  calculateLegalMoves(board, calculateCastle = true) {
    if (this.legalMoves.length) {
      return;
    }
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

        if (board[targetRow][targetColumn] == "EMPTY") {
          legalSquares.push(this.getSquareId(targetRow, targetColumn));
        } else if (board[targetRow][targetColumn].color != this.color) {
          legalSquares.push(this.getSquareId(targetRow, targetColumn));
        }
      }
    }
    if (!this.moved && calculateCastle) {
      debugger;
      let rookRow = this.color == "white" ? 7 : 0;
      let tmpBoard = structuredClone(board);
      deserializeBoard(tmpBoard);
      if (
        board[rookRow][0] != "EMPTY" &&
        board[rookRow][0].name == "rook" &&
        board[rookRow][0].moved == false &&
        board[rookRow][3] == "EMPTY" &&
        board[rookRow][2] == "EMPTY"
      ) {
        tmpBoard[rookRow][3] = tmpBoard[rookRow][4];
        tmpBoard[rookRow][3].squareID -= 1;
        tmpBoard[rookRow][4] = "EMPTY";
        if (!Piece.checkForCheck(tmpBoard, this.color)) {
          tmpBoard[rookRow][2] = tmpBoard[rookRow][3];
          tmpBoard[rookRow][2].squareID -= 1;
          tmpBoard[rookRow][3] = "EMPTY";
          if (!Piece.checkForCheck(tmpBoard, this.color)) {
            legalSquares.push(this.getSquareId(rookRow, 2));
          }
        }
      }

      if (
        board[rookRow][0] != "EMPTY" &&
        board[rookRow][7].name == "rook" &&
        board[rookRow][7].moved == false &&
        board[rookRow][5] == "EMPTY" &&
        board[rookRow][6] == "EMPTY"
      ) {
        tmpBoard[rookRow][5] = tmpBoard[rookRow][4];
        tmpBoard[rookRow][5].squareID += 1;
        tmpBoard[rookRow][4] = "EMPTY";
        if (!Piece.checkForCheck(tmpBoard, this.color)) {
          tmpBoard[rookRow][6] = tmpBoard[rookRow][5];
          tmpBoard[rookRow][6].squareID += 1;
          tmpBoard[rookRow][5] = "EMPTY";
          if (!Piece.checkForCheck(tmpBoard, this.color)) {
            legalSquares.push(this.getSquareId(rookRow, 6));
          }
        }
      }
    }
    this.legalMoves = legalSquares;
  }
}

export let deserializeBoard = (board) => {
  let classNames = {
    pawn: Pawn,
    knight: Knight,
    bishop: Bishop,
    rook: Rook,
    queen: Queen,
    king: King,
  };

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != "EMPTY") {
        let pieceName = board[i][j].name;
        let color = board[i][j].color;
        let squareID = board[i][j].squareID;
        let moved = board[i][j].moved;
        let piece = classNames[pieceName];
        board[i][j] = new piece(color, squareID, moved);
      }
    }
  }
};
