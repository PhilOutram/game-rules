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
</section>

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
};
