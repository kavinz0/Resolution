# Perf gate (component C0)

Run before every component PR (design doc 9.4), on your rebased `index.html`.

## Setup (once per container)
```
mkdir pkgs && cd pkgs && npm pack three@0.160.0 @dimforge/rapier3d-compat@0.12.0
mkdir three rapier && tar xzf three-0.160.0.tgz -C three && tar xzf dimforge-rapier3d-compat-0.12.0.tgz -C rapier
```
The CDN is blocked from cloud containers, so `h.js` serves Three and Rapier from `pkgs/` (or `PKG=/path`).

## Run
```
VW=320 VH=200 node h.js <index.html> roomrun.js          # the room run (about 10-20 min on software GL)
ROUNDS=1 VW=320 VH=200 node h.js <index.html> roomrun.js # quick pass while iterating
node h.js <index.html> c0check.js                        # C0 sanity: clock, effects tiers, menu, HUD
```
Also rerun the v26 freeze scenarios (`../../v26src/fz6.js`, `fz7.js`, `nan.js`) with this `h.js`.

## What passes
- **0 hitch compiles**: no shader program built by a draw after a level's first 3 frames (outside `warmHidden`).
- **No page errors, no Rapier step panic.**
- **Sim step p95 <= 6 ms** (`SIMP95`): one 60 Hz world step (AI, gore, props, physics), timed step by step.
- **Frame p95 < 20 ms** only with `GPU=1` on a machine with a real GPU. Cloud containers only have SwiftShader
  (software GL, 1-10 s frames), so the drawn-frame number there is reported but not judged.

The script calls `R.gyreStart()` before each mini finisher once Gyre (C2) exposes it on `window.__res`.

## In game
Testing ground (GRID2200) > Tab > Simulation > **Performance**: Perf HUD toggle, Effects tier, reset counters.
The HUD shows frame ms + p95 (amber graph), main-thread cpu ms, physics ms (blue graph), draw calls, triangles,
bodies, ragdolls, debris, shader programs, compiles since start and hitch compiles, and the clock (`TIME.scale` and
which source set it).
