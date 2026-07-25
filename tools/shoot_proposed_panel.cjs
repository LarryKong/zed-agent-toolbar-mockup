// Captures the proposed panel alone, sized to sit beside a real Zed screenshot.
// Usage: node shoot_proposed_panel.cjs [panelWidthCss] [panelHeightCss]

const path = require('path');
// Resolve Playwright from PLAYWRIGHT_PATH, else the usual node_modules lookup.
// Install with: npm i -D playwright && npx playwright install chromium
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const REPO = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO, 'shots');
const W = Number(process.argv[2] || 304);   // css px, match the real screenshot
const H = Number(process.argv[3] || 354);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2, colorScheme: 'dark',
  });
  await page.goto('https://larrykong.github.io/zed-agent-toolbar-mockup/', { waitUntil: 'networkidle' });

  await page.$eval('#w', (el, v) => {
    el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true }));
  }, W);

  // Grow the conversation area so the panel matches the real screenshot's height,
  // which makes the "reclaimed vertical space" difference legible.
  await page.addStyleTag({ content: `
    h1,.sub,h2,.note,.row,.bar-ctrls,.state-line,.callouts{display:none!important}
    .demo{margin-top:20px}
  `});
  await page.$eval('#rs .convo', (el, h) => { el.style.minHeight = h + 'px'; }, Math.max(40, H - 118));
  await page.waitForTimeout(400);

  await page.locator('#rs').screenshot({ path: path.join(OUT_DIR, '05-proposed-panel.png') });
  const box = await page.locator('#rs').boundingBox();
  console.log(`05-proposed-panel.png  ${Math.round(box.width)}x${Math.round(box.height)} css px`);
  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
