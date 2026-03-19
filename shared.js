// ═══════════════════════════════════════════════
//  CRYPTO CRIME — Shared JS
//  No timer shown to users.
//  Timestamps are logged server-side via Google Sheets.
// ═══════════════════════════════════════════════

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_iI94FjuBai8AB5cry1g3LMh25E41Idu8D3K836pBPOpF4KhkQWqYrrbbuy4rrmaigg/exec";

const VALID_TEAM_IDS = [
  "MK2601","MK2602","MK2603","MK2604","MK2605","MK2606","MK2607","MK2608","MK2609","MK2610",
  "MK2611","MK2612","MK2613","MK2614","MK2615","MK2616","MK2617","MK2618","MK2619","MK2620",
  "MK2621","MK2622","MK2623","MK2624","MK2625","MK2626","MK2627","MK2628","MK2629","MK2630",
  "MK2631","MK2632","MK2633","MK2634","MK2635","MK2636","MK2637","MK2638","MK2639","MK2640",
  "MK2641","MK2642","MK2643","MK2644","MK2645","MK2646","MK2647","MK2648","MK2649","MK2650",
  "MK2651","MK2652","MK2653","MK2654","MK2655","MK2656","MK2657","MK2658","MK2659","MK2660",
  "MK2661","MK2662","MK2663","MK2664","MK2665","MK2666","MK2667","MK2668","MK2669","MK2670",
  "MK2671","MK2672","MK2673","MK2674","MK2675","MK2676","MK2677","MK2678","MK2679","MK2680",
  "MK2681","MK2682","MK2683","MK2684","MK2685","MK2686","MK2687","MK2688","MK2689","MK2690",
  "MK2691","MK2692","MK2693","MK2694","MK2695","MK2696","MK2697","MK2698","MK2699","MK2700",
  "MK2701","MK2702","MK2703","MK2704","MK2705","MK2706","MK2707","MK2708","MK2709","MK2710",
  "MK2711","MK2712","MK2713","MK2714","MK2715","MK2716","MK2717","MK2718","MK2719","MK2720",
  "MK2721","MK2722","MK2723","MK2724","MK2725","MK2726","MK2727","MK2728","MK2729","MK2730",
  "MK2731","MK2732","MK2733","MK2734","MK2735","MK2736","MK2737","MK2738","MK2739","MK2740",
  "MK2741","MK2742","MK2743","MK2744","MK2745","MK2746","MK2747","MK2748","MK2749","MK2750",
  "MK2751","MK2752","MK2753","MK2754","MK2755","MK2756","MK2757","MK2758","MK2759","MK2760",
  "MK2761","MK2762","MK2763","MK2764","MK2765","MK2766","MK2767","MK2768","MK2769","MK2770",
  "MK2771","MK2772","MK2773","MK2774","MK2775","MK2776","MK2777","MK2778","MK2779","MK2780",
  "MK2781","MK2782","MK2783","MK2784","MK2785","MK2786","MK2787","MK2788","MK2789","MK2790",
  "MK2791","MK2792","MK2793","MK2794","MK2795","MK2796","MK2797","MK2798","MK2799","MK2800"
];

// ── PICK UP PARAMS FROM URL (carries data across domains) ──
(function syncFromURL() {
  const params = new URLSearchParams(window.location.search);
  const teamId           = params.get("teamId");
  const teamName         = params.get("teamName");
  const collectedLetters = params.get("collectedLetters");
  if (teamId)           localStorage.setItem("teamId", teamId);
  if (teamName)         localStorage.setItem("teamName", teamName);
  if (collectedLetters) localStorage.setItem("collectedLetters", collectedLetters);
})();

// ── LOG TO GOOGLE SHEETS ──
async function logToSheet(data) {
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.warn("Sheet log failed:", err);
  }
}

// ── LETTER HELPERS ──
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

// ── BINARY RAIN ──
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
