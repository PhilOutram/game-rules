export const VERSION = "v0.08";

// Newest first. Bump VERSION and prepend an entry on EVERY publish, so the live
// app always shows exactly what shipped. Dates are YYYY-MM-DD.
export const CHANGELOG = [
  {
    version: "v0.08",
    date: "2026-11-12",
    notes: ["Updates now show the first time you open the app after a new version."],
  },
  {
    version: "v0.07",
    date: "2026-08-14",
    notes: [
      "Added President and Cambio - our first two card game guides.",
      "President: illustrated card ranking, a worked trick, and the President/Scum swap.",
      "Cambio: the 2x2 grid, a worked turn, snapping, and the full power-card table.",
    ],
  },
  {
    version: "v0.06",
    date: "2026-08-13",
    notes: ["Boggle: added a Play Boggle button linking to the full Boggle game."],
  },
  {
    version: "v0.05",
    date: "2026-08-12",
    notes: ["Boggle: Game Timer link now opens a single round (repeat off)."],
  },
  {
    version: "v0.04",
    date: "2026-08-12",
    notes: [
      "Boggle: added a built-in 3-minute round timer with an end chime.",
      "Boggle: added game-length info and a link to the Game Timer app.",
    ],
  },
  {
    version: "v0.03",
    date: "2026-08-12",
    notes: ["Added Boggle guide with a letter-grid diagram and the scoring table."],
  },
  {
    version: "v0.02",
    date: "2026-07-26",
    notes: ["Taller board so a full stack of five checkers no longer overlaps."],
  },
  {
    version: "v0.01",
    date: "2026-07-26",
    notes: ["Initial release.", "Backgammon guide with illustrated board diagrams."],
  },
];
