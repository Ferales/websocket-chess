export class Timer {
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
