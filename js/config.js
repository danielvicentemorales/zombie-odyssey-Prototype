// ============================================================
// ZOMBIE COMP ODYSSEY - Game Configuration & Data
// ============================================================

var WORLD_W = 3000;
var WORLD_H = 3000;

// ===== CHARACTER CLASSES =====
var CLASSES = {
  marine: {
    hp: 100, speed: 3.2, dashCd: 2, dashDist: 150,
    weapon: { name: 'ASSAULT RIFLE', damage: 12, fireRate: 80, spread: 0.06, mag: 30, reload: 1.5, auto: true, bulletSpeed: 14 },
    color: '#44aa44', passive: 'Fast reload (-30%)'
  },
  medic: {
    hp: 120, speed: 2.8, dashCd: 3, dashDist: 120,
    weapon: { name: 'SMG', damage: 8, fireRate: 60, spread: 0.1, mag: 40, reload: 1.2, auto: true, bulletSpeed: 12 },
    color: '#44aaff', passive: 'Regen 1 HP/sec'
  },
  berserker: {
    hp: 150, speed: 2.5, dashCd: 2.5, dashDist: 180,
    weapon: { name: 'SHOTGUN', damage: 8, fireRate: 500, spread: 0.2, mag: 6, reload: 2, auto: false, bulletSpeed: 16, pellets: 6 },
    color: '#ff4444', passive: 'Lifesteal: +5 HP per kill'
  },
  scout: {
    hp: 70, speed: 4.5, dashCd: 1, dashDist: 200,
    weapon: { name: 'DUAL PISTOLS', damage: 14, fireRate: 120, spread: 0.04, mag: 24, reload: 1, auto: true, bulletSpeed: 16 },
    color: '#ffaa00', passive: 'Double dash'
  },
  engineer: {
    hp: 100, speed: 2.8, dashCd: 3, dashDist: 120,
    weapon: { name: 'RIFLE', damage: 18, fireRate: 250, spread: 0.02, mag: 15, reload: 2, auto: false, bulletSpeed: 18 },
    color: '#aa44ff', passive: 'Deploy turret every 20s'
  },
  pyro: {
    hp: 80, speed: 3.5, dashCd: 2, dashDist: 140,
    weapon: { name: 'FLAMETHROWER', damage: 4, fireRate: 30, spread: 0.3, mag: 100, reload: 2.5, auto: true, bulletSpeed: 8, flame: true },
    color: '#ff6600', passive: 'Burn: enemies take DOT'
  }
};

// ===== ZOMBIE TYPES =====
var ZOMBIE_TYPES = {
  walker:   { hp: 30,  speed: 1,   damage: 8,  radius: 12, color: '#556b2f', xp: 10,  score: 50 },
  runner:   { hp: 20,  speed: 2.5, damage: 6,  radius: 10, color: '#8b4513', xp: 15,  score: 75 },
  tank:     { hp: 120, speed: 0.6, damage: 20, radius: 20, color: '#4a0e0e', xp: 30,  score: 150 },
  spitter:  { hp: 25,  speed: 1.2, damage: 5,  radius: 11, color: '#2e8b57', xp: 20,  score: 100, ranged: true },
  exploder: { hp: 40,  speed: 1.8, damage: 30, radius: 14, color: '#8b0000', xp: 25,  score: 120, explodes: true },
  boss:     { hp: 500, speed: 0.8, damage: 35, radius: 30, color: '#1a001a', xp: 100, score: 500, boss: true }
};

// ===== PERKS =====
var ALL_PERKS = [
  { icon: '❤️', name: 'VITALITY',       desc: '+25 Max HP',                    apply: function(p) { p.maxHp += 25; p.hp = Math.min(p.hp + 25, p.maxHp); }},
  { icon: '🛡️', name: 'ARMOR',          desc: '+15 Shield',                    apply: function(p) { p.maxShield += 15; p.shield = Math.min(p.shield + 15, p.maxShield); }},
  { icon: '⚔️', name: 'DAMAGE+',        desc: '+20% Damage',                   apply: function(p) { p.damageMulti *= 1.2; }},
  { icon: '🔫', name: 'RAPID FIRE',     desc: '+15% Fire Rate',                apply: function(p) { p.fireRateMulti *= 0.85; }},
  { icon: '💨', name: 'VELOCITY',       desc: '+15% Move Speed',               apply: function(p) { p.speed *= 1.15; }},
  { icon: '🎯', name: 'PRECISION',      desc: '-40% Spread',                   apply: function(p) { p.spreadMulti *= 0.6; }},
  { icon: '💀', name: 'PIERCING',       desc: 'Bullets pierce 1 extra',        apply: function(p) { p.pierce += 1; }},
  { icon: '🔥', name: 'INCENDIARY',     desc: 'Bullets ignite enemies',        apply: function(p) { p.incendiary = true; }},
  { icon: '❄️', name: 'CRYO',           desc: 'Bullets slow enemies 30%',      apply: function(p) { p.cryo = true; }},
  { icon: '⚡', name: 'CHAIN LIGHTNING', desc: '25% chance to chain hit',       apply: function(p) { p.chain = true; }},
  { icon: '🧲', name: 'MAGNET',         desc: 'Pickups attracted from far',    apply: function(p) { p.magnetRange *= 2; }},
  { icon: '💎', name: 'LUCKY',          desc: '+50% drop chance',              apply: function(p) { p.luckMulti *= 1.5; }},
  { icon: '🔄', name: 'QUICK RELOAD',   desc: '-30% Reload time',              apply: function(p) { p.reloadMulti *= 0.7; }},
  { icon: '💥', name: 'EXPLOSIVE',      desc: 'Kills have 20% explode chance', apply: function(p) { p.explosive = true; }},
  { icon: '🩸', name: 'VAMPIRIC',       desc: '+3 HP per kill',                apply: function(p) { p.lifesteal += 3; }},
];
