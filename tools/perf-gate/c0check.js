// C0 checks: the clock, effects tiers, the testing ground menu section, the HUD
module.exports = async ({ p, ev, shot }) => {
  await p.waitForTimeout(2500);
  console.log(await ev(() => { const R = window.__res, o = [];
    R.step(2); o.push('idle ' + R.TIME.scale.toFixed(2) + ' ' + R.TIME.by);
    R.TGM.ts = 0.5; R.step(1); o.push('test clock ' + R.TIME.scale.toFixed(2) + ' ' + R.TIME.by); R.TGM.ts = 1;
    R.timeMod('probe', () => 0.2); R.step(1); o.push('mod ' + R.TIME.scale.toFixed(2) + ' ' + R.TIME.by);
    R.timeMod('probe', () => 1); R.step(1); o.push('mod off ' + R.TIME.scale.toFixed(2) + ' ' + R.TIME.by);
    // player keeps real speed in slowed world: velocity before/after a slowed step
    R.timeMod('probe', () => 0.25); R.player.body.setLinvel({ x: 5, y: 0, z: 0 }, true); R.step(1); const v = R.player.body.linvel(); o.push('player vx in 0.25x ' + v.x.toFixed(2)); R.timeMod('probe', () => 1);
    const g0 = R.TIME.game, r0 = R.TIME.real; R.timeMod('probe', () => 0.2); R.step(60); o.push('game/real over 60 steps at 0.2 ' + ((R.TIME.game - g0) / (R.TIME.real - r0)).toFixed(2)); R.timeMod('probe', () => 1); R.step(1);
    // effects tiers
    for (const t of ['low', 'medium', 'high']) { R.applySet('fx', t); o.push(t + ' ' + JSON.stringify(R.fxTier())); }
    R.applySet('fx', 'low'); const V = R.THREE.Vector3; for (let i = 0; i < 40; i++) R.goreWire(new V(0, 1, 8), new V(0, 1, 0)); o.push('wires on (low) ' + R.GORE.w.filter((w) => w.on).length);
    R.applySet('fx', 'medium');
    return o.join('\n'); }));
  // Focus routes through the same clock
  console.log(await ev(() => { const R = window.__res; try { R.state.tsMode = 'focus'; R.state.ts = 0.18; R.state.tsTimer = 1; R.step(1); return 'focus ' + R.TIME.scale.toFixed(2) + ' ' + R.TIME.by; } finally { R.state.tsMode = 'normal'; R.state.ts = 1; } }));
  await ev(() => { window.__res.perfSet(true); window.__res.tgmOpen(); });
  await p.waitForTimeout(1500);
  console.log(await ev(() => [...document.querySelectorAll('#tgbody h3')].map((h) => h.textContent).join(' | ')));
  await ev(() => { const s = [...document.querySelectorAll('#tgbody .set-sec')].find((x) => x.querySelector('h3').textContent === 'Performance'); s.scrollIntoView(); });
  await shot('tgmenu');
  await ev(() => { window.__res.TGM.tab = 'set'; document.querySelector('#tgmenu .tg-tabs button[data-tab=set]').click(); });
  await p.waitForTimeout(500);
  console.log(await ev(() => [...document.querySelectorAll('#tgset .set-l')].map((h) => h.firstChild.textContent).filter((t) => /Effects/.test(t)).join(',')));
  await ev(() => window.__res.tgmClose()); await p.waitForTimeout(3000); await shot('hud');
};
