// ============================================================
// ZOMBIE COMP ODYSSEY - Hazards + Interactables + Puzzle Logic
// ============================================================

// ===== UPDATE HAZARDS =====
function updateHazards() {
  for (var i = hazards.length - 1; i >= 0; i--) {
    var h = hazards[i];

    // Lifetime tracking for boss hazards
    if (h.life !== undefined) {
      h.life--;
      // Bomb explosion on expiry
      if (h.isBomb && h.life <= 0) {
        createExplosion(h.x, h.y, h.explosionRadius || 80, h.damage);
        // Akkha bombs leave shadow tile residue
        if (h.leavesResidue) {
          hazards.push({
            x: h.x - 25, y: h.y - 25,
            w: 50, h: 50,
            damage: 8, color: '#c4a032',
            vx: 0, vy: 0,
            isShadowTile: true,
            life: 240,
            dmgInterval: 20
          });
        }
        hazards.splice(i, 1);
        continue;
      }
      if (h.life <= 0) {
        hazards.splice(i, 1);
        continue;
      }
    }

    // Gravity well pull effect
    if (h.isGravity && h.pullStrength) {
      var gDist = Math.hypot(player.x - h.x, player.y - h.y);
      if (gDist < h.radius && gDist > 10) {
        var gAngle = Math.atan2(h.y - player.y, h.x - player.x);
        var gForce = h.pullStrength * (1 - gDist / h.radius);
        player.x += Math.cos(gAngle) * gForce;
        player.y += Math.sin(gAngle) * gForce;
      }
    }

    // Move hazard if it has velocity
    if (h.vx || h.vy) {
      h.x += h.vx;
      h.y += h.vy;

      // Wave/Boulder: remove when off-screen, don't bounce
      if ((h.isWave || h.isBoulder) && !h.bounces) {
        if (h.isCircular) {
          // Circular hazard center check
          if (h.y < -100 || h.y > WORLD_H + 100 || h.x < -100 || h.x > WORLD_W + 100) {
            hazards.splice(i, 1);
            continue;
          }
        } else {
          if (h.y + h.h < -100 || h.y > WORLD_H + 100 || h.x + h.w < -100 || h.x > WORLD_W + 100) {
            hazards.splice(i, 1);
            continue;
          }
        }
      } else if (h.isCircular && h.bounces) {
        // Circular bouncing boulders
        if (h.x - h.radius < 0 || h.x + h.radius > WORLD_W) h.vx *= -1;
        if (h.y - h.radius < 0 || h.y + h.radius > WORLD_H) h.vy *= -1;
        h.x = Math.max(h.radius, Math.min(WORLD_W - h.radius, h.x));
        h.y = Math.max(h.radius, Math.min(WORLD_H - h.radius, h.y));
      } else {
        // Regular hazards bounce off room bounds
        if (h.x < 0 || h.x + h.w > WORLD_W) h.vx *= -1;
        if (h.y < 0 || h.y + h.h > WORLD_H) h.vy *= -1;

        h.x = Math.max(0, Math.min(WORLD_W - h.w, h.x));
        h.y = Math.max(0, Math.min(WORLD_H - h.h, h.y));
      }
    }

    // Update boulder roll angle
    if (h.isBoulder && h.rollAngle !== undefined) {
      h.rollAngle += 0.15;
    }

    // Damage player on contact
    var touching = false;
    if (h.isCircular && h.radius) {
      // Circular collision (pools + boulders)
      var cx = h.x;
      var cy = h.y;
      var dist = Math.hypot(player.x - cx, player.y - cy);
      touching = dist < player.radius + h.radius;
    } else {
      // Rect collision
      touching = player.x + player.radius > h.x && player.x - player.radius < h.x + h.w &&
                 player.y + player.radius > h.y && player.y - player.radius < h.y + h.h;
    }

    if (touching) {
      // Push wave effect - pushes player in wave direction
      if (h.isPushWave && h.pushForce) {
        player.x += h.pushForce;
      }

      h.dmgTimer = (h.dmgTimer || 0) + 1;
      var dmgInterval = h.dmgInterval || (h.isPool ? 20 : 30); // Custom or default tick rate
      if (h.dmgTimer % dmgInterval === 0) {
        damagePlayer(h.damage);
        // Particles
        for (var p = 0; p < 5; p++) {
          particles.push({
            x: player.x + (Math.random() - 0.5) * 20,
            y: player.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -1 - Math.random() * 2,
            life: 20, maxLife: 20,
            color: h.color || '#39FF14',
            size: 3
          });
        }
      }
    } else {
      h.dmgTimer = 0;
    }
  }
}

