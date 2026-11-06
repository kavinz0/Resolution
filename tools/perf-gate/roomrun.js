// Room run: the perf gate scenario (design doc 9.4). Clears a testing-ground arena 5 times with mini finishers
// (and Gyre when it exists), then reports and judges:
//   - sim step ms (one 60 Hz world step: AI, gore, props, physics): p95 and max, timed step by step
//   - physics ms per step (world.step only)
//   - drawn-frame time p95 (meaningful on a real GPU; with software GL it is just slow)
//   - shader programs compiled by a draw after the level's first frames ("hitch compiles"), which must be 0
//   - page errors and Rapier panics, which must be 0
// usage: node h.js <index.html> roomrun.js            (software GL: judges sim step, compiles, errors)
//        GPU=1 node h.js <index.html> roomrun.js      (real GPU: also judges drawn-frame p95 < 20 ms)
// env: ROUNDS (5), SIMP95 (sim step p95 budget ms, default 6), FRAMEP95 (20)
module.exports = async ({ p, ev, errs }) => {
  const ROUNDS = +(process.env.ROUNDS || 5), SIMP95 = +(process.env.SIMP95 || 6), FRAMEP95 = +(process.env.FRAMEP95 || 20);
  const raf = () => ev(() => new Promise((r) => requestAnimationFrame(() => r())));
  await p.waitForTimeout(2500); for (let i = 0; i < 4; i++) await raf();
  await ev(() => { const R = window.__res; R.player.god = true; R.perfSet(true); R.PH.count = 0; R.PH.hitch = 0; R.PH.hitchLog = []; R.PH.ft.fill(0); R.PH.pm.fill(0); R.PH.cp.fill(0);
    window.__rr = { sim: [], phys: [], calls: 0, bodies: 0, ragdolls: 0, kills: 0, minis: 0, gyre: 0, panic: '' };
    const W = R.world, st = W.step.bind(W); W.step = (...a) => { try { return st(...a); } catch (err) { window.__rr.panic ||= 'STEP PANIC ' + err.message; throw err; } };
    // one timed world step
    window.__st = (n) => { const R = window.__res, rr = window.__rr; for (let i = 0; i < n && !R.player.dead; i++) { const p0 = R.PH.phys; const t0 = performance.now(); R.step(1); rr.sim.push(performance.now() - t0); rr.phys.push(R.PH.phys - p0); }
      let b = 0; try { b = R.world.bodies.len(); } catch {} rr.bodies = Math.max(rr.bodies, b); rr.ragdolls = Math.max(rr.ragdolls, R.ragdolls2.length); rr.calls = Math.max(rr.calls, R.PH.calls); };
  });
  const kinds = [['grab', 'Digit2', 'brawler'], ['whip', 'Digit3', 'worker'], ['stab', 'Digit5', 'shield'], ['lasso', 'Digit6', 'gunman'], ['ram', 'Digit8', 'brawler']];
  for (let round = 0; round < ROUNDS; round++) {
    // the arena: a cast of dummies spread in front of the player
    for (let k = 0; k < kinds.length; k++) {
      const [kind, key, type] = kinds[(k + round) % kinds.length];
      const res = await ev(([kind, key, type, k]) => { const R = window.__res;
        R.pressed.add(key); window.__st(12);
        R.spawnEnemy(type, 0, 0, 10.5); const e = R.enemies[R.enemies.length - 1]; e.dummy = true; e.home = { x: 0, y: 0, z: 10.5 };
        // a bystander that the finisher's body may crash into
        R.spawnEnemy(['worker', 'gunman', 'brawler'][k % 3], (k % 2 ? 2.2 : -2.2), 0, 8.5); const by = R.enemies[R.enemies.length - 1]; by.dummy = true; by.home = { x: by === e ? 0 : (k % 2 ? 2.2 : -2.2), y: 0, z: 8.5 };
        R.teleport(0, 1.3, 12.3); R.setLook(Math.PI, -0.05); window.__st(15);
        if (R.gyreStart) { try { R.gyreStart(); window.__rr.gyre++; } catch {} }
        try { R.mfStart(kind, e); window.__rr.minis++; } catch (err) { return kind + ' ERR ' + err.message; }
        return 'ok'; }, [kind, key, type, k]);
      if (res !== 'ok') errs.push('ROOMRUN ' + res);
      // run the finisher to its end, letting a real frame draw every 40 steps so new shaders would show up
      for (let i = 0; i < 12; i++) { const busy = await ev(() => { window.__st(40); return !!window.__res.MF.cur; }); await raf(); if (!busy && i > 1) break; }
      // and a plain shot kill on the bystander's neighbour so debris, sparks and ragdoll paths run too
      await ev(() => { const R = window.__res, V = R.THREE.Vector3; const e = R.enemies.filter((q) => !q.dead).pop(); if (!e) return; const t = e.body.translation(); R.damageEnemy(e, 999, new V(t.x, t.y + 0.4, t.z), new V(0, 0, -1), 'shot'); window.__rr.kills++; window.__st(30); });
      await raf();
    }
    // clear the room for the next round
    await ev(() => { const R = window.__res; R.killPhase(); window.__st(60); });
    await raf();
  }
  for (let i = 0; i < 6; i++) await raf();
  const r = await ev(() => { const R = window.__res, rr = window.__rr, s = R.perfStats(); const q = (a, x) => { const b = [...a].sort((m, n) => m - n); return b.length ? b[Math.min(b.length - 1, Math.floor(b.length * x))] : 0; };
    return { steps: rr.sim.length, simP50: q(rr.sim, 0.5), simP95: q(rr.sim, 0.95), simMax: q(rr.sim, 1), physP95: q(rr.phys, 0.95), physMax: q(rr.phys, 1), frames: Math.min(R.PH.count, R.PH.n), frameP95: s.p95, cpuP95: s.cpuP95,
      callsMax: rr.calls, bodiesMax: rr.bodies, ragdollsMax: rr.ragdolls, minis: rr.minis, kills: rr.kills, gyre: rr.gyre, hitch: R.PH.hitch, hitchLog: R.PH.hitchLog, compiles: R.PH.compiles, panic: rr.panic, fx: s.fx }; });
  const f = (x) => (+x).toFixed(2);
  console.log(`ROOM RUN  rounds ${ROUNDS}  minis ${r.minis}  shot kills ${r.kills}  gyre ${r.gyre}  fx ${r.fx}`);
  console.log(`  sim step   p50 ${f(r.simP50)} ms  p95 ${f(r.simP95)} ms  max ${f(r.simMax)} ms  (${r.steps} steps)`);
  console.log(`  physics    p95 ${f(r.physP95)} ms  max ${f(r.physMax)} ms`);
  console.log(`  frames     p95 ${f(r.frameP95)} ms  cpu p95 ${f(r.cpuP95)} ms  (${r.frames} drawn${process.env.GPU ? '' : ', software GL: not judged'})`);
  console.log(`  peaks      draws ${r.callsMax}  bodies ${r.bodiesMax}  ragdolls ${r.ragdollsMax}`);
  console.log(`  shaders    hitch compiles ${r.hitch}  (all compiles since boot ${r.compiles})${r.hitchLog.length ? ' ' + JSON.stringify(r.hitchLog) : ''}`);
  const fails = [];
  if (r.hitch > 0) fails.push('shader compiles after the first frame');
  if (r.panic) fails.push(r.panic);
  if (r.simP95 > SIMP95) fails.push(`sim step p95 ${f(r.simP95)} > ${SIMP95} ms`);
  if (process.env.GPU && r.frameP95 > FRAMEP95) fails.push(`frame p95 ${f(r.frameP95)} > ${FRAMEP95} ms`);
  if (errs.some((e) => !e.startsWith('CONSOLE warning'))) fails.push('page errors (below)');
  console.log(fails.length ? 'GATE FAIL: ' + fails.join('; ') : 'GATE PASS');
  if (fails.length) global.__gateFail = true;
};
