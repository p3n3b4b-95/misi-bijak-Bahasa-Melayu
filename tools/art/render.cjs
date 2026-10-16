// Renders SVG illustrations to transparent PNGs with headless Chromium (Playwright).
// Usage: node tools/art/render.cjs <outDir> <svg> [<svg> ...]
// Each SVG must carry width/height attributes equal to its output pixel size.
// Source of truth for artwork is the SVG; PNGs are intermediate and converted to WebP by build_assets.py.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
const [outDir, ...svgs] = process.argv.slice(2);
if (!outDir || !svgs.length) { console.error("usage: render.cjs <outDir> <svg>..."); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });

const executablePath = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox", "--allow-file-access-from-files"] });
for (const svg of svgs) {
  const text = fs.readFileSync(svg, "utf8");
  const w = Number(/<svg[^>]*\swidth="(\d+)"/.exec(text)?.[1]);
  const h = Number(/<svg[^>]*\sheight="(\d+)"/.exec(text)?.[1]);
  if (!w || !h) throw new Error(`${svg}: missing integer width/height on <svg>`);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.resolve(svg));
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(outDir, path.basename(svg, ".svg") + ".png");
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(`${svg} -> ${out} (${w}x${h})`);
}
await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
