// Backgammon rules content + the SVG board diagrams used throughout the guide.
// Everything here is plain strings so the guide is just data the router drops in.

// ---- Board diagram builder -------------------------------------------------
// A backgammon board has 24 points (triangles). We number them the standard way:
//   top row    left->right : 13 14 15 16 17 18 | bar | 19 20 21 22 23 24
//   bottom row left->right : 12 11 10  9  8  7 | bar |  6  5  4  3  2  1
// "light" checkers travel 24 -> 1 and bear off from the bottom-right (points 1-6).
// "dark"  checkers travel  1 -> 24 and bear off from the top-right (points 19-24).

const VIEW_W = 720;
const VIEW_H = 576;      // tall enough that a stack of five checkers fits one half
const FRAME = 18;        // outer wooden frame thickness
const BAR_W = 44;        // the raised bar down the middle
const TRI_H = 250;       // point length - roughly five checkers, so a full point fits
const CHK_GAP = 2;       // gap between stacked checkers

const PLAY_X = FRAME;
const PLAY_Y = FRAME;
const PLAY_W = VIEW_W - FRAME * 2;
const PLAY_H = VIEW_H - FRAME * 2;
const HALF_W = (PLAY_W - BAR_W) / 2;
const PT_W = HALF_W / 6;          // width of one point
const CHK_R = PT_W / 2 - 3;       // checker radius

// Where does point number `p` sit? Return the x of its left edge and which row.
function pointGeometry(p) {
  let col, top;
  if (p >= 13) {                  // top row: 13..24 run left to right
    top = true;
    col = p - 13;
  } else {                        // bottom row: 12..1 run left to right
    top = false;
    col = 12 - p;
  }
  const rightHalf = col >= 6;
  const x = PLAY_X + col * PT_W + (rightHalf ? BAR_W : 0);
  return { x, top, col };
}

function triangle(p, i) {
  const { x, top } = pointGeometry(p);
  const light = i % 2 === 0;
  const fill = light ? "#e7c9a0" : "#9c6640";
  const cx = x + PT_W / 2;
  if (top) {
    return `<polygon points="${x},${PLAY_Y} ${x + PT_W},${PLAY_Y} ${cx},${PLAY_Y + TRI_H}" fill="${fill}" />`;
  }
  const baseY = PLAY_Y + PLAY_H;
  return `<polygon points="${x},${baseY} ${x + PT_W},${baseY} ${cx},${baseY - TRI_H}" fill="${fill}" />`;
}

function checkerStack(p, count, color) {
  const { x, top } = pointGeometry(p);
  const cx = x + PT_W / 2;
  const fill = color === "light" ? "#f5efe1" : "#26262b";
  const stroke = color === "light" ? "#c8b48f" : "#000000";
  const textFill = color === "light" ? "#3a3a3a" : "#f5efe1";
  const shown = Math.min(count, 5);
  const step = CHK_R * 2 + CHK_GAP;
  let out = "";
  for (let k = 0; k < shown; k++) {
    const cy = top
      ? PLAY_Y + CHK_R + 3 + k * step
      : PLAY_Y + PLAY_H - CHK_R - 3 - k * step;
    out += `<circle cx="${cx}" cy="${cy}" r="${CHK_R}" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;
  }
  if (count > 5) {
    const cy = top
      ? PLAY_Y + CHK_R + 3 + (shown - 1) * step
      : PLAY_Y + PLAY_H - CHK_R - 3 - (shown - 1) * step;
    out += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="18" font-weight="700" fill="${textFill}">${count}</text>`;
  }
  return out;
}

// A small arrow overlay, drawn in board coordinates.
function arrow(x1, y1, x2, y2, colorVar = "#38bdf8") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colorVar}" stroke-width="5" stroke-linecap="round" marker-end="url(#ah)" />`;
}

// Build a full board. `placements` = [{ p, count, color }]. `extras` = raw SVG.
export function board(placements = [], extras = "") {
  let tris = "";
  // draw triangles in visual order so alternating colours line up per row
  for (let p = 13; p <= 24; p++) tris += triangle(p, p - 13);
  for (let p = 12; p >= 1; p--) tris += triangle(p, 12 - p);

  let chks = "";
  for (const { p, count, color } of placements) chks += checkerStack(p, count, color);

  const barX = PLAY_X + HALF_W;
  return `
<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" class="board" role="img" aria-label="Backgammon board diagram" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#38bdf8" />
    </marker>
  </defs>
  <rect x="0" y="0" width="${VIEW_W}" height="${VIEW_H}" rx="14" fill="#5c3a22" />
  <rect x="${PLAY_X}" y="${PLAY_Y}" width="${PLAY_W}" height="${PLAY_H}" fill="#c79a6b" />
  ${tris}
  <rect x="${barX}" y="${PLAY_Y}" width="${BAR_W}" height="${PLAY_H}" fill="#5c3a22" />
  ${chks}
  ${extras}
</svg>`;
}

