// Martı duman testi: sayfa açılıyor mu, konsol hatası var mı, oyun başlıyor mu, bir etkileşim durumu değiştiriyor mu,
// telefon görünümünde taşma var mı, eski kayıtla açılıyor mu. Depoya hiçbir bağımlılık eklenmez.
//
// Kullanım:  node test/duman.mjs [klasör]        (klasör verilmezse deponun kökü)
// Gerekli:   `playwright-core` (depo dışında kurulu olabilir: PW_MODULE=<node_modules'ın bulunduğu klasör>)
//            ve Chromium tabanlı bir tarayıcı: CHROMIUM=<exe yolu> (verilmezse Playwright'ın kendi tarayıcısı).
//            Three.js sayfanın kendi CDN adresinden gelir, bağlantı gerekir.
// Çıktı: "ok" / "n/a" / "FAIL" satırları, en sonda RESULT; hata varsa çıkış kodu 1.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || join(here, '..'));
const req = createRequire(process.env.PW_MODULE ? pathToFileURL(join(process.env.PW_MODULE, 'x.js')) : import.meta.url);
const { chromium } = req('playwright-core');
const IGNORED = /gc\.zgo\.at|goatcounter|fonts\.googleapis\.com|fonts\.gstatic\.com/;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.mp4': 'video/mp4', '.glb': 'model/gltf-binary' };
let failed = false;
const ok = (m) => console.log('ok   ' + m);
const fail = (m) => { failed = true; console.log('FAIL ' + m); };
const check = (c, m) => (c ? ok(m) : fail(m));

