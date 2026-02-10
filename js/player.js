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
    // Dual weapon system
    primaryWeapon: Object.assign({}, c.weapon),
    secondaryWeapon: Object.assign({}, c.secondaryWeapon),
    activeWeaponSlot: 1,
    primaryAmmo: c.weapon.mag,
    secondaryAmmo: c.secondaryWeapon.mag,
    primaryReloading: false,
    primaryReloadTimer: 0,
    secondaryReloading: false,
    secondaryReloadTimer: 0,
    weaponSwapTimer: 0,
    weaponSwapCooldown: 15,
    // Grenade system (Bulwark only)
    grenadeCount: className === 'bulwark' ? 3 : 0,
    grenadeMax: 5,
    grenadeCooldown: 0,
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

function swapWeapon(p, slot) {
  if (slot === p.activeWeaponSlot) return;
  if (p.weaponSwapTimer > 0) return;

  // Save current weapon state to the appropriate slot
  if (p.activeWeaponSlot === 1) {
    p.primaryAmmo = p.ammo;
    p.primaryReloading = p.reloading;
    p.primaryReloadTimer = p.reloadTimer;
  } else {
    p.secondaryAmmo = p.ammo;
    p.secondaryReloading = p.reloading;
    p.secondaryReloadTimer = p.reloadTimer;
  }

  // Switch to new slot
  p.activeWeaponSlot = slot;
  if (slot === 1) {
    p.weapon = Object.assign({}, p.primaryWeapon);
    p.ammo = p.primaryAmmo;
    p.reloading = p.primaryReloading;
    p.reloadTimer = p.primaryReloadTimer;
  } else {
    p.weapon = Object.assign({}, p.secondaryWeapon);
    p.ammo = p.secondaryAmmo;
    p.reloading = p.secondaryReloading;
    p.reloadTimer = p.secondaryReloadTimer;
  }

  p.fireTimer = 0;
  p.weaponSwapTimer = p.weaponSwapCooldown;
}
