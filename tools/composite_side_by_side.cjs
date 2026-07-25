// Stitches the REAL Zed screenshot beside the proposed panel into one labelled image.
// Usage: node composite_side_by_side.cjs /path/to/real-zed-screenshot.png
const path = require('path');
// Resolve Playwright from PLAYWRIGHT_PATH, else the usual node_modules lookup.
// Install with: npm i -D playwright && npx playwright install chromium
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const REPO = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO, 'shots');
const fs = require('fs');

const REAL = process.argv[2];
const MINE = path.join(OUT_DIR, '05-proposed-panel.png');
const OUT  = path.join(OUT_DIR, '01-side-by-side.png');

if (!REAL || !fs.existsSync(REAL)) {
  console.error('Pass the path to the real Zed screenshot, e.g.\n  node composite_side_by_side.cjs ~/Desktop/zed.png');
  process.exit(1);
}
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');

(async () => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    :root{--muted:#8b8e95;--dim:#63666d;--bad:#d97757;--good:#5fb37a}
    *{box-sizing:border-box}
    body{margin:0;padding:26px 26px 20px;background:#131315;color:#d6d7da;
      font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
      -webkit-font-smoothing:antialiased}
    .wrap{display:flex;gap:30px;align-items:flex-start}
    .col{display:flex;flex-direction:column}
    .cap{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12.5px;color:var(--muted)}
    .tag{font-size:10.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:2px 7px;border-radius:4px}
    .now{background:rgba(217,119,87,.14);color:var(--bad)}
    .new{background:rgba(95,179,122,.14);color:var(--good)}
    .rows{margin-left:auto;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--dim)}
    /* Both sources are 2x captures — pin to the CSS width so they scale to match. */
    img{display:block;width:304px;height:auto;border-radius:8px;border:1px solid #2a2c31}
    .notes{margin-top:12px;font-size:12px;color:var(--dim);max-width:330px}
    .notes div{margin:5px 0;display:flex;gap:7px;align-items:flex-start}
    .x{color:var(--bad);font-weight:600} .y{color:var(--good);font-weight:600}
    #card{display:inline-block;padding:26px;background:#131315}
  </style></head><body style="margin:0;padding:0">
    <div id="card"><div class="wrap">
      <div class="col">
        <div class="cap"><span class="tag now">current</span> Zed 1.13.0-pre <span class="rows">5 rows</span></div>
        <img src="${b64(REAL)}">
        <div class="notes">
          <div><span class="x">✕</span><span>controls wrap by source order — send gets its own row</span></div>
          <div><span class="x">✕</span><span>context ring alone on a row, unlabelled</span></div>
          <div><span class="x">✕</span><span>two dropdowns both read “Default” (model / agent)</span></div>
        </div>
      </div>
      <div class="col">
        <div class="cap"><span class="tag new">proposed</span> priority + overflow <span class="rows">1 row</span></div>
        <img src="${b64(MINE)}">
        <div class="notes">
          <div><span class="y">✓</span><span>send pinned right, never wrap-eligible</span></div>
          <div><span class="y">✓</span><span>meter labelled, reserved slot, escalates with usage</span></div>
          <div><span class="y">✓</span><span>ambiguous values self-qualify; rest behind <code>⋯</code></span></div>
        </div>
      </div>
    </div></div>
  </body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.locator('#card').screenshot({ path: OUT });
  console.log('wrote', OUT);
  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
