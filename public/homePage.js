function sendGameRequest(gameTime, increment) {
  localStorage.setItem("time", gameTime);
  localStorage.setItem("increment", increment);
  console.log("xd");
  window.location.href += "game";
}
