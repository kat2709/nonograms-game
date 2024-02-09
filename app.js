import { gameArray } from "./games.js";

let curGameIndex = 0;
let arr = gameArray[curGameIndex].game;
let checkArr = arr.flat();
let tempArr = new Array(arr.length * arr.length).fill(0);
let gameLevel = gameArray[curGameIndex].level;
let timer = undefined;
let countTime = 0;
let timerFlag = false;
let scoreArray = [];
let colorMode = "light";
const sounds = [
  "./assets/sounds/cross_click.mp3",
  "./assets/sounds/left_click.mp3",
  "./assets/sounds/win_game.mp3",
];

let savedScore = localStorage.getItem("scoreArray");
if (savedScore) {
  scoreArray = JSON.parse(savedScore);
}

function main() {
  drawField();
  createGameField();
  createGameList();
  drawFooter();
  addListeners();
}
main();

function addListeners() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", clickCell));
  cells.forEach((cell) => cell.addEventListener("contextmenu", rightClickCell));

  const listButtons = document.querySelectorAll(".list-item-btn");
  listButtons.forEach((btn) => btn.addEventListener("click", btnsListClick));

  const levelBtns = document.querySelectorAll(".level-btn");
  levelBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      if (e.target.id === "easy") {
        curGameIndex = 0;
      }
      if (e.target.id === "medium") {
        curGameIndex = 5;
      }
      if (e.target.id === "hard") {
        curGameIndex = 10;
      }
      drawGame();
      clearTimerInt();
      const saveGameBtn = document.getElementById("save-game");
      saveGameBtn.classList.add("inactive");
    })
  );

  const resetGameBtn = document.getElementById("reset-game");
  resetGameBtn.addEventListener("click", resetBoard);

  const randomBtn = document.getElementById("random-game");
  randomBtn.addEventListener("click", createRandomGame);

  // save game
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.addEventListener("click", () => {
    const saveGameObj = {
      game: tempArr,
      level: gameLevel,
      name: gameArray[curGameIndex].name,
      index: curGameIndex,
      time: countTime,
      flag: true,
    };
    localStorage.setItem("saveGameObj", JSON.stringify(saveGameObj));
    const continueGameBtn = document.querySelector("#continue-game");
    continueGameBtn.classList.remove("inactive");
  });

  // continue game
  clearTimerInt();

  const continueGameBtn = document.getElementById("continue-game");
  continueGameBtn.addEventListener("click", () => {
    const saveGameBtn = document.getElementById("save-game");
    saveGameBtn.classList.remove("inactive");
    const obj = JSON.parse(localStorage.getItem("saveGameObj"));
    curGameIndex = obj.index;
    const arrLocal = obj.game;
    drawGame();
    for (let i = 0; i < arrLocal.length; i++) {
      if (arrLocal[i] === "0") {
        let cell = document.getElementById(`${i}`);
        if (colorMode === "dark") {
          cell.classList.add("white-cross");
        } else {
          cell.classList.add("cross-cell");
        }
      }
      if (arrLocal[i] === 1) {
        let cell = document.getElementById(`${i}`);
        if (colorMode === "dark") {
          cell.classList.toggle("clicked-cell-night");
        } else {
          cell.classList.toggle("clicked-cell");
        }
      }
    }
    countTime = obj.time;
    if (!timerFlag) {
      timer = setInterval(timerInt, 1000);
      timerFlag = true;
    }
    tempArr = arrLocal;
  });

  // solution btn
  const solutionBtn = document.getElementById("solution-button");
  solutionBtn.addEventListener("click", () => {
    resetBoard();
    for (let i = 0; i < checkArr.length; i++) {
      if (checkArr[i] === 1) {
        let cell = document.getElementById(`${i}`);
        if (colorMode === "dark") {
          cell.classList.toggle("clicked-cell-night");
        } else {
          cell.classList.toggle("clicked-cell");
        }
      }
    }
    tempArr = checkArr;
    clearInterval(timer);
    timerFlag = false;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.removeEventListener("click", clickCell));
    cells.forEach((cell) =>
      cell.removeEventListener("contextmenu", rightClickCell)
    );
    const saveGameBtn = document.getElementById("save-game");
    saveGameBtn.classList.add("inactive");
  });

  const scoreTableBtn = document.getElementById("score-table-button");
  scoreTableBtn.addEventListener("click", () => {
    createScoreTable();
  });

  // day/nigth btn
  const dayNightBtn = document.getElementById("day-night-button");
  dayNightBtn.addEventListener("click", () => {
    // resetBoard();
    dayNightBtn.classList.toggle("moon");
    colorMode = colorMode === "light" ? "dark" : "light";
    if (colorMode === "dark") {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.add("night-mode-backgr"));
      buttons.forEach((btn) => btn.classList.add("night-mode-color"));
      dayNightBtn.classList.add("grey");
      document.body.classList.add("body-night");
      const headerTitle = document.getElementById("header-title");
      headerTitle.classList.add("night-mode-color");
      const gameField = document.getElementById("game-field");
      gameField.classList.add("night-field");
      const levelBox = document.querySelector(".level-box");
      levelBox.classList.add("grey");
      const timeTitle = document.getElementById("timer-title");
      timeTitle.classList.add("night-mode-color");
      timeTitle.classList.add("dark-grey");
      const listTitle = document.querySelector(".list-title");
      listTitle.classList.add("night-mode-color");
      listTitle.classList.add("dark-grey");
      const soundBtn = document.getElementById("sound-button");
      soundBtn.classList.add("grey");
      const cell = document.querySelectorAll(".clicked-cell");
      cell.forEach((cell) => cell.classList.remove("clicked-cell"));
      cell.forEach((cell) => cell.classList.add("clicked-cell-night"));
    }
    if (colorMode === "light") {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.remove("night-mode-backgr"));
      buttons.forEach((btn) => btn.classList.remove("night-mode-color"));
      dayNightBtn.classList.remove("grey");
      document.body.classList.remove("body-night");
      const headerTitle = document.getElementById("header-title");
      headerTitle.classList.remove("night-mode-color");
      const gameField = document.getElementById("game-field");
      gameField.classList.remove("night-field");
      const levelBox = document.querySelector(".level-box");
      levelBox.classList.remove("grey");
      const timeTitle = document.getElementById("timer-title");
      timeTitle.classList.remove("night-mode-color");
      timeTitle.classList.remove("dark-grey");
      const listTitle = document.querySelector(".list-title");
      listTitle.classList.remove("night-mode-color");
      listTitle.classList.remove("dark-grey");
      soundBtn.classList.remove("grey");
      const cell = document.querySelectorAll(".clicked-cell-night");
      cell.forEach((cell) => cell.classList.remove("clicked-cell-night"));
      cell.forEach((cell) => cell.classList.add("clicked-cell"));
    }
  });

  // sound on/off btn
  const soundBtn = document.getElementById("sound-button");
  soundBtn.addEventListener("click", () => {
    soundBtn.classList.toggle("sound-off");
  });

  // num
  const nums = document.querySelectorAll(".num");
  nums.forEach((num) =>
    num.addEventListener("click", () => {
      num.classList.toggle("red-num");
    })
  );

  // arrow btn
  const arrowBtn = document.querySelector(".arrow-btn");
  arrowBtn.addEventListener("click", arrowClick);
}

