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
| Space | Jump, or let go of the swing grapple. On the sling line, hold to focus |
| Ctrl / C | Slide. Sliding into an enemy staggers them |
| Shift | Dash (2 charges) |
| 1 / 2 / 3, wheel | Fists, sword, steam pistol |
| Left mouse | Punch, slash or fire. Slide + attack with the sword is a thrust |
| Right mouse | Block (press it just before a hit lands to parry). With the pistol: aim down the sights |
| E | Hold to grapple (unlocked by the sword). Let go to release and keep your momentum |
| C while grappling | Breach: crash through the window and execute enemies behind it |
| G | Grapple mode: swing or sling |
| R | Pistol: vent and reload |
| F | Inspect your weapon |
| Backspace | Restart from the last checkpoint |

## Floor 01: Activation

1. **Fists.** You boot in the chassis lab with no weapons. Six brawlers in the hall telegraph punches with a glowing fist. Block to take chip damage, parry (block in the last 0.18 s) to stagger them, or slide into them. A staggered enemy takes triple damage.
2. **The sword.** Clearing the hall opens the armory. The sword widens the parry window to 0.38 s, lets you deflect bolts back at the shooter, and unlocks the grappling wrist. The grapple line passes through glass.
3. **The windows.** The east wing and server room are sealed from inside. Break out of the armory window, grapple to the amber window-washer rails, hang, then grapple onto a window and press C to breach. The glass bursts inward as shrapnel and executes anyone near the impact.

4. **The finisher.** The killing blow on the last enemy of the floor becomes a third-person finisher (see below).

## Start and boot sequence

- A start menu styled as a Meridian Continuum asset file, over the orbiting tower.
- New directive plays a typed story intro, then a Boot UNIT-7 button starts an eight-second activation: code rain and a boot log, an empathy-dampener malfunction that tears the screen, black, eyes opening with a blink while the optics focus, the charging capsule hissing open, then the arms come up and the HUD comes online. Space skips it.
- Skip to the floor goes straight into Floor 01.

## Fist fighting

- A punch's damage lands on the frame the fist connects in the animation, not on the click.
- If an enemy is within lunge range, the punch carries you into them so it doesn't whiff.
- The crosshair turns orange when a punch will land and flashes an X when it does.
- Hits freeze the frame briefly, jolt the camera, flash the enemy white, and make them flinch and cancel their wind-up. Hooks and uppercuts (hits 3 and 4 of the combo) hit harder and send bodies flying.

## Hands and weapons

- Firing the grapple throws the hook with an open hand; the fist then closes around the cord, the arm points along the line, and the latch yanks it forward. The rope leaves from the fist, with a short cord back to the launcher on the forearm.
- Each hand has four fingers with three separately jointed phalanges plus a two-joint thumb. The sword's grip runs straight through the closed fingers, so every finger wraps it, and fingers ripple open and closed one after another.
- While swinging on the grapple with the sword, the hand plays one of six tricks at random: forward twirl, backward twirl, flip toss, wheel spin, reverse-grip flip, and a high double toss.
- F inspects: the blade is turned in the light with an edge glow, or with fists the launcher is shown off with a finger roll and clench.

## Destruction

- Drywall partitions in the hall and east wing break into rubble when ragdolls are slammed into them, or when you thrust or breach through them.
- Explosive barrels (switched off for now; the code stays in for later): punch or slash one and it blinks, then goes off; bolts and flying bodies set them off at once. Explosions kill or stun enemies nearby, hurt you, throw bodies and debris, shatter glass, break partitions, and chain into other barrels.
- Enemies, ragdolls and debris are interpolated between physics steps for smooth motion at any frame rate.

## Look and feel

- Cel-shaded dusk art style: toon shading in flat bands, rounded shapes with ink outlines, and a violet-to-ember sky.
- Glitch post-processing: RGB split, slipping scanline bands, and block tears that spike on damage, parries, breaches and time effects, and hold steady at low health.
- Robot arms with idle breathing, walk sway, sprint and air poses, and lag behind fast mouse turns. They render in their own pass so they never clip into walls.
- A four-hit fist combo (jab, cross, hook, uppercut) with impact stars and shockwave rings.
- Sword swings leave a dry-brush stroke that follows the blade's actual path, solid at the head and breaking into bristle streaks behind. Thrusts, dashes, and breaches add speed lines and a one-frame impact flash.
- The grapple hook flies out, latches, and reels you in on a spring line, so you swing in arcs. Letting go flings you with your swing speed, and the hook reels back to the wrist. The launcher glows blue when the hook is docked and turns gray while it is out.
- Smoothed camera: interpolated physics, a landing dip, and a softer head bob and lean.
- Your robot body and legs are visible when you look down, and they cast a shadow.

