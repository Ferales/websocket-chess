import { Timer } from "./timer.js";

let time = localStorage.getItem("time");
let increment = localStorage.getItem("increment");
let timerWhite;
let timerWhiteElement;
let timerBlack;
let timerBlackElement;
let currentTimer;
let currentTimerElement;
let timerInterval;

export let createTimers = (color) => {
  setTimerElements(color);

  timerWhiteElement.innerHTML = `${time}:00`;
  timerBlackElement.innerHTML = `${time}:00`;

  timerWhite = new Timer(time * 1000 * 60);
  timerBlack = new Timer(time * 1000 * 60);

  currentTimer = timerWhite;
};

export let changeTimers = () => {
  currentTimer.stop();
  if (currentTimer.started) {
    currentTimer.addTime(increment);
    currentTimerElement.innerHTML = millisecondsToTimeString(currentTimer.time);
  }
  clearInterval(timerInterval);
  if (currentTimer == timerBlack) {
    currentTimer = timerWhite;
    currentTimerElement = timerWhiteElement;
  } else {
    currentTimer = timerBlack;
    currentTimerElement = timerBlackElement;
  }
  currentTimer.start();
  timerInterval = setInterval(() => {
    if (currentTimer.time <= 0) {
      currentTimer.time = 0;
      stopTimers();
    }
    currentTimerElement.innerHTML = millisecondsToTimeString(currentTimer.time);
  }, 100);
};

export let stopTimers = () => {
  timerBlack.stop();
  timerWhite.stop();
  clearInterval(timerInterval);
};

export let restoreTimers = (color, timeWhite, timeBlack, currentTimerColor) => {
  setTimerElements(color);

  timerWhite = new Timer(timeWhite);
  timerBlack = new Timer(timeBlack);

  if (currentTimerColor == "white") {
    timerWhite.start();
    currentTimer = timerWhite;
    currentTimerElement = timerWhiteElement;
  } else {
    timerBlack.start();
    currentTimer = timerBlack;
    currentTimerElement = timerBlackElement;
  }

  timerWhiteElement.innerHTML = millisecondsToTimeString(timeWhite);
  timerBlackElement.innerHTML = millisecondsToTimeString(timeBlack);

  timerInterval = setInterval(() => {
    if (currentTimer.time <= 0) {
      currentTimer.time = 0;
      stopTimers();
    }
    currentTimerElement.innerHTML = millisecondsToTimeString(currentTimer.time);
  }, 100);
};

let setTimerElements = (color) => {
  if (color == "white") {
    timerWhiteElement = document.getElementsByClassName("timer-bottom")[0];
    timerBlackElement = document.getElementsByClassName("timer-top")[0];
  } else {
    timerWhiteElement = document.getElementsByClassName("timer-top")[0];
    timerBlackElement = document.getElementsByClassName("timer-bottom")[0];
  }
};

export let millisecondsToTimeString = (milliseconds) => {
  let totalSeconds = Math.floor(milliseconds / 1000);

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};