// UTILS

function clickCell(e) {
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.remove("inactive");
  if (!timerFlag) {
    timer = setInterval(timerInt, 1000);
    timerFlag = true;
  }

  const soundBtn = document.getElementById("sound-button");
  if (!soundBtn.classList.contains("sound-off")) {
    createSound(1);
  }

  let index = e.target.id;
  let cell = document.getElementById(index);
  cell.classList.remove("cross-cell");
  cell.classList.remove("white-cross");
  const dayNightBtn = document.querySelector(".day-mode");
  if (dayNightBtn.classList.contains("moon")) {
    cell.classList.toggle("clicked-cell-night");
  } else {
    cell.classList.toggle("clicked-cell");
  }
  if (
    e.target.classList.contains("clicked-cell") ||
    e.target.classList.contains("clicked-cell-night")
  ) {
    tempArr[index] = 1;
  } else {
    tempArr[index] = 0;
  }
  if (arrsEqual(tempArr, checkArr)) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.removeEventListener("click", clickCell));
    cells.forEach((cell) =>
      cell.removeEventListener("contextmenu", rightClickCell)
    );
    const soundBtn = document.getElementById("sound-button");
    if (!soundBtn.classList.contains("sound-off")) {
      createSound(2);
    }
    setTimeout(createEndGameModal, 500);
  }
}

