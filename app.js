const hoursSelect = document.getElementById("hours");
const minutesSelect = document.getElementById("minutes");
const gong = document.getElementById("gong");

const hhWrap = document.getElementById("hh");
const mmWrap = document.getElementById("mm");
const ssWrap = document.getElementById("ss");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");

let totalSeconds = 0;
let interval = null;

for (let i = 0; i <= 12; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  hoursSelect.appendChild(option);
}

// Minutes in intervals of 5
for (let i = 0; i <= 60; i += 5) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  minutesSelect.appendChild(option);
}

function pad(num) {
  return String(num).padStart(2, '0');
}

function updateDisplay() {
  const hrs = pad(Math.floor(totalSeconds / 3600));
  const mins = pad(Math.floor((totalSeconds % 3600) / 60));
  const secs = pad(totalSeconds % 60);

  hhWrap.textContent = hrs;
  mmWrap.textContent = mins;
  ssWrap.textContent = secs;
}

function startTimer() {
  if (interval) return;

  const hrs = parseInt(hoursSelect.value);
  const mins = parseInt(minutesSelect.value);

  if (totalSeconds === 0) {
    totalSeconds = (hrs * 60 + mins) * 60;
  }

  interval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      totalSeconds = 0;
      clearInterval(interval);
      interval = null;
      gong.currentTime = 0;
      gong.play().catch(e => console.error("Audio playback failed:", e));
    }
    updateDisplay();
  }, 1000);

  updateDisplay();
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  updateDisplay();
  gong.pause();
  gong.currentTime = 0;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
stopBtn.addEventListener("click", resetTimer);

updateDisplay();

