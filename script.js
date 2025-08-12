// Ambil elemen
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

// Ukuran layar
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Karakter Mochil
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 40,
  color: 'yellow',
  speed: 5,
  dx: 0,
  dy: 0
};

// Skor & Timer
let score = 0;
let timeLeft = 60;
let timerInterval;

// Gambar Mochil
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0.2 * Math.PI, 1.8 * Math.PI); // Mulut terbuka
  ctx.lineTo(player.x, player.y);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// Update posisi
function update() {
  player.x += player.dx;
  player.y += player.dy;

  // Batas layar
  if (player.x - player.size < 0) player.x = player.size;
  if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
  if (player.y - player.size < 0) player.y = player.size;
  if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
}

// Loop game
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Mulai timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Waktu habis! Skor kamu: " + score);
    }
  }, 1000);
}

// Kontrol swipe
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchend', e => {
  const touch = e.changedTouches[0];
  let deltaX = touch.clientX - touchStartX;
  let deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Geser horizontal
    if (deltaX > 0) { // Kanan
      player.dx = player.speed;
      player.dy = 0;
    } else { // Kiri
      player.dx = -player.speed;
      player.dy = 0;
    }
  } else {
    // Geser vertikal
    if (deltaY > 0) { // Bawah
      player.dy = player.speed;
      player.dx = 0;
    } else { // Atas
      player.dy = -player.speed;
      player.dx = 0;
    }
  }
}, false);

// Mulai game
gameLoop();
startTimer();
