class Timer {
  constructor(time) {
    this.time = time * 60 * 1000;
    this.startingTime = null;
    this.referenceTime = null;
    this.intervalId = null;
    this.started = false;
  }

  start() {
    this.startingTime = this.time;
    this.referenceTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsedTime = Date.now() - this.referenceTime;
      this.time = this.startingTime - elapsedTime;
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
  constructor(time, increment) {
    this.timerWhite = new Timer(time);
    this.timerBlack = new Timer(time);
    this.currentTimer = this.timerWhite;
    this.timerInterval = null;
    this.increment = increment;
  }

  changeTimers() {
    this.currentTimer.stop();
    if (this.currentTimer.started) {
      this.currentTimer.addTime(this.increment);
    }
    clearInterval(this.timerInterval);
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
    clearInterval(this.timerInterval);
  }
}

module.exports = {
  RoomTimers,
};