// Centre point of a point's outer edge - handy for anchoring arrows.
function tip(p) {
  const { x, top } = pointGeometry(p);
  return { x: x + PT_W / 2, y: top ? PLAY_Y + 26 : PLAY_Y + PLAY_H - 26 };
}

// ---- Standard starting position -------------------------------------------
const START = [
  { p: 24, count: 2, color: "light" },
  { p: 13, count: 5, color: "light" },
  { p: 8, count: 3, color: "light" },
  { p: 6, count: 5, color: "light" },
  { p: 1, count: 2, color: "dark" },
  { p: 12, count: 5, color: "dark" },
  { p: 17, count: 3, color: "dark" },
  { p: 19, count: 5, color: "dark" },
];

// ---- Diagrams used in the guide -------------------------------------------
const setupBoard = board(START);

// Direction of travel: light sweeps top-right down to bottom-right, dark mirrors.
const directionBoard = board(START, [
  arrow(tip(24).x, tip(24).y, tip(19).x, tip(19).y),
  arrow(tip(13).x, tip(13).y + 40, tip(8).x, tip(8).y - 40),
]);

// Hitting a blot: a lone dark checker on 5 is about to be sent to the bar.
const hitBoard = board(
  [
    { p: 8, count: 2, color: "light" },
    { p: 5, count: 1, color: "dark" },
    { p: 6, count: 4, color: "light" },
  ],
  [arrow(tip(8).x, tip(8).y - 20, tip(5).x, tip(5).y - 20)]
);

// Bearing off: all fifteen light checkers are home (points 1-6), leaving the board.
// The arrow sits above the home points and sweeps right, "off" the board edge.
const BEAR_ARROW_Y = PLAY_Y + PLAY_H / 2;
const BEAR_ARROW_X1 = 470;
const BEAR_ARROW_X2 = 700;
const bearOffBoard = board(
  [
    { p: 6, count: 3, color: "light" },
    { p: 5, count: 2, color: "light" },
    { p: 4, count: 3, color: "light" },
    { p: 3, count: 2, color: "light" },
    { p: 2, count: 3, color: "light" },
    { p: 1, count: 2, color: "light" },
  ],
  [arrow(BEAR_ARROW_X1, BEAR_ARROW_Y, BEAR_ARROW_X2, BEAR_ARROW_Y)]
);