function rightClickCell(e) {
  if (!timerFlag) {
    timer = setInterval(timerInt, 1000);
    timerFlag = true;
  }
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.remove("inactive");
  e.preventDefault();
  let index = e.target.id;
  let cell = document.getElementById(index);
  cell.classList.remove("clicked-cell");
  cell.classList.remove("clicked-cell-night");

  const soundBtn = document.getElementById("sound-button");
  if (!soundBtn.classList.contains("sound-off")) {
    createSound(0);
  }

  const dayNightBtn = document.querySelector(".day-mode");
  if (dayNightBtn.classList.contains("moon")) {
    cell.classList.toggle("white-cross");
  } else {
    cell.classList.toggle("cross-cell");
  }
  if (
    e.target.classList.contains("cross-cell") ||
    e.target.classList.contains("white-cross")
  ) {
    tempArr[index] = "0";
  } else {
    tempArr[index] = 0;
  }
}

function clearActiveStyleBtns() {
  const listButtons = document.querySelectorAll(".list-item-btn");
  listButtons.forEach((btn) => btn.classList.remove("btn-active"));
}

function btnsListClick(e) {
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.add("inactive");
  clearTimerInt();
  clearActiveStyleBtns();

  const gameField = document.getElementById("game-field");
  gameField.innerHTML = "";
  curGameIndex = undefined;
  checkArr = [];
  gameLevel = undefined;
  tempArr = new Array(arr.length * arr.length).fill(0);
  for (let key in gameArray) {
    if (gameArray[key].name === e.target.id) {
      curGameIndex = key;
      arr = gameArray[curGameIndex].game;
      checkArr = arr.flat();
      gameLevel = gameArray[curGameIndex].level;
      const activeBtn = document.getElementById(gameArray[curGameIndex].name);
      activeBtn.classList.add("btn-active");
      createGameField();
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => cell.addEventListener("click", clickCell));
      cells.forEach((cell) =>
        cell.addEventListener("contextmenu", rightClickCell)
      );
    }
  }
}

function clearLevelBtns() {
  const levelBtns = document.querySelectorAll(".level-btn");
  levelBtns.forEach((btn) => btn.classList.remove("btn-active"));
}

function arrowClick() {
  const arrowBtn = document.querySelector(".arrow-btn");
  arrowBtn.classList.toggle("arrow-close");
  if (arrowBtn.classList.contains("arrow-close")) {
    const gameList = document.querySelector(".game-list");
    gameList.classList.add("open-list");
  } else {
    const gameList = document.querySelector(".game-list");
    gameList.classList.remove("open-list");
  }
}

// reset btn
function resetBoard() {
  clearTimerInt();
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.classList.remove("clicked-cell"));
  cells.forEach((cell) => cell.classList.remove("clicked-cell-night"));
  cells.forEach((cell) => cell.classList.remove("cross-cell"));
  cells.forEach((cell) => cell.classList.remove("white-cross"));
  tempArr = new Array(arr.length * arr.length).fill(0);
  cells.forEach((cell) => cell.addEventListener("click", clickCell));
  cells.forEach((cell) => cell.addEventListener("contextmenu", rightClickCell));
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.add("inactive");
  const nums = document.querySelectorAll(".num");
  nums.forEach((num) => num.classList.remove("red-num"));
}

// random game
function createRandomGame() {
  clearTimerInt();
  const randomNum = Math.floor(Math.random() * gameArray.length);
  curGameIndex = randomNum;
  drawGame();
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.add("inactive");
}

function getTopNumberArr(arr) {
  const topNumberArr = [];
  let countNum = 0;
  for (let i = 0; i < arr.length; i++) {
    topNumberArr.push([]);
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[j][i] === 1) {
        countNum++;
      }
      if (arr[j][i] === 0 && countNum != 0) {
        topNumberArr[i].push(countNum);
        countNum = 0;
      }
    }
    if (countNum !== 0) {
      topNumberArr[i].push(countNum);
      countNum = 0;
    }
  }
  return topNumberArr;
}

