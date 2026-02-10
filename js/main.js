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
  // Reinit floor pattern (canvas resize resets context, invalidating patterns)
  if (gameRunning) initFloorPattern();
}
resize();
window.addEventListener('resize', resize);

// ===== START GAME =====
function startGame(className, mode) {
  document.getElementById('class-screen').classList.remove('active');
  document.getElementById('game-hud').classList.add('active');
  document.getElementById('minimap').classList.add('active');

  gameMode = mode || 'endless';

  player = createPlayer(className);
  zombies = [];
  bullets = [];
  particles = [];
  pickups = [];
  turrets = [];
  totems = [];
  explosions = [];
  damageNumbers = [];
  bloodSplats = [];
  telegraphs = [];
  hazards = [];
  interactables = [];
  roomWalls = [];
  wave = 0;
  score = 0;
  kills = 0;
  combo = 0;
  comboTimer = 0;
  bulletsDodged = 0;
  bulletsDodgedCombo = 0;
  dodgeComboTimer = 0;
  dodgeFeedbackTimer = 0;
  dodgeFeedbackIntensity = 0;
  afterimages = [];
  bulletTrails = [];

  // Init hub system
  roomsCleared = {};
  hubRoom = false;

  gameRunning = true;

  // Init procedural floor and scenery
  initFloorPattern();
  generateScenery(WORLD_W, WORLD_H, 180);

  if (gameMode === 'odyssey') {
    initHub();
  } else {
    // Reset world size for endless mode
    WORLD_W = 3000;
    WORLD_H = 3000;
    player.x = WORLD_W / 2;
    player.y = WORLD_H / 2;
    startWave();
  }

  gameLoop();
}

// ===== GAME OVER =====
function gameOver() {
  gameRunning = false;
  gamePaused = false;
  document.getElementById('pause-screen').classList.remove('active');
  if (gameMode === 'odyssey') {
    if (hubRoom) {
      document.getElementById('go-wave').textContent = 'HUB (' + Object.keys(roomsCleared).length + '/4)';
    } else {
      document.getElementById('go-wave').textContent = ROOMS[currentRoom].name;
    }
  } else {
    document.getElementById('go-wave').textContent = wave;
  }
  document.getElementById('go-kills').textContent = kills;
  document.getElementById('go-score').textContent = Math.floor(score);
  document.getElementById('go-level').textContent = player.level;
  document.getElementById('gameover-screen').classList.add('active');
}

// ===== PAUSE =====
function togglePause() {
  if (!gameRunning) return;
  // Don't toggle pause during level-up or gameover screens
  if (document.getElementById('levelup-screen').classList.contains('active')) return;
  if (document.getElementById('gameover-screen').classList.contains('active')) return;
  gamePaused = !gamePaused;
  var pauseScreen = document.getElementById('pause-screen');
  if (gamePaused) {
    pauseScreen.classList.add('active');
  } else {
    pauseScreen.classList.remove('active');
  }
}

