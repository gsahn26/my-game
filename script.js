const board = document.getElementById("board");
const holes = Array.from(document.querySelectorAll(".hole"));
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const resultOverlay = document.getElementById("resultOverlay");
const finalScoreEl = document.getElementById("finalScore");

const GAME_DURATION = 30;
const MOLE_UP_TIME = 1000;

let score = 0;
let timeLeft = GAME_DURATION;
let timerId = null;
let moleTimerId = null;
let activeHole = null;
let isPlaying = false;

function getRandomHole(excludeHole) {
  let candidates = holes;
  if (excludeHole) {
    candidates = holes.filter((hole) => hole !== excludeHole);
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

function showMole() {
  if (activeHole) {
    activeHole.classList.remove("up");
  }
  const hole = getRandomHole(activeHole);
  activeHole = hole;
  hole.classList.add("up");

  moleTimerId = setTimeout(() => {
    hole.classList.remove("up");
    if (isPlaying) {
      showMole();
    }
  }, MOLE_UP_TIME);
}

function handleHoleClick(event) {
  if (!isPlaying) return;
  const hole = event.currentTarget;
  if (!hole.classList.contains("up")) return;

  hole.classList.remove("up");
  score += 1;
  scoreEl.textContent = score;

  clearTimeout(moleTimerId);
  showMole();
}

function updateTimer() {
  timeLeft -= 1;
  timeEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function startGame() {
  score = 0;
  timeLeft = GAME_DURATION;
  isPlaying = true;

  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;

  startBtn.disabled = true;
  resultOverlay.classList.add("hidden");

  clearInterval(timerId);
  clearTimeout(moleTimerId);

  timerId = setInterval(updateTimer, 1000);
  showMole();
}

function endGame() {
  isPlaying = false;
  clearInterval(timerId);
  clearTimeout(moleTimerId);

  if (activeHole) {
    activeHole.classList.remove("up");
    activeHole = null;
  }

  startBtn.disabled = false;
  finalScoreEl.textContent = score;
  resultOverlay.classList.remove("hidden");
}

holes.forEach((hole) => {
  hole.addEventListener("click", handleHoleClick);
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
