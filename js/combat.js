// ============================================================
// ZOMBIE COMP ODYSSEY - Combat System
// ============================================================

function findNearest(from, list, range) {
  var best = null, bestDist = range;
  list.forEach(function(e) {
    var d = Math.hypot(e.x - from.x, e.y - from.y);
    if (d < bestDist) { best = e; bestDist = d; }
  });
  return best;
}

// ===== SHOOTING =====

function shoot() {
  if (!player || player.reloading || player.ammo <= 0) return;
  if (player.fireTimer > 0) return;

  var pellets = player.weapon.pellets || 1;
  var isFlame = player.weapon.flame || false;
  var isSlash = player.weapon.slash || false;

  for (var i = 0; i < pellets; i++) {
    var spread = (Math.random() - 0.5) * player.weapon.spread * 2 * player.spreadMulti;
    var angle = player.angle + spread;

    bullets.push({
      x: player.x + Math.cos(player.angle) * 20,
      y: player.y + Math.sin(player.angle) * 20,
      vx: Math.cos(angle) * player.weapon.bulletSpeed,
      vy: Math.sin(angle) * player.weapon.bulletSpeed,
      damage: Math.floor(player.weapon.damage * player.damageMulti),
      pierce: isSlash ? player.pierce + 3 : player.pierce,
      life: isFlame ? 15 : (isSlash ? 8 : 60),
      isFlame: isFlame,
      isSlash: isSlash,
      slashAngle: angle,
      owner: 'player'
    });
  }

  player.ammo--;
  var frMulti = player.fireRateMulti * (player.overchargeTimer > 0 ? 0.5 : 1);
  player.fireTimer = player.weapon.fireRate * frMulti;
  screenShake = Math.max(screenShake, isFlame ? 1 : (isSlash ? 2 : 3));

  // Muzzle flash / slash trail particles
  var flashColor = isSlash ? '#bb88ff' : (isFlame ? '#ff6600' : '#ffff44');
  for (var j = 0; j < (isSlash ? 5 : 3); j++) {
    particles.push({
      x: player.x + Math.cos(player.angle) * 22,
      y: player.y + Math.sin(player.angle) * 22,
      vx: Math.cos(player.angle + (Math.random() - 0.5) * (isSlash ? 1.2 : 0.5)) * (3 + Math.random() * 4),
      vy: Math.sin(player.angle + (Math.random() - 0.5) * (isSlash ? 1.2 : 0.5)) * (3 + Math.random() * 4),
      life: isSlash ? 10 : 8,
      maxLife: isSlash ? 10 : 8,
      color: flashColor,
      size: isSlash ? 3 : (isFlame ? 4 : 2)
    });
  }

  if (player.ammo <= 0) reloadWeapon();
}

function reloadWeapon() {
  if (player.reloading) return;
  player.reloading = true;
  player.reloadTimer = player.weapon.reload * player.reloadMulti * 60;
}

// ===== DAMAGE =====

function damagePlayer(amount) {
  if (player.invincible > 0) return;

  var dr = player.damageReduction + (player.fortifyTimer > 0 ? 0.5 : 0);
  var dmg = Math.floor(amount * (1 - Math.min(dr, 0.8)));
  if (player.shield > 0) {
    var absorbed = Math.min(player.shield, dmg);
    player.shield -= absorbed;
    dmg -= absorbed;
  }

  player.hp -= dmg;
  player.invincible = 15;
  screenShake = Math.max(screenShake, 8);

  var flash = document.getElementById('screen-flash');
  flash.classList.add('hit');
  setTimeout(function() { flash.classList.remove('hit'); }, 150);

  if (player.hp <= 0) {
    gameOver();
  }
}

function damageZombie(zombie, dmg, bullet) {
  if (zombie.dead) return false;

  // Boss invulnerability check
  if (zombie === bossEntity && bossEntity && bossEntity.invulnTimer > 0) return false;

  var scanBonus = player.scanTimer > 0 ? 1.3 : 1;
  var crit = Math.random() < player.critChance;
  var finalDmg = crit ? Math.floor(dmg * 2 * scanBonus) : Math.floor(dmg * scanBonus);
  zombie.hp -= finalDmg;

  // Knockback
  if (bullet) {
    var angle = Math.atan2(bullet.vy, bullet.vx);
    zombie.kbx = Math.cos(angle) * 5;
    zombie.kby = Math.sin(angle) * 5;
    zombie.knockback = 5;
  }

  // Status effects
  if (player.incendiary) zombie.burning = 180;
  if (player.cryo) zombie.slowed = 120;

  // Damage number
  showDamageNumber(zombie.x, zombie.y - zombie.radius, finalDmg, crit);

  // Blood particles
  for (var i = 0; i < 4; i++) {
    particles.push({
      x: zombie.x, y: zombie.y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 20 + Math.random() * 20,
      maxLife: 40,
      color: '#8B0000',
      size: 2 + Math.random() * 2
    });
  }

  if (zombie.hp <= 0) {
    killZombie(zombie);
    return true;
  }
  return false;
}