// ===== UPDATE =====
function update() {
  if (!gameRunning || gamePaused) return;

  // -- Wave / Room management --
  if (gameMode === 'odyssey') {
    updateRoom();
    updateBoss();
    updateHazards();
    updateInteractables();
    updateTelegraphs();
  } else {
    if (waveCooldown > 0) {
      waveCooldown--;
      if (waveCooldown === 0) spawnWaveZombies();
    }

    if (waveCooldown <= 0 && zombiesRemaining <= 0 && zombies.length === 0) {
      startWave();
    }
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
    // Afterimages during dash
    if (player.dashTimer % 2 === 0) {
      afterimages.push({
        x: player.x, y: player.y,
        radius: player.radius,
        color: player.color,
        alpha: 0.5,
        life: 12, maxLife: 12
      });
    }
    if (player.dashTimer <= 0) player.dashing = false;
  } else {
    player.x += mx * player.speed;
    player.y += my * player.speed;
  }

  // Wall collision for player
  var playerResolved = resolveWallCollisions(player.x, player.y, player.radius);
  player.x = playerResolved.x;
  player.y = playerResolved.y;

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

    // Dash trail particles
    for (var dt = 0; dt < 8; dt++) {
      particles.push({
        x: player.x, y: player.y,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        life: 15, maxLife: 15,
        color: player.color, size: 3
      });
    }
    // Initial afterimages at dash start
    for (var ai = 0; ai < 3; ai++) {
      afterimages.push({
        x: player.x - player.dashVx * ai * 0.5,
        y: player.y - player.dashVy * ai * 0.5,
        radius: player.radius,
        color: player.color,
        alpha: 0.4 - ai * 0.1,
        life: 10, maxLife: 10
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

  // Mender passive: regen
  if (player.className === 'mender' && gameRunning) {
    if (Math.random() < 1 / 60) {
      player.hp = Math.min(player.hp + 1, player.maxHp);
    }
  }

  // Ability key processing (1-4)
  var abilityKeys = [keys['1'], keys['2'], keys['3'], keys['4']];
  for (var ak = 0; ak < 4; ak++) {
    if (abilityKeys[ak] && !abilityKeysWas[ak]) {
      executeAbility(ak);
    }
    abilityKeysWas[ak] = abilityKeys[ak] || false;
  }

  // Ability cooldown ticking
  for (var cd = 0; cd < player.abilities.length; cd++) {
    if (player.abilities[cd].cdTimer > 0) player.abilities[cd].cdTimer--;
  }

  // Buff timers
  if (player.fortifyTimer > 0) player.fortifyTimer--;
  if (player.overchargeTimer > 0) player.overchargeTimer--;
  if (player.scanTimer > 0) player.scanTimer--;

  // Shadow clone update
  if (shadowClone) {
    shadowClone.life--;
    // Clone draws aggro: nearby zombies target clone
    zombies.forEach(function(z) {
      if (z.dead || z === bossEntity) return;
      var dClone = Math.hypot(z.x - shadowClone.x, z.y - shadowClone.y);
      var dPlayer = Math.hypot(z.x - player.x, z.y - player.y);
      if (dClone < 200 && dClone < dPlayer) {
        var a = Math.atan2(shadowClone.y - z.y, shadowClone.x - z.x);
        z.x += Math.cos(a) * z.speed * 0.5;
        z.y += Math.sin(a) * z.speed * 0.5;
      }
    });
    if (shadowClone.life <= 0) shadowClone = null;
  }

  // Temporary wall expiry
  for (var tw = roomWalls.length - 1; tw >= 0; tw--) {
    if (roomWalls[tw].temporary) {
      roomWalls[tw].life--;
      if (roomWalls[tw].life <= 0) roomWalls.splice(tw, 1);
    }
  }

  // -- Bullets --
  bullets = bullets.filter(function(b) {
    b.x += b.vx;
    b.y += b.vy;
    b.life--;

    if (b.life <= 0) return false;
    if (b.x < 0 || b.x > WORLD_W || b.y < 0 || b.y > WORLD_H) return false;

    // Wall collision for bullets
    if (bulletHitsWall(b.x, b.y)) {
      // Spark particles on wall hit
      for (var sp = 0; sp < 3; sp++) {
        particles.push({
          x: b.x, y: b.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 8, maxLife: 8,
          color: '#ffaa44', size: 2
        });
      }
      return false;
    }

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
      var bDist = Math.hypot(b.x - player.x, b.y - player.y);
      if (bDist < player.radius + 4) {
        if (player.invincible > 0 && player.dashing && !b._dodged) {
          // Dodge detection - bullet passes through during dash
          b._dodged = true;
          bulletsDodgedCombo++;
          dodgeComboTimer = 120;
          dodgeFeedbackTimer = 15;
          dodgeFeedbackIntensity = Math.min(1, 0.3 + bulletsDodgedCombo * 0.1);
          // Afterimage at dodge position
          afterimages.push({
            x: player.x, y: player.y,
            radius: player.radius * 1.2,
            color: '#88ddff',
            alpha: 0.7,
            life: 15, maxLife: 15
          });
          // Score bonus
          score += 25 * bulletsDodgedCombo;
          // Combo notifications
          if (bulletsDodgedCombo === 3) showNotification('CLOSE CALL!');
          else if (bulletsDodgedCombo === 5) showNotification('MATRIX DODGE!');
          else if (bulletsDodgedCombo >= 8 && bulletsDodgedCombo % 3 === 0) showNotification('UNTOUCHABLE!');
          // Bullet passes through (don't consume)
        } else if (player.invincible <= 0) {
          damagePlayer(b.damage);
          return false;
        }
      }
    }

    return true;
  });

  // -- Zombies --
  zombies = zombies.filter(function(z) {
    if (z.dead || z.hp <= 0) return false;

    // Skip movement for boss entity (handled by updateBoss)
    if (z === bossEntity) return true;

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
        // Burst queue processing (fires remaining burst shots)
        if (z.burstQueue > 0) {
          z.burstTimer--;
          if (z.burstTimer <= 0) {
            z.burstQueue--;
            z.burstTimer = 8;
            var burstJitter = (Math.random() - 0.5) * 0.08;
            bullets.push({
              x: z.x, y: z.y,
              vx: Math.cos(z.burstAngle + burstJitter) * 5.5,
              vy: Math.sin(z.burstAngle + burstJitter) * 5.5,
              damage: Math.floor(z.damage * 0.4),
              life: 50,
              owner: 'zombie',
              pierce: 0,
              isSpitter: true,
              trailColor: '#66ff66'
            });
          }
        }
        z.shootCd--;
        if (z.shootCd <= 0 && z.burstQueue <= 0) {
          var pat = SPITTER_PATTERNS[z.patternType || 'spread'];
          z.shootCd = pat.cooldown;

          if (z.patternType === 'spread') {
            for (var si = 0; si < pat.bulletCount; si++) {
              var spreadOff = (si - (pat.bulletCount - 1) / 2) * (pat.spreadAngle / (pat.bulletCount - 1));
              bullets.push({
                x: z.x, y: z.y,
                vx: Math.cos(angle + spreadOff) * pat.speed,
                vy: Math.sin(angle + spreadOff) * pat.speed,
                damage: Math.floor(z.damage * pat.damageMulti),
                life: pat.life,
                owner: 'zombie',
                pierce: 0,
                isSpitter: true,
                trailColor: '#66ff66'
              });
            }
          } else if (z.patternType === 'burst') {
            // Fire first bullet, queue the rest
            bullets.push({
              x: z.x, y: z.y,
              vx: Math.cos(angle) * pat.speed,
              vy: Math.sin(angle) * pat.speed,
              damage: Math.floor(z.damage * pat.damageMulti),
              life: pat.life,
              owner: 'zombie',
              pierce: 0,
              isSpitter: true,
              trailColor: '#66ff66'
            });
            z.burstQueue = pat.bulletCount - 1;
            z.burstTimer = pat.burstDelay;
            z.burstAngle = angle;
          } else if (z.patternType === 'aimed_double') {
            // Direct bullet
            bullets.push({
              x: z.x, y: z.y,
              vx: Math.cos(angle) * pat.speed,
              vy: Math.sin(angle) * pat.speed,
              damage: Math.floor(z.damage * pat.damageMulti),
              life: pat.life,
              owner: 'zombie',
              pierce: 0,
              isSpitter: true,
              trailColor: '#66ff66'
            });
            // Predictive bullet (leads player movement)
            var mx = 0, my = 0;
            if (keys['w'] || keys['arrowup']) my -= 1;
            if (keys['s'] || keys['arrowdown']) my += 1;
            if (keys['a'] || keys['arrowleft']) mx -= 1;
            if (keys['d'] || keys['arrowright']) mx += 1;
            var predX = player.x + mx * player.speed * dist / pat.speed * pat.leadFactor;
            var predY = player.y + my * player.speed * dist / pat.speed * pat.leadFactor;
            var predAngle = Math.atan2(predY - z.y, predX - z.x);
            bullets.push({
              x: z.x, y: z.y,
              vx: Math.cos(predAngle) * pat.speed,
              vy: Math.sin(predAngle) * pat.speed,
              damage: Math.floor(z.damage * pat.damageMulti),
              life: pat.life,
              owner: 'zombie',
              pierce: 0,
              isSpitter: true,
              trailColor: '#88ff88'
            });
          }
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

    // Wall collision for zombies
    var zResolved = resolveWallCollisions(z.x, z.y, z.radius);
    z.x = zResolved.x;
    z.y = zResolved.y;

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

  // -- Totems (Mender) --
  totems = totems.filter(function(t) {
    t.life--;
    if (t.life <= 0) return false;

    // Heal player if nearby
    if (Math.hypot(player.x - t.x, player.y - t.y) < t.healRange) {
      if (t.life % 30 === 0) {
        player.hp = Math.min(player.hp + 2, player.maxHp);
      }
    }

    // Slow nearby enemies
    zombies.forEach(function(z) {
      if (!z.dead && Math.hypot(z.x - t.x, z.y - t.y) < t.slowRange) {
        z.slowed = Math.max(z.slowed || 0, 30);
      }
    });

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

  // -- Dodge combo timer --
  if (dodgeComboTimer > 0) {
    dodgeComboTimer--;
    if (dodgeComboTimer <= 0) {
      bulletsDodgedCombo = 0;
    }
  }
  if (dodgeFeedbackTimer > 0) dodgeFeedbackTimer--;

  // -- Afterimages --
  afterimages = afterimages.filter(function(a) {
    a.life--;
    a.alpha *= 0.88;
    return a.life > 0 && a.alpha > 0.01;
  });

  // -- Bullet trails --
  // Generate trails for enemy bullets
  bullets.forEach(function(b) {
    if ((b.isToxic || b.isSpitter) && b.owner === 'zombie' && b.life % 2 === 0) {
      bulletTrails.push({
        x: b.x, y: b.y,
        size: b.isToxic ? 4 : 3,
        color: b.trailColor || '#44ff44',
        alpha: 0.6,
        life: 12, maxLife: 12,
        glow: b.isToxic
      });
    }
  });
  // Update trails
  bulletTrails = bulletTrails.filter(function(t) {
    t.life--;
    t.alpha = (t.life / t.maxLife) * 0.6;
    t.size *= 0.92;
    return t.life > 0;
  });

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
