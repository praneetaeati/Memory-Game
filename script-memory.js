const memoryBoard = document.getElementById("memoryBoard");
const restartBtn = document.getElementById("restartMemory");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const message = document.getElementById("message");

let colors = ["red", "blue", "green", "yellow", "purple", "orange"];
let cards = [...colors, ...colors]; // 12 cards (6 pairs)
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let lives = 5;
let lockBoard = false;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function setupBoard() {
  memoryBoard.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
  score = 0;
  lives = 5;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  message.textContent = "";
  lockBoard = false;

  let shuffled = shuffle([...cards]);
  shuffled.forEach((color, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.color = color;
    card.dataset.index = index;
    card.style.backgroundColor = "#ccc";
    memoryBoard.appendChild(card);

    card.addEventListener("click", () => {
      if (lockBoard || card.classList.contains("matched") || flippedCards.includes(card)) return;

      flipCard(card);
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 600);
      }
    });
  });
}

function flipCard(card) {
  card.style.backgroundColor = card.dataset.color;
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.color === card2.dataset.color) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    score += 10;
    scoreEl.textContent = score;
    if (matchedPairs === colors.length) {
      message.textContent = "🎉 You won!";
    }
  } else {
    card1.style.backgroundColor = "#ccc";
    card2.style.backgroundColor = "#ccc";
    lives--;
    livesEl.textContent = lives;
    if (lives === 0) {
      message.textContent = "❌ Game Over!";
      lockBoard = true;
      return;
    }
  }
  flippedCards = [];
  lockBoard = false;
}

restartBtn.addEventListener("click", setupBoard);

setupBoard();
