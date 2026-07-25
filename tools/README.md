# Capture tooling

Regenerates everything in `../shots/`. Playwright is not vendored here:

```bash
npm i -D playwright && npx playwright install chromium
# …or point at an existing install:
export PLAYWRIGHT_PATH=/path/to/node_modules/playwright
```

All paths resolve relative to the repo root, so run these from anywhere.

| Script | Writes | Notes |
|---|---|---|
| `shoot_mockup.cjs` | `02`, `03`, `04` | Captures the live demo at github.io. Takes no arguments. |
| `shoot_proposed_panel.cjs [w] [h]` | `05-proposed-panel.png` | The proposed panel alone, sized to sit beside a real screenshot. Defaults `304 354`. |
| `composite_side_by_side.cjs <real.png>` | `01-side-by-side.png` | Stitches a **real Zed screenshot** beside `05`, with labels. |

## Order matters

`01` pairs a real capture with the proposal, so it depends on `05` existing first:

```bash
node tools/shoot_proposed_panel.cjs 304 354
node tools/composite_side_by_side.cjs shots/real-zed-current.png
node tools/shoot_mockup.cjs
```

`shoot_mockup.cjs` deliberately does **not** write `01` — it only knows the mockup's own
reproduction of current behaviour, and `01` must show the real thing. That ownership split
is the one non-obvious constraint here; an earlier version wrote `01` from both scripts and
silently replaced the real screenshot with a recreation.

## Sizing

Screenshots are captured at `deviceScaleFactor: 2`. When compositing, both images are pinned
to the same CSS width (304px) so the panels are genuinely comparable — a raw 2x capture
dropped in unscaled renders at double size and breaks the layout.
