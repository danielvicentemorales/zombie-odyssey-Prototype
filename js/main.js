// ============================================================
// ZOMBIE COMP ODYSSEY - Main Entry Point & Game Loop
// ============================================================

// ===== CANVAS SETUP =====
canvas = document.getElementById('game');
ctx = canvas.getContext('2d');
minimap = document.getElementById('minimap');
minimapCtx = minimap.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  minimap.width = 140;
  minimap.height = 140;
}
resize();
window.addEventListener('resize', resize);

// ===== START GAME =====
function startGame(className) {
  document.getElementById('class-screen').classList.remove('active');
  document.getElementById('game-hud').classList.add('active');
  document.getElementById('minimap').classList.add('active');

  player = createPlayer(className);
  zombies = [];
  bullets = [];
  particles = [];
  pickups = [];
  turrets = [];
  explosions = [];
  damageNumbers = [];
  bloodSplats = [];
  wave = 0;
  score = 0;
  kills = 0;
  combo = 0;
  comboTimer = 0;

  gameRunning = true;
  startWave();
  gameLoop();
}

// ===== GAME OVER =====
function gameOver() {
  gameRunning = false;
  document.getElementById('go-wave').textContent = wave;
  document.getElementById('go-kills').textContent = kills;
  document.getElementById('go-score').textContent = Math.floor(score);
  document.getElementById('go-level').textContent = player.level;
  document.getElementById('gameover-screen').classList.add('active');
}

