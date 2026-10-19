# Game 04: Martı (arcade seagull flyer)

Same block structure as games 01-03 (World, Life, Game rules, Interaction, HUD, Extras, Performance, Self-test).
Written by the orchestrator; the game itself is built by a different model each time (see the series table).

```text
Build a single-file browser game (one index.html with inline CSS and JS) using Three.js r170 loaded
as an ES module from https://cdn.jsdelivr.net/npm/three@0.170.0/ (import map; addons from examples/jsm
if needed). A 3D arcade flying game called "Martı" (Turkish for seagull). Do not ask questions, build
it end to end.

WORLD: an endless, low-poly Istanbul-style strait seen from behind a flying seagull, built entirely in
code, no external models, textures or fonts beyond one Google Font. The water stretches ahead with
gentle waves; both shores scroll past with hills of colourful houses, mosque domes and minarets, a
waterfront mansion row, a stone tower on a hill, a lighthouse on a tiny island, and a big suspension
bridge that appears every so often with its towers and cables. Ferries, fishing boats, a tanker and
sailboats travel on the water. The sky moves from afternoon gold through sunset to a lit-up night as
the run goes on. Clean toy-like clay look, flat shading, one accent colour (#F59E0B gold) for UI,
pickups and highlights.

LIFE: the seagull flaps (wing animation, banking into turns, a little dive pose), its shadow moves on
the water. Passengers on ferries hold up simit; other gulls fly in small flocks; kites and balloons drift
near the shores; fishing lines hang from the bridge; fireworks start once night falls.

GAME RULES: an endless runner in 3D: the gull flies forward automatically and speeds up over time. Steer
left/right and up/down inside a corridor over the water. Snatch simit from ferry decks and fish that
jump from the water for points and to fill a stamina bar; stamina drains slowly and running out ends
the run. Obstacles: bridge cables and towers, ships' masts and funnels, kites with lines, a rival gull
flock that steals food, the occasional storm cloud that pushes you around. Three hits end the run
(brief invulnerability after a hit). Power-ups: tailwind (speed and score multiplier), golden simit
(score x2), shield feather. Combo multiplier for chained pickups, distance score, best score and a
small list of local high scores in localStorage, daily missions (for example "snatch 20 simit").
Difficulty ramps smoothly and the first 30 seconds are forgiving.

INTERACTION: keyboard (arrows or WASD to steer, Space to dive for fish, P pause), mouse (move to steer,
click to dive) and touch (drag anywhere to steer, tap to dive). Controls must feel responsive and fair:
clear hitboxes, readable obstacles well before you reach them.

HUD: frosted glass panels over the 3D view: top bar (logo, score, combo, distance, best, stamina bar,
lives as feathers, sound, music, language), toasts for power-ups and missions, floating "+points" at
pickups, title screen with a short how-to, pause screen, game-over card with score, best, distance,
simit snatched and a retry button. Turkish by default with an English toggle.

EXTRAS: generated upbeat music (Web Audio, layers that build with speed) and synthesised sound effects
(wing flaps, gull calls, ferry horn, pickup chime, hit thud, power-up whoosh, fireworks), separate music
and sound toggles; camera shake on hits; works on mobile with touch.

PERFORMANCE (must run at 60 fps on an Intel UHD 620 laptop iGPU): renderer pixel ratio capped at 1.5,
antialias on, one directional light with a 1024 shadow map that follows the gull, InstancedMesh for
repeated objects (houses, waves, pickups, flock members), recycle world chunks instead of creating new
ones, merged static geometry with vertex colours, MeshLambert materials only, no post-processing, at
most ~150 draw calls, particles as one Points object, fog to hide chunk spawning. Pause the simulation
when the tab is hidden. Add a "?low" URL flag that turns shadows off and halves particles.

SELF-TEST: add a "?auto" URL flag that plays the game by itself (steers around obstacles, collects
pickups, uses power-ups) and a "?debug" flag that shows draw calls and any JS errors on screen and
exposes window.<game>Sim(seconds) to fast-forward without rendering, so the game can be verified in a
real browser without a human. Expose the live game state on window.<game>.

Deliver only the finished index.html. No build step, no server needed: it must open by double-clicking
the file.
```
