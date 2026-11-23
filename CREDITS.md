# Credits

## Mascot

- `assets/mascot/kedi-sessiz.png`: the white Turkish Van kitten, quiet pose. Downscaled copy (320 px, PNG) of
  `video-studio/public/maskot/kedi-sessiz.png`, made for this game. No longer shown since the 3D style pass (the
  game-over card shows the gull chick instead).

## Generated 3D models and crest

See [docs/assets.md](docs/assets.md) (Tripo 3D models through Higgsfield, GPT Image crest and favicon).

## 3D chibi style (stil-3d, 24.11.2026)

In-game sprites and menu figures in the style of the game's song video (stylized 3D chibi, soft studio light).
Generated with the Google Gemini app (Nano Banana image model) from text prompts only, on a plain white background;
the background was keyed out locally (PIL flood fill) and the cells cut into atlases.

- `assets/3d/marti.webp`: 2x2 atlas, Gemini item sheet 1: the player's gull from behind (wings up, glide), the gull
  from the front, the chick in its nest. Used for the player, both flocks, your flock, the young gull and the rooftop
  nests.
- `assets/3d/nesne.webp`: 3x3 atlas, Gemini item sheet 2: simit, fish, golden simit, three kites, feather (shield),
  tailwind swirl, fish crate.
- `assets/3d/ufuk.webp`: Gemini image 3: Istanbul skyline strip with the Bosphorus bridge (the horizon).
- `assets/3d/poz-marti.webp`, `assets/3d/poz-yavru.webp`: menu figures cut from sheet 1.
