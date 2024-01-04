import * as Pieces from "./pieces.js";
import * as Board from "./board.js";
import { socket, playerColor, promotionRow } from "./client.js";
import * as TimerHandler from "./timerHelpers.js";

let chessboard = document.getElementById("chessboard");
let currentPiece;
let selectedPiece;
let selectedPieceSquareId;
let targetSquareId;
let selectedPieceColor;
let row;
let column;
let mate;
let onMove = false;
let board = new Board.Board().board;

if (
  localStorage.getItem("time") == null ||
  localStorage.getItem("increment") == null
) {
  window.location.href = "/";
}

let resetBorders = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.getElementById((i * 8 + j).toString());
      square.style.border = "";
    }
  }
};

let squareClick = (e) => {
  if (!onMove) {
    return;
  }
  resetBorders();
  let square = e.target;
  currentPiece = square.firstChild;

  if (!selectedPiece) {
    if (currentPiece) {
      selectedPieceColor = currentPiece.src.includes("white")
        ? "white"
        : "black";

      if (selectedPieceColor == playerColor) {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = parseInt(square.id);
      }
    }
  } else {
    if (currentPiece) {
      selectedPieceColor = currentPiece.src.includes("white")
        ? "white"
        : "black";
      if (selectedPieceColor != playerColor) {
        row = Math.floor(selectedPieceSquareId / 8);
        column = selectedPieceSquareId % 8;
        targetSquareId = parseInt(currentPiece.parentNode.id);
        if (board[row][column].moveTo(targetSquareId, board)) {
          selectedPiece = board[row][column];
          board[row][column] = "EMPTY";
          if (
            selectedPiece.name == "pawn" &&
            Math.floor(targetSquareId / 8) == promotionRow
          ) {
            openPopup();
          } else {
            board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
              selectedPiece;

            mate = Pieces.Piece.hasGameEnded(board, playerColor);
            if (mate) {
              gameOver(mate);
            } else {
              TimerHandler.changeTimers();
              socket.emit("sendBoard", board);
              onMove = !onMove;
            }
            selectedPiece = null;
            renderBoard();
          }
        }
      } else {
        square.style.border = "3px solid green";
        selectedPiece = currentPiece;
        selectedPieceSquareId = parseInt(square.id);
      }
    } else {
      row = Math.floor(selectedPieceSquareId / 8);
      column = selectedPieceSquareId % 8;
      targetSquareId = parseInt(square.id);
      if (board[row][column].moveTo(targetSquareId, board)) {
        selectedPiece = board[row][column];
        board[row][column] = "EMPTY";
        if (
          selectedPiece.name == "pawn" &&
          Math.floor(targetSquareId / 8) == promotionRow
        ) {
          openPopup();
        } else {
          board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
            selectedPiece;
          board[Math.floor(targetSquareId / 8)][targetSquareId % 8] =
            selectedPiece;
          if (selectedPiece.name == "king") {
            if (targetSquareId == selectedPieceSquareId - 2) {
              board[row][column - 1] = board[row][0];
              board[row][column - 1].squareID = row * 8 + column - 1;
              board[row][0] = "EMPTY";
            } else if (targetSquareId == selectedPieceSquareId + 2) {
              board[row][column + 1] = board[row][7];
              board[row][column + 1].squareID = row * 8 + column + 1;
              board[row][7] = "EMPTY";
            }
          }

          mate = Pieces.Piece.hasGameEnded(board, playerColor);
          if (mate) {
            gameOver(mate);
          } else {
            TimerHandler.changeTimers();
            socket.emit("sendBoard", board);
            onMove = !onMove;
          }
          selectedPiece = null;
          renderBoard();
        }
      }
    }
  }
};

let renderBoard = () => {
  clearBoard();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != "EMPTY") {
        let squareID = board[i][j].squareID.toString();
        let square = document.getElementById(squareID);
        let color = board[i][j].color;
        let piece = board[i][j].name;
        let fileName = `icons/${color}_${piece}.png`;
        let img = document.createElement("img");
        img.src = fileName;
        img.classList.add("icon");
        square.appendChild(img);
      }
    }
  }
};

let clearBoard = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let squareID = (i * 8 + j).toString();
      let square = document.getElementById(squareID);
      if (square.firstChild) {
        square.removeChild(square.firstChild);
      }
    }
  }
};

let updateBoard = (newBoard, reconnectOptions) => {
  board = newBoard;
  if (reconnectOptions) {
    onMove = reconnectOptions["reconnectOnMove"];
  } else {
    onMove = !onMove;
  }
};

