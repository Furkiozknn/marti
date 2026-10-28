# Martı v2 upgrade brief — for Claude Haiku 5.5

## What the game is now
An endless 3D arcade flyer: a seagull flies down the Istanbul strait inside a 40-unit corridor (`CORR`), snatching simit from ferry decks and the air, diving for jumping fish, dodging bridge decks and cables, hulls, masts, kites, storm clouds and a rival flock that steals food (`spawnPattern`, `checkHits`).
Stamina drains faster over time (`simStep`); three feathers; a combo multiplier up to x5; power-ups (tailwind, golden simit, shield feather).
It runs from golden afternoon through sunset to a firework night. Three daily missions (`MISSION_DEFS`), a local top 5, generated music and sound, an attract-mode title with a bot.
Spawning is data-driven, but after about 180 s the difficulty stops growing (`diffK` is clamped to 1, `baseSpeed` flattens), runs have no goal beyond a score, and the first seconds teach nothing.

## Upgrade items (priority order)

### 1. First 30 seconds and a clear mute
- Why: Start begins the run (one click, good), but the only hint is a `toast(tx('fly'))` in `startRun()`. The player is never told to dive for fish (`diveHold`) or that stamina is food (`S.stamina`). The audit flags no single mute: only separate Music (M) and Effects (X) toggles exist.
- What to build: in-run prompts that appear once at the right moment and never block play: "move to steer" at 1 s, a pulsing ring around the first simit pattern, "hold Space / tap to dive" when the first jumping fish arcs up, "eat simit to refill stamina" the first time stamina drops under 45 %. Store seen prompts in `arena.marti.save` (new field). Add a master speaker toggle in the top bar that sets master volume to 0 and restores it (`SET.master`), also on key `N`.
- Done-when: a first run shows the three prompts in TR and EN, and a second run shows none; the speaker mutes all sound; `?run` and `?auto` unaffected.

### 2. Rooftop nests: deliver food to a chick (mechanic depth, from research)
- Why: the research says gulls now nest on city rooftops and chicks fly after 40-50 days; the game only has food that refills stamina, so the shore (`spawnShoreBand`, `PR.house` / `PR.roof`) is pure scenery.
- What to build: a "carried simit" counter (0-2, shown as small icons next to the stamina bar): picking up simit adds to it as well as refilling stamina. Every 700-900 m a rooftop with a nest and a chick appears on a shore house (instanced, 2 draw calls). Fly low over it with at least 1 carried simit to feed the chick: the chick chirps, +150 score, +1 feather up to the max of 3. The rival flock (`stealFood`) also steals carried simit.
- Done-when: `window.marti` exposes `carried` and `feeds`; the bot (`botThink`) may ignore nests; the nest mesh is culled with the band.

### 3. The chick grows across runs
- Why: there is no meta progress apart from the top-5 table.
- What to build: total chicks fed over all runs lives in a new field `chick` of `arena.marti.save` (add only). The title screen shows a small nest scene with a chick in 4 stages (egg, hatchling, fluffy, fledgling) at 0 / 5 / 15 / 30 feeds. At stage 4 a young gull flies beside you in every run and absorbs one hit per run (a visible feather fall). Keep it modest: one extra instanced mesh.
- Done-when: stage persists after reload; a debug flag `?chick=4` shows the wingmate.

### 4. Risky pier snacks: diet lanes (mechanic depth, from research)
- Why: the research says gulls moved from fish to rubbish and street food; the game's safest food is in the centre of the corridor (`simitPattern` picks x in -17..17 with nothing at the edges).
- What to build: "pier snack" patterns at the corridor edges (|x| about 18-20, beside jetty posts that cost a feather on contact): a row of 4 simit and a fish crate that gives a bigger stamina refill (+35) than the usual pickups. A new pattern in `spawnPattern`, from t >= 30 s, at about 10 % of patterns.
- Done-when: pier snacks appear on both shores in `?debug` stats; the bot can take them but does not need to.

