// President rules content + the SVG playing-card diagrams used in the guide.
// Same shape as backgammon.js: plain strings the router drops straight in.
// The ruleset taught here is the classic one - 3 low up to Ace, then the 2 on
// top, no jokers, and the pile only clears when everyone passes. The popular
// alternatives live in the house-rules box at the bottom rather than muddling
// the walkthrough, because President is played a hundred slightly different ways.

import {
  FIG_W, CARD_W, CARD_H, CARD_GAP, CARD_STEP, FIG_PAD,
  PANEL_EDGE, LABEL, MUTED, ACCENT,
  cardsAt, arrow, figure, figureLabel, inlineCard,
} from "./cards.js?v=0.08";

// A "passes" chip, drawn where that player's cards would have gone.
function passChip(x, y) {
  const h = 46;
  return `
    <rect x="${x}" y="${y + (CARD_H - h) / 2}" width="128" height="${h}" rx="23"
          fill="${PANEL_EDGE}" stroke="#475569" stroke-width="2" />
    <text x="${x + 64}" y="${y + CARD_H / 2}" font-size="21" fill="${MUTED}"
          text-anchor="middle" dominant-baseline="central">passes</text>`;
}

// ---- Figure 1: the ranking ladder ------------------------------------------
// Thirteen cards will not fit legibly across a phone, so the ladder wraps onto a
// second row. Suits are deliberately mixed to underline that they do not matter.
const RANK_ROW_1 = [["3", "C"], ["4", "H"], ["5", "S"], ["6", "D"], ["7", "H"],
                    ["8", "S"], ["9", "D"]];
const RANK_ROW_2 = [["10", "C"], ["J", "H"], ["Q", "S"], ["K", "D"], ["A", "C"], ["2", "H"]];

const RANK_Y_1 = 48;
const RANK_Y_2 = 172;
const RANK_H   = RANK_Y_2 + CARD_H + 22;
const TWO_X    = FIG_PAD + 5 * CARD_STEP;  // the 2 is the sixth card of row two

const rankingLadder = figure(
  RANK_H,
  "Card ranking from lowest to highest: 3 4 5 6 7 8 9 10 Jack Queen King Ace 2",
  `
  <text x="${FIG_PAD + 4}" y="34" font-size="17" fill="${MUTED}"
        letter-spacing="1.5">WEAKEST</text>
  ${cardsAt(RANK_ROW_1, FIG_PAD, RANK_Y_1)}
  <text x="${TWO_X + CARD_W / 2}" y="158" font-size="17" fill="${ACCENT}"
        text-anchor="middle" letter-spacing="1.5">STRONGEST</text>
  ${cardsAt(RANK_ROW_2, FIG_PAD, RANK_Y_2, 5)}`
);

// ---- Figure 2: one trick, start to finish ----------------------------------
const TRICK_X    = 214;  // where the cards start, leaving room for the names
const TRICK_STEP = 112;  // one card height plus breathing room
const TRICK_Y_1  = 30;
const TRICK_H    = TRICK_Y_1 + TRICK_STEP * 3 + CARD_H + 26;

function trickRow(name, y, cards, hotIndex) {
  const label = `<text x="${FIG_PAD + 12}" y="${y + CARD_H / 2}" font-size="22" fill="${LABEL}"
        dominant-baseline="central">${name}</text>`;
  const body = cards ? cardsAt(cards, TRICK_X, y, hotIndex) : passChip(TRICK_X, y);
  return label + body;
}

const trickFigure = figure(
  TRICK_H,
  "One pile: a pair of fives is led, beaten by a pair of nines, one player passes, "
    + "then a pair of kings wins the pile",
  `
  ${trickRow("Mum leads", TRICK_Y_1, [["5", "C"], ["5", "D"]])}
  ${trickRow("Ben", TRICK_Y_1 + TRICK_STEP, [["9", "S"], ["9", "H"]])}
  ${trickRow("Ella", TRICK_Y_1 + TRICK_STEP * 2, null)}
  ${trickRow("Sam", TRICK_Y_1 + TRICK_STEP * 3, [["K", "D"], ["K", "S"]], 1)}`
);

