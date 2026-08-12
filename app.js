// Family Game Rules - a tiny hash router between a home menu and each game guide.
import { VERSION, CHANGELOG } from "./version.js";
import { GAMES, getGame } from "./games.js";

const app = document.getElementById("app");

// Register the service worker so the app is installable and works offline.
// The relative path resolves correctly on the GitHub Pages /<slug>/ subpath.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}

// ---- Router ----------------------------------------------------------------
function currentId() {
  return decodeURIComponent((location.hash || "").replace(/^#\/?/, ""));
}

function route() {
  const game = getGame(currentId());
  if (game) renderGame(game);
  else renderHome();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
route();

// ---- Views -----------------------------------------------------------------
function renderHome() {
  const cards = GAMES.map(
    (g) => `
      <a class="game-card" href="#/${g.id}">
        <span class="game-icon">${gameIcon(g.icon)}</span>
        <span class="game-text">
          <span class="game-name">${g.title}</span>
          <span class="game-tagline">${g.tagline}</span>
        </span>
        <span class="chev" aria-hidden="true">&rsaquo;</span>
      </a>`
  ).join("");

  app.innerHTML = `
    <header class="home-head">
      <h1>Family Game Rules</h1>
      <p class="hint">Simple, illustrated how-to-play guides for our favourite games.
        Pick one to get started.</p>
    </header>
    <nav class="game-list">${cards}</nav>`;
}

function renderGame(game) {
  app.innerHTML = `
    <header class="game-head">
      <a class="back" href="#/">&lsaquo; All games</a>
      <h1>${game.title}</h1>
      <p class="tagline">${game.tagline}</p>
    </header>
    <article class="guide">${game.render()}</article>
    <footer class="foot"><a class="back" href="#/">&lsaquo; Back to all games</a></footer>`;
}

// A small icon for a game card.
function gameIcon(key) {
  if (key === "backgammon") {
    return `<svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="3" y="6" width="42" height="36" rx="5" fill="#5c3a22" />
      <rect x="7" y="10" width="34" height="28" fill="#c79a6b" />
      <polygon points="10,10 16,10 13,26" fill="#9c6640" />
      <polygon points="18,10 24,10 21,26" fill="#e7c9a0" />
      <polygon points="10,38 16,38 13,22" fill="#e7c9a0" />
      <polygon points="30,38 36,38 33,22" fill="#9c6640" />
      <circle cx="33" cy="34" r="4" fill="#f5efe1" stroke="#c8b48f" />
      <circle cx="21" cy="14" r="4" fill="#26262b" />
    </svg>`;
  }
  if (key === "boggle") {
    const tile = (x, y, ch) =>
      `<rect x="${x}" y="${y}" width="17" height="17" rx="4" fill="#f5efe1" stroke="#c8b48f" stroke-width="1.5" />` +
      `<text x="${x + 8.5}" y="${y + 9}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="800" fill="#1f2937">${ch}</text>`;
    return `<svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="9" fill="#5c3a22" />
      <rect x="6" y="6" width="36" height="36" rx="6" fill="#c79a6b" />
      ${tile(9, 9, "B")}${tile(27, 9, "O")}${tile(9, 27, "G")}${tile(27, 27, "E")}
    </svg>`;
  }
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="8" fill="#334155" /></svg>`;
}

// ---- Version badge: shows the current version; click to see the changelog. --
renderVersionBadge();

function renderVersionBadge() {
  const badge = document.createElement("button");
  badge.className = "version-badge";
  badge.textContent = VERSION;
  badge.title = "Changelog";
  badge.addEventListener("click", showChangelog);
  document.body.appendChild(badge);
}

function showChangelog() {
  const overlay = document.createElement("div");
  overlay.className = "changelog-overlay";
  overlay.addEventListener("click", () => overlay.remove());

  const panel = document.createElement("div");
  panel.className = "changelog";
  panel.addEventListener("click", (e) => e.stopPropagation());
  panel.innerHTML =
    "<h2>Changelog</h2>" +
    CHANGELOG.map(
      (e) =>
        `<section><h3>${e.version} <span class="muted">${e.date}</span></h3>` +
        `<ul>${e.notes.map((n) => `<li>${n}</li>`).join("")}</ul></section>`
    ).join("");
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}
