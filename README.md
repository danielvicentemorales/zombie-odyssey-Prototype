# Zombie Odyssey

2D top-down zombie survival game with wave-based combat, class selection, and perk progression.

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

## Classes

| Class | Role | Weapon | Passive |
|-------|------|--------|---------|
| Bulwark | Tank | Shotgun | 25% damage reduction |
| Mender | Support | SMG | HP regen + Bio-Totems (heal & slow) |
| Rift | Assassin | Dual Pistols | Double dash |
| Warden | Sentinel | Rifle | Auto-deploy turrets |
| Shadow | Ninja | Katana | Kills reset dash cooldown |

## Features

- 5 playable classes with unique weapons and passives
- Wave-based zombie spawning with 6 enemy types (walker, runner, tank, spitter, exploder, boss)
- 15 perks to choose on level-up
- Combo system with score multiplier
- Pickup drops (health, ammo, shield, XP)
- Minimap, screen shake, particle effects

## Project Structure

```
zombie-odyssey/
├── index.html          HTML structure
├── css/styles.css      All styles
├── js/
│   ├── config.js       Game data (classes, zombies, perks)
│   ├── state.js        Shared game state
│   ├── input.js        Keyboard/mouse handling
│   ├── player.js       Player creation
│   ├── pickups.js      Item drop system
│   ├── ui.js           HUD, notifications
│   ├── perks.js        Level-up system
│   ├── combat.js       Shooting, damage, explosions
│   ├── waves.js        Wave spawning
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
