import { Timer } from "./timer.js";
import { gameOver } from "./index.js";

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
  if (color == "white") {
    timerWhiteElement = document.getElementsByClassName("timer-bottom")[0];
    timerBlackElement = document.getElementsByClassName("timer-top")[0];
  } else {
    timerWhiteElement = document.getElementsByClassName("timer-top")[0];
    timerBlackElement = document.getElementsByClassName("timer-bottom")[0];
    timerBlackElement.innerHTML = `${time}:00`;
  }
  timerWhiteElement.innerHTML = `${time}:00`;
  timerBlackElement.innerHTML = `${time}:00`;

  timerWhite = new Timer(time);
  timerBlack = new Timer(time);

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
      gameOver("outOfTime");
    }
    currentTimerElement.innerHTML = millisecondsToTimeString(currentTimer.time);
  }, 100);
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

export let stopTimers = () => {
  timerBlack.stop();
  timerWhite.stop();
  clearInterval(timerInterval);
};
