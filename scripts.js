const screen1 = document.querySelector(".screen1");
const screen2 = document.querySelector(".screen2");
const startBtn = screen1.querySelector("button");

const flipCards = document.querySelectorAll(".flip-card");
const flipCardBacks = document.querySelectorAll(".flip-card-back");

const timerText = document.getElementById("demo");
const clickCounter = document.getElementById("clickCounter");
const matchCounter = document.getElementById("matchCounter");

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
let audioContext;

let firstCard = null;
let clicks = 0;
let matches = 0;
let boardLocked = false;
let gameOver = false;
let gameStarted = false;

if (timerText) timerText.textContent = "Time: 60";
if (clickCounter) clickCounter.textContent = "Clicks: 0";
if (matchCounter) matchCounter.textContent = "Matches: 0";

startBtn.addEventListener("click", () => {
  if (gameStarted) return;

  gameStarted = true;
  screen1.classList.add("hide");
  screen2.classList.remove("hide");

  flipCardBacks.forEach((flipCardBack, index) => {
    const img = document.createElement("img");

    img.src = "images/" + shuffledImages[index];
    img.alt = "Memory game card";

    flipCardBack.dataset.image = shuffledImages[index];
    flipCardBack.append(img);
  });

  startTimer();

  // Start button click ke baad sound context start hota hai
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
      audioContext = new AudioContext();
      audioContext.resume();
    }
  } catch (error) {
    console.log("Audio start nahi ho paya.");
  }
});

function startTimer() {
  timer = setInterval(() => {
    seconds--;

    if (seconds <= 0) {
      seconds = 0;
      gameOver = true;
      boardLocked = true;

      if (timerText) timerText.textContent = "Game Over";

      clearInterval(timer);
      playBeep();
      return;
    }

    if (timerText) {
      timerText.textContent = "Time: " + seconds;
    }
  }, 1000);
}

function playBeep() {
  if (!audioContext) return;

  const sound = audioContext.createOscillator();
  const volume = audioContext.createGain();

  sound.connect(volume);
  volume.connect(audioContext.destination);

  sound.frequency.value = 800;
  volume.gain.value = 0.2;

  sound.start();
  sound.stop(audioContext.currentTime + 0.5);
}

flipCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Game start na hua ho, time khatam ho gaya ho,
    // ya board lock ho, toh click kaam nahi karega
    if (!gameStarted || gameOver || boardLocked) return;
    if (card.classList.contains("matched")) return;
    if (card === firstCard) return;

    clicks++;

    if (clickCounter) {
      clickCounter.textContent = "Clicks: " + clicks;
    }

    card.children[0].style.transform = "rotateY(180deg)";

    if (firstCard === null) {
      firstCard = card;
      return;
    }

    boardLocked = true;

    const image1 = firstCard
      .querySelector(".flip-card-back")
      .dataset.image;

    const image2 = card
      .querySelector(".flip-card-back")
      .dataset.image;

    if (image1 === image2) {
      matches++;

      if (matchCounter) {
        matchCounter.textContent = "Matches: " + matches;
      }

      firstCard.classList.add("matched");
      card.classList.add("matched");

      firstCard = null;
      boardLocked = false;
    } else {
      setTimeout(() => {
        firstCard.children[0].style.transform = "rotateY(0deg)";
        card.children[0].style.transform = "rotateY(0deg)";

        firstCard = null;
        boardLocked = false;
      }, 1500);
    }
  });
});