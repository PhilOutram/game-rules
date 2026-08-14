// Cambio rules content + the SVG card diagrams used in the guide.
// Same shape as the other guides: plain strings the router drops straight in.
// Card drawing comes from the shared cards.js so Cambio and President look like
// the same set of illustrations.
//
// The ruleset taught here is the common one: red Kings are worth minus one and
// do nothing, black Kings look-and-swap, and a power only fires when you bin the
// card you have just drawn. Regional wobbles live in the house-rules box.

import {
  FIG_W, CARD_W, CARD_H, CARD_GAP,
  cardsAt, arrow, figure, figureLabel, inlineCard,
} from "./cards.js";

const GRID_W = CARD_W * 2 + CARD_GAP;   // a player's 2x2 square is two cards wide
const ROW_GAP = 12;                     // vertical gap between the two grid rows

// A player's 2x2 square. `cards` is four entries, row-major, null for face down.
function grid(cards, x, y, hotIndex = -1) {
  return (
    cardsAt(cards.slice(0, 2), x, y, hotIndex) +
    cardsAt(cards.slice(2), x, y + CARD_H + ROW_GAP, hotIndex - 2)
  );
}

// ---- Figure 1: what you know, and what everyone else knows ------------------
const F1_LEFT_X  = 66;
const F1_RIGHT_X = 336;
const F1_ROW_Y   = 54;
const F1_H       = F1_ROW_Y + CARD_H * 2 + ROW_GAP + 24;

const gridFigure = figure(
  F1_H,
  "Four cards face down in a square; you have peeked at your bottom two, a four of "
    + "diamonds and a king of hearts",
  `
  ${figureLabel(F1_LEFT_X + GRID_W / 2, 34, "WHAT EVERYONE SEES")}
  ${grid([null, null, null, null], F1_LEFT_X, F1_ROW_Y)}
  ${figureLabel(F1_RIGHT_X + GRID_W / 2, 34, "WHAT YOU KNOW")}
  ${grid([null, null, ["4", "D"], ["K", "H"]], F1_RIGHT_X, F1_ROW_Y)}`
);

// ---- Figure 2: one turn ------------------------------------------------------
const F2_GRID_X  = 210;
const F2_ROW_Y   = 86;
const F2_BOTTOM  = F2_ROW_Y + CARD_H * 2 + ROW_GAP;
const F2_MID_Y   = (F2_ROW_Y + F2_BOTTOM) / 2;
const F2_SIDE_Y  = F2_MID_Y - CARD_H / 2;
const F2_DRAW_X  = 40;
const F2_BIN_X   = FIG_W - 30 - CARD_W;
const F2_H       = F2_BOTTOM + 26;

const turnFigure = figure(
  F2_H,
  "A drawn three of clubs swaps into the grid, pushing an eight of spades out onto "
    + "the discard pile",
  `
  ${figureLabel(F2_GRID_X + GRID_W / 2, 62, "YOUR FOUR CARDS")}
  ${figureLabel(F2_DRAW_X + CARD_W / 2, 122, "DRAWN")}
  ${figureLabel(F2_BIN_X + CARD_W / 2, 122, "DISCARD")}
  ${cardsAt([["3", "C"]], F2_DRAW_X, F2_SIDE_Y)}
  ${arrow(F2_DRAW_X + CARD_W + 12, F2_GRID_X - 8, F2_MID_Y, "goes in")}
  ${grid([null, null, null, null], F2_GRID_X, F2_ROW_Y, 0)}
  ${arrow(F2_GRID_X + GRID_W + 8, F2_BIN_X - 12, F2_MID_Y, "comes out")}
  ${cardsAt([["8", "S"]], F2_BIN_X, F2_SIDE_Y)}`
);

// ---- Figure 3: snapping a matching card -------------------------------------
const F3_GRID_X = 336;
const F3_ROW_Y  = 64;
const F3_BOTTOM = F3_ROW_Y + CARD_H * 2 + ROW_GAP;
const F3_MID_Y  = (F3_ROW_Y + F3_BOTTOM) / 2;
const F3_PILE_X = 76;
const F3_H      = F3_BOTTOM + 26;