// ---- Figure 3: the card swap between rounds ---------------------------------
const SWAP_LEFT_X  = 24;
const SWAP_RIGHT_X = FIG_W - 24 - CARD_W * 2 - CARD_GAP;
const SWAP_Y_1     = 68;
const SWAP_Y_2     = 200;
const SWAP_H       = SWAP_Y_2 + CARD_H + 24;
const SWAP_MID_1   = SWAP_LEFT_X + CARD_W * 2 + CARD_GAP + 22;
const SWAP_MID_2   = SWAP_RIGHT_X - 22;

const swapFigure = figure(
  SWAP_H,
  "The Scum hands two aces up to the President, who hands back a four and a three",
  `
  ${figureLabel(SWAP_LEFT_X + CARD_W + CARD_GAP / 2, 38, "SCUM")}
  ${figureLabel(SWAP_RIGHT_X + CARD_W + CARD_GAP / 2, 38, "PRESIDENT")}
  ${cardsAt([["A", "S"], ["A", "H"]], SWAP_LEFT_X, SWAP_Y_1)}
  ${arrow(SWAP_MID_1, SWAP_MID_2, SWAP_Y_1 + CARD_H / 2, "2 best cards")}
  ${cardsAt([["4", "C"], ["3", "D"]], SWAP_RIGHT_X, SWAP_Y_2)}
  ${arrow(SWAP_MID_2, SWAP_MID_1, SWAP_Y_2 + CARD_H / 2, "any 2 cards back")}`
);

// ---- Who finishes where, and what it costs them next round ------------------
const TITLES = [
  { place: "1st out", title: "President",
    next: "Takes the Scum's 2 best cards and gives back any 2. Leads the first pile." },
  { place: "2nd out", title: "Vice-President",
    next: "Takes the Vice-Scum's best card and gives back any 1." },
  { place: "The middle", title: "Citizen",
    next: "Swaps nothing. Sit tight and enjoy the quiet life." },
  { place: "2nd last", title: "Vice-Scum",
    next: "Hands their best card to the Vice-President." },
  { place: "Last", title: "Scum",
    next: "Hands their 2 best cards to the President. Shuffles and deals." },
];

const titlesTable = `
<table class="score-table wide">
  <thead><tr><th>Finished</th><th>Title</th><th>Next round</th></tr></thead>
  <tbody>
    ${TITLES.map(
      (t) => `<tr><td>${t.place}</td><td><strong>${t.title}</strong></td><td>${t.next}</td></tr>`
    ).join("")}
  </tbody>
</table>`;

