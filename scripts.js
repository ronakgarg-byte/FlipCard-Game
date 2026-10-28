const screen1 = document.querySelector(".screen1");
const screen2 = document.querySelector(".screen2");
const screen3 = document.querySelector(".screen3");

const startBtn = screen1.querySelector("button");
const flipCards = document.querySelectorAll(".flip-card");

const flipCardBacks = document.querySelectorAll(".flip-card-back");

const images = [
  "anne hathway.jpg",
  "hrithik roshan.avif",
  "john abraham.jpg",
  "kate winslet.webp",
  "scarlett johanson.jpg",
  "ranbir kapoor.webp",
];
const double = [...images, ...images];
//makes an  array in which twice thwe umages is there [hrithik,joh, , , , ,]
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// screen1.classList: add, remove, toggle

startBtn.addEventListener("click", () => {


  screen1.classList.add("hide");
  screen2.classList.remove("hide");

  //PUtting random images in the UI on click of "Start Game" button
  flipCardBacks.forEach((flipCardBack, index) => {
    const img = document.createElement("img");
    img.src = "images/" + shuffledImages[index];
    flipCardBack.dataset.image = shuffledImages[index];
    flipCardBack.append(img);
  });
  startTimer();
});

let seconds = 60;
let timer;
let audioContext;

function startTimer() {
  const timerText = document.getElementById("demo");

  // Start button click ke time sound context banega
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();

  timer = setInterval(() => {
    seconds--;

    if (seconds === 0) {
      timerText.textContent = "Game Over";
      clearInterval(timer);
      playBeep();
    } else {
      timerText.textContent = "Time: " + seconds;
    }
  }, 1000);
}

function playBeep() {
  const sound = audioContext.createOscillator();
  const volume = audioContext.createGain();

  sound.connect(volume);
  volume.connect(audioContext.destination);

  sound.frequency.value = 800;
  volume.gain.value = 0.2;

  sound.start();
  sound.stop(audioContext.currentTime + 0.5);
}
let firstCard = null;
let clicks = 0;
let matches = 0;
let boardLocked = false;

flipCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (boardLocked || card.classList.contains("matched")) return;
    if (card === firstCard) return;

    clicks++;
    document.getElementById("clickCounter").textContent = "Clicks: " + clicks;

    card.children[0].style.transform = "rotateY(180deg)";

    if (firstCard === null) {
      firstCard = card;
      return;
    }

    boardLocked = true;

    const image1 = firstCard.querySelector(".flip-card-back").dataset.image;
    const image2 = card.querySelector(".flip-card-back").dataset.image;

    if (image1 === image2) {
      matches++;
      document.getElementById("matchCounter").textContent =
        "Matches: " + matches;

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
const shuffledImages = shuffle(double);
console.log(shuffledImages);
