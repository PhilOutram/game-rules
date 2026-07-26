// The list of games in the app. Add a new game by writing its module (like
// backgammon.js) and dropping it into this array - the home screen and router
// pick it up automatically.
import { backgammon } from "./backgammon.js";

export const GAMES = [backgammon];

export function getGame(id) {
  return GAMES.find((g) => g.id === id) || null;
}
