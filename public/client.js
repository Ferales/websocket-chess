import { Timer } from "./timer.js";
import {
  startGame,
  renderBoard,
  updateBoard,
  rotateChessboard,
} from "./index.js";
import * as Pieces from "./pieces.js";

let time = localStorage.getItem("time");
let increment = localStorage.getItem("increment");
let timerWhite;
let timerWhiteElement;
let timerBlack;
let timerBlackElement;
let currentTimer;
let currentTimerElement;
let timerInterval;
let playerColor;
let classNames = {
  pawn: Pieces.Pawn,
  knight: Pieces.Knight,
  bishop: Pieces.Bishop,
  rook: Pieces.Rook,
  queen: Pieces.Queen,
  king: Pieces.King,
};

let createTimers = (color) => {
  if (color == "white") {
    timerWhiteElement = document.getElementsByClassName("timer-bottom")[0];
    timerBlackElement = document.getElementsByClassName("timer-top")[0];
  } else {
    timerWhiteElement = document.getElementsByClassName("timer-top")[0];
    timerBlackElement = document.getElementsByClassName("timer-bottom")[0];
  }
  timerWhite = new Timer(time);
  timerBlack = new Timer(time);

  currentTimer = timerBlack;

  return [timerWhite, timerBlack];
};

let changeTimers = () => {
  currentTimer.stop();
  clearInterval(timerInterval);
  if (currentTimer == timerBlack) {
    currentTimer = timerWhite;
    currentTimerElement = timerWhiteElement;
  } else {
    currentTimer = timerBlack;
    currentTimerElement = timerBlackElement;
  }
  currentTimer.start();
  timerInterval = setInterval(() => {
    currentTimerElement.innerHTML = millisecondsToTimeString(currentTimer.time);
  }, 100);
};

function millisecondsToTimeString(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
}

document
  .getElementsByClassName("draw")[0]
  .addEventListener("click", changeTimers);

const socket = io("http://localhost:3000", {
  reconnect: true,
  autoConnect: false,
});

const sessionID = localStorage.getItem("sessionID");

if (sessionID) {
  socket.auth = { sessionID };
}

socket.connect();

socket.on("connect", () => {
  // const socketID = socket.id;
  // localStorage.setItem("socketID", socketID);
  socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
  });

  socket.emit("gameRequest", [time, increment]);

  socket.on("gameStart", (color) => {
    playerColor = color;
    let [timerWhite, timerBlack] = createTimers(color);
    startGame();
    // changeTimers();
  });

  socket.on("getBoard", (board) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] != "EMPTY") {
          debugger;
          let pieceName = board[i][j].name;
          let color = board[i][j].color;
          let squareID = board[i][j].squareID;
          let moved = board[i][j].moved;
          let piece = classNames[pieceName];
          board[i][j] = new piece(color, squareID, moved);
        }
      }
    }
    updateBoard(rotateChessboard(board));
    renderBoard();
  });

  socket.on("timeSync", () => {});
});

export { socket, playerColor };