// ===== KILLS =====

function killZombie(zombie) {
  if (zombie.dead) return;
  zombie.dead = true;

  // Mark boss as dead for room system
  if (zombie === bossEntity) {
    bossEntity.dead = true;
  }

  // XP & Score
  player.xp += zombie.xp;
  score += zombie.score * (1 + combo * 0.1);
  kills++;
  player.kills++;
  if (zombiesRemaining > 0) zombiesRemaining--;

  // Combo
  combo++;
  comboTimer = 120;

  // Lifesteal
  if (player.lifesteal > 0) {
    player.hp = Math.min(player.hp + player.lifesteal, player.maxHp);
  }

  // Shadow passive: kills reset dash cooldown
  if (player.className === 'shadow') {
    player.dashCd = 0;
  }

  // Explosive perk
  if (player.explosive && Math.random() < 0.2) {
    createExplosion(zombie.x, zombie.y, 60, 30);
  }

  // Chain lightning
  if (player.chain && Math.random() < 0.25) {
    var nearest = findNearest(zombie, zombies.filter(function(z) { return z !== zombie && !z.dead; }), 120);
    if (nearest) {
      damageZombie(nearest, Math.floor(player.weapon.damage * player.damageMulti * 0.5));
      particles.push({
        x: zombie.x, y: zombie.y,
        tx: nearest.x, ty: nearest.y,
        life: 8, maxLife: 8,
        lightning: true
      });
    }
  }

  // Exploder zombies
  if (zombie.explodes) {
    createExplosion(zombie.x, zombie.y, 80, zombie.damage);
  }

  // Blood splat
  bloodSplats.push({
    x: zombie.x, y: zombie.y,
    radius: zombie.radius * 2 + Math.random() * 10,
    alpha: 0.4
  });

  // Death particles
  for (var i = 0; i < 12; i++) {
    var angle = (i / 12) * Math.PI * 2;
    particles.push({
      x: zombie.x, y: zombie.y,
      vx: Math.cos(angle) * (2 + Math.random() * 4),
      vy: Math.sin(angle) * (2 + Math.random() * 4),
      life: 30 + Math.random() * 30,
      maxLife: 60,
      color: zombie.color,
      size: 3 + Math.random() * 3
    });
  }

  // Drop pickup
  spawnPickup(zombie.x, zombie.y, player.luckMulti);

  // Check level up
  checkLevelUp();
}

// ===== EXPLOSIONS =====

// ===== ABILITIES =====