// ===== UPDATE INTERACTABLES =====
function updateInteractables() {
  // E key debounce
  var eDown = keys['e'];
  eKeyJustPressed = eDown && !eKeyWasDown;
  eKeyWasDown = eDown;

  for (var i = 0; i < interactables.length; i++) {
    var obj = interactables[i];
    if (!obj.active) continue;

    var dist = Math.hypot(player.x - obj.x, player.y - obj.y);
    obj.inRange = dist < obj.interactRadius;

    if (obj.inRange && eKeyJustPressed) {
      if (obj.onInteract) {
        obj.onInteract(obj);
      }
    }

    // Extraction beacon: hold E logic
    if (obj.type === 'beacon') {
      updateExtractionBeacon(obj);
    }
  }
}

// ===== PUZZLE: LOCKDOWN SWITCHES =====
var puzzleSwitchOrder = [];
var puzzleSwitchCurrent = 0;

function initPuzzle(puzzleId) {
  puzzleSwitchOrder = [0, 1, 2, 3, 4]; // 5 switches to activate in order
  puzzleSwitchCurrent = 0;

  if (puzzleId === 'lockdown_switches') {
    // 5 switches scattered across the 3-section room
    var switchDefs = [
      { x: 1100, y: 800, label: '1' },  // Bottom right
      { x: 200, y: 750, label: '2' },    // Bottom left
      { x: 300, y: 450, label: '3' },    // Middle left
      { x: 1100, y: 450, label: '4' },   // Middle right
      { x: 700, y: 150, label: '5' }     // Top center
    ];

    for (var si = 0; si < switchDefs.length; si++) {
      interactables.push({
        x: switchDefs[si].x, y: switchDefs[si].y,
        radius: 15,
        interactRadius: 60,
        type: 'switch',
        id: si,
        color: '#ff4444',
        activeColor: '#44ff44',
        activated: false,
        active: true,
        inRange: false,
        label: switchDefs[si].label,
        onInteract: function(obj) { activatePuzzleSwitch(obj); }
      });
    }

    // Toxic hazards in doorways (static)
    hazards.push({
      x: 500, y: 290, w: 100, h: 50,
      damage: 5, color: '#39FF14',
      vx: 0, vy: 0
    });
    hazards.push({
      x: 800, y: 590, w: 100, h: 50,
      damage: 5, color: '#39FF14',
      vx: 0, vy: 0
    });

    // Moving toxic hazards - patrol paths
    hazards.push({
      x: 100, y: 450, w: 70, h: 70,
      damage: 8, color: '#44ff00',
      vx: 2, vy: 0
    });
    hazards.push({
      x: 900, y: 450, w: 70, h: 70,
      damage: 8, color: '#44ff00',
      vx: -2, vy: 0
    });
    hazards.push({
      x: 700, y: 100, w: 70, h: 70,
      damage: 8, color: '#44ff00',
      vx: 0, vy: 1.5
    });
    hazards.push({
      x: 400, y: 700, w: 70, h: 70,
      damage: 8, color: '#44ff00',
      vx: 1.5, vy: 1
    });

    // Circular patrolling hazards near switches
    hazards.push({
      x: 1100, y: 350, w: 50, h: 50,
      damage: 10, color: '#ff4400',
      vx: 0, vy: 2
    });
    hazards.push({
      x: 200, y: 150, w: 50, h: 50,
      damage: 10, color: '#ff4400',
      vx: 2, vy: 0
    });
  }
}