// ===== UPDATE =====
function update() {
  if (!gameRunning || gamePaused) return;

  // -- Wave management --
  if (waveCooldown > 0) {
    waveCooldown--;
    if (waveCooldown === 0) spawnWaveZombies();
  }

  if (waveCooldown <= 0 && zombiesRemaining <= 0 && zombies.length === 0) {
    startWave();
  }

  // -- Player movement --
  var mx = 0, my = 0;
  if (keys['w'] || keys['arrowup']) my -= 1;
  if (keys['s'] || keys['arrowdown']) my += 1;
  if (keys['a'] || keys['arrowleft']) mx -= 1;
  if (keys['d'] || keys['arrowright']) mx += 1;

  if (mx || my) {
    var len = Math.hypot(mx, my);
    mx /= len; my /= len;
  }

  if (player.dashing) {
    player.dashTimer--;
    player.x += player.dashVx;
    player.y += player.dashVy;
    if (player.dashTimer <= 0) player.dashing = false;
  } else {
    player.x += mx * player.speed;
    player.y += my * player.speed;
  }

  // Clamp to world
  player.x = Math.max(player.radius, Math.min(WORLD_W - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(WORLD_H - player.radius, player.y));

  // Angle to mouse
  player.angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);

  // Dash
  if (keys[' '] && player.dashCd <= 0 && !player.dashing) {
    player.dashing = true;
    player.dashTimer = 8;
    player.invincible = 8;
    var dashAngle = (mx || my) ? Math.atan2(my, mx) : player.angle;
    var spd = player.classData.dashDist / 8;
    player.dashVx = Math.cos(dashAngle) * spd;
    player.dashVy = Math.sin(dashAngle) * spd;
    player.dashCd = player.classData.dashCd * 60;

    // Dash trail
    for (var dt = 0; dt < 8; dt++) {
      particles.push({
        x: player.x, y: player.y,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        life: 15, maxLife: 15,
        color: player.color, size: 3
      });
    }
  }

  // Timers
  if (player.dashCd > 0) player.dashCd--;
  if (player.fireTimer > 0) player.fireTimer--;
  if (player.invincible > 0) player.invincible--;

  // Reload
  if (player.reloading) {
    player.reloadTimer--;
    if (player.reloadTimer <= 0) {
      player.ammo = player.weapon.mag;
      player.reloading = false;
    }
  }

  // Manual reload
  if (keys['r'] && !player.reloading && player.ammo < player.weapon.mag) {
    reloadWeapon();
  }

  // Shooting
  if (mouse.down) {
    if (player.weapon.auto) {
      shoot();
    } else if (player.fireTimer <= 0) {
      shoot();
    }
  }

  // Medic passive
  if (player.className === 'medic' && gameRunning) {
    if (Math.random() < 1 / 60) {
      player.hp = Math.min(player.hp + 1, player.maxHp);
    }
  }

  // Engineer turret
  if (player.className === 'engineer') {
    player.turretTimer++;
    if (player.turretTimer >= 1200) { // 20 seconds
      player.turretTimer = 0;
      turrets.push({
        x: player.x, y: player.y,
        hp: 80, fireRate: 30, fireTimer: 0,
        life: 600, damage: 8, range: 200
      });
      showNotification('TURRET DEPLOYED');
    }
  }

  // -- Bullets --
  bullets = bullets.filter(function(b) {
    b.x += b.vx;
    b.y += b.vy;
    b.life--;

    if (b.life <= 0) return false;
    if (b.x < 0 || b.x > WORLD_W || b.y < 0 || b.y > WORLD_H) return false;

    if (b.owner === 'player') {
      for (var zi = 0; zi < zombies.length; zi++) {
        var z = zombies[zi];
        if (Math.hypot(b.x - z.x, b.y - z.y) < z.radius + 4) {
          damageZombie(z, b.damage, b);
          if (b.pierce > 0) {
            b.pierce--;
            b.damage = Math.floor(b.damage * 0.7);
          } else {
            return false;
          }
        }
      }
    }

    if (b.owner === 'zombie') {
      if (Math.hypot(b.x - player.x, b.y - player.y) < player.radius + 4) {
        damagePlayer(b.damage);
        return false;
      }
    }

    return true;
  });

  // -- Zombies --
  zombies = zombies.filter(function(z) {
    if (z.dead || z.hp <= 0) return false;

    // Burning DOT
    if (z.burning > 0) {
      z.burning--;
      if (z.burning % 30 === 0) {
        z.hp -= 3;
        particles.push({
          x: z.x + (Math.random() - 0.5) * 10,
          y: z.y - z.radius,
          vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 2,
          life: 15, maxLife: 15,
          color: '#ff6600', size: 3
        });
        if (z.hp <= 0) { killZombie(z); return false; }
      }
    }

    // Knockback
    if (z.knockback > 0) {
      z.x += z.kbx;
      z.y += z.kby;
      z.knockback--;
      z.kbx *= 0.7;
      z.kby *= 0.7;
    }

    // Movement towards player
    if (z.stunned > 0) { z.stunned--; }
    else {
      var angle = Math.atan2(player.y - z.y, player.x - z.x);
      var spd = z.speed * (z.slowed > 0 ? 0.5 : 1);
      if (z.slowed > 0) z.slowed--;

      var dist = Math.hypot(player.x - z.x, player.y - z.y);

      if (z.ranged && dist < 250 && dist > 100) {
        z.shootCd--;
        if (z.shootCd <= 0) {
          z.shootCd = 90;
          bullets.push({
            x: z.x, y: z.y,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            damage: z.damage,
            life: 60,
            owner: 'zombie',
            pierce: 0
          });
        }
      } else {
        z.x += Math.cos(angle) * spd;
        z.y += Math.sin(angle) * spd;
      }

      // Melee attack
      if (dist < player.radius + z.radius + 2) {
        z.attackCd--;
        if (z.attackCd <= 0) {
          damagePlayer(z.damage);
          z.attackCd = 40;
        }
      }
    }

    // Clamp
    z.x = Math.max(z.radius, Math.min(WORLD_W - z.radius, z.x));
    z.y = Math.max(z.radius, Math.min(WORLD_H - z.radius, z.y));

    return true;
  });

  // -- Turrets --
  turrets = turrets.filter(function(t) {
    t.life--;
    if (t.life <= 0) return false;

    t.fireTimer--;
    if (t.fireTimer <= 0) {
      var target = findNearest(t, zombies, t.range);
      if (target) {
        var angle = Math.atan2(target.y - t.y, target.x - t.x);
        bullets.push({
          x: t.x, y: t.y,
          vx: Math.cos(angle) * 10,
          vy: Math.sin(angle) * 10,
          damage: t.damage,
          pierce: 0, life: 30,
          owner: 'player'
        });
        t.fireTimer = t.fireRate;
      }
    }
    return true;
  });

  // -- Pickups --
  pickups = pickups.filter(function(p) {
    p.life--;
    if (p.life <= 0) return false;

    var dist = Math.hypot(p.x - player.x, p.y - player.y);

    // Magnet effect
    if (dist < player.magnetRange) {
      var angle = Math.atan2(player.y - p.y, player.x - p.x);
      p.x += Math.cos(angle) * 3;
      p.y += Math.sin(angle) * 3;
    }

    if (dist < player.radius + p.radius) {
      switch (p.type) {
        case 'health':
          player.hp = Math.min(player.hp + 25, player.maxHp);
          showNotification('+25 HP');
          break;
        case 'ammo':
          player.ammo = player.weapon.mag;
          player.reloading = false;
          showNotification('AMMO REFILLED');
          break;
        case 'shield':
          player.shield = Math.min(player.shield + 10, player.maxShield);
          showNotification('+10 SHIELD');
          break;
        case 'xp_orb':
          player.xp += 20;
          checkLevelUp();
          break;
      }
      return false;
    }

    return true;
  });

  // -- Particles --
  particles = particles.filter(function(p) {
    if (!p.lightning) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
    }
    p.life--;
    return p.life > 0;
  });

  // -- Explosions --
  explosions = explosions.filter(function(e) {
    e.life--;
    return e.life > 0;
  });

  // -- Combo --
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer <= 0) combo = 0;
  }

  // -- Screen shake decay --
  if (screenShake > 0) screenShake *= 0.85;
  if (screenShake < 0.5) screenShake = 0;

  // -- Camera --
  camera.x = player.x - canvas.width / (2 * cameraZoom);
  camera.y = player.y - canvas.height / (2 * cameraZoom);

  // -- Update HUD --
  updateHUD();
}

// ===== GAME LOOP =====
function gameLoop() {
  if (!gameRunning && !gamePaused) return;

  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Auto-shoot for held mouse (non-auto weapons)
window.addEventListener('mousedown', function() {
  if (!player || !gameRunning || gamePaused) return;
  if (!player.weapon.auto) shoot();
});
