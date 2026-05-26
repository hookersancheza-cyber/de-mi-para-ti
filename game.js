/* ═══════════════════════════════════════════════════════════════════
   🎮 JUEGO ROMÁNTICO "NUESTRO AMOR"
   ═══════════════════════════════════════════════════════════════════
   Instrucciones:
   - Flechas / WASD para moverte
   - Encuentra todas las letras para formar la frase
   - Esquiva los obstáculos
   - Llega al final para ver el mensaje sorpresa
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   ⚙️  CONFIGURACIÓN - EDITA AQUÍ PARA PERSONALIZAR
   ═══════════════════════════════════════════════════════════════════ */

// --- Mensaje romántico final (edita las líneas que quieras) ---
const FINAL_MESSAGE = [
  'Para la niña más hermosa del mundo 💐❤️',
  'Gracias por existir.',
  'Te amo infinitamente. 🌹'
];

// --- Velocidad del juego (más alto = más lento) ---
const PLAYER_MOVE_INTERVAL = 8;
const OBSTACLE_MOVE_INTERVAL = 35;

/* ═══════════════════════════════════════════════════════════════════
   INICIALIZACIÓN DEL CANVAS
   ═══════════════════════════════════════════════════════════════════ */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const COLS = 16, ROWS = 12;
let TILE = 40, CANVAS_W = 640, CANVAS_H = 480;

function resizeCanvas() {
  const maxW = window.innerWidth * 0.92;
  const maxH = window.innerHeight * 0.55;
  const tileW = Math.floor(maxW / COLS);
  const tileH = Math.floor(maxH / ROWS);
  TILE = Math.max(24, Math.min(tileW, tileH, 52));
  CANVAS_W = TILE * COLS;
  CANVAS_H = TILE * ROWS;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  canvas.style.width = CANVAS_W + 'px';
  canvas.style.height = CANVAS_H + 'px';
}

/* ═══════════════════════════════════════════════════════════════════
   NIVELES DEL JUEGO
   ═══════════════════════════════════════════════════════════════════
   Cada nivel tiene:
   - word: palabra a formar
   - map: grid 16x12 (1=pared, 0=camino)
   - letterPos: [{x, y}] posiciones de cada letra
   - obstacles: [{x, y, dx, dy}] obstáculos que se mueven
   - start: {x, y} posición inicial
   ═══════════════════════════════════════════════════════════════════ */