const snapFigure = figure(
  F3_H,
  "A seven of diamonds from your own square is slapped onto a seven of clubs on the "
    + "discard pile",
  `
  ${figureLabel(F3_PILE_X + CARD_W / 2, 40, "DISCARD")}
  ${figureLabel(F3_GRID_X + GRID_W / 2, 40, "YOUR CARDS")}
  ${cardsAt([["7", "C"]], F3_PILE_X, F3_MID_Y - CARD_H / 2)}
  ${grid([null, ["7", "D"], null, null], F3_GRID_X, F3_ROW_Y, 1)}
  ${arrow(F3_GRID_X - 16, F3_PILE_X + CARD_W + 16, F3_MID_Y, "match!")}`
);

// ---- What every card is worth ------------------------------------------------
const VALUES = [
  { card: "Red King &#9829; &#9830;", pts: "-1" },
  { card: "Joker", pts: "0" },
  { card: "Ace", pts: "1" },
  { card: "2 up to 10", pts: "2-10" },
  { card: "Jack, Queen, black King &#9824; &#9827;", pts: "10" },
];

const valuesTable = `
<table class="score-table">
  <thead><tr><th>Card</th><th>Points</th></tr></thead>
  <tbody>
    ${VALUES.map(
      (v) => `<tr><td>${v.card}</td><td><strong>${v.pts}</strong></td></tr>`
    ).join("")}
  </tbody>
</table>`;

// ---- The power cards - the heart of the game --------------------------------
const POWERS = [
  { card: "7 or 8", power:
    "<strong>Peek at your own.</strong> Look at one of your own face-down cards, then put "
    + "it straight back where it was." },
  { card: "9 or 10", power:
    "<strong>Spy on someone.</strong> Look at one of <em>another</em> player's face-down "
    + "cards, then put it back. Only you see it." },
  { card: "Jack or Queen", power:
    "<strong>Blind swap.</strong> Trade any one of your cards for any one of another "
    + "player's. Neither card is turned over - nobody sees what moved." },
  { card: "Black King &#9824; &#9827;", power:
    "<strong>Look, then swap.</strong> Look at any one card on the table - yours or "
    + "theirs - and then swap it with one of yours, or leave it exactly where it is." },
  { card: "Red King &#9829; &#9830;", power:
    "No power at all. It is worth <strong>minus one point</strong> though, so it is the "
    + "best card in the pack to be sitting on." },
];

const powersTable = `
<table class="score-table wide">
  <thead><tr><th>Bin a</th><th>and you may</th></tr></thead>
  <tbody>
    ${POWERS.map(
      (p) => `<tr><td><strong>${p.card}</strong></td><td>${p.power}</td></tr>`
    ).join("")}
  </tbody>
</table>`;

