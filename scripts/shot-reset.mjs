import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, normalize } from 'path';
import { fileURLToPath } from 'url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'out');
const out = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'screenshots', 'reset');
mkdirSync(out, { recursive: true });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain',
};

function serveFile(urlPath, res) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  if (rel === '/') rel = '/index.html';
  const file = normalize(join(root, rel));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end('missing');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
}

const server = createServer((req, res) => serveFile(req.url || '/', res));
await new Promise((resolve) => server.listen(3467, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:3467';

const browser = await chromium.launch();
const failures = [];

async function withPage(size, palette, fn) {
  const page = await browser.newPage({ viewport: size });
  await page.addInitScript((p) => {
    localStorage.setItem('aied:palette', p);
    localStorage.setItem('aied:learned', JSON.stringify(['rag', 'agent', 'embeddings', 'evals']));
    localStorage.setItem('aied:study:v1', JSON.stringify({ 'rag:term': { ease: 2.5, interval: 1, due: Date.now(), reps: 1 } }));
  }, palette);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  try {
    await fn(page);
  } catch (err) {
    failures.push(String(err));
    console.error(err);
  }
  await page.close();
}

await withPage({ width: 1440, height: 900 }, 'paper', async (page) => {
  await page.getByRole('button', { name: 'Reset view' }).waitFor();
  await page.goto(base + '/?term=rag', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator('.search__input').fill('agent');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/desktop-paper-before-reset.png` });
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.waitForTimeout(700);
  const url = page.url();
  if (url.includes('term=')) throw new Error('term still in URL after reset: ' + url);
  const query = await page.locator('.search__input').inputValue();
  if (query !== '') throw new Error('search not cleared: ' + query);
  if (await page.locator('.panel:not(.panel--welcome)').count()) throw new Error('term panel still open');
  await page.screenshot({ path: `${out}/desktop-paper-after-reset.png` });
  const resetBox = await page.getByRole('button', { name: 'Reset view' }).boundingBox();
  if (!resetBox || resetBox.x + resetBox.width > 1440 - 400) throw new Error('Reset view still under panel: ' + JSON.stringify(resetBox));
  console.log('desktop paper reset ok');
});

await withPage({ width: 1440, height: 900 }, 'night', async (page) => {
  await page.goto(base + '/?term=agent', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/desktop-night-reset.png` });
  // progress should still exist
  const learned = await page.evaluate(() => localStorage.getItem('aied:learned'));
  if (!learned || !learned.includes('rag')) throw new Error('reset cleared progress: ' + learned);
  console.log('desktop night reset keeps progress ok');
});

await withPage({ width: 390, height: 844 }, 'paper', async (page) => {
  await page.getByRole('button', { name: 'Reset view' }).waitFor();
  await page.goto(base + '/?term=evals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/mobile-paper-before-reset.png` });
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.waitForTimeout(600);
  if (page.url().includes('term=')) throw new Error('mobile term still in URL');
  await page.screenshot({ path: `${out}/mobile-paper-after-reset.png` });
  console.log('mobile reset ok');
});

await withPage({ width: 1440, height: 900 }, 'paper', async (page) => {
  await page.getByRole('button', { name: 'Clear my progress' }).waitFor();
  await page.screenshot({ path: `${out}/desktop-clear-trigger.png` });
  await page.getByRole('button', { name: 'Clear my progress' }).click();
  await page.getByRole('alertdialog').waitFor();
  const body = await page.locator('.clear-progress__body').innerText();
  if (!body.includes("4 terms you've visited")) throw new Error('unexpected confirm copy: ' + body);
  await page.screenshot({ path: `${out}/desktop-clear-confirm.png` });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('status').waitFor();
  const after = await page.evaluate(() => ({
    learned: localStorage.getItem('aied:learned'),
    study: localStorage.getItem('aied:study:v1'),
    palette: localStorage.getItem('aied:palette'),
  }));
  if (after.learned !== null) throw new Error('learned not cleared');
  if (after.study !== null) throw new Error('study not cleared');
  if (after.palette !== 'paper') throw new Error('palette wiped');
  await page.screenshot({ path: `${out}/desktop-clear-toast.png` });
  await page.getByRole('button', { name: 'Undo' }).click();
  await page.waitForTimeout(200);
  const restored = await page.evaluate(() => localStorage.getItem('aied:learned'));
  if (!restored || !restored.includes('rag')) throw new Error('undo failed: ' + restored);
  console.log('clear + undo ok');
});

await withPage({ width: 390, height: 844 }, 'night', async (page) => {
  await page.getByRole('button', { name: 'Clear my progress' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('status').waitFor();
  await page.screenshot({ path: `${out}/mobile-night-clear-toast.png` });
  console.log('mobile night clear ok');
});

await browser.close();
server.close();
if (failures.length) {
  console.error('FAILURES', failures);
  process.exit(1);
}
console.log('all reset screenshots ok ->', out);