const LEVELS = [
  // ─── Nivel 1: "MI" ───
  {
    word: 'MI',
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
      [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
      [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    letterPos: [{ x: 14, y: 2 }, { x: 3, y: 10 }],
    obstacles: [{ x: 8, y: 5, dx: 1, dy: 0 }],
    start: { x: 1, y: 1 }
  },

  // ─── Nivel 2: "NEGRA" ───
  {
    word: 'NEGRA',
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    letterPos: [
      { x: 14, y: 2 }, { x: 2, y: 3 },
      { x: 13, y: 5 }, { x: 4, y: 9 },
      { x: 14, y: 10 }
    ],
    obstacles: [
      { x: 7, y: 5, dx: 0, dy: -1 },
      { x: 4, y: 5, dx: 1, dy: 0 }
    ],
    start: { x: 1, y: 1 }
  },

  // ─── Nivel 3: "HERMOSHA" ───
  {
    word: 'HERMOSHA',
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,1,1,1,1,0,0,1,1,0,1],
      [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
      [1,0,1,1,0,0,1,1,1,1,0,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    letterPos: [
      { x: 14, y: 1 }, { x: 5, y: 2 },
      { x: 1, y: 3 }, { x: 14, y: 4 },
      { x: 1, y: 5 }, { x: 14, y: 7 },
      { x: 5, y: 8 }, { x: 1, y: 10 }
    ],
    obstacles: [
      { x: 7, y: 4, dx: 1, dy: 0 },
      { x: 8, y: 7, dx: -1, dy: 0 },
      { x: 6, y: 3, dx: 0, dy: 1 }
    ],
    start: { x: 1, y: 1 }
  },

  // ─── Nivel 4: "BELLA" ───
  {
    word: 'BELLA',
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    letterPos: [
      { x: 14, y: 2 }, { x: 2, y: 4 },
      { x: 13, y: 7 }, { x: 7, y: 5 },
      { x: 14, y: 10 }
    ],
    obstacles: [
      { x: 3, y: 3, dx: 1, dy: 0 },
      { x: 12, y: 5, dx: 0, dy: -1 },
      { x: 6, y: 8, dx: 1, dy: 0 },
      { x: 9, y: 4, dx: 0, dy: 1 }
    ],
    start: { x: 1, y: 1 }
  }
];

/* ═══════════════════════════════════════════════════════════════════
   FRASE COMPLETA Y CONFIGURACIÓN DE LETRAS
   ═══════════════════════════════════════════════════════════════════ */

const FULL_PHRASE = 'MI NEGRA HERMOSHA BELLA';
const allLetters = [];

// Construir array plano de todas las letras a recolectar
LEVELS.forEach((level, lvlIdx) => {
  level.word.split('').forEach(ch => {
    allLetters.push({ char: ch, collected: false, levelIdx: lvlIdx });
  });
});

// Mapa de índice en la frase -> índice en allLetters (-1 = espacio)
function buildPhraseIndices() {
  const indices = [];
  let letterIdx = 0;
  for (let i = 0; i < FULL_PHRASE.length; i++) {
    if (FULL_PHRASE[i] === ' ') {
      indices.push(-1);
    } else {
      indices.push(letterIdx);
      letterIdx++;
    }
  }
  return indices;
}
const PHRASE_LETTER_INDICES = buildPhraseIndices();

/* ═══════════════════════════════════════════════════════════════════
   ESTADO DEL JUEGO
   ═══════════════════════════════════════════════════════════════════ */

let currentLevel = 0;
let player = { x: 1, y: 1 };
let lives = 3;
let frameCount = 0;
let moveTimer = 0;
let gameRunning = false;
let gamePaused = false;
let hitFlash = 0;
let particles = [];
let shakeAmount = 0;
let collectedThisLevel = new Set();

let keysDown = {};
let touchDir = null;

/* ═══════════════════════════════════════════════════════════════════
   FUNCIONES AUXILIARES
   ═══════════════════════════════════════════════════════════════════ */

function getLevel() { return LEVELS[currentLevel]; }

function isWalkable(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  return getLevel().map[y][x] === 0;
}

function getLetterAt(x, y) {
  const lvl = getLevel();
  for (let i = 0; i < lvl.letterPos.length; i++) {
    const pos = lvl.letterPos[i];
    if (pos.x === x && pos.y === y && !collectedThisLevel.has(i)) {
      return { index: i, letter: lvl.word[i] };
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   SISTEMA DE PARTÍCULAS (corazones y destellos)
   ═══════════════════════════════════════════════════════════════════ */

const PARTICLE_EMOJIS = ['❤️', '💖', '💕', '✨', '🌸', '💗', '🌟'];

function spawnParticles(x, y, count) {
  const cx = x * TILE + TILE / 2;
  const cy = y * TILE + TILE / 2;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 6 - 2,
      life: 1,
      decay: 0.008 + Math.random() * 0.015,
      emoji: PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)],
      size: 10 + Math.random() * 16
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= p.decay;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

/* ═══════════════════════════════════════════════════════════════════
   FLORES Y CORAZONES EN PANTALLA FINAL
   ═══════════════════════════════════════════════════════════════════ */

const FLOWER_EMOJIS = ['🌸', '🌺', '🌹', '🌷', '💐', '🌻'];
const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💓'];

function startFinalAnimations() {
  // Flores cayendo
  const flowerContainer = document.getElementById('flower-container');
  flowerContainer.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'falling-flower';
      el.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      el.style.animationDuration = (8 + Math.random() * 12) + 's';
      el.style.animationDelay = '0s';
      el.style.opacity = 0.4 + Math.random() * 0.4;
      flowerContainer.appendChild(el);
    }, i * 200);
  }

  // Corazones flotando
  const heartsContainer = document.getElementById('hearts-container');
  heartsContainer.innerHTML = '';
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'floating-heart';
      el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
      el.style.left = (5 + Math.random() * 90) + '%';
      el.style.fontSize = (1.2 + Math.random() * 1.8) + 'rem';
      el.style.animationDuration = (6 + Math.random() * 8) + 's';
      el.style.animationDelay = '0s';
      heartsContainer.appendChild(el);
    }, i * 300);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MOVIMIENTO DEL JUGADOR
   ═══════════════════════════════════════════════════════════════════ */

function movePlayer(dx, dy) {
  if (!gameRunning || gamePaused) return;
  if (hitFlash > 0) return;

  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!isWalkable(nx, ny)) return;

  player.x = nx;
  player.y = ny;

  // Revisar si hay letra aquí
  const letter = getLetterAt(nx, ny);
  if (letter) {
    collectedThisLevel.add(letter.index);
    const globalIdx = getGlobalLetterIndex(currentLevel, letter.index);
    if (globalIdx !== -1) {
      allLetters[globalIdx].collected = true;
    }
    spawnParticles(nx, ny, 18);
    updatePhraseDisplay();
    shakeAmount = 4;

    // Verificar si completó el nivel
    if (collectedThisLevel.size === getLevel().word.length) {
      gamePaused = true;
      setTimeout(showLevelComplete, 500);
    }
  }
}

