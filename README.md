# Zombie Odyssey

2D top-down zombie survival game with two modes: wave-based Endless and a Tombs of Amascut (OSRS)-inspired Odyssey dungeon crawler. Vanilla JS + Canvas.

## Play

Open `index.html` in any modern browser. No server required.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Aim & Shoot |
| R | Reload |
| Space | Dash |
| E | Interact |
| 1-4 | Class Abilities |
| ESC | Pause |

## Game Modes

### Endless
Classic wave-based survival with scaling difficulty. Kill zombies, level up, pick perks.

### Odyssey
Hub-based dungeon crawler inspired by OSRS Tombs of Amascut:

1. Spawn in **The Nexus** (hub) with 4 challenge portals + 1 locked boss portal
2. Enter any challenge room in any order
3. Complete the **pre-stage** (combat wave or puzzle)
4. Fight the room's **boss**
5. Pick a perk, return to hub
6. Clear all 4 rooms to unlock the **final boss** (The Amalgam)
7. Defeat The Amalgam, then **extract** to win

## Classes

| Class | Role | Weapon | Passive |
|-------|------|--------|---------|
| Bulwark | Tank | Shotgun | 25% damage reduction |
| Mender | Support | SMG | HP regen + Bio-Totems |
| Rift | Assassin | Dual Pistols | Double dash |
| Warden | Sentinel | Rifle | Deploy turrets |
| Shadow | Ninja | Katana | Kills reset dash cooldown |

Each class has **4 active abilities** on keys 1-4:

- **Bulwark**: Shield Bash, Fortify, War Cry, Ground Pound
- **Mender**: Bio-Totem, Heal Pulse, Poison Nova, Shield Surge
- **Rift**: Blink, Overcharge, Static Field, Phase Shift
- **Warden**: Deploy Turret, Scan Pulse, EMP Blast, Barricade
- **Shadow**: Smoke Bomb, Blade Fury, Shadow Clone, Execute

## Bosses

| Boss | Room | Attacks |
|------|------|---------|
| Ba-Ba, The Brute | The Breach | Ground Slam, Boulder Toss, Falling Rocks |
| Kephri, The Plague | Contamination Zone | Toxic Burst, Spawn Swarm, Plague Cloud |
| Akkha, The Warden | The Lockdown | Shadow Orbs, Detonate, Mirror Dash |
| The Overseer | Horde Corridor | Laser Sweep, Summon Guards, Gravity Well |
| The Amalgam | Final Boss | Blood Wave, Acid Pool, Boulder Roll, Enraged Roar |

## Features

- 5 playable classes with unique weapons, passives, and 4 abilities each
- 2 game modes: Endless waves and Odyssey dungeon crawler
- 5 bosses with multi-phase AI, telegraphed attacks, and custom rendering
- Room staging system: pre-stage challenge then boss fight
- Hub room with portal navigation
- 6 enemy types (walker, runner, tank, spitter, exploder, boss)
- Hazard system: blood waves, acid pools, boulders, bombs, gravity wells, lasers
- 15 perks to choose on level-up
- Combo system with score multiplier
- Pickup drops (health, ammo, shield, XP)
- Minimap, screen shake, particle effects, pause system

## Project Structure

```
zombie-odyssey/
├── index.html          HTML structure + screens
├── css/styles.css      All styles
├── js/
│   ├── config.js       Game data (classes, zombies, perks, abilities)
│   ├── state.js        Shared game state
│   ├── input.js        Keyboard/mouse handling
│   ├── player.js       Player creation
│   ├── pickups.js      Item drop system
│   ├── ui.js           HUD, notifications, banners, transitions
│   ├── perks.js        Level-up system
│   ├── combat.js       Shooting, damage, explosions, abilities
│   ├── boss.js         Boss AI, telegraphs, attacks, HP bar
│   ├── rooms.js        Room definitions, hub, wall collision, staging
│   ├── hazards.js      Hazards, interactables, puzzle, extraction
│   ├── waves.js        Wave spawning (Endless mode)
│   ├── renderer.js     Canvas rendering + minimap
│   └── main.js         Game loop, initialization
└── assets/
    ├── sprites/        (future)
    └── sounds/         (future)
```

## Roadmap

Migrating to a full-stack multiplayer architecture:

- **TypeScript** - Type safety
- **Phaser 3** - 2D game engine
- **React 18** - UI overlays (menus, HUD, shop, lobby)
- **Zustand** - State management (game engine <-> UI bridge)
- **Colyseus** - Multiplayer server (WebSocket rooms, state sync)
- **Vite** - Bundler
- **Node.js + Express** - Backend

Target architecture: monorepo with `client/`, `server/`, `shared/` packages.

## License

MIT