// ---- Small reusable bits ---------------------------------------------------
function die(n) {
  const dot = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="6" fill="#0f172a" />`;
  const P = { tl: [12, 12], tr: [40, 12], ml: [12, 26], c: [26, 26], mr: [40, 26], bl: [12, 40], br: [40, 40] };
  const faces = {
    1: ["c"], 2: ["tl", "br"], 3: ["tl", "c", "br"],
    4: ["tl", "tr", "bl", "br"], 5: ["tl", "tr", "c", "bl", "br"],
    6: ["tl", "tr", "ml", "mr", "bl", "br"],
  };
  const dots = faces[n].map((k) => dot(P[k][0], P[k][1])).join("");
  return `<svg viewBox="0 0 52 52" class="die" role="img" aria-label="die showing ${n}"><rect x="2" y="2" width="48" height="48" rx="9" fill="#f5efe1" stroke="#c8b48f" stroke-width="2" />${dots}</svg>`;
}

// ---- The guide -------------------------------------------------------------
export const backgammon = {
  id: "backgammon",
  title: "Backgammon",
  tagline: "A race for two players. First to bring all your pieces home and off the board wins.",
  icon: "backgammon",
  render() {
    return `
<section class="lead">
  <p><strong>Players:</strong> 2 &nbsp;·&nbsp; <strong>You need:</strong> a board, 15 checkers each,
     two dice &nbsp;·&nbsp; <strong>Length:</strong> 10-20 minutes</p>
  <p>Backgammon is a race. Each of you moves your 15 checkers around the board in opposite
     directions, trying to be the <em>first</em> to get all of them into your own corner and then
     off the board. The dice decide how far you move - but you choose <em>which</em> checkers to
     move, and that is where the skill is.</p>
</section>

<div class="rule">
  <span class="step">1</span>
  <div class="rule-body">
    <h2>Set up the board</h2>
    <p>The board has 24 thin triangles called <strong>points</strong>. Set your checkers out exactly
       like this to start. Your opponent's checkers (dark) mirror yours (light).</p>
    ${setupBoard}
    <p class="cap">Each colour starts with two checkers in the far corner, and stacks of five, three
       and five nearer home. Both sides always begin the same way.</p>
  </div>
</div>

<div class="rule">
  <span class="step">2</span>
  <div class="rule-body">
    <h2>Which way do I go?</h2>
    <p>You move <strong>your</strong> checkers around to <strong>your</strong> home - the bottom-right
       quarter of the board. Your opponent moves the other way, to their home in the top-right.
       You are always heading toward the corner where you take pieces off.</p>
    ${directionBoard}
    <p class="cap">Light follows the blue arrows toward the bottom-right. Think of it as running
       around the track in your own direction.</p>
  </div>
</div>

<div class="rule">
  <span class="step">3</span>
  <div class="rule-body">
    <h2>Roll and move</h2>
    <p>Roll the two dice. Each die is a separate move. Roll a ${die(5)} and a ${die(3)} and you may
       move one checker 5 points and another 3 points - or move the <em>same</em> checker 5 then 3
       (as long as it could stop safely in between).</p>
    <p><strong>Doubles are special:</strong> roll the same number twice, like ${die(4)} ${die(4)},
       and you get to play it <strong>four</strong> times - four moves of 4.</p>
    <p>You may only land on a point that is <strong>open</strong>: empty, one of your own, or holding
       just a single enemy checker. If both dice are unplayable, you lose the turn.</p>
  </div>
</div>

<div class="rule">
  <span class="step">4</span>
  <div class="rule-body">
    <h2>Hitting and the bar</h2>
    <p>A point with just <strong>one</strong> checker on it is a <strong>blot</strong>. If you land on
       an enemy blot, you <strong>hit</strong> it: that checker is picked up and placed on the
       <strong>bar</strong> in the middle.</p>
    ${hitBoard}
    <p class="cap">Light lands on the lone dark checker and knocks it onto the bar.</p>
    <p>A checker on the bar must <strong>come back in</strong> before its owner can do anything else.
       It re-enters in the far corner by rolling a number for an open point there. Getting hit sends
       a checker all the way back to the start of its journey - so try not to leave blots!</p>
  </div>
</div>

<div class="rule">
  <span class="step">5</span>
  <div class="rule-body">
    <h2>Make points to block</h2>
    <p>Put <strong>two or more</strong> of your checkers on a point and you <strong>own</strong> it -
       the other player cannot land there. Line up several owned points in a row and you build a wall
       that is hard to get past. Six in a row is a <strong>prime</strong>, and nothing can jump it.</p>
  </div>
</div>

<div class="rule">
  <span class="step">6</span>
  <div class="rule-body">
    <h2>Bear off to win</h2>
    <p>Once <strong>all fifteen</strong> of your checkers are home (in your bottom-right quarter), you
       start <strong>bearing off</strong> - taking them off the board. Roll a number and remove a
       checker from the matching point.</p>
    ${bearOffBoard}
    <p class="cap">All fifteen light checkers are home and coming off. First to clear the whole board
       wins the game.</p>
    <p>One catch: if you get <strong>hit</strong> while bearing off, that checker goes back to the bar
       and has to travel all the way round again before you can carry on. It is a race to the finish.</p>
  </div>
</div>

<div class="rule">
  <span class="step">7</span>
  <div class="rule-body">
    <h2>How much did you win?</h2>
    <ul class="plain">
      <li><strong>Single (1 point):</strong> the normal win - your opponent had already borne off at
          least one checker.</li>
      <li><strong>Gammon (2 points):</strong> you finish before your opponent bears off <em>any</em>
          checker.</li>
      <li><strong>Backgammon (3 points):</strong> you finish while they still have a checker on the bar
          or in your home corner. Rare and brutal!</li>
    </ul>
  </div>
</div>

<div class="tips">
  <h2>Quick tips for your first games</h2>
  <ul class="plain">
    <li>Safety in pairs - two checkers on a point can't be hit.</li>
    <li>Don't leave a lone checker where the enemy dice can easily reach it.</li>
    <li>Try to build a wall in front of your opponent's back checkers.</li>
    <li>When in doubt, run for home. It's a race.</li>
  </ul>
</div>
`;
  },
};
