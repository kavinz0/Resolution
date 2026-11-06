# Floors 01-03 as room chains (C6)

Design: `movement-levels-doc.md` sections 3-5. Blueprint metres (x east, z south). Every room is a `ROOM_DEFS` entry; the room system (C1) runs them, and a small fallback runner keeps the floors playable until C1 is merged. Colour language: amber anchors, red sling points, cyan wall-run strips, white chevrons on flip pads and cable starts.

## Floor 01 Activation (x 4-100, z 12-76, gantry outside to x 109)

| # | Room | Kind / clear | Where | Cast | Lines and toys | Challenges |
|---|---|---|---|---|---|---|
| 1 | Cradle | breath | x 4-12, z 66-76 | none | the capsule, boot sequence unchanged | |
| 2 | Cold Lab | intro, purge | x 4-28, z 52-76 | 3 workers, 1 brawler | glass partition is the alt entry, racks | time 20, all finishers, no damage |
| 3 | Charging Bays | breath, dark | x 4-28, z 12-52 | none | Okafor line, memory fragment in the dead end, stim | |
| 4 | Armory | intro, script | x 28-60, z 12-32, pit 6 m deep | none | sword plinth grants everything, 3 amber anchors over the pit, window seal, secret tool crib behind drywall | time 18, no damage, one weapon |
| 5 | Gantry Rail | test, silence | outside, rail at +10.5 | 4 gunmen, spotter, 2 reinforcements | balcony, gondolas, cyan wall-run on the east wing facade, 2 sling points, cable from the NE davit to the breach landing | silence, no floor, time 30 |
| 6 | Breach Corridor | twist, lockdown 15 s | east wing + server room | 2 gunmen, 1 bot (optional) | breach door, corridor of drywall offices, rack wall-run, slide/vault bar, flip pad to the hall vent | time 11, no damage, all finishers |
| 7 | Desk Farm | arena, purge | the hall, 44 x 44 x 12 | 4 gunmen (1 on the catwalk), 2 brawlers | golden line: flip pad -> vent ledge -> cable across the hall; catwalk alt entry; glass pods with roofs; lift core is the exit | time 30, showoff, all finishers |

## Floor 02 Lobby Protocol (x 4-132, z -56-80)

| # | Room | Kind / clear | Where | Cast | Lines and toys |
|---|---|---|---|---|---|
| 1 | Revolving Doors | intro, purge | the bay | 2 gunmen, 1 brawler | turnstiles with a slide gap; flip pad through a ceiling hatch to the showoff ledge |
| 2 | Security Desk | test, silence | concourse | spotter in the arsenal booth, 4 gunmen, shield; reinforcements from the chief's office | the ring, sling point over it, wall-run panel; the seal is the whole gate line |
| 3 | Lobby Atrium | arena, purge, twist at half | grand lobby | 11 (shields, gunmen on bridges and mezzanines, bots) | wall-run faces on the four cores, anchors, ring, cable across; twist drops lockdown shutters that cut the floor in half |
| 4 | Mail Room | breath, secret | north annex | none | first protocol chip (Big Heads) |
| 5 | Elevator Bank | lift 0 -> +32, 22 s | shaft north of the lobby | timeline: 8 enemies on landings | sling points on the landings |
| 6 | Gatekeeper | boss | +32, 56 x 42 | Hask + adds on two +6 balconies | anchors on two pillars, exit lift |

## Floor 03 Atrium Run (x 4-110, z 4-96, 64 m tall)

| # | Room | Kind / clear | Where | Cast | Lines and toys |
|---|---|---|---|---|---|
| 1 | The Drop | intro, purge | new 30 x 30 shaft east, enter at +48 | 2 drones, 2 gunmen on glass walkways | anchors on alternating walls, two glass walkways that break; the first Gyre |
| 2 | Glass Walkways | test, purge | atrium tiers 0-16 | 3 drones, 3 gunmen | new glass span at +8, flip pad; sealed by plates on the updraft holes and a laser net at +24 |
| 3 | Art Installation | twist, purge | tiers 24-40 | 3 drones, 2 gunmen, shield | the mobile ring starts turning at half and carries your grapple with it; glass lift 24-40 |
| 4 | Glass Bridge | arena, purge (pincer) | outside the south curtain wall at +40 | 4 at the east end, 2 on a rig above the west end, a drone | 44 m glass deck, cyan wall-run fin, sling rig, flip pad up to +48; falling costs height |
| 5 | Corona | boss | top tiers +48-64 | Corona + 2 adds | exit lift at +56 |

## Notes
- Floor select lists every room; loading one resolves the rooms before it.
- Each fight room has a checkpoint flag just outside its main entry.
- Floor 01 keeps Kavin's rule: the armory grants blade, pistol, disc and the arsenal.