### 5. A late-run ramp
- Why: `diffK()` is `clamp((S.t - 30) / 150, 0, 1)`, so everything is flat after 180 s, and `baseSpeed` approaches 58 asymptotically; long runs become a plateau.
- What to build: a second ramp from 180 s to 420 s: storm clouds more often (raise their share in `spawnPattern`), kites in pairs, hostile flocks 20 % faster, and a gust (`S.gustX`) warning with a small icon 2 s ahead. Check with `martiSim(400)` that a good bot can still survive to 300 s.
- Done-when: `?auto&debug` logs survival time; the first 90 s are unchanged.

### 6. Near-miss bonus and pickup readability
- Why: simit and fish are tiny at distance (screenshot day.png shows pale dots), and there is no reward for flying close to obstacles; hits are binary (`hitBox`, `hitPlayer`).
- What to build: a soft glowing halo and a thin trail on simit, fish and power-ups, visible from 80 units. A near-miss (inside about 1.5 units of a hull, mast, kite or cable without a hit) gives +25 score, a whoosh (`sfxWhoosh`) and a tiny screen kick, with a cooldown of 1 s.
- Done-when: `window.marti.nearMiss` counts them; the draw-call count stays within budget.

### 7. Facts on the game-over card
- Why: the game-over card shows only numbers and missions.
- What to build: one fact card under the run summary (rotating through the list below, one `FACTS` table with the source URL in a comment) and a "Did you know" line on the title.
- Done-when: both languages; each fact shown in turn.

## Facts for in-game cards
1. TR: İstanbul kıyılarında en yaygın tür sarıbacaklı martıdır (Larus michahellis). EN: The most common gull on Istanbul's coasts is the yellow-legged gull (Larus michahellis). Source: https://doaj.org/article/5a69f0727604460889f1a554982883d6
2. TR: Martılar normalde ada ve kayalıklarda ürer; artık bina çatılarını da yuva alanı yapıyor. EN: Gulls normally breed on islands and rocks, but they now also nest on building roofs. Source: https://www.gzt.com/hayat/istanbulda-artan-marti-sesleri-uzmanlar-yavru-beslenme-donemine-dikkat-cekiyor-guncel-haberler-4239807
3. TR: Yumurtlama nisan-mayıs aylarındadır; kuluçka yaklaşık 28-30 gün sürer, yavru 40-50 günde uçar. EN: Eggs are laid in April and May; incubation lasts about 28-30 days and the chick flies after 40-50 days. Source: https://www.gzt.com/hayat/istanbulda-artan-marti-sesleri-uzmanlar-yavru-beslenme-donemine-dikkat-cekiyor-guncel-haberler-4239807
4. TR: Martıların beslenmesi balıktan çöpe ve sokağa bırakılan kedi-köpek mamasına kaymış; kolay yiyecek üreme başarısını artırıyor. EN: Gulls' diet has shifted from fish to rubbish and street cat and dog food; easy food raises breeding success. Source: https://www.gzt.com/hayat/istanbulda-artan-marti-sesleri-uzmanlar-yavru-beslenme-donemine-dikkat-cekiyor-guncel-haberler-4239807
5. TR: 1593'te Üsküdar'da simidin ağırlığı ve fiyatı standartlaştırıldı. EN: In 1593 the weight and price of simit were standardised in Üsküdar. Source: https://en.wikipedia.org/wiki/Simit
6. TR: Evliya Çelebi 1630'larda İstanbul'da 70 simit fırını saydı. EN: In the 1630s Evliya Çelebi counted 70 simit bakeries in Istanbul. Source: https://en.wikipedia.org/wiki/Simit

## Mascot
Yes, small: the white Turkish Van kitten sitting in the corner of the game-over card, watching the gull (one 2D image from `assets/mascot/`, hidden with `?noassets`). No kitten in the 3D scene.

## Do not break
- Start is the first button and begins a run in one click; endless run, stamina, three feathers, combo x5, power-ups, three daily missions, top-5 table.
- Flags `?auto ?debug ?low ?noassets ?lang ?run ?t0=N ?sim=N`, `window.marti`, `window.martiSim`, `window.martiDebug`.
- Keys `arena.marti.settings|best|save` (add fields only; the old `marti.*` migration stays), pause on P / Esc and on a hidden tab (sound freezes), keys M, X, L, F.
- Day-to-night cycle and the title attract mode.

The shared rules in `_sablonlar/arena-upgrade-common.md` (and `_sablonlar/arena-round6-common.md`) are appended to this brief.
