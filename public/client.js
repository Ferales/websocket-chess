import { Board } from "./board.js";
import {
  startGame,
  renderBoard,
  updateBoard,
  getDrawRequest,
  clearElements,
} from "./index.js";
import * as Pieces from "./pieces.js";
import * as TimerHandler from "./timerHelpers.js";

let time = localStorage.getItem("time");
let increment = localStorage.getItem("increment");
let playerColor;
let promotionRow = 0;

const socket = io("http://localhost:3000", {
  reconnect: true,
  autoConnect: false,
});

const userID = localStorage.getItem("userID");
const roomID = localStorage.getItem("roomID");

if (userID && roomID) {
  socket.auth = { userID, roomID };
}

socket.connect();

socket.on("connect", () => {
  if (!socket.roomID) {
    socket.emit("gameRequest", [time, increment]);
  }

  socket.on("saveIDs", (userID, roomID) => {
    localStorage.setItem("userID", userID);
    localStorage.setItem("roomID", roomID);
  });

  socket.on("gameStart", (color) => {
    playerColor = color;
    if (color == "black") {
      promotionRow = 7;
    }
    startGame();
  });

  socket.on("getBoard", (board) => {
    Pieces.deserializeBoard(board);
    updateBoard(board);
    renderBoard();
    TimerHandler.changeTimers();
  });

  socket.on("gameOver", (message, board) => {
    TimerHandler.stopTimers();
    Pieces.deserializeBoard(board);
    updateBoard(board);
    renderBoard();
    clearElements(message);
  });

  socket.on("clearIDs", () => {
    localStorage.clear();
  });

  socket.on("getDrawRequest", () => {
    getDrawRequest();
  });

  socket.on(
    "reconnect",
    (board, timerWhite, timerBlack, currentTimerColor, color, onMove) => {
      playerColor = color;
      let hasGameStarted;
      if (board) {
        Pieces.deserializeBoard(board);
        hasGameStarted = true;
      } else {
        board = new Board().board;
        hasGameStarted = false;
      }
      updateBoard(board, { reconnectOnMove: onMove });
      TimerHandler.restoreTimers(
        playerColor,
        timerWhite,
        timerBlack,
        currentTimerColor,
        hasGameStarted
      );
      startGame(true);
    }
  );
});

export { socket, playerColor, promotionRow };
