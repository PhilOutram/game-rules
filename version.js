export const VERSION = "v0.05";

// Newest first. Bump VERSION and prepend an entry on EVERY publish, so the live
// app always shows exactly what shipped. Dates are YYYY-MM-DD.
export const CHANGELOG = [
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
