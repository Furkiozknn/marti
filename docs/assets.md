# Martı: generated assets

Overnight pass of 2026-10-21. All models were generated with Higgsfield **Tripo 3D** (text-to-3D, standard texture,
`pbr: false`), the crest with **GPT Image 2.5**, then normalised with
`claude-game-arena/tools/assets/fit.mjs` (glTF-Transform: bake transforms, rotate, fit to the game size, pivot,
weld, optional simplify, texture to WebP). Raw downloads stay outside the repo.

Conventions (both engines): **+Y up, +Z forward** (the gull flies +z), metres. Base pivot (bottom centre) unless the
table says *centre*. In Three.js every model is drawn with `MeshLambertMaterial({ map, flatShading: true })`; instanced
models keep their `InstancedMesh` (one draw call) and instance colours still tint the texture.

Fallback: every procedural builder is kept. From `file://` (Chrome blocks fetch), with `?noassets`, or when a file
fails to load within 10 s, the game keeps the procedural look.

## Done (integrated)

| Asset | File | Replaces | Size in game (x × y × z) | Pivot | Tris | Size | Prompt (short) | QC |
|---|---|---|---|---|---|---|---|---|
| Simit | `assets/models/simit.glb` | torus | 2.34 × 2.34 × 0.8, hole along z | centre | 764 | 33 KB | "Turkish simit, golden-brown bread ring covered in sesame seeds" | A filled membrane inside the hole was removed (`dropHoleR 0.47`). Also used ×1.3 with a gold tint and emissive as the golden-simit power-up. |
| Fish | `assets/models/fish.glb` | sphere fish | 0.94 × 1.56 × 2.5, head +z | centre | 512 | 31 KB | "silver-blue fish, sea bass leaping" | Rotated 180° (head was -z). Pitches along the leap. |
| Shield feather | `assets/models/feather.glb` | cone | 0.2 × 2.2 × 0.74 | centre | 490 | 31 KB | "single white feather with a pale blue tint" | Flat in the YZ plane, spins about y. |
| Ferry (vapur) | `assets/models/ferry.glb` | box ferry with passengers | 6 × 4.75 × 15, bow +z | base | 2256 | 123 KB | "Istanbul city ferry, white hull, red waterline, black-and-yellow funnel" | Height squashed to 4.75 so the deck simit at y 5.3 stay above it. Collision boxes unchanged plus the cabin box (H3). |
| Fishing boat | `assets/models/fishing.glb` | box boat | 3 × 6.4 × 6, bow +z | base | 688 | 62 KB | "small Turkish wooden fishing boat, blue and white hull, wheelhouse at the back" | An orange slab under the hull was cut (`dropBelow 0.1`). |
| Sailboat | `assets/models/sail.glb` | box hull + panel sail | 2.6 × 23 × 9 | base | 878 | 50 KB | "small sailing yacht, one very tall mast, single white triangular mainsail" | Length squashed (9 instead of 14.7) so the tall mast matches the 23 u collision mast. |
| Mosque | `assets/models/mosque.glb` | dome + two minarets (separate instanced meshes, no body) | 14 × 13.8 × 10.5, door +z | base | 2743 | 124 KB | "Ottoman mosque, cream stone hall, big blue dome, two minarets" | One `InstancedMesh` (cap 40), no tint, faces the water, sunk 0.3 into the slope. |
| Galata tower | `assets/models/galata.glb` | stone cylinder tower | 8.7 × 26 × 8.6 | base | 1444 | 87 KB | "Galata Tower, round stone tower, balcony ring, pointed dark roof" | Good. |
| Maiden's tower | `assets/models/maiden.glb` | lighthouse on the shore | 12 × 13 × 11.2 | base | 1410 | 79 KB | "Maiden's Tower on a tiny rocky islet with a low wall" | Placed in the water at \|x\| = 31 (islet edge at about 25, outside the 20 + 3.7 wing corridor), no collision. |
| Yalı | `assets/models/yali.glb` | box mansion | 16 × 7.5 × 6, front +z | base | 2277 | 138 KB | "Ottoman yalı waterfront mansion, two storeys, pink and cream, red roof" | Windows are a bit crumpled up close, fine from the game camera. Faces the water on both shores (H14). |
| Crest / logo | `assets/ui/logo.png` (512 px), `assets/ui/favicon.png` (64 px) | text logo, no favicon | — | — | — | 92 KB + 11 KB | "round navy badge with a gold rim, white seagull over a sesame simit, red suspension bridge, sunset strait, flat vector" | The generator ignored the transparent background (orange glow, black corners): cut to the badge circle with a fresh gold rim (sharp). |

HUD and UI icons (pause, music, sound, language, settings, check mark, simit) are hand-drawn inline SVG in
`index.html` (no emoji, no OS glyphs): generated icons rarely sit on a pixel grid.

## Rejected (generated, not used)

| Asset | Why |
|---|---|
| Gull body without wings (Tripo) | Came out as a standing, upright chick with folded wings and the beak at 90° to the body; unusable as a flying body. |
| Single gull wing (Tripo) | A cross-shaped blob with two black tips, not one wing with a root and a tip. |
| Gliding gull, spread wings (Tripo) | Integrated first (split at the joints, later bent in a vertex shader), then rejected after review: lumpy, stretched body and stick-like wings with block tips; from the chase camera it read as a thin stick, not a gull. Replaced by a redesigned procedural gull (tapered two-layer wing panels, grey tops, white undersides, black tips, mantle, fan tail; wings pitched -0.6 rad leading-edge-up, body -0.15, dihedral 0.12, flap amplitude 0.55). The fitted file is kept outside the repo. |

## Not started / kept procedural

- Gull and rival flock (procedural, redesigned: see Rejected).
- Tanker (procedural, collision fixed), bridge (collision and the bot depend on `BR`), houses (instanced boxes, now
  with window quads that glow at night), trees, clouds, storm clouds, kites, tailwind power-up.
- House facade texture atlas: not done (the window quads give the night look at 1 draw call).

## Credits

Higgsfield balance before: **167.78**. This pass submitted 13 Tripo jobs × 5 = **65** credits and one GPT Image
2.5 job = **1.5** credits: **66.5 credits** in total (budget 70). Other agents generated assets at the same time, so
the account balance difference is not this game's alone.
