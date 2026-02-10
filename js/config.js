// ============================================================
// ZOMBIE COMP ODYSSEY - Game Configuration & Data
// ============================================================

var WORLD_W = 3000;
var WORLD_H = 3000;

// ===== CHARACTER CLASSES =====
var CLASSES = {
  bulwark: {
    hp: 180, speed: 2.2, dashCd: 3, dashDist: 100,
    weapon: { name: 'SHOTGUN', damage: 10, fireRate: 160, spread: 0.22, mag: 8, reload: 2.2, auto: true, bulletSpeed: 14, pellets: 5 },
    color: '#cc4444', passive: 'Damage reduction: -25%',
    damageReduction: 0.25
  },
  mender: {
    hp: 110, speed: 3.0, dashCd: 2.5, dashDist: 130,
    weapon: { name: 'SMG', damage: 7, fireRate: 55, spread: 0.1, mag: 35, reload: 1.3, auto: true, bulletSpeed: 12 },
    color: '#44cc88', passive: 'Regen 1 HP/sec + Bio-Totems'
  },
  rift: {
    hp: 75, speed: 4.2, dashCd: 1, dashDist: 200,
    weapon: { name: 'DUAL PISTOLS', damage: 13, fireRate: 100, spread: 0.05, mag: 24, reload: 1.0, auto: true, bulletSpeed: 16 },
    color: '#cc66ff', passive: 'Double dash'
  },
  warden: {
    hp: 100, speed: 2.8, dashCd: 3, dashDist: 120,
    weapon: { name: 'RIFLE', damage: 20, fireRate: 280, spread: 0.02, mag: 12, reload: 2.0, auto: false, bulletSpeed: 18 },
    color: '#ffaa44', passive: 'Deploy turret every 20s'
  },
  shadow: {
    hp: 85, speed: 3.8, dashCd: 1.5, dashDist: 170,
    weapon: { name: 'KATANA', damage: 22, fireRate: 20, spread: 0.4, mag: 999, reload: 0.1, auto: true, bulletSpeed: 10, slash: true, pellets: 3 },
    color: '#6644aa', passive: 'Kills reset dash cooldown'
  }
};

// ===== ZOMBIE TYPES =====
var ZOMBIE_TYPES = {
  walker:   { hp: 30,  speed: 1,   damage: 8,  radius: 12, color: '#556b2f', xp: 10,  score: 50 },
  runner:   { hp: 18,  speed: 2.0, damage: 6,  radius: 10, color: '#8b4513', xp: 15,  score: 75 },
  tank:     { hp: 120, speed: 0.6, damage: 20, radius: 20, color: '#4a0e0e', xp: 30,  score: 150 },
  spitter:  { hp: 25,  speed: 1.2, damage: 5,  radius: 11, color: '#2e8b57', xp: 20,  score: 100, ranged: true },
  exploder: { hp: 40,  speed: 1.8, damage: 30, radius: 14, color: '#8b0000', xp: 25,  score: 120, explodes: true },
  boss:     { hp: 500, speed: 0.8, damage: 35, radius: 30, color: '#1a001a', xp: 100, score: 500, boss: true }
};

// ===== SPITTER PATTERNS =====
var SPITTER_PATTERNS = {
  spread:       { bulletCount: 3, spreadAngle: 0.4, speed: 4.5, damageMulti: 0.5, cooldown: 100, life: 55 },
  burst:        { bulletCount: 3, burstDelay: 8, speed: 5.5, jitter: 0.08, damageMulti: 0.4, cooldown: 130, life: 50 },
  aimed_double: { bulletCount: 2, speed: 5, leadFactor: 0.3, damageMulti: 0.6, cooldown: 110, life: 55 }
};

// ===== PERKS =====
var ALL_PERKS = [
  { icon: '❤️', name: 'VITALITY',       desc: '+25 Max HP',                    apply: function(p) { p.maxHp += 25; p.hp = Math.min(p.hp + 25, p.maxHp); }},
  { icon: '🛡️', name: 'ARMOR',          desc: '+15 Shield',                    apply: function(p) { p.maxShield += 15; p.shield = Math.min(p.shield + 15, p.maxShield); }},
  { icon: '⚔️', name: 'DAMAGE+',        desc: '+20% Damage',                   apply: function(p) { p.damageMulti *= 1.2; }},
  { icon: '🔫', name: 'RAPID FIRE',     desc: '+15% Fire Rate',                apply: function(p) { p.fireRateMulti *= 0.85; }},
  { icon: '💨', name: 'VELOCITY',       desc: '+15% Move Speed',               apply: function(p) { p.speed *= 1.15; }},
  { icon: '🎯', name: 'DEAD EYE',       desc: '+15% Crit Chance',              apply: function(p) { p.critChance = (p.critChance || 0.15) + 0.15; }},
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

// ===== CLASS ABILITIES (keys 1-4) =====
var CLASS_ABILITIES = {
  bulwark: [
    { name: 'SHIELD BASH', desc: 'AoE knockback + stun', cd: 600 },
    { name: 'FORTIFY', desc: '50% DR for 4s', cd: 1080 },
    { name: 'WAR CRY', desc: 'Heal 25 + stun nearby', cd: 1200 },
    { name: 'GROUND POUND', desc: 'AoE 40 damage', cd: 1500 }
  ],
  mender: [
    { name: 'BIO-TOTEM', desc: 'Deploy heal totem', cd: 1200 },
    { name: 'HEAL PULSE', desc: 'Instant +30 HP', cd: 840 },
    { name: 'POISON NOVA', desc: 'Burn nearby enemies', cd: 960 },
    { name: 'SHIELD SURGE', desc: '+25 shield', cd: 1200 }
  ],
  rift: [
    { name: 'BLINK', desc: 'Teleport forward', cd: 420 },
    { name: 'OVERCHARGE', desc: '2x fire rate 4s', cd: 900 },
    { name: 'STATIC FIELD', desc: 'Stun nearby 2s', cd: 1080 },
    { name: 'PHASE SHIFT', desc: 'Invincible 2s', cd: 1200 }
  ],
  warden: [
    { name: 'DEPLOY TURRET', desc: 'Place auto-turret', cd: 1320 },
    { name: 'SCAN PULSE', desc: '+30% damage 5s', cd: 960 },
    { name: 'EMP BLAST', desc: 'AoE stun + damage', cd: 840 },
    { name: 'BARRICADE', desc: 'Place temp wall 8s', cd: 1200 }
  ],
  shadow: [
    { name: 'SMOKE BOMB', desc: 'AoE slow + invuln', cd: 720 },
    { name: 'BLADE FURY', desc: '360 slash damage', cd: 600 },
    { name: 'SHADOW CLONE', desc: 'Decoy draws aggro', cd: 1080 },
    { name: 'EXECUTE', desc: 'Dash to enemy + kill', cd: 840 }
  ]
};