function executeAbility(abilityIndex) {
  if (!player || !player.abilities[abilityIndex]) return;
  var ability = player.abilities[abilityIndex];
  if (ability.cdTimer > 0) return;

  ability.cdTimer = ability.cd;

  switch (ability.name) {
    // ===== BULWARK =====
    case 'SHIELD BASH':
      var bashRadius = 100;
      screenShake = 6;
      zombies.forEach(function(z) {
        if (z.dead) return;
        var d = Math.hypot(z.x - player.x, z.y - player.y);
        if (d < bashRadius) {
          var a = Math.atan2(z.y - player.y, z.x - player.x);
          z.kbx = Math.cos(a) * 12;
          z.kby = Math.sin(a) * 12;
          z.knockback = 10;
          z.stunned = 90;
        }
      });
      explosions.push({ x: player.x, y: player.y, radius: bashRadius, life: 15, maxLife: 15 });
      showNotification('SHIELD BASH!');
      break;

    case 'FORTIFY':
      player.fortifyTimer = 240;
      for (var fi = 0; fi < 12; fi++) {
        var fa = (fi / 12) * Math.PI * 2;
        particles.push({
          x: player.x + Math.cos(fa) * 25, y: player.y + Math.sin(fa) * 25,
          vx: Math.cos(fa) * 1, vy: Math.sin(fa) * 1,
          life: 30, maxLife: 30, color: '#cc4444', size: 4
        });
      }
      showNotification('FORTIFY! 50% DR');
      break;

    case 'WAR CRY':
      player.hp = Math.min(player.hp + 25, player.maxHp);
      var cryRadius = 150;
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < cryRadius) {
          z.stunned = 120;
        }
      });
      screenShake = 5;
      showNotification('WAR CRY! +25 HP');
      break;

    case 'GROUND POUND':
      createExplosion(player.x, player.y, 120, 40);
      showNotification('GROUND POUND!');
      break;

    // ===== MENDER =====
    case 'BIO-TOTEM':
      totems.push({
        x: player.x, y: player.y,
        life: 600, healRange: 100, slowRange: 80
      });
      showNotification('BIO-TOTEM DEPLOYED');
      break;

    case 'HEAL PULSE':
      player.hp = Math.min(player.hp + 30, player.maxHp);
      for (var hp = 0; hp < 10; hp++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 30,
          y: player.y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 2, vy: -2 - Math.random() * 2,
          life: 20, maxLife: 20, color: '#44cc88', size: 3
        });
      }
      showNotification('+30 HP');
      break;

    case 'POISON NOVA':
      var novaRadius = 130;
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < novaRadius) {
          z.burning = 240;
        }
      });
      for (var pn = 0; pn < 16; pn++) {
        var pnA = (pn / 16) * Math.PI * 2;
        particles.push({
          x: player.x, y: player.y,
          vx: Math.cos(pnA) * 5, vy: Math.sin(pnA) * 5,
          life: 20, maxLife: 20, color: '#44cc88', size: 4
        });
      }
      screenShake = 3;
      showNotification('POISON NOVA!');
      break;

    case 'SHIELD SURGE':
      player.shield = Math.min(player.shield + 25, player.maxShield);
      showNotification('+25 SHIELD');
      break;

    // ===== RIFT =====
    case 'BLINK':
      var blinkDist = 200;
      var bAngle = player.angle;
      var oldX = player.x, oldY = player.y;
      player.x += Math.cos(bAngle) * blinkDist;
      player.y += Math.sin(bAngle) * blinkDist;
      player.x = Math.max(player.radius, Math.min(WORLD_W - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(WORLD_H - player.radius, player.y));
      var blinkRes = resolveWallCollisions(player.x, player.y, player.radius);
      player.x = blinkRes.x;
      player.y = blinkRes.y;
      for (var bt = 0; bt < 12; bt++) {
        var t = bt / 12;
        particles.push({
          x: oldX + (player.x - oldX) * t, y: oldY + (player.y - oldY) * t,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          life: 15, maxLife: 15, color: '#cc66ff', size: 3
        });
      }
      player.invincible = Math.max(player.invincible, 10);
      showNotification('BLINK!');
      break;

    case 'OVERCHARGE':
      player.overchargeTimer = 240;
      showNotification('OVERCHARGE! 2x FIRE RATE');
      break;

    case 'STATIC FIELD':
      var sfRadius = 120;
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < sfRadius) {
          z.stunned = 120;
          damageZombie(z, 10);
        }
      });
      for (var sf = 0; sf < 16; sf++) {
        var sfA = (sf / 16) * Math.PI * 2;
        particles.push({
          x: player.x + Math.cos(sfA) * sfRadius * 0.5,
          y: player.y + Math.sin(sfA) * sfRadius * 0.5,
          vx: Math.cos(sfA) * 3, vy: Math.sin(sfA) * 3,
          life: 15, maxLife: 15, color: '#88ccff', size: 3
        });
      }
      screenShake = 4;
      showNotification('STATIC FIELD!');
      break;

    case 'PHASE SHIFT':
      player.invincible = 120;
      for (var ps = 0; ps < 10; ps++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 20,
          y: player.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
          life: 25, maxLife: 25, color: '#cc66ff', size: 4
        });
      }
      showNotification('PHASE SHIFT! INVINCIBLE');
      break;

    // ===== WARDEN =====
    case 'DEPLOY TURRET':
      turrets.push({
        x: player.x, y: player.y,
        hp: 80, fireRate: 30, fireTimer: 0,
        life: 600, damage: 8, range: 200
      });
      showNotification('TURRET DEPLOYED');
      break;

    case 'SCAN PULSE':
      player.scanTimer = 300;
      for (var sc = 0; sc < 20; sc++) {
        var scA = (sc / 20) * Math.PI * 2;
        particles.push({
          x: player.x, y: player.y,
          vx: Math.cos(scA) * 6, vy: Math.sin(scA) * 6,
          life: 20, maxLife: 20, color: '#ffaa44', size: 2
        });
      }
      showNotification('SCAN PULSE! +30% DMG');
      break;

    case 'EMP BLAST':
      var empRadius = 140;
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < empRadius) {
          z.stunned = 120;
          damageZombie(z, 15);
        }
      });
      explosions.push({ x: player.x, y: player.y, radius: empRadius, life: 15, maxLife: 15 });
      screenShake = 5;
      showNotification('EMP BLAST!');
      break;

    case 'BARRICADE':
      var wallAngle = player.angle;
      var wallX = player.x + Math.cos(wallAngle) * 60 - 50;
      var wallY = player.y + Math.sin(wallAngle) * 60 - 15;
      roomWalls.push({
        x: wallX, y: wallY, w: 100, h: 30,
        temporary: true, life: 480
      });
      showNotification('BARRICADE PLACED');
      break;

    // ===== SHADOW =====
    case 'SMOKE BOMB':
      player.invincible = Math.max(player.invincible, 90);
      var smokeRadius = 100;
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < smokeRadius) {
          z.slowed = 180;
        }
      });
      for (var sm = 0; sm < 20; sm++) {
        var smA = Math.random() * Math.PI * 2;
        var smR = Math.random() * smokeRadius;
        particles.push({
          x: player.x + Math.cos(smA) * smR,
          y: player.y + Math.sin(smA) * smR,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          life: 40, maxLife: 40, color: '#555555', size: 6
        });
      }
      showNotification('SMOKE BOMB!');
      break;

    case 'BLADE FURY':
      var furyRadius = 100;
      var furyDmg = Math.floor(player.weapon.damage * player.damageMulti * 1.5);
      zombies.forEach(function(z) {
        if (z.dead) return;
        if (Math.hypot(z.x - player.x, z.y - player.y) < furyRadius) {
          damageZombie(z, furyDmg);
        }
      });
      for (var bf = 0; bf < 16; bf++) {
        var bfA = (bf / 16) * Math.PI * 2;
        particles.push({
          x: player.x + Math.cos(bfA) * furyRadius * 0.5,
          y: player.y + Math.sin(bfA) * furyRadius * 0.5,
          vx: Math.cos(bfA) * 5, vy: Math.sin(bfA) * 5,
          life: 15, maxLife: 15, color: '#bb88ff', size: 4
        });
      }
      screenShake = 4;
      showNotification('BLADE FURY!');
      break;

    case 'SHADOW CLONE':
      shadowClone = {
        x: player.x, y: player.y,
        life: 360, radius: 14,
        color: 'rgba(102,68,170,0.5)'
      };
      showNotification('SHADOW CLONE!');
      break;

    case 'EXECUTE':
      var execTarget = findNearest(player, zombies.filter(function(z) { return !z.dead; }), 300);
      if (execTarget) {
        player.x = execTarget.x + 30;
        player.y = execTarget.y;
        var execRes = resolveWallCollisions(player.x, player.y, player.radius);
        player.x = execRes.x;
        player.y = execRes.y;
        player.invincible = Math.max(player.invincible, 15);
        if (execTarget.hp <= execTarget.maxHp * 0.5 && !execTarget.boss) {
          killZombie(execTarget);
        } else {
          damageZombie(execTarget, Math.floor(player.weapon.damage * player.damageMulti * 3));
        }
        screenShake = 5;
        for (var ex = 0; ex < 8; ex++) {
          particles.push({
            x: execTarget.x, y: execTarget.y,
            vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
            life: 15, maxLife: 15, color: '#6644aa', size: 4
          });
        }
        showNotification('EXECUTE!');
      } else {
        ability.cdTimer = 0;
        showNotification('NO TARGET!');
      }
      break;
  }
}

// ===== EXPLOSIONS =====

function createExplosion(x, y, radius, damage) {
  explosions.push({ x: x, y: y, radius: radius, life: 15, maxLife: 15 });
  screenShake = Math.max(screenShake, 10);

  zombies.forEach(function(z) {
    if (z.dead) return;
    var dist = Math.hypot(z.x - x, z.y - y);
    if (dist < radius) {
      damageZombie(z, damage);
    }
  });

  for (var i = 0; i < 20; i++) {
    var angle = Math.random() * Math.PI * 2;
    var spd = 2 + Math.random() * 6;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 20 + Math.random() * 30,
      maxLife: 50,
      color: Math.random() < 0.5 ? '#ff6600' : '#ffcc00',
      size: 3 + Math.random() * 4
    });
  }
}
