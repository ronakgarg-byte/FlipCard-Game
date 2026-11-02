const screen1 = document.querySelector(".screen1");
const screen2 = document.querySelector(".screen2");
const startBtn = screen1.querySelector("button");

const flipCards = document.querySelectorAll(".flip-card");
const flipCardBacks = document.querySelectorAll(".flip-card-back");

const timerText = document.getElementById("demo");
const clickCounter = document.getElementById("clickCounter");
const matchCounter = document.getElementById("matchCounter");

const gameOverBox = document.getElementById("gameOver");
const resultTitle = document.getElementById("resultTitle");
const finalClicks = document.getElementById("finalClicks");

const images = [
  "anne hathway.jpg",
  "hrithik roshan.avif",
  "john abraham.jpg",
  "kate winslet.webp",
  "scarlett johanson.jpg",
  "ranbir kapoor.webp",
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const shuffledImages = shuffle([...images, ...images]);

let seconds = 60;
let timer;
let firstCard = null;
let clicks = 0;
let matches = 0;
let boardLocked = false;
let gameEnded = false;
let gameStarted = false;

timerText.textContent = "Time: 60";
clickCounter.textContent = "Clicks: 0";
matchCounter.textContent = "Matches: 0";

startBtn.addEventListener("click", () => {
  if (gameStarted) return;

  gameStarted = true;
  screen1.classList.add("hide");
  screen2.classList.remove("hide");

  flipCardBacks.forEach((back, index) => {
    const img = document.createElement("img");
    img.src = "images/" + shuffledImages[index];
    img.alt = "Memory game card";

    back.dataset.image = shuffledImages[index];
    back.appendChild(img);
  });

  startTimer();
});

function startTimer() {
  timer = setInterval(() => {
    seconds--;
    timerText.textContent = "Time: " + seconds;

    if (seconds <= 0) {
      endGame("Time's up!");
    }
  }, 1000);
}

function endGame(title) {
  if (gameEnded) return;

  gameEnded = true;
  boardLocked = true;
  clearInterval(timer);

  resultTitle.textContent = title;
  finalClicks.textContent = clicks + " clicks";
  gameOverBox.classList.remove("hide");
}

flipCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!gameStarted || gameEnded || boardLocked) return;
    if (card.classList.contains("matched")) return;
    if (card === firstCard) return;

    clicks++;
    clickCounter.textContent = "Clicks: " + clicks;

    const inner = card.querySelector(".flip-card-inner");
    inner.style.transform = "rotateY(180deg)";

    if (firstCard === null) {
      firstCard = card;
      return;
    }

    boardLocked = true;

    const firstImage = firstCard.querySelector(".flip-card-back").dataset.image;
    const secondImage = card.querySelector(".flip-card-back").dataset.image;

    if (firstImage === secondImage) {
      firstCard.classList.add("matched");
      card.classList.add("matched");

      matches++;
      matchCounter.textContent = "Matches: " + matches;

      firstCard = null;
      boardLocked = false;

      if (matches === images.length) {
        endGame("You found them all!");
      }
    } else {
      const previousCard = firstCard;
      firstCard = null;

      setTimeout(() => {
        previousCard.querySelector(".flip-card-inner").style.transform =
          "rotateY(0deg)";
        inner.style.transform = "rotateY(0deg)";
        boardLocked = false;
      }, 1000);
    }
  });
});