function getLeftNumberArr(arr) {
  const leftNumberArr = [];
  let countNum = 0;
  for (let i = 0; i < arr.length; i++) {
    leftNumberArr.push([]);
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 1) {
        countNum++;
      }
      if (arr[i][j] === 0 && countNum != 0) {
        leftNumberArr[i].push(countNum);
        countNum = 0;
      }
    }
    if (countNum !== 0 || leftNumberArr[i].length === 0) {
      leftNumberArr[i].push(countNum);
      countNum = 0;
    }
  }
  return leftNumberArr;
}

function createEndGameModal() {
  const endGameModal = document.createElement("dialog");
  endGameModal.classList.add("end-game-modal");
  document.body.appendChild(endGameModal);

  const crossModal = document.createElement("div");
  crossModal.classList.add("cross-modal");
  endGameModal.appendChild(crossModal);

  const name = gameArray[curGameIndex].name;
  const endGameTitle = document.createElement("h2");

  let time = "";
  let min = Math.floor(countTime / 60);
  if (countTime < 60) {
    time = `${countTime}` + " seconds!";
  } else {
    time = `${min}` + " min " + `${countTime % 60}` + " seconds!";
  }
  endGameTitle.innerHTML =
    "Great! You have solved the nonogram " +
    `${name.toUpperCase()}` +
    "(level:" +
    `${gameLevel}` +
    ") " +
    "in " +
    `${time}`;
  endGameModal.appendChild(endGameTitle);
  endGameModal.showModal();
  clearInterval(timer);
  timerFlag = false;
  const saveGameBtn = document.getElementById("save-game");
  saveGameBtn.classList.add("inactive");

  const scoreTableBtn = document.createElement("button");
  scoreTableBtn.classList.add("setting-btn");
  scoreTableBtn.classList.add("modal-btn");
  scoreTableBtn.innerHTML = "score table";
  scoreTableBtn.id = "score-table-button";
  endGameModal.appendChild(scoreTableBtn);

  crossModal.addEventListener("click", () => {
    endGameModal.close();
    document.body.removeChild(endGameModal);
  });

  const scoreObj = {};
  scoreObj.name = gameArray[curGameIndex].name;
  scoreObj.level = gameArray[curGameIndex].level;
  scoreObj.time = countTime;

  if (scoreArray.length < 5) {
    scoreArray.push(scoreObj);
  } else {
    scoreArray.push(scoreObj);
    scoreArray = scoreArray.slice(1);
  }
  localStorage.setItem("scoreArray", JSON.stringify(scoreArray));

  scoreTableBtn.addEventListener("click", () => {
    endGameModal.close();
    document.body.removeChild(endGameModal);
    createScoreTable();
  });
}

function drawGame() {
  clearLevelBtns();
  const gameListBox = document.querySelector(".game-list-box");
  gameListBox.innerHTML = "";
  const gameField = document.getElementById("game-field");
  gameField.innerHTML = "";
  gameLevel = gameArray[curGameIndex].level;
  createGameList();
  arr = gameArray[curGameIndex].game;
  checkArr = arr.flat();
  tempArr = new Array(arr.length * arr.length).fill(0);
  gameLevel = gameArray[curGameIndex].level;
  const activeBtn = document.getElementById(gameArray[curGameIndex].level);
  activeBtn.classList.add("btn-active");

  createGameField();
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", clickCell));
  cells.forEach((cell) => cell.addEventListener("contextmenu", rightClickCell));
  const listButtons = document.querySelectorAll(".list-item-btn");
  listButtons.forEach((btn) => btn.addEventListener("click", btnsListClick));
  // const nums = document.querySelectorAll(".num");
  // nums.forEach((num) =>
  //   num.addEventListener("click", () => {
  //     num.classList.toggle("red-num");
  //   })
  // );
}

