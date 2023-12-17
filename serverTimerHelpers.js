class Timer {
  constructor(time, color, outOfTimeHandler, roomID) {
    this.time = time;
    this.startingTime = null;
    this.referenceTime = null;
    this.intervalId = null;
    this.started = false;
    this.color = color;
    this.outOfTimeHandler = outOfTimeHandler;
    this.roomID = roomID;
  }

  start() {
    this.startingTime = this.time;
    this.referenceTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsedTime = Date.now() - this.referenceTime;
      this.time = this.startingTime - elapsedTime;
      if (this.time <= 0) {
        this.outOfTimeHandler(this.roomID, this.color);
        this.stop();
      }
    }, 100);
    this.started = true;
  }

  stop() {
    clearInterval(this.intervalId);
  }

  addTime(increment) {
    increment *= 1000;
    this.time += increment;
  }
}

class RoomTimers {
  constructor(time, increment, gameOverCallback, roomID) {
    this.timerWhite = new Timer(
      time * 1000 * 60,
      "white",
      gameOverCallback,
      roomID
    );
    this.timerBlack = new Timer(
      time * 1000 * 60,
      "black",
      gameOverCallback,
      roomID
    );
    this.currentTimer = this.timerWhite;
    this.increment = increment;
  }

  changeTimers() {
    this.currentTimer.stop();
    if (this.currentTimer.started) {
      this.currentTimer.addTime(this.increment);
    }
    if (this.currentTimer === this.timerBlack) {
      this.currentTimer = this.timerWhite;
    } else {
      this.currentTimer = this.timerBlack;
    }
    this.currentTimer.start();
  }

  stopTimers() {
    this.timerBlack.stop();
    this.timerWhite.stop();
  }
}

module.exports = {
  RoomTimers,
};
