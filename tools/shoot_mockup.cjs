
const path = require('path');
// Resolve Playwright from PLAYWRIGHT_PATH, else the usual node_modules lookup.
// Install with: npm i -D playwright && npx playwright install chromium
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const REPO = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO, 'shots');
const URL = 'https://larrykong.github.io/zed-agent-toolbar-mockup/';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1000, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const set = async (sel, v) => {
    await page.$eval(sel, (el, val) => {
      el.value = String(val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);
    await page.waitForTimeout(250);
  };

  // NOTE: 01-side-by-side.png is owned by composite_side_by_side.cjs, which pairs a
  // REAL Zed screenshot with the proposed panel. Do not write it from here — this
  // script only knows the mockup's own reproduction of current behaviour.

  // 3) Context meter escalation at 92%
  await set('#w', 560); await set('#c', 92);
  await page.locator('#rs').screenshot({ path: path.join(OUT_DIR, '03-context-meter-critical.png') });
  console.log('03-context-meter-critical.png');

  // 4) Label disambiguation, everything in one row at 700px
  await set('#c', 13); await set('#w', 700);
  await page.locator('#rs').screenshot({ path: path.join(OUT_DIR, '04-label-disambiguation.png') });
  console.log('04-label-disambiguation.png');

  // 2) Overflow menu at the 300px floor. Done LAST because it strips the page
  // down to the panel — the popover renders above the bar and would otherwise
  // be clipped by, or collide with, surrounding prose.
  await set('#w', 300);
  await page.addStyleTag({ content: `
    h1,.sub,h2,.note,.row,.bar-ctrls,.state-line,.callouts{display:none!important}
    body{padding-top:0}
    .demo{margin-top:360px}
  `});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.locator('#rs .fixed-right button.icon').click();
  await page.waitForTimeout(350);
  {
    const d = await page.locator('#rs').boundingBox();
    await page.screenshot({
      path: path.join(OUT_DIR, '02-overflow-at-300.png'),
      clip: { x: Math.max(0, d.x - 16), y: Math.max(0, d.y - 344),
              width: d.width + 32, height: d.height + 364 },
    });
  }
  console.log('02-overflow-at-300.png');

  await browser.close();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
