# Zed agent panel — message editor toolbar proposal

Interactive mockup proposing a responsive layout for the agent panel's message editor
toolbar in [Zed](https://github.com/zed-industries/zed).

**Live demo: https://larrykong.github.io/zed-agent-toolbar-mockup/**

Related: [zed-industries/zed#55315](https://github.com/zed-industries/zed/issues/55315) ·
[#61152](https://github.com/zed-industries/zed/issues/61152) ·
[#61395](https://github.com/zed-industries/zed/pull/61395)

## Context

`#61395` fixed the toolbar clipping out of bounds, and that fix is in `1.13.0-pre`. What it
did not address is that the toolbar is a plain `flex-wrap` with no priority order. At a
360–380px panel — a normal working width, not the minimum — it spends five rows of vertical
chrome under a one-line input, and the send button and context meter get stranded on rows of
their own.

Two further problems are independent of layout:

- **Two adjacent dropdowns both read `Default`** — one selects the model, one selects the
  agent — with nothing in either label to distinguish them.
- **The context meter is an unlabelled ring.** It renders identically at 13% and at 97%, so
  the one control you read continuously tells you nothing without hovering.

## What the mockup shows

Side-by-side comparison at 380px, plus a live demo you can resize from Zed's 300px panel
floor upward.

- **Measured, not breakpointed.** The bar renders the richest control set that actually fits
  and hands the rest to a working `⋯` overflow menu, whose contents are derived from what was
  dropped. Content width matters as much as panel width — selecting `web-search-agent` steps
  the bar down a tier at a fixed 300px, which a hardcoded breakpoint would miss.
- **Ambiguous labels self-qualify.** A control names its dimension only when its value is
  shared with another control. `Opus 5` and `web-search-agent` stand alone; when both would
  read `Default`, they become `Model: Default` and `Agent: Default`. Computed from live
  state — set Model to `Opus 5` and the Agent prefix disappears.
- **Priority order, not source order.** Agent outranks model, because which agent answers
  changes its instructions and tools. Fast mode retreats first.
- **The context meter is pinned and legible.** Reserved slot beside send, labelled with a
  percentage, escalating muted → amber at 75% → red at 90%, with the token count appearing
  inline in the red. Usage and cost on hover.
- **Send is pinned right** and never participates in wrapping.

All popovers are functional — change any setting and the bar re-fits.

## Caveats

Palette and spacing were approximated by eye from screenshots rather than taken from Zed's
theme tokens. This is a layout and information-hierarchy proposal, not a pixel-accurate skin.
Single self-contained HTML file, no dependencies, no build step.