function arrsEqual(arr1, arr2) {
  for (let i = 0; i < checkArr.length; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function timerInt() {
  countTime++;
  const timeTitle = document.getElementById("timer-title");
  timeTitle.innerHTM = "";
  if (countTime < 60) {
    timeTitle.innerHTML = "Time 00:" + `${countTime}`.padStart(2, "0");
  } else {
    let min = Math.floor(countTime / 60);
    timeTitle.innerHTML =
      "Time " +
      `${min}`.padStart(2, "0") +
      ":" +
      `${countTime % 60}`.padStart(2, "0");
  }
}

function clearTimerInt() {
  clearInterval(timer);
  countTime = 0;
  timerFlag = false;
  const timeTitle = document.getElementById("timer-title");
  timeTitle.innerHTML = "Time 00:00";
}

function createScoreTable() {
  const scoreTableModal = document.createElement("dialog");
  scoreTableModal.classList.add("score-modal");
  document.body.appendChild(scoreTableModal);

  const crossModal = document.createElement("div");
  crossModal.classList.add("cross-modal");
  scoreTableModal.appendChild(crossModal);

  const scoreTableTitle = document.createElement("h2");
  scoreTableTitle.innerHTML = "score table:";
  scoreTableModal.appendChild(scoreTableTitle);
  scoreTableModal.showModal();

  const scoreList = document.createElement("div");
  scoreList.classList.add("score-list");
  scoreList.innerHTML = "";
  const arr = JSON.parse(localStorage.getItem("scoreArray"));
  const key = "time";
  const sortedArr = arr.sort((time1, time2) =>
    time1[key] > time2[key] ? 1 : -1
  );
  for (let i = 0; i < sortedArr.length; i++) {
    let item = document.createElement("div");
    let choosenTime = "";
    let timeRes = sortedArr[i].time;
    let min = Math.floor(timeRes / 60);
    if (timeRes < 60) {
      choosenTime = `${timeRes}` + " seconds!";
    } else {
      choosenTime = `${min}` + " min " + `${timeRes % 60}` + " seconds!";
    }
    item.innerHTML =
      `${i + 1}` +
      ". " +
      `${sortedArr[i].name.toUpperCase()}` +
      " (level: " +
      `${sortedArr[i].level}` +
      ") time: " +
      `${choosenTime}`;
    scoreList.appendChild(item);
  }
  scoreTableModal.appendChild(scoreList);
  crossModal.addEventListener("click", () => {
    scoreTableModal.close();
    document.body.removeChild(scoreTableModal);
  });
}

function drawFooter() {
  const footer = document.createElement("footer");
  document.body.appendChild(footer);

  const settingBox = document.createElement("div");
  settingBox.classList.add("setting-box");
  footer.appendChild(settingBox);

  const resetGameBtn = document.createElement("button");
  resetGameBtn.classList.add("setting-btn");
  resetGameBtn.innerHTML = "reset game";
  resetGameBtn.id = "reset-game";
  settingBox.appendChild(resetGameBtn);

  const saveGameBtn = document.createElement("button");
  saveGameBtn.classList.add("setting-btn");
  saveGameBtn.classList.add("inactive");
  saveGameBtn.innerHTML = "save game";
  saveGameBtn.id = "save-game";
  settingBox.appendChild(saveGameBtn);

  const continueGameBtn = document.createElement("button");
  continueGameBtn.classList.add("setting-btn");
  if (JSON.parse(localStorage.getItem("saveGameObj")).flag === true) {
    continueGameBtn.classList.remove("inactive");
  } else {
    continueGameBtn.classList.add("inactive");
  }
  continueGameBtn.innerHTML = "continue game";
  continueGameBtn.id = "continue-game";
  settingBox.appendChild(continueGameBtn);

  const dayNigthBtn = document.createElement("button");
  dayNigthBtn.classList.add("day-mode");
  dayNigthBtn.id = "day-night-button";
  settingBox.appendChild(dayNigthBtn);

  const solutionBtn = document.createElement("button");
  solutionBtn.classList.add("setting-btn");
  solutionBtn.innerHTML = "solution";
  solutionBtn.id = "solution-button";
  settingBox.appendChild(solutionBtn);

  const scoreTableBtn = document.createElement("button");
  scoreTableBtn.classList.add("setting-btn");
  scoreTableBtn.innerHTML = "score table";
  scoreTableBtn.id = "score-table-button";
  settingBox.appendChild(scoreTableBtn);

  const soundBtn = document.createElement("button");
  soundBtn.classList.add("sound-on");
  soundBtn.id = "sound-button";
  settingBox.appendChild(soundBtn);
}

function createGameField() {
  const topBox = document.createElement("div");
  topBox.classList.add("top-box");
  const gameField = document.getElementById("game-field");
  gameField.appendChild(topBox);

  const topNumbers = document.createElement("div");
  topNumbers.classList.add("top-numbers");
  topBox.appendChild(topNumbers);

  const bottomBox = document.createElement("div");
  bottomBox.classList.add("bottom-box");
  gameField.appendChild(bottomBox);

  const leftNumbers = document.createElement("div");
  leftNumbers.classList.add("left-numbers");
  bottomBox.appendChild(leftNumbers);

  const gameCells = document.createElement("div");
  gameCells.classList.add("game-cells");
  if (gameLevel === "easy") {
    gameCells.style.width = "200px";
  }
  if (gameLevel === "medium") {
    gameCells.style.width = "300px";
  }
  if (gameLevel === "hard") {
    gameCells.style.width = "375px";
  }
  bottomBox.appendChild(gameCells);

  function createTopNumbers(topArr) {
    topArr = getTopNumberArr(arr);
    for (let i = 0; i < topArr.length; i++) {
      let topNumber = document.createElement("div");
      topNumber.classList.add("top-cell");
      if (gameLevel === "easy") {
        topNumber.style.width = "40px";
        topNumber.style.height = "60px";
      }
      if (gameLevel === "medium") {
        topNumber.style.width = "30px";
        topNumber.style.height = "80px";
      }
      if (gameLevel === "hard") {
        topNumber.style.width = "25px";
        topNumber.style.height = "100px";
      }
      if (i % 5 === 0 && i !== 0) {
        topNumber.classList.add("top-bold-cell");
      }
      topNumbers.appendChild(topNumber);
      for (let j = 0; j < topArr[i].length; j++) {
        let num = document.createElement("div");
        num.classList.add("num");
        num.innerHTML = topArr[i][j];
        num.addEventListener("click", () => {
          num.classList.toggle("red-num");
        });
        topNumber.appendChild(num);
      }
    }
  }

  function createLeftNumbers(leftArr) {
    leftArr = getLeftNumberArr(arr);
    for (let i = 0; i < leftArr.length; i++) {
      let leftNumber = document.createElement("div");
      leftNumber.classList.add("left-cell");
      if (gameLevel === "easy") {
        leftNumber.style.height = "40px";
        leftNumber.style.width = "60px";
      }
      if (gameLevel === "medium") {
        leftNumber.style.height = "30px";
        leftNumber.style.width = "80px";
      }
      if (gameLevel === "hard") {
        leftNumber.style.height = "25px";
        leftNumber.style.width = "100px";
      }
      if (i % 5 === 0 && i !== 0) {
        leftNumber.classList.add("left-bold-cell");
      }
      leftNumbers.appendChild(leftNumber);
      for (let j = 0; j < leftArr[i].length; j++) {
        let num = document.createElement("div");
        num.classList.add("num");
        num.innerHTML = leftArr[i][j];
        num.addEventListener("click", () => {
          num.classList.toggle("red-num");
        });
        leftNumber.appendChild(num);
      }
    }
  }

  function creategameCells() {
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        if (gameLevel === "easy") {
          cell.style.width = "40px";
          cell.style.height = "40px";
        }
        if (gameLevel === "medium") {
          cell.style.width = "30px";
          cell.style.height = "30px";
        }
        if (gameLevel === "hard") {
          cell.style.width = "25px";
          cell.style.height = "25px";
        }
        if (j % 5 === 0 && j !== 0) {
          cell.classList.add("top-bold-cell");
        }
        if (i % 5 === 0 && i !== 0) {
          cell.classList.add("left-bold-cell");
        }
        cell.setAttribute("id", idx);
        idx++;
        gameCells.appendChild(cell);
      }
    }
  }

  createTopNumbers();
  createLeftNumbers();
  creategameCells();
}

