# Gothicorn

A mobile-first js13kGames 2026 entry for the Unicorns and Rainbows theme.

You play a black goth unicorn who has had enough of rainbow-farting cousins leaving magical mess everywhere. Enemy attacks increase Beauty, and reaching full Beauty is defeat. Tap to fire ranged Gloom bolts, hold at close range to absorb spectrum and build VOID, then use BLACKOUT when VOID is full. Between encounters, clean up the rainbow mess to become properly drab again.

## Controls

### Mobile
- Left thumb: move.
- Tap toward a cousin: Gloom bolt.
- Hold near a cousin: close-range spectrum drain.
- Tap the VOID meter when full: BLACKOUT.
- Swipe during DRAB BREAK to clean rainbow residue.

### Desktop
- WASD or arrow keys: move.
- Mouse click: Gloom bolt.
- Hold mouse: close-range spectrum drain.
- Q or Space: BLACKOUT.

## Build

Requires Python 3.

```bash
python3 tools_build.py
```

This creates:
- dist/index.html
- Gothicorn_SUBMISSION.zip

The submission archive contains a single top-level index.html and is generated deterministically with DEFLATE compression.

## Source layout

- src/game.js: run state, camera and world coordination, progression and recovery.
- src/combat.js: targeting, attacks, enemy steering and combat resolution.
- src/input.js: touch, pointer and keyboard input.
- src/render.js: procedural Canvas visuals and animation.
- src/audio.js: procedural WebAudio music and sound effects.
- src/data.js: encounter, story and tuning data.

All gameplay art and audio are generated at runtime. The submission uses no external resources.

## Checks

```bash
python3 tests/release_checks.py
node tests/full_run_calibration.js
```
