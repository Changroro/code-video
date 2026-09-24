// node render.mjs video [out.mp4]      -> full MP4 (H.264 at window.VIDEO size and fps; muxes audio.wav when present)
// node render.mjs stills 1.2 3.4 ...   -> stills/t<sec>.png for review
// env: CRF (20), WORKERS (4), QUERY (appended to the page URL, e.g. QUERY=lang=ko), CAPTURE=png (lossless frames, ~2x slower)
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const [mode = 'video', ...rest] = process.argv.slice(2);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2' };

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
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html${process.env.QUERY ? '?' + process.env.QUERY : ''}`);
  await page.waitForFunction('window.READY === true', null, { timeout: 30000 });
  return page;
}
// JPEG q.92 capture is 2-3x faster than PNG and measures ~44 dB PSNR against it after H.264; stills stay PNG
const grab = (page, f, mime = 'image/png') => page.evaluate(async ([f, m]) => { await renderFrame(f); return document.getElementById('c').toDataURL(m, .92).split(',')[1]; }, [f, mime]).then(b => Buffer.from(b, 'base64'));
const page = await openPage();
const fps = await page.evaluate('FPS');
const run = (cmd, args) => new Promise((ok, fail) => spawn(cmd, args, { cwd: root, stdio: 'inherit' }).on('close', c => (c ? fail(new Error(`${cmd} exit ${c}`)) : ok())));

if (mode === 'stills') {
  fs.mkdirSync(path.join(root, 'stills'), { recursive: true });
  for (const s of rest) fs.writeFileSync(path.join(root, 'stills', `t${s}.png`), await grab(page, Math.round(+s * fps)));
} else {
  const out = rest[0] ?? 'video.mp4';
  const audio = fs.existsSync(path.join(root, 'audio.wav'));
  const silent = audio ? `.silent-${out}` : out;
  const png = process.env.CAPTURE === 'png';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', png ? 'png' : 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.CRF ?? '20', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent],
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
      ready.set(f, await grab(p, f, png ? 'image/png' : 'image/jpeg'));
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
  if (audio) {
    // -14 LUFS is the usual loudness target for social video
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', 'audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out]);
    fs.unlinkSync(path.join(root, silent));
  }
}
await browser.close();
server.close();
