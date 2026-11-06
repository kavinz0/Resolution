// Gyre checks (C2): flip, time scale, upside-down exit, charges, Halo, Drop Spike, hitch compiles.
// Run with the perf gate harness: node tools/perf-gate/h.js index.html tools/gyre/gyre-check.js
module.exports = async ({ p, ev, shot, errs }) => {
  const wait = (ms) => p.waitForTimeout(ms);
  await wait(2500);
  const log = async (fn, a) => console.log(await ev(fn, a));
  await ev(() => { window.__resHold = true; const R = window.__res; R.player.god = true; });
  // 1. basic flip
  await log(() => {
    const R = window.__res, G = R.GYRE; const o = [];
    R.teleport(46, 1.3, -6); R.setLook(0, 0); R.step(30);
    R.player.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space'); R.step(4); // jump
    o.push('after jump grounded=' + R.player.grounded + ' y=' + R.player.body.translation().y.toFixed(2));
    R.step(8);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space');
    o.push('gyre on=' + G.on + ' n=' + G.n + ' dir=' + G.dir);
    R.step(10); o.push('k after 10 steps=' + G.k.toFixed(2));
    const y0 = R.player.body.translation().y; let steps = 0;
    while (G.on && steps < 200) { R.step(1); steps++; if (steps === 30) o.push('mid ang=' + G.ang.toFixed(2) + ' k=' + G.k.toFixed(2) + ' ps=' + (G.psOut).toFixed(2)); }
    o.push('gyre lasted steps=' + (steps + 11) + ' (' + ((steps + 11) / 60).toFixed(2) + ' s real) dy=' + (R.player.body.translation().y - y0).toFixed(2) + ' budget=' + G.budget.toFixed(2));
    R.step(20); o.push('k after=' + G.k.toFixed(2));
    return o.join('\n');
  });
  // 2. upside-down look then snap out
  await log(() => {
    const R = window.__res, G = R.GYRE; const o = [];
    R.teleport(46, 8, -6); R.player.body.setLinvel({ x: 0, y: 0, z: 0 }, true); R.step(9);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space'); R.step(30);
    o.push('on=' + G.on + ' n=' + G.n);
    R.setLook(0.3, 2.6); R.step(1);
    window.__shotRdy = true; return o.join('\n');
  });
  await ev(() => { window.__resHold = false; }); await wait(250); await ev(() => { window.__resHold = true; });
  await shot('gy_upside');
  await log(() => {
    const R = window.__res, G = R.GYRE; const o = [];
    R.keys.add('Space'); R.step(1); R.keys.delete('Space');
    const st = R.state; o.push('after snap on=' + G.on + ' rollFix=' + G.rollFix.toFixed(2));
    let steps = 0; while (!R.player.grounded && steps < 300) { R.step(1); steps++; }
    o.push('landed after ' + steps);
    // charges: two used, the third press should fail
    R.teleport(46, 8, -6); R.player.body.setLinvel({ x: 0, y: 0, z: 0 }, true); R.step(9);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space'); o.push('third try on=' + G.on + ' n=' + G.n);
    return o.join('\n');
  });
  // 3. Halo over a dummy
  await log(() => {
    const R = window.__res, G = R.GYRE; const o = [];
    let steps = 0; while (!R.player.grounded && steps < 400) { R.step(1); steps++; }
    R.step(260); o.push('refilled n=' + G.n + ' budget=' + G.budget.toFixed(1));
    R.spawnEnemy('brawler', 46, 0, -30); const e = R.enemies[R.enemies.length - 1]; e.dummy = true; e.home = { x: 46, y: 0, z: -30 }; R.step(5);
    R.teleport(46, 4.2, -31.6); R.player.body.setLinvel({ x: 0, y: 0, z: -4 }, true); R.setLook(0, -0.9); R.step(8);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space'); R.step(3);
    o.push('gyre on=' + G.on);
    R.pressed.add('KeyF'); R.step(1);
    o.push('halo=' + !!G.halo + ' kind=' + (G.halo && G.halo.kind));
    window.__e = e; R.step(24);
    return o.join('\n');
  });
  await ev(() => { window.__resHold = false; }); await wait(200); await ev(() => { window.__resHold = true; });
  await shot('gy_halo_grab');
  await log(() => { const R = window.__res; R.step(20); return 'halo t=' + (R.GYRE.halo ? R.GYRE.halo.t.toFixed(2) : '-'); });
  await ev(() => { window.__resHold = false; }); await wait(200); await ev(() => { window.__resHold = true; });
  await shot('gy_halo_twist');
  await log(() => {
    const R = window.__res, G = R.GYRE; const e = window.__e; const o = [];
    let n = 0; while (G.halo && n < 200) { R.step(1); n++; }
    o.push('halo ended after ' + n + ' more; e.dead=' + e.dead + ' head joint=' + (e.rd && e.rd.joints ? String(!!e.rd.joints.head) : 'n/a') + ' k=' + G.k.toFixed(2));
    o.push('book halo combo? ' + JSON.stringify(R.BOOK.halo || null));
    return o.join('\n');
  });
  // 4. Drop Spike
  await log(() => {
    const R = window.__res, G = R.GYRE; const o = [];
    R.spawnEnemy('gunman', 40, 0, -30); const e = R.enemies[R.enemies.length - 1]; e.dummy = true; e.home = { x: 40, y: 0, z: -30 }; R.step(5);
    R.teleport(40, 6, -30.4); R.player.body.setLinvel({ x: 0, y: 0, z: 0 }, true); R.step(9);
    R.keys.add('Space'); R.step(1); R.keys.delete('Space'); R.step(6);
    o.push('gyre on=' + G.on + ' n=' + G.n);
    R.pressed.add('ControlLeft'); R.step(1); o.push('drop=' + !!G.drop + ' on=' + G.on);
    let n = 0; while (G.drop && n < 120) { R.step(1); n++; }
    o.push('landed after ' + n + ' e.dead=' + e.dead);
    return o.join('\n');
  });
  // 5. a tutorial build check
  await log(() => { const R = window.__res; return 'rooms: ' + R.ROOMS.map((r) => r.name).join(', '); });
  await ev(() => { window.__resHold = false; }); await wait(1500);
  await log(() => 'hitch compiles ' + window.__res.PH.hitch + ' total ' + window.__res.PH.compiles + ' ' + JSON.stringify(window.__res.PH.hitchLog));
};
