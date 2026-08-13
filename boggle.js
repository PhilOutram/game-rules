// Boggle rules content + the SVG letter-grid diagram used in the guide.
// Same shape as backgammon.js: plain strings the router drops straight in.

// ---- Letter-grid diagram builder ------------------------------------------
const GVIEW = 360;       // square viewBox
const GMARGIN = 16;      // gap from the edge to the first tile
const GGAP = 8;          // gap between tiles
const GRID_N = 4;        // 4x4 board
const CELL = (GVIEW - GMARGIN * 2 - GGAP * (GRID_N - 1)) / GRID_N;

function cellXY(r, c) {
  return { x: GMARGIN + c * (CELL + GGAP), y: GMARGIN + r * (CELL + GGAP) };
}

// letters: 16 strings row-major. path: array of [row, col] tracing one word.
function boggleGrid(letters, path = []) {
  const onPath = new Set(path.map(([r, c]) => r * GRID_N + c));

  let tiles = "";
  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const i = r * GRID_N + c;
      const { x, y } = cellXY(r, c);
      const hot = onPath.has(i);
      const fill = hot ? "#0ea5e9" : "#f5efe1";
      const tcol = hot ? "#f8fafc" : "#1f2937";
      tiles += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="12" fill="${fill}" stroke="#c8b48f" stroke-width="2" />`;
      tiles += `<text x="${x + CELL / 2}" y="${y + CELL / 2}" text-anchor="middle" dominant-baseline="central" font-size="36" font-weight="800" fill="${tcol}">${letters[i]}</text>`;
    }
  }

  let trail = "";
  if (path.length > 1) {
    const pts = path
      .map(([r, c]) => {
        const { x, y } = cellXY(r, c);
        return `${x + CELL / 2},${y + CELL / 2}`;
      })
      .join(" ");
    const start = cellXY(path[0][0], path[0][1]);
    trail =
      `<polyline points="${pts}" fill="none" stroke="#0369a1" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" opacity="0.85" />` +
      `<circle cx="${start.x + CELL / 2}" cy="${start.y + CELL / 2}" r="11" fill="#0369a1" />`;
  }

  // letters sit on top so the trail never hides them
  return `
<svg viewBox="0 0 ${GVIEW} ${GVIEW}" class="grid" role="img" aria-label="Boggle letter grid tracing the word TRAIN" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${GVIEW}" height="${GVIEW}" rx="20" fill="#5c3a22" />
  <rect x="6" y="6" width="${GVIEW - 12}" height="${GVIEW - 12}" rx="16" fill="#c79a6b" />
  ${tiles}
  ${trail}
</svg>`;
}

// A grid where the highlighted path spells TRAIN (5 letters). Every step touches
// the next tile, including diagonally, and no tile is used twice.
const LETTERS = ["T", "A", "P", "E", "R", "I", "L", "S", "O", "N", "E", "D", "C", "K", "M", "U"];
const TRAIN_PATH = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]];
const wordGrid = boggleGrid(LETTERS, TRAIN_PATH);

// ---- Scoring table ---------------------------------------------------------
const SCORES = [
  { len: "3 letters", pts: 1 },
  { len: "4 letters", pts: 1 },
  { len: "5 letters", pts: 2 },
  { len: "6 letters", pts: 3 },
  { len: "7 letters", pts: 5 },
  { len: "8 or more", pts: 11 },
];

const scoreTable = `
<table class="score-table">
  <thead><tr><th>Word length</th><th>Points</th></tr></thead>
  <tbody>
    ${SCORES.map((s) => `<tr><td>${s.len}</td><td><strong>${s.pts}</strong></td></tr>`).join("")}
  </tbody>
</table>`;

// ---- Timer constants -------------------------------------------------------
const ROUND_SECONDS = 180;              // a Boggle round is exactly three minutes
const RING_R = 100;                     // matches the SVG circle r="100"
const RING_CIRC = 2 * Math.PI * RING_R; // dash length for the full countdown ring
const TICK_MS = 200;                    // how often the countdown refreshes
const PIP_FROM = 5;                     // start the per-second pips this many secs out
const URGENT_FROM = 30;                 // turn the ring amber under this many secs
const FLASH_MS = 900;                   // how long the end-of-round flash lasts