function getGlobalLetterIndex(levelIdx, localIdx) {
  let count = 0;
  for (let l = 0; l < levelIdx; l++) {
    count += LEVELS[l].word.length;
  }
  return count + localIdx;
}

/* ═══════════════════════════════════════════════════════════════════
   OBSTÁCULOS
   ═══════════════════════════════════════════════════════════════════ */

let obstacleTimers = [];

function initObstacles() {
  const lvl = getLevel();
  obstacleTimers = lvl.obstacles.map(() =>
    Math.floor(Math.random() * OBSTACLE_MOVE_INTERVAL)
  );
}

function updateObstacles() {
  const lvl = getLevel();
  for (let i = 0; i < lvl.obstacles.length; i++) {
    obstacleTimers[i]--;
    if (obstacleTimers[i] <= 0) {
      obstacleTimers[i] = OBSTACLE_MOVE_INTERVAL;
      const obs = lvl.obstacles[i];
      const nx = obs.x + obs.dx;
      const ny = obs.y + obs.dy;
      if (isWalkable(nx, ny)) {
        obs.x = nx;
        obs.y = ny;
      } else {
        obs.dx *= -1;
        obs.dy *= -1;
      }
    }
  }
  checkObstacleCollision();
}

function checkObstacleCollision() {
  if (hitFlash > 0 || !gameRunning || gamePaused) return;
  const lvl = getLevel();
  for (const obs of lvl.obstacles) {
    if (obs.x === player.x && obs.y === player.y) {
      onPlayerHit();
      break;
    }
  }
}

function onPlayerHit() {
  lives--;
  hitFlash = 40;
  shakeAmount = 10;
  updateLivesDisplay();

  if (lives <= 0) {
    gameRunning = false;
    setTimeout(showGameOver, 600);
  } else {
    gamePaused = true;
    setTimeout(() => {
      player.x = getLevel().start.x;
      player.y = getLevel().start.y;
      gamePaused = false;
    }, 400);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   RENDERIZADO
   ═══════════════════════════════════════════════════════════════════ */

function drawLevel() {
  const lvl = getLevel();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * TILE;
      const py = y * TILE;

      if (lvl.map[y][x] === 1) {
        // Paredes: malva / rosa viejo
        const grad = ctx.createLinearGradient(px, py, px, py + TILE);
        grad.addColorStop(0, '#7B5E8C');
        grad.addColorStop(1, '#5A3D6B');
        ctx.fillStyle = grad;
        ctx.fillRect(px, py, TILE, TILE);

        ctx.strokeStyle = 'rgba(212,165,181,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, TILE, TILE);
      } else {
        // Suelo: alterna morado oscuro y rosa suave
        ctx.fillStyle = (x + y) % 2 === 0 ? '#2D1B3A' : '#3D2B4A';
        ctx.fillRect(px, py, TILE, TILE);
      }
    }
  }
}