function createGameList() {
  const gameListTitle = document.createElement("div");
  // todo
  gameListTitle.classList.add("list-title");
  if (colorMode === "dark") {
    gameListTitle.classList.add("night-mode-color");
    gameListTitle.classList.add("dark-grey");
  }
  if (gameLevel === "easy") {
    gameListTitle.innerHTML = "5x5 games:";
  }
  if (gameLevel === "medium") {
    gameListTitle.innerHTML = "10x10 games:";
  }
  if (gameLevel === "hard") {
    gameListTitle.innerHTML = "15x15 games:";
  }
  const gameListBox = document.querySelector(".game-list-box");
  gameListBox.appendChild(gameListTitle);

  const arrowBtn = document.createElement("div");
  arrowBtn.classList.add("arrow-btn");
  gameListTitle.appendChild(arrowBtn);

  arrowBtn.addEventListener("click", arrowClick);

  const gameList = document.createElement("div");
  gameList.classList.add("game-list");
  let levelListArr = [];

  for (let key in gameArray) {
    if (gameArray[key].level === gameLevel) {
      levelListArr.push(gameArray[key].name);
    }
  }

  for (let i = 0; i < levelListArr.length; i++) {
    let listItem = document.createElement("button");
    listItem.classList.add("list-item-btn");
    listItem.setAttribute("id", levelListArr[i]);
    listItem.innerHTML = levelListArr[i];
    if (colorMode === "dark") {
      listItem.classList.add("night-mode-backgr");
      listItem.classList.add("night-mode-color");
    }
    gameList.appendChild(listItem);
  }
  gameListBox.appendChild(gameList);

  const activeBtn = document.getElementById(gameArray[curGameIndex].name);
  activeBtn.classList.add("btn-active");

  const nums = document.querySelectorAll(".num");
  nums.forEach((num) =>
    num.addEventListener("click", () => {
      num.classList.toggle("red-num");
    })
  );
}

