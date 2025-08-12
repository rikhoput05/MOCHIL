const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔹 Kunci ukuran layar sekali saja (supaya stabil)
const fixedWidth = window.innerWidth;
const fixedHeight = window.innerHeight;
canvas.width = fixedWidth;
canvas.height = fixedHeight;

// Grid
const gridSize = 40;
const cols = Math.floor(fixedWidth / gridSize);
const rows = Math.floor(fixedHeight / gridSize);

// Score & Waktu
let score = 0;
let timeLeft = 30;
let gameOver = false;
const scoreBoard = document.getElementById("scoreBoard");
scoreBoard.style.position = "absolute";
scoreBoard.style.top = "10px";
scoreBoard.style.left = "50%";
scoreBoard.style.transform = "translateX(-50%)";
scoreBoard.style.color = "#fff";
scoreBoard.style.fontSize = "24px";
scoreBoard.style.fontWeight = "bold";

// Karakter Mochil
let mochil = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0,
  size: gridSize - 4
};

// Gambar
const imgMochil = new Image();
imgMochil.src = "MOCHIL1.png";

const imgLove = new Image();
imgLove.src = "LOVE.png";

const imgBG = new Image();
imgBG.src = "BG.png";

const imgHome = new Image();
imgHome.src = "GO_TO_HOME.png";

// Love array
let loves = [];

// Spawn awal love
function spawnInitialLoves() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!(i === mochil.x && j === mochil.y) && Math.random() < 0.15) {
        loves.push(spawnLove(i, j));
      }
    }
  }
}

function spawnLove(x, y) {
  let r = Math.random();
  if (r < 0.05) return { x, y, size: gridSize, type: "big" };
  if (r < 0.30) return { x, y, size: gridSize - 10, type: "medium" };
  return { x, y, size: gridSize - 18, type: "small" };
}

spawnInitialLoves();

// Animasi detak love
let pulse = 0;
function drawLoves() {
  pulse += 0.05;
  loves.forEach(love => {
    let scale = 1 + Math.sin(pulse) * 0.1;
    let size = love.size * scale;
    ctx.drawImage(
      imgLove,
      love.x * gridSize + (gridSize - size) / 2,
      love.y * gridSize + (gridSize - size) / 2,
      size,
      size
    );
  });
}

// Gambar Mochil
function drawMochil() {
  ctx.drawImage(
    imgMochil,
    mochil.x * gridSize + (gridSize - mochil.size) / 2,
    mochil.y * gridSize + (gridSize - mochil.size) / 2,
    mochil.size,
    mochil.size
  );
}

// Update ukuran Mochil
function updateMochilSize() {
  let maxSize = 150;
  let minSize = gridSize - 4;
  mochil.size = Math.min(minSize + (score / 200) * (maxSize - minSize), maxSize);
}

// Update game
function update() {
  if (gameOver) return;

  mochil.x += mochil.dirX;
  mochil.y += mochil.dirY;

  // Batas layar
  mochil.x = Math.max(0, Math.min(cols - 1, mochil.x));
  mochil.y = Math.max(0, Math.min(rows - 1, mochil.y));

  // Cek makan love
  for (let i = 0; i < loves.length; i++) {
    if (loves[i].x === mochil.x && loves[i].y === mochil.y) {
      loves.splice(i, 1);
      score++;
      updateMochilSize();

      let rx = Math.floor(Math.random() * cols);
      let ry = Math.floor(Math.random() * rows);
      loves.push(spawnLove(rx, ry));
      break;
    }
  }

  scoreBoard.innerText = `Score: ${score} | Time: ${timeLeft}s`;
}

// Timer
let timer = setInterval(() => {
  if (!gameOver) {
    timeLeft--;
    if (timeLeft <= 0) {
      gameOver = true;
      clearInterval(timer);
      scoreBoard.innerText = `Game Over! Final Score: ${score}`;
      showHomeButton = true;
    }
  }
}, 1000);

// Tombol Home
let showHomeButton = false;
let homeButtonX, homeButtonY, homeButtonWidth = 300, homeButtonHeight = 100;
let pulseHome = 0;

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, fixedWidth, fixedHeight);

  ctx.drawImage(imgBG, 0, 0, fixedWidth, fixedHeight);

  drawLoves();
  drawMochil();
  update();

  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, fixedWidth, fixedHeight);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", fixedWidth / 2, fixedHeight / 2 - 100);

    if (showHomeButton) {
      pulseHome += 0.05;
      let beat = Math.sin(pulseHome * 2) * Math.sin(pulseHome) * 0.08;
      let scale = 1 + beat;

      homeButtonWidth = 300 * scale;
      homeButtonHeight = 100 * scale;
      homeButtonX = (fixedWidth - homeButtonWidth) / 2;
      homeButtonY = fixedHeight / 2 + 20;

      ctx.drawImage(imgHome, homeButtonX, homeButtonY, homeButtonWidth, homeButtonHeight);
    }
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();

// Klik tombol Home
canvas.addEventListener("click", e => {
  if (showHomeButton) {
    let mx = e.clientX;
    let my = e.clientY;
    if (mx >= homeButtonX && mx <= homeButtonX + homeButtonWidth &&
        my >= homeButtonY && my <= homeButtonY + homeButtonHeight) {
      window.location.href = "index.html";
    }
  }
});

// Kontrol Keyboard
document.addEventListener("keydown", e => {
  let key = e.key.toLowerCase();
  if (key === "arrowup" || key === "w") { mochil.dirX = 0; mochil.dirY = -1; }
  if (key === "arrowdown" || key === "s") { mochil.dirX = 0; mochil.dirY = 1; }
  if (key === "arrowleft" || key === "a") { mochil.dirX = -1; mochil.dirY = 0; }
  if (key === "arrowright" || key === "d") { mochil.dirX = 1; mochil.dirY = 0; }
});

// Kontrol Swipe
let startX, startY;
canvas.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) { mochil.dirX = 1; mochil.dirY = 0; }
    else { mochil.dirX = -1; mochil.dirY = 0; }
  } else {
    if (dy > 0) { mochil.dirX = 0; mochil.dirY = 1; }
    else { mochil.dirX = 0; mochil.dirY = -1; }
  }
});
