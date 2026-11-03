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
| Space | Jump |
| Ctrl / C | Slide |
| Shift | Dash (2 charges) |
| Right mouse / E (hold) | Grapple |
| Left mouse | Fire |
| F | Hack terminal |
| R | Restart |

## What's in the prototype

- Momentum movement: ground friction, air strafing, slide boost, dash, and slide-jumps.
- Grappling wrist that anchors to any surface within 60 m.
- Breakable glass that shatters into physics shards from bullets, or when you or a ragdoll hit it fast.
- Jointed ragdolls that keep the momentum of the killing shot.
- Workers who flee, guards who strafe and telegraph shots, and armored defense bots. Enemies miss more when you move fast.
- One graybox floor, a mezzanine with a story terminal, and a skybridge to the next tower.

## Tech stack

Three.js for rendering and Rapier (WebAssembly) for physics. The plan is to move to TypeScript + Vite in week 2 as the code grows.

## Story and plan

See [docs/story-and-plan.md](docs/story-and-plan.md).