function activatePuzzleSwitch(obj) {
  if (obj.activated) return;

  if (obj.id === puzzleSwitchOrder[puzzleSwitchCurrent]) {
    // Correct switch!
    obj.activated = true;
    obj.color = obj.activeColor;
    puzzleSwitchCurrent++;
    showNotification('SWITCH ' + (obj.id + 1) + '/' + puzzleSwitchOrder.length + ' ACTIVATED!');
    screenShake = 3;

    // All switches done?
    if (puzzleSwitchCurrent >= puzzleSwitchOrder.length) {
      roomCleared = true;
      if (exitZone) exitZone.locked = false;
      showNotification('LOCKDOWN DISENGAGED!');
      // Remove hazards
      hazards = [];
    }
  } else {
    // Wrong switch - reset all
    showNotification('WRONG SEQUENCE! (' + puzzleSwitchCurrent + '/' + puzzleSwitchOrder.length + ' LOST)');
    screenShake = 5;
    puzzleSwitchCurrent = 0;
    for (var i = 0; i < interactables.length; i++) {
      if (interactables[i].type === 'switch') {
        interactables[i].activated = false;
        interactables[i].color = '#ff4444';
      }
    }
    // Damage increases with each failed attempt
    damagePlayer(8);
  }
}

// ===== EXTRACTION =====
var extractionSpawnTimer = 0;

function initExtraction(beaconPos) {
  extractionProgress = 0;
  extractionActive = false;
  extractionSpawnTimer = 0;

  interactables.push({
    x: beaconPos.x,
    y: beaconPos.y,
    radius: 25,
    interactRadius: 50,
    type: 'beacon',
    active: true,
    inRange: false,
    color: '#39FF14',
    channeling: false,
    label: 'EXTRACT'
  });
}

function updateExtractionBeacon(beacon) {
  var room = ROOMS[currentRoom];

  // Continuous enemy spawning
  extractionSpawnTimer++;
  if (extractionSpawnTimer % 90 === 0) { // Every 1.5s
    var types = ['walker', 'runner', 'runner', 'exploder'];
    var type = types[Math.floor(Math.random() * types.length)];
    var sp = room.spawnPoints[Math.floor(Math.random() * room.spawnPoints.length)];
    spawnRoomZombie(type, sp);
  }

  // Check if player is holding E in range
  var eDown = keys['e'];
  var dist = Math.hypot(player.x - beacon.x, player.y - beacon.y);
  var inRange = dist < beacon.interactRadius;

  if (inRange && eDown && !player.dashing) {
    beacon.channeling = true;
    extractionActive = true;
    extractionProgress += 1 / 600; // 10 seconds at 60fps = 600 frames

    // Channel particles
    if (Math.random() < 0.3) {
      var a = Math.random() * Math.PI * 2;
      var r = 30 + Math.random() * 20;
      particles.push({
        x: beacon.x + Math.cos(a) * r,
        y: beacon.y + Math.sin(a) * r,
        vx: -Math.cos(a) * 1.5,
        vy: -Math.sin(a) * 1.5,
        life: 15, maxLife: 15,
        color: '#39FF14', size: 2
      });
    }

    if (extractionProgress >= 1) {
      // Extraction complete!
      showVictoryScreen();
      return;
    }
  } else {
    if (beacon.channeling) {
      // Interrupted! Lose 20% progress
      extractionProgress = Math.max(0, extractionProgress - 0.2);
      beacon.channeling = false;
      extractionActive = false;
      if (extractionProgress > 0) {
        showNotification('CHANNEL INTERRUPTED!');
      }
    }
  }

  // Damage interrupts too (handled by checking if player is being hit)
  // We check invincible frames as a proxy for taking damage
  if (player.invincible === 14 && beacon.channeling) { // Just got hit (invincible starts at 15, decrements)
    extractionProgress = Math.max(0, extractionProgress - 0.2);
    beacon.channeling = false;
    extractionActive = false;
    showNotification('CHANNEL INTERRUPTED!');
  }
}
