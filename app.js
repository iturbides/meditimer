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
let wakeLock = null;

// Populate hours select (0 to 12)
for (let i = 0; i <= 12; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  hoursSelect.appendChild(option);
}

// Populate minutes select in intervals of 5 (0 to 60)
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

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released');
      });
      console.log('Screen Wake Lock acquired');
    } catch (err) {
      console.error(`Wake Lock error: ${err.name}, ${err.message}`);
    }
  } else {
    console.log('Wake Lock API not supported on this browser.');
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Screen Wake Lock released manually');
    } catch (err) {
      console.error('Error releasing Wake Lock:', err);
    }
  }
}

async function startTimer() {
  if (interval) return;

  const hrs = parseInt(hoursSelect.value);
  const mins = parseInt(minutesSelect.value);

  if (hrs === 0 && mins === 0) {
   alert("Please set a duration greater than 0.");
    return;
  }

  if (totalSeconds === 0) {
    totalSeconds = (hrs * 60 + mins) * 60;
  }

  await requestWakeLock();

  interval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      totalSeconds = 0;
      clearInterval(interval);
      interval = null;
      gong.currentTime = 0;
      gong.play().catch(e => console.error("Audio playback failed:", e));
      releaseWakeLock();
    }
    updateDisplay();
  }, 1000);

  updateDisplay();
}

async function pauseTimer() {
  clearInterval(interval);
  interval = null;
  await releaseWakeLock();
}

async function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  updateDisplay();
  gong.pause();
  gong.currentTime = 0;
  await releaseWakeLock();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
stopBtn.addEventListener("click", resetTimer);

updateDisplay();

