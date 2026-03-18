// ═══════════════════════════════════════════════
//  CRYPTO CRIME — Shared Config & Sheets Logger
//  Update SHEET_URL if you redeploy Apps Script
// ═══════════════════════════════════════════════

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_iI94FjuBai8AB5cry1g3LMh25E41Idu8D3K836pBPOpF4KhkQWqYrrbbuy4rrmaigg/exec";

// Valid pre-assigned Team IDs — add more as needed
const VALID_TEAM_IDS = [
  "MK2601","MK2602","MK2603","MK2604","MK2605",
  "MK2606","MK2607","MK2608","MK2609","MK2610",
  "MK2611","MK2612","MK2613","MK2614","MK2615",
  "MK2616","MK2617","MK2618","MK2619","MK2620"
];

// Token for each level — must match QR code URLs
const LEVEL_TOKENS = {
  1: "ROT1X",
  2: "BIN2X",
  3: "STG3X",
  4: "VIG4X",
  5: "AES5X",
  6: "SHA6X"
};

// ── LOG TO GOOGLE SHEETS ──
// action: 'registered' | 'level_complete' | 'finished'
async function logToSheet(data) {
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",          // required for Apps Script
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.warn("Sheet log failed (non-critical):", err);
  }
}

// ── TIMER HELPERS ──
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function getElapsedSeconds() {
  const start = parseInt(localStorage.getItem("teamStartTime") || "0");
  if (!start) return 0;
  return Math.floor((Date.now() - start) / 1000);
}

// ── LETTER TILE HELPERS ──
function getCollectedLetters() {
  return JSON.parse(localStorage.getItem("collectedLetters") || "[]");
}

function addLetter(letter) {
  const letters = getCollectedLetters();
  if (!letters.includes(letter)) {
    letters.push(letter);
    localStorage.setItem("collectedLetters", JSON.stringify(letters));
  }
  return letters;
}

function renderLetterTiles(miniPrefix, bigPrefix) {
  const letters = getCollectedLetters();
  for (let i = 0; i < 5; i++) {
    const mini = document.getElementById(`${miniPrefix}${i}`);
    const big  = document.getElementById(`${bigPrefix}${i}`);
    if (letters[i]) {
      if (mini) { mini.textContent = letters[i]; mini.classList.add("lit"); }
      if (big)  { big.textContent  = letters[i]; big.classList.add("revealed"); }
    }
  }
}

// ── BINARY RAIN BACKGROUND ──
function startBinaryRain(opacity = 0.05) {
  const c = document.createElement("canvas");
  c.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;opacity:${opacity};pointer-events:none;z-index:0;`;
  document.body.prepend(c);
  const cx = c.getContext("2d");
  let cols, drops;
  function init() {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.floor(c.width / 14);
    drops = Array(cols).fill(1);
  }
  function draw() {
    cx.fillStyle = "rgba(2,12,2,0.05)"; cx.fillRect(0,0,c.width,c.height);
    cx.fillStyle = "#00ff41"; cx.font = "14px Share Tech Mono";
    drops.forEach((y, i) => {
      cx.fillText(Math.random() > 0.5 ? "1" : "0", i * 14, y * 14);
      if (y * 14 > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  init();
  setInterval(draw, 50);
  addEventListener("resize", init);
}