// ---- The guide -------------------------------------------------------------
export const boggle = {
  id: "boggle",
  title: "Boggle",
  tagline: "Race the timer to find hidden words in a grid of letters. Longer words score more.",
  icon: "boggle",
  render() {
    return `
<section class="lead">
  <p><strong>Players:</strong> 2 or more &nbsp;·&nbsp; <strong>You need:</strong> the Boggle box of
     16 letter dice, the grid tray and lid, the 3-minute timer, and paper &amp; a pen each.</p>
  <p>Everyone hunts the <em>same</em> grid of letters at the same time, writing down as many words as
     they can before the timer runs out. The longer the word, the more it scores - so a couple of long
     words can beat a big pile of short ones.</p>
  <p><strong>How long does it take?</strong> One round is a single <strong>3-minute</strong> timer.
     Most families play <strong>best of three rounds</strong>, so a whole game runs about
     <strong>10-15 minutes</strong> once you add reading out words and scoring. Agree how many rounds
     you'll play before you start.</p>
</section>

<div class="bg-timer" id="bgTimer">
  <div class="timer-ring-wrap">
    <svg class="timer-ring" viewBox="0 0 220 220" aria-hidden="true">
      <circle class="ring-track" cx="110" cy="110" r="100" />
      <circle class="ring-fill" id="ringFill" cx="110" cy="110" r="100" transform="rotate(-90 110 110)" />
    </svg>
    <div class="timer-face">
      <div class="timer-time" id="timerTime">3:00</div>
      <div class="timer-sub">one round</div>
    </div>
  </div>
  <div class="timer-controls">
    <button class="t-btn primary" id="btnStart" type="button">Start</button>
    <button class="t-btn" id="btnReset" type="button">Reset</button>
  </div>
  <p class="timer-note">A built-in 3-minute timer, with a chime when the round ends. Keep this page open
     while you play - or open the
     <a href="https://philoutram.github.io/timer-app/?t=180&loop=0" target="_blank" rel="noopener">Game
     Timer app</a> preset to a single 3-minute round for a big full-screen version.</p>
</div>

<div class="rule">
  <span class="step">1</span>
  <div class="rule-body">
    <h2>Shake and start</h2>
    <p>Drop the 16 lettered dice into the tray, put the lid on and give it a good shake. Settle every
       die into its own square so all 16 letters face up, then flip the 3-minute timer and go.</p>
  </div>
</div>

<div class="rule">
  <span class="step">2</span>
  <div class="rule-body">
    <h2>Build words from touching letters</h2>
    <p>Start on any letter and step to a <strong>neighbouring</strong> tile - up, down, sideways
       <em>or</em> diagonally. Keep hopping to touching tiles to spell your word.</p>
    ${wordGrid}
    <p class="cap">The blue trail spells <strong>TRAIN</strong>. Each letter sits next to the one
       before it (the T to R step is diagonal), and no tile is used twice.</p>
    <p>Two rules to remember: a word must be <strong>at least 3 letters</strong>, and you can't use
       the <strong>same tile twice</strong> in one word. The <strong>Qu</strong> tile counts as the two
       letters Q and U together.</p>
  </div>
</div>

<div class="rule">
  <span class="step">3</span>
  <div class="rule-body">
    <h2>Write down everything you find</h2>
    <p>Work on your own and keep your list hidden. Real words only - names and abbreviations don't
       count, but plurals and verb endings (like <em>-s</em>, <em>-ed</em>, <em>-ing</em>) are fine.
       When the timer runs out, everyone stops writing at once.</p>
  </div>
</div>

<div class="rule">
  <span class="step">4</span>
  <div class="rule-body">
    <h2>Cross out any matches</h2>
    <p>Take turns reading your words aloud. If <strong>two or more</strong> players found the same word,
       everyone crosses it out - it scores <strong>nothing</strong>. Only words that <em>you alone</em>
       found will score. This is why sneaky long words are gold.</p>
  </div>
</div>

<div class="rule">
  <span class="step">5</span>
  <div class="rule-body">
    <h2>Score by length</h2>
    <p>Add up points for each of your surviving words using this table:</p>
    ${scoreTable}
    <p class="cap">So TRAIN (5 letters) is worth 2 points; a 7-letter word is worth 5. The player with
       the highest total wins - play a single round, or best of a few.</p>
  </div>
</div>

<div class="tips">
  <h2>Quick tips for your first games</h2>
  <ul class="plain">
    <li>Grab the easy 3 and 4 letter words first, then hunt for longer ones.</li>
    <li>Add <em>-s</em>, <em>-ed</em> and <em>-ing</em> to words you've already found for extra points.</li>
    <li>Longer words are worth chasing - and less likely to clash with someone else.</li>
    <li>Remember you can move diagonally. It opens up loads more words.</li>
  </ul>
</div>
`;
  },

  // Wire up the built-in countdown after the guide is inserted. Returns a cleanup
  // function the router calls when you navigate away (stops the clock, drops the
  // wake lock). Uses performance.now() as the clock so a backgrounded tab stays
  // accurate instead of drifting with throttled intervals.
  mount(root) {
    const panel = root.querySelector("#bgTimer");
    if (!panel) return () => {};
    const timeEl = root.querySelector("#timerTime");
    const ringEl = root.querySelector("#ringFill");
    const startBtn = root.querySelector("#btnStart");
    const resetBtn = root.querySelector("#btnReset");

    let remaining = ROUND_SECONDS;
    let running = false;
    let interval = null;
    let endAt = 0;
    let lastPip = -1;
    let wakeLock = null;
    let audioCtx = null;

    ringEl.style.strokeDasharray = RING_CIRC;

    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    function draw() {
      timeEl.textContent = fmt(remaining);
      ringEl.style.strokeDashoffset = RING_CIRC * (1 - remaining / ROUND_SECONDS);
      panel.classList.toggle("urgent", remaining > 0 && remaining <= URGENT_FROM);
    }

    // --- sound: Web Audio, no files, one shared context unlocked on first tap ---
    function ctx() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      return audioCtx;
    }
    function unlock() {
      const c = ctx();
      if (c && c.state === "suspended") c.resume();
    }
    function beep(freq, dur, vol) {
      try {
        const c = ctx();
        if (!c) return;
        if (c.state === "suspended") c.resume();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur / 1000);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + dur / 1000);
      } catch (e) {
        // audio unavailable - stay silent
      }
    }
    const pip = () => beep(760, 90, 0.14);
    function endChime() {
      beep(660, 160, 0.4);
      setTimeout(() => beep(880, 160, 0.4), 200);
      setTimeout(() => beep(1100, 320, 0.5), 420);
    }

    // --- keep the screen awake only while the clock runs ---
    async function lockScreen() {
      if (!("wakeLock" in navigator) || wakeLock) return;
      try {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => (wakeLock = null));
      } catch (e) {
        // unsupported, denied, or hidden - ignore
      }
    }
    async function releaseScreen() {
      if (!wakeLock) return;
      try {
        await wakeLock.release();
      } catch (e) {
        // already gone
      }
      wakeLock = null;
    }

    function stopClock() {
      clearInterval(interval);
      interval = null;
    }

    function tick() {
      remaining = Math.max(0, Math.round((endAt - performance.now()) / 1000));
      if (running && remaining > 0 && remaining <= PIP_FROM && remaining !== lastPip) {
        lastPip = remaining;
        pip();
      }
      draw();
      if (remaining <= 0) finish();
    }

    function start() {
      if (running) return;
      if (remaining <= 0) remaining = ROUND_SECONDS;
      running = true;
      lastPip = -1;
      endAt = performance.now() + remaining * 1000;
      panel.classList.remove("done");
      startBtn.textContent = "Pause";
      lockScreen();
      interval = setInterval(tick, TICK_MS);
    }

    function pause() {
      if (!running) return;
      running = false;
      stopClock();
      remaining = Math.max(0, Math.round((endAt - performance.now()) / 1000));
      startBtn.textContent = remaining > 0 ? "Resume" : "Start";
      releaseScreen();
      draw();
    }

    function finish() {
      running = false;
      stopClock();
      remaining = 0;
      draw();
      panel.classList.remove("urgent");
      panel.classList.add("done");
      startBtn.textContent = "Start";
      endChime();
      releaseScreen();
      panel.classList.add("flash");
      setTimeout(() => panel.classList.remove("flash"), FLASH_MS);
    }

    function reset() {
      running = false;
      stopClock();
      remaining = ROUND_SECONDS;
      lastPip = -1;
      panel.classList.remove("done", "urgent");
      startBtn.textContent = "Start";
      releaseScreen();
      draw();
    }

    const onStart = () => {
      unlock();
      running ? pause() : start();
    };
    const onReset = () => {
      unlock();
      reset();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && running) lockScreen();
    };

    startBtn.addEventListener("click", onStart);
    resetBtn.addEventListener("click", onReset);
    document.addEventListener("visibilitychange", onVisible);

    draw();

    return () => {
      stopClock();
      releaseScreen();
      startBtn.removeEventListener("click", onStart);
      resetBtn.removeEventListener("click", onReset);
      document.removeEventListener("visibilitychange", onVisible);
    };
  },
};
