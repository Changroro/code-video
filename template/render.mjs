// node render.mjs video [out.mp4]      -> full MP4 (H.264, 1080p30)
// node render.mjs stills 1.2 3.4 ...   -> stills/t<sec>.png for review
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const [mode = 'video', ...rest] = process.argv.slice(2);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.ttf': 'font/ttf' };

const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(root)) return res.writeHead(403).end();
  fs.readFile(f, (err, data) => (err ? res.writeHead(404).end() : res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' }).end(data)));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

const browser = await chromium.launch({ channel: 'chrome' });
async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => { console.error('pageerror:', e); process.exit(1); });
  page.on('console', m => m.type() === 'error' && !m.text().includes('404') && console.error('console:', m.text()));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}
const grab = (page, f) => page.evaluate(f => { renderFrame(f); return document.getElementById('c').toDataURL('image/png').slice(22); }, f).then(b => Buffer.from(b, 'base64'));
const page = await openPage();

if (mode === 'stills') {
  fs.mkdirSync(path.join(root, 'stills'), { recursive: true });
  for (const s of rest) fs.writeFileSync(path.join(root, 'stills', `t${s}.png`), await grab(page, Math.round(+s * 30)));
} else {
  const out = rest[0] ?? 'video.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.CRF ?? '20', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
    { cwd: root, stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', c => (c ? fail(new Error(`ffmpeg exit ${c}`)) : ok())));
  // frames are deterministic, so N pages render in parallel and are written back in order
  const total = await page.evaluate('FPS * DUR');
  const pages = [page, ...(await Promise.all(Array.from({ length: +(process.env.WORKERS ?? 4) - 1 }, openPage)))];
  const ready = new Map();
  let next = 0, written = 0;
  await Promise.all(pages.map(async p => {
    while (next < total) {
      const f = next++;
      ready.set(f, await grab(p, f));
      while (ready.has(written)) {
        const buf = ready.get(written); ready.delete(written);
        if (written % 90 === 0) console.log(`frame ${written}/${total}`);
        written++;
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
    }
  }));
  ff.stdin.end();
  await done;
}
await browser.close();
server.close();
