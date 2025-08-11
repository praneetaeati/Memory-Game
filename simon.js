let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let difficulty = "medium";
let moveTimer;
let isReplaying = false;

let h2 = document.querySelector("h2");
let progressBar = document.getElementById("progressBar");

document.addEventListener("keypress", () => {
  if (!started) {
    let user = document.getElementById("username").value || "Anonymous";
    difficulty = document.getElementById("difficulty").value;
    started = true;
    level = 0;
    gameSeq = [];
    levelUp();
  }
});

function getFlashDelay() {
  return difficulty === "easy" ? 500 : difficulty === "hard" ? 150 : 300;
}

function gameFlash(btn) {
  let delay = getFlashDelay();
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), delay);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 250);
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;
  let randColor = btns[Math.floor(Math.random() * btns.length)];
  gameSeq.push(randColor);
  let randBtn = document.getElementById(randColor);
  gameFlash(randBtn);
  startMoveTimer();
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      clearTimeout(moveTimer);
      setTimeout(levelUp, 800);
    }
  } else {
    endGame("❌ Wrong move! ");
  }
}

function btnPress() {
  if (!started || isReplaying) return;
  let btn = this;
  userFlash(btn);
  userSeq.push(btn.id);
  checkAns(userSeq.length - 1);
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", btnPress);
});

function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  clearTimeout(moveTimer);
  progressBar.style.width = "0%";
}

function startMoveTimer() {
  clearTimeout(moveTimer);
  progressBar.style.transition = "none";
  progressBar.style.width = "100%";
  progressBar.offsetWidth; // reflow
  progressBar.style.transition = `width 5s linear`;
  progressBar.style.width = "0%";
  moveTimer = setTimeout(() => {
    endGame("⏰ Time's up! ");
  }, 5000);
}

function replaySequence() {
  if (!started || gameSeq.length === 0) return;
  isReplaying = true;
  let i = 0;
  let interval = setInterval(() => {
    let btn = document.getElementById(gameSeq[i]);
    gameFlash(btn);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
      isReplaying = false;
      startMoveTimer();
    }
  }, 600);
}

function endGame(message) {
  h2.innerHTML = `${message} Score: <b>${level}</b><br>Press any key to restart.`;
  document.body.style.backgroundColor = "#ffcccb";
  setTimeout(() => (document.body.style.backgroundColor = "#f4f4f4"), 250);
  saveHighScore(level);
  reset();
}

function saveHighScore(score) {
  let user = document.getElementById("username").value || "Anonymous";
  let scores = JSON.parse(localStorage.getItem("highScores")) || [];
  scores.push({ user, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("highScores", JSON.stringify(scores.slice(0, 3)));
}

function showHighScores() {
  let scores = JSON.parse(localStorage.getItem("highScores")) || [];
  let str = scores.map(s => `${s.user}: ${s.score}`).join("\n");
  alert("🏆 Top Scores:\n" + str);
}

document.getElementById("replayBtn").addEventListener("click", replaySequence);