// ---- The guide ---------------------------------------------------------------
export const cambio = {
  id: "cambio",
  title: "Cambio",
  tagline: "Four cards face down, and you only know two of them. Finish with the lowest score.",
  icon: "cambio",
  render() {
    return `
<section class="lead">
  <p><strong>Players:</strong> 2-6, best with 3-5 &nbsp;·&nbsp; <strong>You need:</strong> a
     52-card pack with both jokers left in, and paper &amp; a pen for scores &nbsp;·&nbsp;
     <strong>Length:</strong> about 10 minutes a round</p>
  <p>In Cambio you want the <strong>lowest</strong> score, not the highest. You get four cards
     face down and you are only ever allowed to look at two of them - so the whole game is a
     memory test. You swap high cards away for low ones, use special cards to spy on everybody
     else, and try to remember what on earth is sitting in front of you.</p>
  <p>When you think you are lowest, you call <strong>"Cambio!"</strong> and everyone turns their
     cards over. Call it too early and someone pips you; leave it too late and someone else calls
     first. It is also known as Cabo and Pablo, and is a close cousin of Golf.</p>
  <p><strong>How long does it take?</strong> A round is about <strong>10 minutes</strong>. Keep a
     running score and play until somebody reaches 100 - the <em>lowest</em> score then wins.</p>
</section>

<div class="rule">
  <span class="step">1</span>
  <div class="rule-body">
    <h2>Four cards each, face down in a square</h2>
    <p>Deal <strong>four cards to each player, face down</strong>, laid out in a little 2 by 2
       square in front of them. Put the rest of the pack in the middle as the <strong>draw
       pile</strong> and turn its top card over beside it to start the <strong>discard
       pile</strong>.</p>
    <p><strong>Nobody moves their cards.</strong> They stay in the same four spots all round -
       that is the whole point, because you are trying to remember which is which.</p>
  </div>
</div>

<div class="rule">
  <span class="step">2</span>
  <div class="rule-body">
    <h2>One peek, and that is your lot</h2>
    <p>Before anyone plays, every player picks up the <strong>two cards nearest to them</strong>
       and has a good look. Then they go straight back face down, in the same places.</p>
    ${gridFigure}
    <p class="cap">Everyone else sees four blank backs. You know your bottom two - here a
       ${inlineCard("4", "D")} and a ${inlineCard("K", "H")}, which is a lovely start. Your top
       two are as much of a mystery to you as they are to everybody else.</p>
    <p>That is the only free look you get. From here on you only ever see a card again by playing
       a power card - or by taking a wild guess.</p>
  </div>
</div>

<div class="rule">
  <span class="step">3</span>
  <div class="rule-body">
    <h2>What every card is worth</h2>
    <p>You are collecting <em>low</em> numbers. Add your four cards up at the end and the smallest
       total wins.</p>
    ${valuesTable}
    <p class="cap">So a red King is the single best card in the pack at minus one, and a Jack,
       Queen or black King is the worst at ten. Aces are nearly as good as red Kings.</p>
  </div>
</div>

<div class="rule">
  <span class="step">4</span>
  <div class="rule-body">
    <h2>Your turn: draw one card, then keep it or bin it</h2>
    <p>Starting to the dealer's left and going clockwise, take the <strong>top card of the draw
       pile</strong> and look at it - just you. Now pick one of two things to do with it.</p>
    ${turnFigure}
    <p class="cap"><strong>Keep it:</strong> slide it face down into any one of your four spots,
       and put the card it replaced face up on the discard pile. You do not have to look at the
       card you are throwing out, and often you will not know what it was.</p>
    <p><strong>Or bin it:</strong> put the card you drew straight onto the discard pile face up,
       and change nothing in your square. If it is one of the power cards in step 5, this is when
       you get to use it.</p>
    <p>One rule that catches everybody out: <strong>powers only work on the card you have just
       drawn and binned.</strong> A card that gets bumped out of your square by a swap is just
       points - it does nothing, even if it is a Jack.</p>
    <p>If the draw pile runs out, shuffle the discard pile and turn it back over to make a new one.</p>
  </div>
</div>

<div class="rule">
  <span class="step">5</span>
  <div class="rule-body">
    <h2>The power cards</h2>
    <p>This is where Cambio gets good. Bin any of these instead of keeping it, and you get to do
       something nasty before your turn ends.</p>
    ${powersTable}
    <p class="cap">A ${inlineCard("10", "S")} is the classic one: bin it, and you get to look at
       any single card in front of any other player.</p>
    <p>You never <em>have</em> to use a power - and using one costs you the chance to swap that
       card into your square, so a low card is often worth more kept than played. Take the peek
       quietly and try not to give away what you saw with your face.</p>
  </div>
</div>

<div class="rule">
  <span class="step">6</span>
  <div class="rule-body">
    <h2>Snap a matching card away</h2>
    <p>At <strong>any</strong> moment, whoever you are, if you reckon one of your face-down cards
       is the <strong>same rank</strong> as the card sitting on top of the discard pile, you may
       slap it down on top. First hand there wins - it is a race.</p>
    ${snapFigure}
    <p class="cap">A ${inlineCard("7", "C")} is showing, and you are fairly sure that card of
       yours is a seven. Slap it on: if you are right, it leaves your square for good.</p>
    <p><strong>Get it right</strong> and you are down to three cards - fewer cards means a lower
       score, so this is the fastest way to win. A snapped card never uses its power.</p>
    <p><strong>Get it wrong</strong> and it goes straight back where it came from, plus you take an
       extra card off the draw pile, face down, as a fourth-or-fifth card. Guessing is expensive.</p>
    <p>Feeling brave? You may also snap a card belonging to <em>somebody else</em> if you are sure
       you know it. It goes on the pile - and then you hand them one of your own cards, face down,
       to fill the gap. That is how you dump a Queen on your brother.</p>
  </div>
</div>

<div class="rule">
  <span class="step">7</span>
  <div class="rule-body">
    <h2>Call "Cambio!" to finish it</h2>
    <p>On your turn, <strong>instead of drawing a card</strong>, you may say
       <strong>"Cambio!"</strong> That means you think you have the lowest total on the table.</p>
    <p>Everyone else gets <strong>exactly one more turn</strong>, and the caller sits those out.
       Snapping still counts during those last turns, so stay awake. Then everybody turns all
       their cards face up and adds them up.</p>
    <p><strong>The lowest total wins the round.</strong> Write everyone's total down, gather the
       cards up, and deal again - the player to the left of the last dealer deals next.</p>
  </div>
</div>

<div class="rule">
  <span class="step">8</span>
  <div class="rule-body">
    <h2>Keeping score</h2>
    <p>Add each round's total to a running score. When any player reaches <strong>100 or
       more</strong>, the game stops and whoever has the <strong>lowest</strong> running total is
       the winner. If you would rather a short game, just play an agreed number of rounds - five
       works nicely - and take the lowest total at the end.</p>
  </div>
</div>

<div class="tips">
  <h2>Popular house rules</h2>
  <p>Cambio is played slightly differently everywhere. Pick whichever of these you fancy, but
     settle them <strong>before you deal</strong>.</p>
  <ul class="plain">
    <li><strong>Wrong call, penalty:</strong> if you call Cambio and somebody beats you, add 5
        (or 10) to your score. Stops people calling on a hunch.</li>
    <li><strong>Perfect call:</strong> if you call Cambio and you really are lowest, you score
        <strong>zero</strong> for the round instead of your total.</li>
    <li><strong>Either King works:</strong> red Kings get the look-and-swap power too, on top of
        being worth minus one. Generous, and it speeds the game up.</li>
    <li><strong>Take the discard:</strong> on your turn you may pick up the face-up top card of the
        discard pile instead of drawing blind - but then you must swap it into your square.</li>
    <li><strong>Jokers out:</strong> play with a plain 52-card pack and no zeroes.</li>
    <li><strong>No snapping once Cambio is called</strong> - the last turns are played quietly.</li>
    <li><strong>Six cards each</strong> in a 2 by 3 block, with a peek at the nearest two. Longer,
        much harder to remember.</li>
  </ul>
</div>

<div class="tips">
  <h2>Quick tips for your first games</h2>
  <ul class="plain">
    <li>Learn your two known cards <em>by position</em>, not by picture - "top left is a four" is
        what you will need in five minutes' time.</li>
    <li>When you swap a card in, swap out a card you have <strong>never seen</strong>. It is
        probably worse than the one in your hand.</li>
    <li>Bin a 9 or 10 early to spy on whoever looks smug. Knowing one of their cards makes your
        snap and your Jack far more dangerous.</li>
    <li>A blind swap with a Jack is a gamble both ways - use it to shift a card you know is
        terrible, not just for the fun of it.</li>
    <li>Do not sit on a good hand too long. If you think you are around 5 or less, call Cambio
        before someone snaps their way past you.</li>
  </ul>
</div>
`;
  },
};