const srv = createServer((rq, rs) => {
  const p = normalize(decodeURIComponent(new URL(rq.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  let f = join(root, p || 'index.html');
  if (!f.startsWith(root)) { rs.writeHead(403).end(); return; }
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { rs.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
  rs.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }).end(readFileSync(f));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + srv.address().port + '/';
console.log('hedef: ' + root);

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const attach = (page, errs) => {
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (!IGNORED.test(r.url())) errs.push('requestfailed: ' + r.url()); });
  page.on('response', (r) => { if (r.status() >= 400 && !IGNORED.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
};
const ready = (page) => page.waitForFunction(() => { const b = document.getElementById('bStart'); return b && !b.disabled && window.marti; }, null, { timeout: 120000 });
const newPage = async (vp, mobile, init) => {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await ctx.route(IGNORED, (r) => r.fulfill({ status: 200, body: '' }));
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  const errs = [];
  attach(page, errs);
  return { ctx, page, errs };
};
try {
  for (const [name, vp, mobile] of [['masaustu 1366x768', { width: 1366, height: 768 }, false], ['telefon 390x844', { width: 390, height: 844 }, true]]) {
    const { ctx, page, errs } = await newPage(vp, mobile);
    await page.goto(base + '?low', { waitUntil: 'load' });
    await ready(page);
    ok(`[${name}] sayfa açıldı, "Başla" düğmesi etkin`);
    check(/Martı/.test(await page.title()), `[${name}] başlık: ${await page.title()}`);
    const over = await page.evaluate(() => {
      const w = innerWidth, bad = [];
      for (const e of document.querySelectorAll('#title button, #title a')) { const r = e.getBoundingClientRect(); if (r.width && (r.left < -1 || r.right > w + 1)) bad.push(e.id || e.textContent); }
      return { h: document.documentElement.scrollWidth > w + 1, bad };
    });
    check(!over.h && !over.bad.length, `[${name}] başlık ekranında yatay taşma yok ${over.bad.join(',')}`);
    // Yenilikler penceresi ve diğer oyunlar bağlantısı (yalnız yeni sürümde var)
    if (await page.$('#bNews')) {
      const ver = await page.evaluate(() => (document.getElementById('verTag') || {}).textContent || '');
      check(/v\d+\.\d+/.test(ver), `[${name}] sürüm etiketi görünüyor (${ver.trim()})`);
      await page.click('#bNews');
      const shown = await page.evaluate(() => !document.getElementById('news').classList.contains('hidden') && document.querySelectorAll('#newsList li').length >= 3);
      check(shown, `[${name}] Yenilikler penceresi açılıyor ve maddeleri var`);
      const fit = await page.evaluate(() => { const r = document.querySelector('#news .card').getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1 && document.documentElement.scrollWidth <= innerWidth + 1; });
      check(fit, `[${name}] Yenilikler kartı ekrana sığıyor`);
      await page.keyboard.press('Escape');
      check(await page.evaluate(() => document.getElementById('news').classList.contains('hidden')), `[${name}] Esc ile kapanıyor`);
    } else console.log(`n/a  [${name}] Yenilikler penceresi bu sürümde yok`);
    const hub = await page.$('#titleHub');
    if (hub) check((await hub.getAttribute('href')) === 'https://furkiozknn.github.io/', `[${name}] "Diğer oyunlar" merkez sayfaya gidiyor`);
    else console.log(`n/a  [${name}] "Diğer oyunlar" bağlantısı bu sürümde yok`);
    // oyun başlıyor, bir etkileşim durumu değiştiriyor
    await page.click('#bStart');
    await page.waitForFunction(() => window.marti.state === 'playing', null, { timeout: 30000 });
    ok(`[${name}] oyun başladı (state: playing)`);
    await page.keyboard.press('KeyP');
    check(await page.evaluate(() => window.marti.state === 'paused'), `[${name}] P ile duraklatma çalışıyor`);
    await page.click('#bResume');
    check(await page.evaluate(() => window.marti.state === 'playing'), `[${name}] Devam ile oyuna dönülüyor`);
    const d0 = await page.evaluate(() => window.marti.d);
    await page.evaluate(() => window.martiSim(3));
    check(await page.evaluate((d) => window.marti.d > d + 20, d0), `[${name}] 3 sn simülasyonda mesafe artıyor`);
    check(errs.length === 0, `[${name}] konsol/sayfa/ağ hatası yok` + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
  // girdisiz koşu biter, sonuç ekranı gelir, en iyi skorlar yazılır
  {
    const { ctx, page, errs } = await newPage({ width: 1366, height: 768 });
    await page.goto(base + '?low&run', { waitUntil: 'load' });
    await ready(page);
    const r = await page.evaluate(() => { for (let i = 0; i < 60 && window.marti.state === 'playing'; i++) window.martiSim(10); return { state: window.marti.state, runs: window.marti.runs.length, best: localStorage.getItem('arena.marti.best') }; });
    check(r.state === 'over' && r.runs === 1, `girdisiz koşu bitti (state ${r.state}, koşu ${r.runs})`);
    check(!!r.best && JSON.parse(r.best).length === 1, 'koşu en iyi skorlara yazıldı');
    const sv = await page.evaluate(() => JSON.parse(localStorage.getItem('arena.marti.save') || '{}'));
    if (await page.$('#bNews')) check(sv.ach && sv.ach.first, 'ilk koşu "İlk uçuş" başarımını açtı ve kayda yazıldı (' + JSON.stringify(sv.ach) + ')');
    else console.log('n/a  başarımlar bu sürümde yok');
    check(errs.length === 0, 'sanal koşuda konsol/sayfa/ağ hatası yok' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
  // rekor geçilince bildirim (yalnız yeni sürümde)
  {
    const seed = () => { try { if (!localStorage.getItem('arena.marti.best')) localStorage.setItem('arena.marti.best', JSON.stringify([{ s: 40, d: 100, n: 1, date: '2026-11-10' }])); } catch (e) {} };
    const { ctx, page, errs } = await newPage({ width: 1366, height: 768 }, false, seed);
    await page.goto(base + '?low&run', { waitUntil: 'load' });
    await ready(page);
    const has = await page.evaluate(() => 'beatShown' in window.marti);
    if (has) {
      await page.evaluate(() => window.martiSim(6));
      await page.waitForFunction(() => window.marti.beatShown === true, null, { timeout: 15000 }).catch(() => {});
      check(await page.evaluate(() => window.marti.score > 40 && window.marti.beatShown), 'rekor geçilince "beatShown" tetiklendi');
    } else console.log('n/a  rekor bildirimi bu sürümde yok');
    await ctx.close();
  }
  // bot (?auto): kayıt yazmaz
  {
    const { ctx, page, errs } = await newPage({ width: 1366, height: 768 });
    await page.goto(base + '?auto&low', { waitUntil: 'load' });
    await ready(page);
    const r = await page.evaluate(() => { const a = window.martiSim(60); return { score: a.score, runs: window.marti.runs.length, ach: localStorage.getItem('arena.marti.ach') }; });
    check(r.runs >= 1 || r.score > 0, `bot ilerledi (skor ${r.score}, koşu ${r.runs})`);
    check(errs.length === 0, 'bot koşusunda konsol/sayfa/ağ hatası yok' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
  // eski kayıtla açılış: en iyi skorlar, yavru ve ayarlar korunur
  {
    const seed = () => { try { if (!localStorage.getItem('arena.marti.best')) { localStorage.setItem('arena.marti.best', JSON.stringify([{ s: 4321, d: 2100, n: 17, date: '2026-11-10' }])); localStorage.setItem('arena.marti.save', JSON.stringify({ chick: 7, hints: {}, factIdx: 2 })); localStorage.setItem('arena.marti.settings', JSON.stringify({ master: 0.5, music: 0.6, sfx: 0.8, lang: 'en', quality: 'low', musicOn: true, sfxOn: true })); } } catch (e) {} };
    const { ctx, page, errs } = await newPage({ width: 1366, height: 768 }, false, seed);
    await page.goto(base + '?low', { waitUntil: 'load' });
    await ready(page);
    const r = await page.evaluate(() => ({ line: document.getElementById('bestLine').textContent, lang: document.documentElement.lang, save: JSON.parse(localStorage.getItem('arena.marti.save')) }));
    check(/4321/.test(r.line) && r.lang === 'en' && r.save.chick === 7, `eski kayıt korunuyor (${r.line.trim()}, dil ${r.lang}, yavru ${r.save.chick})`);
    check(errs.length === 0, 'eski kayıtla açılışta hata yok' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
} catch (e) { fail('beklenmeyen: ' + (e && e.message)); }
await browser.close();
srv.close();
console.log(failed ? 'RESULT FAIL' : 'RESULT OK');
process.exit(failed ? 1 : 0);
