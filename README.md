# Resolution

A fast first-person shooter set in 2200. You are UNIT-7, an AI built to do terrible things, given a combat chassis and sent through the Halcyon Meridian Tower. Sprint, slide, dash, grapple, shatter glass, and decide whether you follow the voice giving you orders.

## Play the prototype

Open `index.html` in a modern desktop browser (Chrome, Edge, or Firefox). No build step is needed; Three.js and Rapier load from a CDN. To serve it locally:

```sh
npx serve .
```

You can also turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) to play it from a link.

### Controls

| Key | Action |
| --- | --- |
| WASD | Move |
| Space | Jump, or let go of the grapple |
| Ctrl / C | Slide. Sliding into an enemy staggers them |
| Shift | Dash (2 charges) |
| Left mouse | Punch or slash. Slide + attack with the sword is a thrust |
| Right mouse | Block. Press it just before a hit lands to parry |
| E | Grapple (unlocked by the sword). Press again to switch anchors |
| C while grappling | Breach: crash through the window and execute enemies behind it |
| Q | Slow time (needs 2 bloodlust bars, costs 1) |
| X | Stop time (needs 3 bars, costs 1) |
| V | Finisher on the enemy under your crosshair (needs 4+ bars, costs 1) |
| R | Restart from the last checkpoint |

## Floor 01: Activation

1. **Fists.** You boot in the chassis lab with no weapons. Six brawlers in the hall telegraph punches with a glowing fist. Block to take chip damage, parry (block in the last 0.18 s) to stagger them, or slide into them. A staggered enemy takes triple damage.
2. **The sword.** Clearing the hall opens the armory. The sword widens the parry window to 0.38 s, lets you deflect bolts back at the shooter, and unlocks the grappling wrist. The grapple line passes through glass.
3. **The windows.** The east wing and server room are sealed from inside. Break out of the armory window, grapple to the amber window-washer rails, hang, then grapple onto a window and press C to breach. The glass bursts inward as shrapnel and executes anyone near the impact, each kill adding a bloodlust bar.

**Bloodlust** (max 5 bars) raises your speed and damage and drops a bar whenever you take a clean hit. You gain bars from breach executions, from thrust kills on enemies that are nearly dead or staggered, and in small amounts from sword parries and deflects.

## Tech stack

Three.js for rendering and Rapier (WebAssembly) for physics. The plan is to move to TypeScript + Vite in week 2 as the code grows.

## Story and plan

See [docs/story-and-plan.md](docs/story-and-plan.md).
