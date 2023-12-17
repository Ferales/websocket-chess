function sendGameRequest(gameTime, increment) {
  localStorage.setItem("time", gameTime);
  localStorage.setItem("increment", increment);
  window.location.href += "game";
}

if (localStorage.getItem("userID") && localStorage.getItem("roomID")) {
  window.location.href += "game";
}
