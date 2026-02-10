// ============================================================
// ZOMBIE COMP ODYSSEY - Player Creation
// ============================================================

function createPlayer(className) {
  var c = CLASSES[className];
  return {
    x: WORLD_W / 2, y: WORLD_H / 2,
    vx: 0, vy: 0,
    radius: 14,
    hp: c.hp, maxHp: c.hp,
    shield: 0, maxShield: 20,
    speed: c.speed,
    className: className,
    classData: c,
    color: c.color,
    weapon: Object.assign({}, c.weapon),
    ammo: c.weapon.mag,
    reloading: false,
    reloadTimer: 0,
    fireTimer: 0,
    angle: 0,
    dashCd: 0,
    dashTimer: 0,
    dashing: false,
    dashVx: 0, dashVy: 0,
    level: 1,
    xp: 0,
    xpToNext: 50,
    damageMulti: 1,
    fireRateMulti: 1,
    spreadMulti: 1,
    reloadMulti: 1,
    pierce: 0,
    incendiary: false,
    cryo: false,
    chain: false,
    explosive: false,
    lifesteal: 0,
    magnetRange: 80,
    luckMulti: 1,
    critChance: 0.15,
    damageReduction: c.damageReduction || 0,
    turretTimer: 0,
    totemTimer: 0,
    invincible: 0,
    perks: [],
    kills: 0,
    // Ability system
    abilities: (function() {
      var defs = CLASS_ABILITIES[className];
      var arr = [];
      for (var ai = 0; ai < defs.length; ai++) {
        arr.push({ name: defs[ai].name, desc: defs[ai].desc, cd: defs[ai].cd, cdTimer: 0 });
      }
      return arr;
    })(),
    fortifyTimer: 0,
    overchargeTimer: 0,
    scanTimer: 0
  };
}
