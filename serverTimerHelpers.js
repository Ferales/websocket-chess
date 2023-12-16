const Timer = require("./public/timer");

let serverTimers = {
  timerWhite: null,
  timerBlack: null,
  currentTimer: null,
  timerInterval: null,

  createTimers: (time) => {
    serverTimers.timerWhite = new Timer(time);
    serverTimers.timerBlack = new Timer(time);
    serverTimers.currentTimer = serverTimers.timerWhite;
  },

  changeTimers: (increment) => {
    serverTimers.currentTimer.stop();
    if (serverTimers.currentTimer.started) {
      serverTimers.currentTimer.addTime(increment);
    }
    clearInterval(serverTimers.timerInterval);
    if (serverTimers.currentTimer === serverTimers.timerBlack) {
      serverTimers.currentTimer = serverTimers.timerWhite;
    } else {
      serverTimers.currentTimer = serverTimers.timerBlack;
    }
    serverTimers.currentTimer.start();
  },

  stopTimers: () => {
    serverTimers.timerBlack.stop();
    serverTimers.timerWhite.stop();
    clearInterval(serverTimers.timerInterval);
  },
};

module.exports = {
  serverTimers,
};