function drawField() {
  const header = document.createElement("header");
  document.body.appendChild(header);

  const headerTitle = document.createElement("h1");
  headerTitle.innerHTML = "Nonograms";
  headerTitle.id = "header-title";
  header.appendChild(headerTitle);

  const levelBox = document.createElement("div");
  levelBox.classList.add("level-box");
  header.appendChild(levelBox);

  const easyBtn = document.createElement("button");
  easyBtn.classList.add("level-btn");
  easyBtn.classList.add("btn-active");
  easyBtn.innerHTML = "easy 5x5";
  easyBtn.setAttribute("id", "easy");
  levelBox.appendChild(easyBtn);

  const mediumBtn = document.createElement("button");
  mediumBtn.classList.add("level-btn");
  mediumBtn.innerHTML = "medium 10x10";
  mediumBtn.setAttribute("id", "medium");
  levelBox.appendChild(mediumBtn);

  const hardBtn = document.createElement("button");
  hardBtn.classList.add("level-btn");
  hardBtn.innerHTML = "hard 15x15";
  hardBtn.setAttribute("id", "hard");
  levelBox.appendChild(hardBtn);

  const randomBtn = document.createElement("button");
  randomBtn.classList.add("random-btn");
  randomBtn.innerHTML = "random game";
  randomBtn.setAttribute("id", "random-game");
  levelBox.appendChild(randomBtn);

  const mainSection = document.createElement("main");
  document.body.appendChild(mainSection);

  const timeTitle = document.createElement("h4");
  timeTitle.innerHTML = "Time 00:00";
  timeTitle.id = "timer-title";
  mainSection.appendChild(timeTitle);

  const containerBox = document.createElement("div");
  containerBox.classList.add("container-box");
  mainSection.appendChild(containerBox);

  let gameField = document.createElement("div");
  gameField.classList.add("game-field");
  gameField.id = "game-field";
  gameField.ondragstart = test;
  gameField.onselectstart = test;
  gameField.oncontextmenu = test;
  function test() {
    return false;
  }
  containerBox.appendChild(gameField);

  const gameListBox = document.createElement("div");
  gameListBox.classList.add("game-list-box");
  containerBox.appendChild(gameListBox);
}

function createSound(i) {
  const audio = document.createElement("audio");
  audio.src = sounds[i];
  audio.play();
}