// ---- The guide -------------------------------------------------------------
export const president = {
  id: "president",
  title: "President",
  tagline: "Race to empty your hand. Finish first and you rule - finish last and you pay for it.",
  icon: "president",
  render() {
    return `
<section class="lead">
  <p><strong>Players:</strong> 3-7, best with 4-6 &nbsp;·&nbsp; <strong>You need:</strong> one
     standard 52-card pack, jokers taken out &nbsp;·&nbsp; <strong>Length:</strong> about 5 minutes
     a round</p>
  <p>President is a race to get rid of every card in your hand. Whoever empties their hand first is
     the <strong>President</strong>; whoever is still clutching cards at the end is the
     <strong>Scum</strong>. That is only half the game, though - next round the Scum has to hand
     their two best cards <em>up</em> to the President and take rubbish back in return. Winning
     makes it easier to keep winning, which is exactly why everyone wants the Scum taken down.</p>
  <p><strong>How long does it take?</strong> A single round runs about <strong>5 minutes</strong>.
     The game only really comes alive once people have titles to defend, so play at least four or
     five rounds - most families just keep dealing until someone calls time. It is also known as
     Scum, Arsehole, Landlord and Rich Man Poor Man.</p>
  <p>You will also hear a dozen different house rules for this game. Learn the version below first,
     then have a look at the <strong>house rules</strong> box at the bottom.</p>
</section>

<div class="rule">
  <span class="step">1</span>
  <div class="rule-body">
    <h2>Deal the whole pack out</h2>
    <p>Shuffle and deal <strong>every</strong> card out, one at a time, clockwise. Unless the pack
       divides exactly, some players end up with one card more than others - that is normal and
       nobody gets a say in it. With five players, two people get 11 cards and three get 10.</p>
    <p>In the very first round the player to the dealer's left leads. From the second round onwards
       the President leads (see step 7).</p>
  </div>
</div>

<div class="rule">
  <span class="step">2</span>
  <div class="rule-body">
    <h2>The 3 is the runt, the 2 is king</h2>
    <p>Cards run in the order you would expect, with one twist at the top: the <strong>2 is the
       highest card in the game</strong>, above the Ace. The 3 is the weakest.</p>
    ${rankingLadder}
    <p class="cap">Read it like a sentence: 3 is the feeblest card, up through the Ace, and the 2
       beats the lot.</p>
    <p><strong>Suits make no difference at all.</strong> A ${inlineCard("9", "S")} and a
       ${inlineCard("9", "H")} are worth exactly the same, and neither beats the other.</p>
  </div>
</div>

<div class="rule">
  <span class="step">3</span>
  <div class="rule-body">
    <h2>Lead a single, a pair, a triple or four of a kind</h2>
    <p>Whoever leads puts down any one card face up - or any set of cards of the <em>same
       rank</em>. So you may lead a single ${inlineCard("7", "C")}, a pair of 7s, three 7s, or all
       four of them.</p>
    <p>Whatever you lead sets the shape for the rest of that pile. Lead a pair and everyone after
       you must play pairs. Lead a single and it is singles all the way.</p>
  </div>
</div>

<div class="rule">
  <span class="step">4</span>
  <div class="rule-body">
    <h2>Beat it with higher cards, or pass</h2>
    <p>Going clockwise, each player must either play the <strong>same number of cards</strong>, all
       of one rank, <strong>higher</strong> than the last play - or simply say "pass".</p>
    ${trickFigure}
    <p class="cap">Mum leads a pair of 5s. Ben beats it with a pair of 9s. Ella either cannot beat
       it or does not fancy it, so she passes. Sam plays a pair of Kings.</p>
    <p>You are allowed to pass <strong>even when you could play</strong> - hanging on to your 2
       until you really need it is often the smart move. But think before you do, because
       <strong>once you pass you are out of that pile for good</strong>. However many more times
       it goes round the table, you sit it out until the pile is binned and a fresh one is led.</p>
  </div>
</div>

<div class="rule">
  <span class="step">5</span>
  <div class="rule-body">
    <h2>Everyone passes, so bin the pile</h2>
    <p>When a play goes all the way round and <strong>everybody else passes</strong>, that pile is
       finished. Turn the cards face down and push them to one side - they take no further part in
       the round.</p>
    <p>The player who put down that last, highest play now <strong>leads again</strong>, with
       anything they like. It is a genuinely powerful position: you get to choose the next shape
       while everyone else has to follow it. If that player has just gone out, the lead passes to
       the next player round the table.</p>
  </div>
</div>

<div class="rule">
  <span class="step">6</span>
  <div class="rule-body">
    <h2>Going out - and the title you win</h2>
    <p>Play your last card and you are <strong>out</strong>, safe, and finished for the round. Note
       the order people go out in, because that order <em>is</em> the scoring. Everyone else keeps
       playing to sort out the places below.</p>
    ${titlesTable}
    <p>With only four players there is no room for a Citizen; with three, drop the Vice-President
       and Vice-Scum too and just play President, Citizen and Scum.</p>
    <p class="cap">There is no points scoring in President. Your title <em>is</em> your score, and
       it lasts exactly one round.</p>
  </div>
</div>

<div class="rule">
  <span class="step">7</span>
  <div class="rule-body">
    <h2>The next round: the Scum pays up</h2>
    <p>This is what makes President worth playing more than once. Deal the next round out as
       normal, then <strong>before anyone plays a card</strong>, the swap happens.</p>
    ${swapFigure}
    <p class="cap">The Scum must hand over their two genuinely best cards - no hiding an Ace. The
       President hands back any two they like, which will not be good ones.</p>
    <p>At the same time the <strong>Vice-Scum</strong> gives their single best card to the
       <strong>Vice-President</strong>, who gives back any one card. Everyone in the middle keeps
       what they were dealt.</p>
    <p>The Scum has no choice about what goes up; the President has a completely free choice about
       what comes down. Once the swap is done, the <strong>President leads</strong> the first
       pile.</p>
  </div>
</div>

<div class="rule">
  <span class="step">8</span>
  <div class="rule-body">
    <h2>The bit everyone actually plays for</h2>
    <p>Half the fun of President is the ceremony around it, and it costs nothing to keep:</p>
    <ul class="plain">
      <li>The <strong>Scum shuffles, deals and clears the cards away</strong> every round. It is
          their job until somebody relieves them of it.</li>
      <li>Players shuffle round the table so the President has the best seat, with everyone in rank
          order down to the Scum on whatever is left.</li>
      <li>The President may put their feet up, ask for a cup of tea, and be insufferable about it.
          The Scum may not.</li>
    </ul>
    <p>Keep going for as many rounds as you fancy. Whoever is President when you stop wins - which
       is why the last round always gets vicious.</p>
  </div>
</div>

<div class="tips">
  <h2>Popular house rules</h2>
  <p>Every family plays President slightly differently. Pick any of these you like the sound of -
     but agree them <strong>before the first deal</strong>, not halfway through a pile.</p>
  <ul class="plain">
    <li><strong>The 2 burns:</strong> a single 2 can be played on <em>anything</em>, whatever shape
        the pile is, and immediately bins it. You then lead again. Very common.</li>
    <li><strong>Four of a kind burns:</strong> putting down all four of a rank bins the pile on the
        spot, whoever else was winning it.</li>
    <li><strong>Jokers in:</strong> leave the two jokers in the pack, ranking above the 2s.</li>
    <li><strong>Match and skip:</strong> play the <em>same</em> rank as the play before and the
        next player is skipped.</li>
    <li><strong>Revolution:</strong> four of a kind flips the whole ranking upside down for the
        rest of the round, so 3s suddenly beat 2s. Chaos, in a good way.</li>
    <li><strong>Passing lets you back in:</strong> the gentler version, where a pass only skips
        your go and you may still play if the pile comes back round to you.</li>
    <li><strong>Scum leads:</strong> some play that the Scum leads the first pile instead of the
        President, so they at least get to dump something.</li>
    <li><strong>President's rule:</strong> the President invents one silly rule each round. Use
        with caution.</li>
  </ul>
</div>

<div class="tips">
  <h2>Quick tips for your first games</h2>
  <ul class="plain">
    <li>Get rid of your 3s and 4s early, underneath somebody else's big lead. Being left with them
        at the end is how you become the Scum.</li>
    <li>Save a 2 for when you are stuck. Winning a pile lets you lead, and leading is where the
        power is.</li>
    <li>Lead the shape <em>you</em> hold most of. If you have three pairs, lead pairs.</li>
    <li>Breaking up a pair to win a single card is usually a bad trade - you will want that pair
        later.</li>
    <li>As the Scum you have already paid your two best cards away, so play for second-from-last
        and climb out slowly. Anything is better than staying put.</li>
  </ul>
</div>
`;
  },
};
