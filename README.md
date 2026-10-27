# 🕊️ Martı · Seagull Run

**[▶ Play in your browser](https://furkiozknn.github.io/marti/)** · Türkçe & English · desktop & mobile · free, no install

🏟️ Part of **[Claude Game Arena](https://furkiozknn.github.io/)**: four games, each built by a different Claude model. This is game #4, built by **Claude Haiku 5.5**. [See all games and the scorecard →](https://furkiozknn.github.io/)

🎮 **Godot 4 remake (round 2):** [play](https://furkiozknn.github.io/marti-godot/) · [code](https://github.com/Furkiozknn/marti-godot), rebuilt by the same model in a real game engine.

![Gameplay clip](docs/gameplay.gif)

An endless 3D arcade flyer in a **single `index.html`** (Three.js, no build step) with a small set of generated
3D models in `assets/` (the game falls back to its procedural models when they cannot load).
You are a seagull over the Istanbul strait: snatch simit from ferry decks, dive for jumping fish, dodge
bridge decks, cables, masts and kites, and fly on from a golden afternoon through sunset into a night of fireworks.

![Flying under the suspension bridge](docs/bridge.png)

## Features

- **Endless run that speeds up:** steer inside the corridor over the water; the first 30 seconds are forgiving.
- **Stamina and lives:** simit and fish refill stamina, which drains faster over time. Three feathers (hits) per run.
- **Obstacles:** bridge decks and cables (the red towers stand just outside the flying corridor and mark the gate),
  ships' hulls, cabins, masts, sails and funnels, kites on long strings, storm clouds that push you, and a rival gull
  flock that steals your food.
- **Power-ups:** tailwind (speed + score ×1.5), golden simit (score ×2), shield feather. Combo multiplier up to ×5.
- **Daily missions** and a local top-5 high score table, saved in your browser.
- **Day to night:** the sky moves from afternoon gold through sunset to a starry night with lit windows and fireworks.
- **Istanbul landmarks:** mosques with domes and minarets, the Galata tower, the Maiden's tower on its islet, yalı
  mansions facing the water, city ferries (vapur) with simit on deck.
- **Generated music and sound:** a beat with layers that build as you speed up, wing flaps, gull calls, ferry horns,
  a game-over jingle, all made with Web Audio. Pausing (or hiding the tab) silences everything.
- **Settings:** master, music and effects volume, language (Türkçe / English), quality (Low / High) and fullscreen,
  saved in your browser. The language follows your browser the first time.

| | |
|---|---|
| ![Sunset](docs/sunset.png) | ![Night with power-ups active](docs/night.png) |
| ![Daylight run](docs/day.png) | ![Game over](docs/gameover.png) |
| ![Title screen](docs/title.png) | ![Phone layout](docs/phone_run.png) |

## Controls

| Action | Keyboard | Mouse | Touch |
|---|---|---|---|
| Steer | Arrows or `WASD` | Move the mouse (the gull follows the pointer) | Drag anywhere (relative to where the finger went down) |
| Dive (for fish) | `Space` | Hold click | Tap |
| Pause (Resume, Restart, Settings, Main menu) | `P` or `Esc` | Pause button | Pause button |
| Music / sound / language | `M` / `X` / `L` | Top bar | Top bar |
| Fullscreen | `F` | Settings | Settings |
| Settings | — | Gear button, title card | Gear button, title card |

Every button can be reached with `Tab` (visible focus ring) and is 44 px tall on touch screens.

## Run it locally

Download the repo and double-click `index.html` (it needs internet the first time, to load Three.js and the font from a CDN),
or serve the folder with `python -m http.server 8766` and open http://127.0.0.1:8766/.

### URL flags

| Flag | Effect |
|---|---|
| `?low` | Low quality (no shadows, pixel ratio 1.0, half the particles), whatever the setting says |
| `?lang=en` / `?lang=tr` | Interface language |
| `?auto` | The game plays itself (self-test bot) |
| `?debug` | FPS, draw calls, state, loaded assets and any JS errors on screen; `window.martiSim(seconds)` fast-forwards the game |
| `?sim=N` | Fast-forwards N seconds once the assets are ready |
| `?noassets` | Skips the generated models (procedural look, as from `file://`) |
| `?run` | Starts a run straight away (manual test) |
| `?t0=N` | Starts each run N seconds into the day (`?t0=150` = night) |

Saved data (`localStorage`): `arena.marti.settings`, `arena.marti.best` (top 5) and `arena.marti.save` (daily
missions). The round-1 keys (`marti.*`) are read once and kept.

## Assets

Generated with **Higgsfield**: Tripo text-to-3D for the simit, fish, shield feather, ferry, fishing boat,
sailboat, mosque, Galata tower, Maiden's tower and yalı, GPT Image for the crest/logo and favicon. Processed with
glTF-Transform (`claude-game-arena/tools/assets/fit.mjs`: rotate, fit to the game size, pivot, WebP textures).
About 0.88 MB in total. The gull itself is procedural (a generated gull was tried and rejected: lumpy body, stick-like
wings): tapered two-layer wing panels (grey tops, white undersides, black tips with a white spot), a grey mantle and a
fan tail, posed so the chase camera sees the back and wing tops. When the page is opened from `file://` (or with `?noassets`, or if a file fails), the game
uses its original procedural models. The HUD icons are hand-drawn inline SVG. Details, prompts and sizes:
[docs/assets.md](docs/assets.md).

![The gull up close](docs/close.png)

## How it was made

Game #4 of a series in which **every game is built by a different AI model**, to compare which one makes the better game.
This one was built by **Claude Haiku 5.5** (`claude-haiku-5-5`) with [Claude Code](https://claude.com/claude-code), on its own,
from one prompt: [`prompts/marti.md`](prompts/marti.md). Every model gets the same prompt structure, quality bar and
self-test rule, and none of them sees the other games' code. The orchestrating session (Claude Opus 5.5) wrote the prompt,
re-tested the result independently and published it.

Verification before release: an independent bot run in a real browser flew 796 seconds before running out of stamina, with zero
JS errors and about 20-30 draw calls. Review found three issues (the gull looked like a plane, white square particles, and the wings
covering the view near the shore), which the builder fixed in one review round.

| # | Game | Genre | Model |
|---|---|---|---|
| 1 | [Hisar](https://github.com/Furkiozknn/kale-savunmasi) | Tower defense, 3D | Claude Opus 5.5 |
| 2 | [Çay Ocağı](https://github.com/Furkiozknn/cay-ocagi) | Time management, 3D | Claude Sonnet 5.5 |
| 3 | [Çini Ustası](https://github.com/Furkiozknn/cini-ustasi) | Puzzle, 3D | Claude Fable 5.1 |
| 4 | **Martı** | Arcade flyer, 3D | Claude Haiku 5.5 |

## Tech

Three.js r170 (ES module from jsDelivr, with GLTFLoader), Web Audio API, one Google Font (Fredoka). About 2,300 lines of plain
JavaScript, HTML and CSS in one file. If the CDN cannot be reached, the page says so after 10 seconds instead of showing a
dead Start button.

## Changelog

### 2026-10-21 overnight pass (assets remastered by Claude Opus 5.5, orchestrator)

**Fixes**
- Steering was mirrored: Right/D and the right half of the screen sent the gull to the screen-left (the camera looks
  along +z, so screen-right is world -x). Keys, mouse and touch now steer the way you press. The bank follows.
- Touch: a tap to dive no longer teleports the steering target; dragging steers relative to where the finger went down.
- Ferry cabin, tanker bridge block, fishing-boat wheelhouse and the sail are now solid (they were fly-through).
  The ferry cabin top stays at 4.5, so the deck simit are still reachable.
- Fireworks are no longer fogged into the sky; only the windows glow at night, not the whole house.
- Music no longer plays a burst of missed notes after a hidden tab, and it stops while paused.
- No more dead Start button when the CDN fails (message after 10 s); Start shows "Loading… n/N" until the models are in.
- Roofs line up with their houses; mosques have a body and their minarets stand on their own ground; balloons have a
  basket; fish pitch along their leap; the rival flock flaps and flies in a proper V; the yalı faces the water on both
  shores; the sun light comes from the visible sun; light colours blend at dusk instead of jumping.
- The title screen no longer drifts into night; a held Space/Enter no longer restarts a run; nothing changes the score
  after a run ended; daily missions reset correctly after midnight; the distance mission shows "1234/3000 m".
- The game-over card shows why the run ended, with a short jingle.

**New**
- Settings (volumes, language, quality, fullscreen), a Pause menu with Restart and Settings, SVG icon buttons with
  labels in both languages, a crest logo and favicon, a best-score line and the arena footer on the title card, the
  `F` key, keyboard focus rings, 44 px touch targets, the browser language by default, new save keys with migration.
- A new procedural gull that reads as a seagull from behind (wing panels with grey tops and black tips, mantle, fan
  tail, wings pitched leading-edge-up, slight dihedral, calmer flap); the rival flock uses the same shape.
- Passed pickups and kites are hidden once behind the gull, so they no longer fill the screen in front of the camera.
- Generated models: simit (also the golden simit), fish, shield feather, ferry, fishing boat, sailboat, mosque,
  Galata tower, Maiden's tower on its islet, yalı.
- Test hooks: `?noassets`, `?t0=`.

**Removed / faster**
- Terrain is rebuilt only when its window moves, static shore props are only rewritten when they change, per-frame
  arrays are reused, the high-score list is cached, and `martiSim` skips rendering work (1,500 simulated seconds take
  about 2 s instead of 73 s).
- Dead code: the paused water rebuild, unused state fields and translation keys, duplicate spawn loops and splash
  spawners, no-op bot code, the hard-coded start toast.

**Known:** the gameplay GIF at the top is from round 1 (old look).

## License

Code: [MIT](LICENSE).
