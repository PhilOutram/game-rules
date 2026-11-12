// The list of games in the app. Add a new game by writing its module (like
// backgammon.js) and dropping it into this array - the home screen and router
// pick it up automatically.
import { backgammon } from "./backgammon.js?v=0.08";
import { boggle } from "./boggle.js?v=0.08";
import { president } from "./president.js?v=0.08";
import { cambio } from "./cambio.js?v=0.08";

export const GAMES = [backgammon, boggle, president, cambio];

export function getGame(id) {
  return GAMES.find((g) => g.id === id) || null;
}
