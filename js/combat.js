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

  for (var i = 0; i < pellets; i++) {
    var spread = (Math.random() - 0.5) * player.weapon.spread * 2 * player.spreadMulti;
    var angle = player.angle + spread;

    bullets.push({
      x: player.x + Math.cos(player.angle) * 20,
      y: player.y + Math.sin(player.angle) * 20,
      vx: Math.cos(angle) * player.weapon.bulletSpeed,
      vy: Math.sin(angle) * player.weapon.bulletSpeed,
      damage: Math.floor(player.weapon.damage * player.damageMulti),
      pierce: player.pierce,
      life: isFlame ? 15 : 60,
      isFlame: isFlame,
      owner: 'player'
    });
  }

  player.ammo--;
  player.fireTimer = player.weapon.fireRate * player.fireRateMulti;
  screenShake = Math.max(screenShake, isFlame ? 1 : 3);

  // Muzzle flash particles
  for (var j = 0; j < 3; j++) {
    particles.push({
      x: player.x + Math.cos(player.angle) * 22,
      y: player.y + Math.sin(player.angle) * 22,
      vx: Math.cos(player.angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 4),
      vy: Math.sin(player.angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 4),
      life: 8,
      maxLife: 8,
      color: isFlame ? '#ff6600' : '#ffff44',
      size: isFlame ? 4 : 2
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

  var dmg = amount;
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

  var crit = Math.random() < 0.15;
  var finalDmg = crit ? Math.floor(dmg * 2) : dmg;
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
  if (player.lifesteal > 0 || player.className === 'berserker') {
    var heal = player.lifesteal + (player.className === 'berserker' ? 5 : 0);
    player.hp = Math.min(player.hp + heal, player.maxHp);
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