## Tech stack

Three.js for rendering and Rapier (WebAssembly) for physics. The plan is to move to TypeScript + Vite in week 2 as the code grows.

## Story and plan

See [docs/story-and-plan.md](docs/story-and-plan.md).

## Performance

- Fixed the explosion freeze: stunning an enemy the blast had already killed touched a removed physics body and crashed the physics engine.
- Barrels are off for now. Explosions, glass and wall debris use shared geometry, pooled sparks and one pooled blast light, with caps on shards (140), effects and simulated ragdolls (7 newest; older bodies settle as corpses).
- Render resolution adapts to frame time, and the simulation catches up at most 4 steps per frame so a slow frame never snowballs.
- Picking up the sword no longer removes a light from the scene, which used to force every shader to recompile. The scene renders with 2x MSAA, plain PCF shadows at 1024, and at most 1.25x resolution.

## Look

- Night: a black sky with a blood moon and a red horizon, thick dark fog, cold work lights, and red emergency lights that slowly breathe.
- The arms, bots, guns, racks and window frames are polished metal with brushed texture, reflecting a baked map of neon strips.
- The sword edge pulses neon with a sharp flicker, and every slash throws small sparks off the blade.

## Movement and weapons

- Hold Shift after the dash to sprint (about 38% faster). The arms pump in time with the stride, the body leans, and the camera bobs harder and widens.
- 1 / 2 / 3 or the mouse wheel switches between fists, the sword and the pistol once you own them (both come from the armory). The grapple works with any of them.
- G switches the grapple between swing and sling. Sling locks onto an enemy in your aim cone (a red marker shows it), holding E charges the shot, and letting go fires you at the target. The shot homes in on a locked enemy and hits it, killing weaker ones outright.

## City and lighting

- The skyline is instanced and unlit: 120 lit towers, neon bands, spires with blinking beacons, holo signs, circling sky traffic and searchlights, for a handful of draw calls.
- The work lights are brighter, two of them are failing tubes that stutter, and the red emergency light breathes. The light count never changes at runtime.
- The floor is glossy tile that reflects the lights and the neon environment. The walls and ceiling are tiled panels with LED skirting strips.
- The resolution governor runs before the frame is drawn, so a resize never flashes an empty frame.

## Testing ground

Main menu, then 04 Testing ground. It needs an access code; ask Kavin for it. Only a hash of the code is stored in the page.

The testing ground is a 120 m grid inside the city with:
- Ten dummies (brawlers, gunmen and bots) that face you, never attack, show damage numbers and respawn 3 s after they die.
- A glass gallery, and a glass cube with a dummy inside for breach tests.
- Drywall partitions to slam bodies through, grapple towers with beams to swing from, and parkour steps and a ramp.

You start with the sword and the pistol. Keys: N plays the finisher on the dummy you are facing, J spawns three live hostiles, L respawns dummies now, H toggles god mode, Backspace resets the level.

Every new weapon or feature gets added to the testing ground too.

## Steam pistol

- A long-barrelled steampunk pistol: walnut grip, brass receiver, cooling fins, a glowing coil, a pressure gauge whose needle shows the rounds left, and a hammer that cocks on every shot.
- Under the riveted top cover are the works: a glowing core vial, meshed gears, twin pistons, a hydraulic ram, and live wires. They always run, faster while venting.
- 8 rounds, hitscan. 1.5 damage to the body, 4 to the head. Shots go through glass, push bodies around and alert enemies nearby. RMB aims down the sights.
- Reload (R, or firing on empty): the left hand lifts the top off, the chamber vents steam and sparks, then the top goes back on and latches.
- Inspect (F): turn the gun over to look at the side, take the top off and hold the works up while the mechanisms run, then put it back.
- On the grapple, the gun spins on your trigger finger, in view and side-on so the spin reads clearly, then drops back into your grip.

## Sling focus

- On a taut sling line, hold Space. The world slows to almost a stop, the view drains to black and white, and you hang still in the air. A bar under the crosshair counts down from 4 s.
- Let go of Space (or run out of time) and the colour comes back as you are fired at the target at full charge.

## Finisher

- The killing blow on the last enemy of the floor starts a third-person cinematic, about 3.5 s, with letterbox bars.
- Your robot body draws the sword low, the blade charges until it crackles and throws sparks, then you dash through the enemy and cut them in half at the waist. Both halves fall apart in slow motion with glowing cut faces, wires hanging out and sparks pouring from the cut. The view drops back into first person where the dash ended, looking back at the halves.

Bloodlust (the meter, streaks, Frenzy and the Q / X / V / B powers) has been removed.
