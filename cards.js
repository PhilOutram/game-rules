// Shared playing-card drawing helpers for the card game guides.
// Every card figure is drawn into the same 540-wide viewBox so the cards come
// out the same size on screen whichever guide - and whichever diagram - you are
// looking at. Colours deliberately echo the Boggle tiles and the backgammon
// checkers so the whole app looks like one set of illustrations.

export const FIG_W     = 540;  // shared viewBox width for every card figure
export const CARD_W    = 64;   // card face width - roughly the real 5:7 card ratio
export const CARD_H    = 92;   // card face height
export const CARD_GAP  = 10;   // gap between cards laid side by side
export const CARD_STEP = CARD_W + CARD_GAP;
export const FIG_PAD   = 16;   // gap from the figure edge to the first card

export const FACE       = "#f5efe1";  // cream card face, same as the Boggle tiles
export const EDGE       = "#c8b48f";  // card border
export const INK_BLACK  = "#1f2937";
export const INK_RED    = "#b91c1c";
export const PANEL      = "#1e293b";  // figure backdrop, matches --panel
export const PANEL_EDGE = "#334155";  // matches --line
export const LABEL      = "#e2e8f0";  // matches --text
export const MUTED      = "#94a3b8";  // matches --muted
export const ACCENT     = "#38bdf8";  // matches --accent

export const PIPS = { S: "&#9824;", H: "&#9829;", D: "&#9830;", C: "&#9827;" };

function inkFor(suit) {
  return suit === "H" || suit === "D" ? INK_RED : INK_BLACK;
}

// One card face. `hot` rings it in the accent colour so a diagram can point at a
// single card without needing a separate arrow.
export function card(rank, suit, x, y, hot = false) {
  const ink = inkFor(suit);
  return `
    <g>
      <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="${FACE}"
            stroke="${hot ? ACCENT : EDGE}" stroke-width="${hot ? 4 : 2}" />
      <text x="${x + 9}" y="${y + 10}" font-size="21" font-weight="800" fill="${ink}"
            dominant-baseline="hanging">${rank}</text>
      <text x="${x + CARD_W / 2}" y="${y + CARD_H * 0.6}" font-size="34" fill="${ink}"
            text-anchor="middle" dominant-baseline="central">${PIPS[suit]}</text>
    </g>`;
}

// A face-down card. The lattice is drawn with a couple of crossing lines rather
// than a pattern fill so the whole figure stays one self-contained string.
export function cardBack(x, y, hot = false) {
  const inset = 7;
  const w = CARD_W - inset * 2;
  const h = CARD_H - inset * 2;
  let weave = "";
  for (let i = -h; i < w; i += 11) {
    weave +=
      `<line x1="${x + inset + Math.max(i, 0)}" y1="${y + inset - Math.min(i, 0)}"` +
      ` x2="${x + inset + Math.min(i + h, w)}"` +
      ` y2="${y + inset + Math.min(h, w - i)}" stroke="#7f1d1d" stroke-width="2" />`;
  }
  return `
    <g>
      <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="#991b1b"
            stroke="${hot ? ACCENT : EDGE}" stroke-width="${hot ? 4 : 2}" />
      <clipPath id="cb${x}-${y}"><rect x="${x + inset}" y="${y + inset}" width="${w}"
        height="${h}" rx="4" /></clipPath>
      <g clip-path="url(#cb${x}-${y})">
        <rect x="${x + inset}" y="${y + inset}" width="${w}" height="${h}" fill="#b91c1c" />
        ${weave}
      </g>
    </g>`;
}

// A row of cards starting at x,y. `list` is [["5","C"], ["5","D"]]; an entry of
// null draws a face-down card. `hotIndex` picks one card in the row to highlight.
export function cardsAt(list, x, y, hotIndex = -1) {
  return list
    .map((c, i) => {
      const cx = x + i * CARD_STEP;
      return c ? card(c[0], c[1], cx, y, i === hotIndex) : cardBack(cx, y, i === hotIndex);
    })
    .join("");
}

// A horizontal arrow with its caption sitting just above it. The head is drawn
// on whichever end you finish at, so pass x2 < x1 to point left.
export function arrow(x1, x2, y, text = "") {
  const back = x2 > x1 ? x2 - 14 : x2 + 14;   // where the head meets the shaft
  const caption = text
    ? `<text x="${(x1 + x2) / 2}" y="${y - 16}" font-size="19" fill="${LABEL}"
            text-anchor="middle">${text}</text>`
    : "";
  return `
    <line x1="${x1}" y1="${y}" x2="${back}" y2="${y}" stroke="${ACCENT}" stroke-width="3" />
    <polygon points="${x2},${y} ${back},${y - 8} ${back},${y + 8}" fill="${ACCENT}" />
    ${caption}`;
}

// A small heading inside a figure, e.g. over one half of a two-part diagram.
export function figureLabel(x, y, text, colour = MUTED) {
  return `<text x="${x}" y="${y}" font-size="19" fill="${colour}" text-anchor="middle"
        letter-spacing="1.2">${text}</text>`;
}

// Wraps a figure's contents in a labelled SVG with the standard dark backdrop.
export function figure(height, label, body) {
  return `
<svg viewBox="0 0 ${FIG_W} ${height}" class="cards" role="img" aria-label="${label}"
     xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${FIG_W - 2}" height="${height - 2}" rx="16"
        fill="${PANEL}" stroke="${PANEL_EDGE}" stroke-width="2" />
  ${body}
</svg>`;
}

// A small card for use mid-sentence, the way die(n) works in the backgammon guide.
export function inlineCard(rank, suit) {
  const ink = inkFor(suit);
  return `<svg viewBox="0 0 44 62" class="card-inline" role="img" aria-label="${rank}"
    ><rect x="2" y="2" width="40" height="58" rx="6" fill="${FACE}" stroke="${EDGE}"
      stroke-width="2" /><text x="22" y="24" font-size="21" font-weight="800" fill="${ink}"
      text-anchor="middle" dominant-baseline="central">${rank}</text><text x="22" y="45"
      font-size="20" fill="${ink}" text-anchor="middle" dominant-baseline="central"
      >${PIPS[suit]}</text></svg>`;
}
