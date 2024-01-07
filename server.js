const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { RoomTimers } = require("./serverTimerHelpers.js");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

let rooms = [];

let time;
let increment;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homePage.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "game.html"));
});

io.on("connection", (socket) => {
  if (Object.keys(socket.handshake.auth).length != 0) {
    socket.userID = socket.handshake.auth.userID;
    socket.roomID = socket.handshake.auth.roomID;
    let room = rooms.find((room) => room.roomID == socket.roomID);
    if (room) {
      let roomPlayers = getConnectedPlayers(socket.roomID);
      let disconnectedPlayer = roomPlayers.find(
        (player) => player.userID == socket.userID
      );
      socket.color = disconnectedPlayer.color;
      socket.inGame = true;
      socket.onMove = disconnectedPlayer.onMove;

      let currentTimerColor =
        room.timers.currentTimer == room.timers.timerWhite ? "white" : "black";

      room.players = room.players.filter(
        (player) => player.userID != socket.userID
      );

      socket.join(room.roomID);
      room.players.push(socket);

      io.to(socket.id).emit(
        "reconnect",
        room.board,
        room.timers.timerWhite.time,
        room.timers.timerBlack.time,
        currentTimerColor,
        socket.color,
        socket.onMove
      );
    }
  } else {
    socket.userID = uuidv4();
  }

  socket.on("gameRequest", (data) => {
    if (socket.inGame) {
      return;
    }
    [time, increment] = data;
    let availableRoom = rooms.find(
      (room) => room.time == time && room.increment == increment && !room.full
    );
    if (!availableRoom) {
      let room = createRoom(data);
      console.log("Room created");
      rooms.push(room);
      socket.join(room.roomID);
      room.players.push(socket);
      socket.roomID = room.roomID;
      socket.inGame = true;
    } else {
      availableRoom.full = true;
      socket.join(availableRoom.roomID);
      availableRoom.players.push(socket);
      socket.roomID = availableRoom.roomID;
      socket.inGame = true;
      console.log("STARTING GAME");
      startGame(availableRoom);
    }
  });

  socket.on("sendBoard", (board) => {
    let players = getConnectedPlayers(socket.roomID);

    for (let player of players) {
      player.onMove = !player.onMove;
    }

    let player = players.find((player) => player.id != socket.id);
    io.to(player.id).emit("getBoard", board);

    let room = rooms.find((room) => room.roomID == socket.roomID);
    room.board = board;
    room.timers.changeTimers();
  });

  socket.on("surrender", () => {
    let players = getConnectedPlayers(socket.roomID);
    let player = players.find((player) => player.id != socket.id);
    io.to(player.id).emit("surrender");
    clearSession(socket.roomID);
  });

  socket.on("sendDrawRequest", () => {
    let players = getConnectedPlayers(socket.roomID);
    let player = players.find((player) => player.id != socket.id);
    io.to(player.id).emit("getDrawRequest");
  });

  socket.on("gameOver", (message, board) => {
    let players = getConnectedPlayers(socket.roomID);
    let player = players.find((player) => player.id != socket.id);
    io.to(player.id).emit("gameOver", message, board);

    clearSession(socket.roomID);
  });

  socket.on("disconnect", () => {
    let room = rooms.find((room) => room.roomID == socket.roomID);
    if (room) {
      if (room.players.length < 2) {
        console.log("test");
        rooms = rooms.filter((r) => r.roomID != room.roomID);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let createRoom = (data) => {
  const roomID = `room-${uuidv4()}`;
  let [time, increment] = data;
  let room = {
    roomID: roomID,
    time: time,
    increment: increment,
    full: false,
    board: null,
    timers: new RoomTimers(
      parseInt(time),
      parseInt(increment),
      outOfTimeHandler,
      roomID
    ),
    players: [],
  };
  return room;
};

let startGame = (room) => {
  const players = getConnectedPlayers(room.roomID);
  let player1Color, player2Color;
  if (Math.random() < 0.5) {
    player1Color = "white";
    player2Color = "black";
  } else {
    player1Color = "black";
    player2Color = "white";
  }

  io.to(players[0].id).emit("gameStart", player1Color);
  players[0].color = player1Color;

  io.to(players[1].id).emit("gameStart", player2Color);
  players[1].color = player2Color;

  for (let player of players) {
    io.to(player.id).emit("saveIDs", player.userID, player.roomID);
    player.color == "white" ? (player.onMove = true) : (player.onMove = false);
  }
};

let outOfTimeHandler = (roomID, color) => {
  let winner = color == "white" ? "czarnych" : "białych";
  let message = `Koniec czasu - zwycięstwo ${winner}`;

  outOfTIme(roomID, message);
};

let outOfTIme = (roomID, message) => {
  let players = getConnectedPlayers(roomID);
  let room = rooms.find((room) => room.roomID == roomID);

  for (let player of players) {
    io.to(player.id).emit("gameOver", message, room.board);
  }

  clearSession(roomID);
};

let clearSession = (roomID) => {
  let players = getConnectedPlayers(roomID);
  for (let player of players) {
    player.userID = "";
    player.roomID = "";
    player.inGame = false;

    io.to(player.id).emit("clearIDs");
  }
  rooms = rooms.filter((room) => room.roomID != roomID);
};

let getConnectedPlayers = (roomID) => {
  let room = rooms.find((room) => room.roomID == roomID);
  return room.players;
};
