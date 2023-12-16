import { startGame, renderBoard, updateBoard } from "./index.js";
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

  socket.emit("gameRequest", (time, increment));

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
    console.log(message);
  });

  socket.on("timeSync", () => {});
});

export { socket, playerColor, promotionRow };
