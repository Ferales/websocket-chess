let sendGameRequest = (gameTime, increment) => {
  localStorage.setItem("time", gameTime);
  localStorage.setItem("increment", increment);
  window.location.href += "game";
};

if (localStorage.getItem("userID") && localStorage.getItem("roomID")) {
  localStorage.clear();
  window.location.href += "game";
}
