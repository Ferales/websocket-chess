const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { SessionStoreage } = require("./sessionStoreage.js");
// const { a } = require("./serverTimerHelpers.js");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketIO(server);

const sessionStore = new SessionStoreage();

const PORT = 3000;

const users = {};
const rooms = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homePage.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "game.html"));
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.inGame = session.inGame;
      return next();
    }
  }

  socket.sessionID = uuidv4();
  socket.userID = uuidv4();
  console.log(socket.userID);
  next();
});

io.on("connection", (socket, data) => {
  console.log("A user connected:", socket.id, socket.userID);

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  socket.on("gameRequest", (data) => {
    console.log(rooms);
    if (socket.inGame) {
      return;
    }
    let [time, increment] = data;
    console.log(rooms);
    let availableRoom = rooms.find(
      (room) => room.time == time && room.increment == increment && !room.full
    );
    if (!availableRoom) {
      let room = createRoom(socket.userID, data);
      //socket.emit("roomCreated", room.roomID);
      console.log("Room created");
      rooms.push(room);
      socket.join(room.roomID);
      socket.roomID = room.roomID;
      socket.inGame = true;
    } else {
      availableRoom.full = true;
      socket.join(availableRoom.roomID);
      socket.roomID = availableRoom.roomID;
      socket.inGame = true;
      console.log("STARTING GAME");
      startGame(availableRoom);
    }
    //users[socket.id] = { roomID, socket };
  });

  socket.on("sendBoard", (board) => {
    let players = getConnectedClients(socket.roomID);
    let index = players.indexOf(socket.id);
    players.splice(index, 1);
    io.to(players[0]).emit("getBoard", board);
  });

  socket.on("gameOver", (message, board) => {
    let players = getConnectedClients(socket.roomID);
    let index = players.indexOf(socket.id);
    players.splice(index, 1);
    io.to(players[0]).emit("gameOver", message, board);
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.id);
    const matchingSockets = await io.in(socket.roomID).allSockets();
    const isDisconnected = matchingSockets.size == 0;
    if (isDisconnected) {
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        inGame: socket.inGame,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let createRoom = (socketID, data) => {
  const roomID = `room-${socketID}`;
  let [time, increment] = data;
  let room = {
    roomID: roomID,
    time: time,
    increment: increment,
    full: false,
  };
  return room;
};

let startGame = (room) => {
  const roomClients = getConnectedClients(room.roomID);
  let player1Color, player2Color;
  if (Math.random() < 0.5) {
    player1Color = "white";
    player2Color = "black";
  } else {
    player1Color = "black";
    player2Color = "white";
  }

  io.to(roomClients[0]).emit("gameStart", player1Color);
  roomClients[0].color = player1Color;

  io.to(roomClients[1]).emit("gameStart", player2Color);
  roomClients[1].color = player2Color;
};

let getConnectedClients = (roomID) => {
  const roomClients = io.sockets.adapter.rooms.get(roomID);
  return Array.from(roomClients);
};