function drawPlayer() {
  const cx = player.x * TILE + TILE / 2;
  const cy = player.y * TILE + TILE / 2;
  const pulse = 1 + Math.sin(frameCount * 0.05) * 0.06;
  const r = TILE * 0.35 * pulse;
  const flash = hitFlash > 0;

  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2.8);
  grad.addColorStop(0, flash ? 'rgba(255,50,50,0.2)' : 'rgba(255,107,138,0.2)');
  grad.addColorStop(1, 'rgba(255,107,138,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);

  const hGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
  hGrad.addColorStop(0, flash ? '#ff6666' : '#FF9EB5');
  hGrad.addColorStop(0.5, flash ? '#ff4444' : '#FF6B8A');
  hGrad.addColorStop(1, flash ? '#cc2222' : '#D4406A');
  ctx.fillStyle = hGrad;
  ctx.shadowColor = flash ? '#ff4444' : '#FF6B8A';
  ctx.shadowBlur = 20;

  ctx.beginPath();
  ctx.moveTo(0, -r * 0.3);
  ctx.bezierCurveTo(-r * 0.8, -r * 0.9, -r * 1.1, r * 0.1, 0, r * 0.7);
  ctx.bezierCurveTo(r * 1.1, r * 0.1, r * 0.8, -r * 0.9, 0, -r * 0.3);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.15, -r * 0.15, r * 0.15, r * 0.1, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.15, -r * 0.15, r * 0.1, r * 0.07, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLetters() {
  const lvl = getLevel();
  const time = Date.now() / 1000;

  for (let i = 0; i < lvl.letterPos.length; i++) {
    if (collectedThisLevel.has(i)) continue;
    const pos = lvl.letterPos[i];
    const cx = pos.x * TILE + TILE / 2;
    const cy = pos.y * TILE + TILE / 2;
    const glow = Math.sin(time * 2 + i) * 0.3 + 0.7;
    const bob = Math.sin(time * 1.5 + i * 0.8) * 3;

    const grad = ctx.createRadialGradient(cx, cy + bob, 2, cx, cy + bob, TILE * 0.8);
    grad.addColorStop(0, `rgba(255,107,138,${glow * 0.3})`);
    grad.addColorStop(1, 'rgba(255,107,138,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, TILE * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255,107,138,${glow * 0.2})`;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, TILE * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(212,165,181,${glow * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + bob, TILE * 0.32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFF0E8';
    ctx.shadowColor = '#FF6B8A';
    ctx.shadowBlur = 15 * glow;
    ctx.font = `bold ${TILE * 0.4}px 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lvl.word[i], cx, cy + bob + 1);
    ctx.shadowBlur = 0;
  }
}

function drawObstacles() {
  const lvl = getLevel();
  const pulse = Math.sin(frameCount * 0.08) * 0.1 + 0.9;

  for (const obs of lvl.obstacles) {
    const cx = obs.x * TILE + TILE / 2;
    const cy = obs.y * TILE + TILE / 2;
    const r = TILE * 0.3 * pulse;

    // Brillo oscuro
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2);
    grad.addColorStop(0, 'rgba(80,40,60,0.15)');
    grad.addColorStop(1, 'rgba(80,40,60,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
    ctx.fill();

    // Figura de obstáculo (espina oscura)
    ctx.fillStyle = '#4A2A3A';
    ctx.shadowColor = '#2A1A2A';
    ctx.shadowBlur = 8;
    // Rombo
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ojo
    ctx.fillStyle = '#FF6B8A';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHitFlash() {
  if (hitFlash > 0 && hitFlash % 4 < 2) {
    ctx.fillStyle = 'rgba(255,0,0,0.2)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   ACTUALIZACIÓN DE LA INTERFAZ
   ═══════════════════════════════════════════════════════════════════ */

function buildPhraseDisplay() {
  const container = document.getElementById('phrase-container');
  container.innerHTML = '';
  let letterIdx = 0;
  for (let i = 0; i < FULL_PHRASE.length; i++) {
    const ch = FULL_PHRASE[i];
    const span = document.createElement('span');
    if (ch === ' ') {
      span.className = 'phrase-char space';
      span.textContent = ' ';
    } else {
      span.className = 'phrase-char';
      span.textContent = ch;
      span.dataset.letterIndex = letterIdx;
      if (allLetters[letterIdx] && allLetters[letterIdx].collected) {
        span.classList.add('collected');
      }
      letterIdx++;
    }
    container.appendChild(span);
  }
}

function updatePhraseDisplay() {
  const spans = document.querySelectorAll('#phrase-container .phrase-char:not(.space)');
  for (const span of spans) {
    const idx = parseInt(span.dataset.letterIndex);
    if (allLetters[idx] && allLetters[idx].collected) {
      span.classList.add('collected');
    }
  }
}

function updateLivesDisplay() {
  const hearts = document.querySelectorAll('.heart-icon');
  hearts.forEach((h, i) => {
    if (i >= lives) {
      h.classList.add('lost');
    } else {
      h.classList.remove('lost');
    }
  });
}

function updateHUD() {
  document.getElementById('level-num').textContent = currentLevel + 1;
  document.getElementById('level-word').textContent = getLevel().word;
}

/* ═══════════════════════════════════════════════════════════════════
   TRANSICIONES DE PANTALLA
   ═══════════════════════════════════════════════════════════════════ */

function showLevelComplete() {
  gamePaused = true;
  document.getElementById('lc-found-word').textContent = getLevel().word;
  document.getElementById('level-complete').classList.remove('hidden');
}

function nextLevel() {
  document.getElementById('level-complete').classList.add('hidden');
  if (currentLevel < LEVELS.length - 1) {
    currentLevel++;
    initLevel();
  } else {
    showFinalScreen();
  }
}

function showGameOver() {
  document.getElementById('gameover-screen').classList.remove('hidden');
}

function restartGame() {
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('level-complete').classList.add('hidden');
  currentLevel = 0;
  lives = 3;
  allLetters.forEach(l => l.collected = false);
  buildPhraseDisplay();
  updateLivesDisplay();
  initLevel();
}

function showFinalScreen() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('final-screen').classList.remove('hidden');
  startFinalAnimations();
}

/* ═══════════════════════════════════════════════════════════════════
   INICIALIZACIÓN DE NIVEL
   ═══════════════════════════════════════════════════════════════════ */

function initLevel() {
  const lvl = getLevel();
  player.x = lvl.start.x;
  player.y = lvl.start.y;
  gameRunning = true;
  gamePaused = false;
  particles = [];
  collectedThisLevel = new Set();
  hitFlash = 0;
  moveTimer = 0;
  shakeAmount = 0;
  initObstacles();
  updateHUD();
  updateLivesDisplay();
}

/* ═══════════════════════════════════════════════════════════════════
   GAME LOOP PRINCIPAL
   ═══════════════════════════════════════════════════════════════════ */

function update() {
  frameCount++;

  if (hitFlash > 0) hitFlash--;

  // Movimiento del jugador por teclado
  if (gameRunning && !gamePaused && hitFlash <= 0) {
    let dx = 0, dy = 0;
    if (touchDir) {
      dx = touchDir.x; dy = touchDir.y;
    } else {
      if (keysDown['ArrowUp'] || keysDown['w'] || keysDown['W']) dy = -1;
      else if (keysDown['ArrowDown'] || keysDown['s'] || keysDown['S']) dy = 1;
      else if (keysDown['ArrowLeft'] || keysDown['a'] || keysDown['A']) dx = -1;
      else if (keysDown['ArrowRight'] || keysDown['d'] || keysDown['D']) dx = 1;
    }

    if (dx !== 0 || dy !== 0) {
      moveTimer--;
      if (moveTimer <= 0) {
        moveTimer = PLAYER_MOVE_INTERVAL;
        movePlayer(dx, dy);
      }
    } else {
      moveTimer = 0;
    }

    updateObstacles();
  }

  updateParticles();

  if (shakeAmount > 0) shakeAmount *= 0.9;
  if (shakeAmount < 0.1) shakeAmount = 0;
}

function render() {
  ctx.save();

  // Shake
  if (shakeAmount > 0.5) {
    const sx = (Math.random() - 0.5) * shakeAmount;
    const sy = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(sx, sy);
  }

  ctx.clearRect(-5, -5, CANVAS_W + 10, CANVAS_H + 10);

  // Fondo - cielo nocturno romántico
  const bg = ctx.createRadialGradient(CANVAS_W/2, CANVAS_H/2, 0, CANVAS_W/2, CANVAS_H/2, CANVAS_W * 0.7);
  bg.addColorStop(0, '#1A1030');
  bg.addColorStop(1, '#0A0418');
  ctx.fillStyle = bg;
  ctx.fillRect(-5, -5, CANVAS_W + 10, CANVAS_H + 10);

  drawLevel();
  drawLetters();
  drawObstacles();
  drawPlayer();
  drawParticles();
  drawHitFlash();

  ctx.restore();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

/* ═══════════════════════════════════════════════════════════════════
   EVENTOS DE TECLADO
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
    e.preventDefault();
  }

  keysDown[key] = true;

  if (key === 'Enter' || key === ' ') {
    const lc = document.getElementById('level-complete');
    if (!lc.classList.contains('hidden')) {
      nextLevel();
      return;
    }
    const go = document.getElementById('gameover-screen');
    if (!go.classList.contains('hidden')) {
      restartGame();
      return;
    }
  }
});

document.addEventListener('keyup', (e) => {
  delete keysDown[e.key];
});

/* ═══════════════════════════════════════════════════════════════════
   CONTROLES TÁCTILES
   ═══════════════════════════════════════════════════════════════════ */

// Swipe en el canvas
(function() {
  let sx = 0, sy = 0;
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    sx = t.clientX;
    sy = t.clientY;
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!sx) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      touchDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else {
      touchDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }
    setTimeout(() => { touchDir = null; }, 100);
    sx = 0; sy = 0;
  }, { passive: false });
})();

// Botones táctiles virtuales
document.querySelectorAll('.touch-btn').forEach(btn => {
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const dir = btn.dataset.dir;
    if (dir === 'up') touchDir = { x: 0, y: -1 };
    else if (dir === 'down') touchDir = { x: 0, y: 1 };
    else if (dir === 'left') touchDir = { x: -1, y: 0 };
    else if (dir === 'right') touchDir = { x: 1, y: 0 };
  }, { passive: false });
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchDir = null;
  }, { passive: false });
  btn.addEventListener('touchcancel', () => { touchDir = null; });
});

/* ═══════════════════════════════════════════════════════════════════
   BOTONES DE LA INTERFAZ
   ═══════════════════════════════════════════════════════════════════ */

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  initLevel();
});

document.getElementById('lc-btn').addEventListener('click', nextLevel);
document.getElementById('go-btn').addEventListener('click', restartGame);
document.getElementById('restart-final-btn').addEventListener('click', () => {
  document.getElementById('final-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  restartGame();
});

/* ═══════════════════════════════════════════════════════════════════
   RESPONSIVE - REDIMENSIONAR CANVAS
   ═══════════════════════════════════════════════════════════════════ */

window.addEventListener('resize', resizeCanvas);

/* ═══════════════════════════════════════════════════════════════════
   INICIO DEL JUEGO
   ═══════════════════════════════════════════════════════════════════ */

resizeCanvas();
buildPhraseDisplay();
initLevel();
gameLoop();