let startGame = (recconect = false) => {
  document.getElementById("loader-container").style.display = "none";

  if (!recconect) {
    TimerHandler.createTimers(playerColor);
    if (playerColor == "white") {
      onMove = true;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.createElement("div");
      let colorClass = (i + j) % 2 == 0 ? "square-white" : "square-black";
      square.classList.add(colorClass);
      let squareID = (i * 8 + j).toString();
      if (playerColor == "black") {
        squareID = 63 - squareID;
      }
      square.id = squareID;
      square.addEventListener("click", squareClick);
      chessboard.appendChild(square);
    }
  }
  renderBoard();
  setEventListeners();
};

let openPopup = () => {
  let popupElement = document.getElementsByClassName("popup")[0];

  document.body.style.pointerEvents = "none";
  popupElement.style.display = "block";
  let pieces = ["bishop", "knight", "rook", "queen"];
  let images = document.querySelectorAll(".popup-content img");
  for (let i = 0; i < images.length; i++) {
    images[i].src = `./icons/${playerColor}_${pieces[i]}.png`;
    images[i].addEventListener("click", promotePawn.bind(null, pieces[i]));
  }
};

let promotePawn = (promotionPiece) => {
  let popupElement = document.getElementsByClassName("popup")[0];
  let classNames = {
    knight: Pieces.Knight,
    bishop: Pieces.Bishop,
    rook: Pieces.Rook,
    queen: Pieces.Queen,
  };
  let piece = classNames[promotionPiece];
  board[Math.floor(targetSquareId / 8)][targetSquareId % 8] = new piece(
    playerColor,
    targetSquareId,
    true
  );

  mate = Pieces.Piece.hasGameEnded(board, playerColor);
  if (mate) {
    gameOver(mate);
  } else {
    TimerHandler.changeTimers();
    socket.emit("sendBoard", board);
    onMove = !onMove;
  }
  selectedPiece = null;
  renderBoard();

  document.body.style.pointerEvents = "auto";
  popupElement.style.display = "none";
};

let gameOver = (endCondition) => {
  TimerHandler.stopTimers();
  let message;
  let winnerMessage;
  switch (endCondition) {
    case "checkmate":
      winnerMessage = playerColor == "white" ? "białych" : "czarnych";
      message = `Mat - zwycięstwo ${winnerMessage}`;
      break;
    case "stalemate":
      message = "Pat";
      break;
    case "surrender":
      let surrenderMessage = playerColor == "white" ? "Białe" : "Czarne";
      winnerMessage = playerColor == "white" ? "czarnych" : "białych";
      message = `${surrenderMessage} poddały partię - zwycięstwo ${winnerMessage}`;
      break;
    case "draw":
      message = "Remis";
  }
  clearElements(message);
  socket.emit("gameOver", message, board);
};

let sendDrawRequest = () => {
  let drawButton = document.getElementById("draw");
  let drawRequestInfo = document.getElementById("drawRequest");

  drawButton.style.display = "none";
  drawRequestInfo.style.display = "inline";

  setTimeout(() => {
    drawButton.style.display = "flex";
    drawRequestInfo.style.display = "none";
  }, 15000);

  socket.emit("sendDrawRequest");
};

let getDrawRequest = () => {
  document.getElementById("drawRequest").style.display = "none";

  let drawButton = document.getElementById("draw");
  let drawOffer = document.getElementById("drawOffer");

  drawButton.style.display = "none";
  drawOffer.style.display = "flex";

  setTimeout(() => {
    drawButton.style.display = "flex";
    drawOffer.style.display = "none";
  }, 15000);
};

let setEventListeners = () => {
  document.getElementById("surrender").addEventListener("click", () => {
    gameOver("surrender");
  });

  document.getElementById("draw").addEventListener("click", () => {
    sendDrawRequest();
  });

  document.getElementById("accept-draw").addEventListener("click", () => {
    gameOver("draw");
  });

  document.getElementById("reject-draw").addEventListener("click", () => {
    document.getElementById("drawOffer").style.display = "none";
    document.getElementById("draw").style.display = "flex";
  });

  document.getElementById("goBack").addEventListener("click", () => {
    window.location.href = "/";
  });
};

let clearElements = (message) => {
  let elementsIds = ["surrender", "draw", "drawOffer", "drawRequest"];
  for (let elementId of elementsIds) {
    let element = document.getElementById(elementId);
    element.style.display = "none";
    element.replaceWith(element.cloneNode(true));
  }
  onMove = false;

  document.getElementById("gameOverElements").style.display = "flex";
  document.getElementById("gameOverMessage").innerHTML = message;
};

export { startGame, renderBoard, updateBoard, getDrawRequest, clearElements };
