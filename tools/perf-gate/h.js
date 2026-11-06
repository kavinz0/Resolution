// Perf-gate harness: loads a full Resolution index.html headless, enters the testing ground (GRID2200), runs a scenario.
// usage: node h.js <index.html> <scenario.js> [menu|floor|test]
// Three and Rapier are served from local npm packs (PKG dir), since headless runs here can't reach the CDN.
//   PKG=/path/with/three/package and rapier/package  (npm pack three@0.160.0 @dimforge/rapier3d-compat@0.12.0, untar)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PKG = process.env.PKG || path.join(__dirname, 'pkgs');
(async () => {
  const b = await chromium.launch({ args: process.env.GPU ? ['--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 960), height: +(process.env.VH || 600) } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 4).join(' | ')));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || m.text().startsWith('DBG')) errs.push('CONSOLE ' + m.type() + ' ' + m.text().slice(0, 300)); });
  await p.route('https://cdn.jsdelivr.net/**', r => { const u = r.request().url();
    const f = u.includes('/examples/jsm/') ? PKG + '/three/package/examples/jsm/' + u.split('/examples/jsm/')[1] : u.includes('three') ? PKG + '/three/package/build/three.module.js' : PKG + '/rapier/package/rapier.es.js';
    r.fulfill({ body: fs.readFileSync(f), contentType: 'application/javascript' }); });
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.route('https://fonts.gstatic.com/**', r => r.fulfill({ body: '', contentType: 'font/woff2' }));
  let html = fs.readFileSync(process.argv[2], 'utf8'); if (!/<!doctype/i.test(html)) html = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>';
  await p.route('http://local/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('http://local/');
  await p.waitForFunction(() => window.__res && document.getElementById('go').dataset.ready === '1', null, { timeout: 90000 });
  const mode = process.argv[4] || 'test';
  if (mode === 'floor') await p.evaluate(() => window.__res.begin());
  else if (mode === 'test') {
    await p.waitForFunction(() => !document.querySelector('#mnav button[data-act=test]').disabled, null, { timeout: 30000 });
    await p.click('#mnav button[data-act=test]');
    await p.fill('#codein', 'GRID2200'); await p.press('#codein', 'Enter'); await p.waitForTimeout(800);
  }
  const shot = async (name) => { await p.screenshot({ path: path.join(process.env.OUT || __dirname, name + '.png') }); };
  const ev = (fn, arg) => p.evaluate(fn, arg);
  const scen = require(path.resolve(process.argv[3]));
  try { await scen({ p, ev, shot, errs }); } catch (e) { errs.push('SCEN ' + e.stack); }
  const bad = errs.filter((e) => !e.startsWith('CONSOLE warning'));
  console.log(bad.slice(0, 12).join('\n') || 'no errors');
  if (process.env.WARN) console.log(errs.filter((e) => e.startsWith('CONSOLE warning')).slice(0, 8).join('\n'));
  await b.close();
  process.exitCode = bad.length || global.__gateFail ? 1 : 0;
})();
