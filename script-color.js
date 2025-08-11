const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const stopButton = document.getElementById("stopButton");
const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const timeLeftDisplay = document.getElementById("timeLeft");
const livesDisplay = document.getElementById("lives");
const countdownDisplay = document.getElementById("countdown");
const message = document.getElementById("message");
const leaderboardList = document.getElementById("leaderboardList");

let score = 0;
let highScore = 0;
let timeLeft = 10;
let lives = 3;
let targetColor = "";
let timerInterval;
let countdownInterval;

const colors = ["red", "green", "blue", "yellow", "orange", "purple"];
const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

function updateLeaderboard() {
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboardList.innerHTML = "";
  leaderboard.slice(0, 5).forEach((entry, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${entry.name || "Player"} - ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

function setNewTarget() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  message.innerText = `Click the ${targetColor} box!`;
  renderBoard();
}

function renderBoard() {
  gameBoard.innerHTML = "";
  let shuffled = [...colors].sort(() => Math.random() - 0.5);
  shuffled.forEach((color) => {
    const div = document.createElement("div");
    div.className = "color-box";
    div.style.backgroundColor = color;
    div.addEventListener("click", () => handleClick(color));
    gameBoard.appendChild(div);
  });
}

function handleClick(color) {
  if (color === targetColor) {
    score++;
    timeLeft += 3;
    scoreDisplay.innerText = score;
    timeLeftDisplay.innerText = timeLeft;

    if (score > highScore) {
      highScore = score;
      highScoreDisplay.innerText = highScore;
    }

    if (score % 5 === 0 && timeLeft > 5) {
      timeLeft -= 1;
    }

    setNewTarget();
  } else {
    lives--;
    livesDisplay.innerText = lives;
    if (lives === 0) endGame("💥 Game Over! Out of lives.");
  }
}

function countdownToStart() {
  let count = 3;
  countdownDisplay.classList.remove("hidden");
  countdownDisplay.innerText = `Starting in ${count}...`;
  countdownInterval = setInterval(() => {
    count--;
    countdownDisplay.innerText = count > 0 ? `Starting in ${count}...` : "GO!";
    if (count === 0) {
      clearInterval(countdownInterval);
      countdownDisplay.classList.add("hidden");
      startGameplay();
    }
  }, 1000);
}

function startGameplay() {
  score = 0;
  lives = 3;
  timeLeft = 10;
  scoreDisplay.innerText = score;
  livesDisplay.innerText = lives;
  timeLeftDisplay.innerText = timeLeft;
  message.innerText = "";
  restartButton.style.display = "none";
  stopButton.style.display = "inline-block";

  setNewTarget();

  timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame("⏰ Time's up!");
    }
  }, 1000);
}

function endGame(msg) {
  clearInterval(timerInterval);
  message.innerText = msg;
  restartButton.style.display = "inline-block";
  stopButton.style.display = "none";
  startButton.disabled = false;
  leaderboard.push({ name: "Player", score: score });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboard();
  gameBoard.innerHTML = "";
}

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  countdownToStart();
});

restartButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  startButton.disabled = true;
  message.innerText = "";
  countdownToStart();
});

stopButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  message.innerText = "⏹ Game Stopped.";
  stopButton.style.display = "none";
  restartButton.style.display = "inline-block";
  startButton.disabled = false;
  gameBoard.innerHTML = "";
});

updateLeaderboard();
