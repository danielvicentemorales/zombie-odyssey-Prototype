// ============================================================
// ZOMBIE COMP ODYSSEY - Boss AI + Telegraph System
// ============================================================

var BOSS_DEFS = {
  baba: {
    name: "BA-BA, THE BRUTE",
    hp: 1500,
    radius: 45,
    color: '#6b3a1f',
    speed: 0.7,
    phases: [
      { hpPercent: 1.0, speed: 0.7, attacks: ['ground_slam', 'boulder_toss'] },
      { hpPercent: 0.4, speed: 1.0, attacks: ['ground_slam', 'boulder_toss', 'falling_rocks'] }
    ],
    attacks: {
      ground_slam: {
        name: 'GROUND SLAM',
        type: 'circle',
        windupTime: 50,
        radius: 130,
        damage: 25,
        cooldown: 120,
        range: 250
      },
      boulder_toss: {
        name: 'BOULDER TOSS',
        type: 'circle',
        windupTime: 45,
        radius: 60,
        damage: 30,
        boulderCount: 3,
        boulderRadius: 25,
        boulderSpeed: 5,
        cooldown: 180,
        range: 9999
      },
      falling_rocks: {
        name: 'FALLING ROCKS',
        type: 'boulder',
        windupTime: 60,
        damage: 20,
        rockCount: 6,
        boulderRadius: 22,
        boulderSpeed: 5,
        cooldown: 240,
        range: 9999
      }
    }
  },

  kephri: {
    name: "KEPHRI, THE PLAGUE",
    hp: 1800,
    radius: 40,
    color: '#4a0e4e',
    speed: 0.6,
    phases: [
      { hpPercent: 1.0, speed: 0.6, attacks: ['toxic_burst', 'spawn_swarm'] },
      { hpPercent: 0.45, speed: 0.9, attacks: ['toxic_burst', 'spawn_swarm', 'plague_cloud'] }
    ],
    attacks: {
      toxic_burst: {
        name: 'TOXIC BURST',
        type: 'spiral',
        windupTime: 35,
        damage: 10,
        projectileCount: 12,
        cooldown: 150,
        range: 9999
      },
      spawn_swarm: {
        name: 'SPAWN SWARM',
        type: 'summon',
        windupTime: 25,
        channelTime: 60,
        summonCount: 5,
        cooldown: 300,
        range: 9999
      },
      plague_cloud: {
        name: 'PLAGUE CLOUD',
        type: 'circle',
        windupTime: 50,
        radius: 180,
        damage: 8,
        poolDuration: 360,
        poolRadius: 100,
        cooldown: 240,
        range: 9999
      }
    }
  },

  amalgam: {
    name: 'THE AMALGAM',
    hp: 2500,
    radius: 50,
    color: '#2d5016',
    speed: 0.6,
    phases: [
      { hpPercent: 1.0, speed: 0.6, attacks: ['blood_wave', 'acid_pool'] },
      { hpPercent: 0.6, speed: 0.9, attacks: ['blood_wave', 'acid_pool', 'boulder_roll'] },
      { hpPercent: 0.25, speed: 1.2, attacks: ['blood_wave', 'acid_pool', 'boulder_roll', 'enraged_roar'] }
    ],
    attacks: {
      blood_wave: {
        name: 'BLOOD WAVE',
        type: 'wave',
        windupTime: 50, // ~0.83s
        damage: 20,
        cooldown: 150, // 2.5s
        range: 9999
      },
      acid_pool: {
        name: 'ACID POOL',
        type: 'acid',
        windupTime: 40,
        damage: 6,
        poolCount: 2,
        poolDuration: 360,
        poolRadius: 50,
        cooldown: 260,
        range: 9999
      },
      boulder_roll: {
        name: 'BOULDER ROLL',
        type: 'boulder',
        windupTime: 60, // 1s
        damage: 35,
        boulderCount: 4,
        boulderRadius: 30,
        boulderSpeed: 6,
        cooldown: 210, // 3.5s
        range: 9999
      },
      enraged_roar: {
        name: 'ENRAGED ROAR',
        type: 'circle',
        windupTime: 45, // 0.75s
        radius: 250,
        damage: 15,
        summonCount: 4,
        cooldown: 300, // 5s
        range: 350
      }
    }
  },
  akkha: {
    name: "AKKHA, THE WARDEN",
    hp: 2000,
    radius: 42,
    color: '#c4a032',
    speed: 0.8,
    phases: [
      { hpPercent: 1.0, speed: 0.8, attacks: ['shadow_orbs', 'detonate'] },
      { hpPercent: 0.5, speed: 1.1, attacks: ['shadow_orbs', 'detonate', 'mirror_dash'] }
    ],
    attacks: {
      shadow_orbs: {
        name: 'SHADOW ORBS',
        type: 'spiral',
        windupTime: 40,
        damage: 12,
        projectileCount: 8,
        cooldown: 160,
        range: 9999
      },
      detonate: {
        name: 'DETONATE',
        type: 'circle',
        windupTime: 55,
        radius: 200,
        damage: 25,
        bombCount: 3,
        bombRadius: 40,
        cooldown: 220,
        range: 9999
      },
      mirror_dash: {
        name: 'MIRROR DASH',
        type: 'line',
        windupTime: 35,
        damage: 20,
        speed: 14,
        width: 50,
        length: 400,
        cooldown: 180,
        range: 9999
      }
    }
  },

  overseer: {
    name: "THE OVERSEER",
    hp: 1600,
    radius: 38,
    color: '#2a4a6b',
    speed: 0.5,
    phases: [
      { hpPercent: 1.0, speed: 0.5, attacks: ['laser_sweep', 'summon_guards'] },
      { hpPercent: 0.45, speed: 0.8, attacks: ['laser_sweep', 'summon_guards', 'gravity_well'] }
    ],
    attacks: {
      laser_sweep: {
        name: 'LASER SWEEP',
        type: 'line',
        windupTime: 45,
        damage: 15,
        width: 30,
        length: 600,
        sweepAngle: Math.PI * 0.6,
        sweepTime: 60,
        cooldown: 180,
        range: 9999
      },
      summon_guards: {
        name: 'SUMMON GUARDS',
        type: 'summon',
        windupTime: 30,
        channelTime: 40,
        summonCount: 4,
        cooldown: 280,
        range: 9999
      },
      gravity_well: {
        name: 'GRAVITY WELL',
        type: 'circle',
        windupTime: 50,
        radius: 160,
        damage: 10,
        pullStrength: 3,
        duration: 180,
        cooldown: 300,
        range: 9999
      }
    }
  }
};

// ===== INIT BOSS =====
function initBoss(bossId) {
  var def = BOSS_DEFS[bossId];

  bossEntity = {
    x: WORLD_W / 2,
    y: 300,
    vx: 0, vy: 0,
    hp: def.hp,
    maxHp: def.hp,
    radius: def.radius,
    color: def.color,
    speed: def.speed,
    type: 'boss',
    xp: 200,
    score: 1000,
    attackCd: 0,
    burning: 0,
    slowed: 0,
    stunned: 0,
    ranged: false,
    explodes: false,
    boss: true,
    shootCd: 0,
    knockback: 0,
    kbx: 0, kby: 0,
    dead: false,

    // Boss-specific state machine
    bossId: bossId,
    bossState: 'idle', // idle, windup, active, phaseTransition
    currentPhase: 0,
    currentAttack: null,
    attackTimer: 0,
    attackCooldowns: {},
    invulnTimer: 0,
    windupTarget: null,
    chargeDir: null,
    spiralAngle: 0,
    spiralTimer: 0,
    channelTimer: 0,
    damage: 15 // melee
  };

  // Add to zombies array so existing collision/rendering works
  zombies.push(bossEntity);
}

// ===== UPDATE BOSS =====
function updateBoss() {
  if (!bossEntity || bossEntity.dead) return;

  var def = BOSS_DEFS[bossEntity.bossId];

  // Invulnerability
  if (bossEntity.invulnTimer > 0) {
    bossEntity.invulnTimer--;
    return;
  }

  // Phase check
  var hpPercent = bossEntity.hp / bossEntity.maxHp;
  var newPhase = 0;
  for (var p = def.phases.length - 1; p >= 0; p--) {
    if (hpPercent <= def.phases[p].hpPercent) {
      newPhase = p;
    }
  }

  if (newPhase > bossEntity.currentPhase) {
    // Phase transition
    bossEntity.currentPhase = newPhase;
    bossEntity.bossState = 'phaseTransition';
    bossEntity.invulnTimer = 60; // 1s invuln
    bossEntity.speed = def.phases[newPhase].speed;
    bossEntity.currentAttack = null;
    telegraphs = [];
    showNotification('PHASE ' + (newPhase + 1) + '!');

    // Flash effect
    screenShake = 15;
    for (var i = 0; i < 30; i++) {
      var angle = (i / 30) * Math.PI * 2;
      particles.push({
        x: bossEntity.x, y: bossEntity.y,
        vx: Math.cos(angle) * (4 + Math.random() * 6),
        vy: Math.sin(angle) * (4 + Math.random() * 6),
        life: 40, maxLife: 40,
        color: '#ff00ff', size: 4
      });
    }
    return;
  }

  // Tick cooldowns
  for (var atk in bossEntity.attackCooldowns) {
    if (bossEntity.attackCooldowns[atk] > 0) {
      bossEntity.attackCooldowns[atk]--;
    }
  }

  // State machine
  switch (bossEntity.bossState) {
    case 'idle':
    case 'phaseTransition':
      // Chase player slowly
      var angle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x);
      var spd = bossEntity.speed * (bossEntity.slowed > 0 ? 0.5 : 1);
      bossEntity.x += Math.cos(angle) * spd;
      bossEntity.y += Math.sin(angle) * spd;

      // Wall collision for boss
      var resolved = resolveWallCollisions(bossEntity.x, bossEntity.y, bossEntity.radius);
      bossEntity.x = resolved.x;
      bossEntity.y = resolved.y;

      // Pick next attack
      bossEntity.attackTimer++;
      if (bossEntity.attackTimer > 60) { // At least 1s between attacks
        var chosen = chooseNextBossAttack();
        if (chosen) {
          bossEntity.currentAttack = chosen;
          bossEntity.bossState = 'windup';
          bossEntity.attackTimer = 0;
          bossEntity.windupTarget = { x: player.x, y: player.y };

          // Create telegraph
          createTelegraph(chosen);
        }
      }

      bossEntity.bossState = bossEntity.bossState === 'phaseTransition' ? 'idle' : bossEntity.bossState;
      break;

    case 'windup':
      // Boss slows during windup
      bossEntity.attackTimer++;
      var atkDef = def.attacks[bossEntity.currentAttack];

      if (bossEntity.attackTimer >= atkDef.windupTime) {
        bossEntity.bossState = 'active';
        bossEntity.attackTimer = 0;
        executeBossAttack();
      }
      break;

    case 'active':
      updateBossActiveAttack();
      break;
  }

  // Melee damage to player
  var distToPlayer = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);
  if (distToPlayer < player.radius + bossEntity.radius + 2) {
    if (bossEntity.attackCd <= 0) {
      damagePlayer(bossEntity.damage);
      bossEntity.attackCd = 60;
    }
  }
  if (bossEntity.attackCd > 0) bossEntity.attackCd--;
}

// ===== CHOOSE NEXT BOSS ATTACK =====
function chooseNextBossAttack() {
  var def = BOSS_DEFS[bossEntity.bossId];
  var phase = def.phases[bossEntity.currentPhase];
  var available = [];
  var distToPlayer = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);

  for (var i = 0; i < phase.attacks.length; i++) {
    var atkName = phase.attacks[i];
    var atkDef = def.attacks[atkName];
    var cd = bossEntity.attackCooldowns[atkName] || 0;

    if (cd <= 0 && distToPlayer < atkDef.range) {
      available.push(atkName);
    }
  }

  if (available.length === 0) return null;

  // Weighted random - prefer close-range attacks when close
  if (distToPlayer < 250 && available.indexOf('ground_slam') !== -1) {
    return 'ground_slam';
  }
  if (distToPlayer < 250 && available.indexOf('enraged_roar') !== -1) {
    return 'enraged_roar';
  }

  return available[Math.floor(Math.random() * available.length)];
}

// ===== CREATE TELEGRAPH =====
function createTelegraph(attackName) {
  var def = BOSS_DEFS[bossEntity.bossId];
  var atkDef = def.attacks[attackName];

  var telegraph = {
    type: atkDef.type,
    timer: 0,
    maxTime: atkDef.windupTime,
    x: 0, y: 0,
    active: true
  };

  switch (attackName) {
    case 'slam':
      telegraph.x = player.x;
      telegraph.y = player.y;
      telegraph.radius = atkDef.radius;
      break;
    case 'charge':
      var angle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x);
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.angle = angle;
      telegraph.width = atkDef.width;
      telegraph.length = atkDef.length;
      break;
    case 'toxic_spiral':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 200;
      telegraph.subtype = 'pulse';
      break;
    case 'summon':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 60;
      telegraph.subtype = 'channel';
      break;

    case 'blood_wave':
      telegraph.type = 'wave';
      telegraph.x = bossEntity.x;
      telegraph.y = 0;
      telegraph.width = 40;
      telegraph.height = WORLD_H;
      telegraph.vertical = true;
      telegraph.text = 'DODGE!';
      break;

    case 'acid_pool':
      telegraph.type = 'acid';
      telegraph.x = player.x;
      telegraph.y = player.y;
      telegraph.poolCount = atkDef.poolCount;
      telegraph.poolRadius = atkDef.poolRadius;
      break;

    case 'boulder_roll':
      telegraph.type = 'boulder';
      telegraph.x = 0;
      telegraph.y = 0;
      telegraph.laneCount = atkDef.boulderCount + 1;
      break;

    case 'enraged_roar':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = atkDef.radius;
      break;

    // Ba-Ba attacks
    case 'ground_slam':
      telegraph.x = player.x;
      telegraph.y = player.y;
      telegraph.radius = atkDef.radius;
      break;

    case 'boulder_toss':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = atkDef.radius;
      break;

    case 'falling_rocks':
      telegraph.type = 'boulder';
      telegraph.x = 0;
      telegraph.y = 0;
      telegraph.laneCount = atkDef.rockCount;
      break;

    // Kephri attacks
    case 'toxic_burst':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 200;
      telegraph.subtype = 'pulse';
      break;

    case 'spawn_swarm':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 60;
      telegraph.subtype = 'channel';
      break;

    case 'plague_cloud':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = atkDef.radius;
      break;

    // Akkha attacks
    case 'shadow_orbs':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 200;
      telegraph.subtype = 'pulse';
      break;

    case 'detonate':
      telegraph.x = player.x;
      telegraph.y = player.y;
      telegraph.radius = atkDef.radius;
      break;

    case 'mirror_dash':
      var mdAngle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x);
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.angle = mdAngle;
      telegraph.width = atkDef.width;
      telegraph.length = atkDef.length;
      break;

    // Overseer attacks
    case 'laser_sweep':
      var lsAngle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x);
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.angle = lsAngle;
      telegraph.width = atkDef.width;
      telegraph.length = atkDef.length;
      break;

    case 'summon_guards':
      telegraph.x = bossEntity.x;
      telegraph.y = bossEntity.y;
      telegraph.radius = 60;
      telegraph.subtype = 'channel';
      break;

    case 'gravity_well':
      telegraph.x = player.x;
      telegraph.y = player.y;
      telegraph.radius = atkDef.radius;
      break;
  }

  telegraphs.push(telegraph);
}

// ===== EXECUTE BOSS ATTACK =====
function executeBossAttack() {
  var def = BOSS_DEFS[bossEntity.bossId];
  var atkName = bossEntity.currentAttack;
  var atkDef = def.attacks[atkName];

  // Set cooldown
  bossEntity.attackCooldowns[atkName] = atkDef.cooldown;

  // Clear telegraphs
  telegraphs = [];

  switch (atkName) {
    case 'slam':
      // Immediate area damage at target location
      var target = bossEntity.windupTarget;
      var distToPlayer = Math.hypot(player.x - target.x, player.y - target.y);
      if (distToPlayer < atkDef.radius) {
        damagePlayer(atkDef.damage);
      }
      screenShake = 12;

      // Visual: explosion at target
      explosions.push({
        x: target.x, y: target.y,
        radius: atkDef.radius,
        life: 20, maxLife: 20
      });

      // Particles
      for (var i = 0; i < 20; i++) {
        var a = (i / 20) * Math.PI * 2;
        particles.push({
          x: target.x, y: target.y,
          vx: Math.cos(a) * (3 + Math.random() * 5),
          vy: Math.sin(a) * (3 + Math.random() * 5),
          life: 25, maxLife: 25,
          color: '#880044', size: 4
        });
      }

      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'charge':
      // Boss charges in locked direction
      var angle = Math.atan2(
        bossEntity.windupTarget.y - bossEntity.y,
        bossEntity.windupTarget.x - bossEntity.x
      );
      bossEntity.chargeDir = angle;
      bossEntity.attackTimer = 0;
      break;

    case 'toxic_spiral':
      bossEntity.spiralAngle = 0;
      bossEntity.spiralTimer = 0;
      bossEntity.attackTimer = 0;
      break;

    case 'summon':
      bossEntity.channelTimer = 0;
      bossEntity.attackTimer = 0;
      // Spawn runners from corners
      var room = ROOMS[currentRoom];
      var corners = room.spawnPoints;
      var count = Math.min(atkDef.summonCount, corners.length);
      for (var s = 0; s < count; s++) {
        var sp = corners[s % corners.length];
        spawnRoomZombie('runner', sp);
      }
      showNotification('DPS WINDOW!');
      break;

    case 'blood_wave':
      // Vertical walls sweep left-to-right (or right-to-left) with 2 gaps
      var waveX = bossEntity.x;
      var gapHeight = 110;
      var numSegments = 5;
      var gapPositions = [];
      while (gapPositions.length < 2) {
        var gp = Math.floor(Math.random() * (numSegments + 1));
        if (gapPositions.indexOf(gp) === -1) gapPositions.push(gp);
      }
      gapPositions.sort(function(a, b) { return a - b; });

      // Build vertical wave segments with gaps along Y axis
      var curY = 0;
      var waveDir = waveX < WORLD_W / 2 ? 4 : -4;
      for (var g = 0; g <= gapPositions.length; g++) {
        var gapY = g < gapPositions.length ? gapPositions[g] * (WORLD_H / (numSegments + 1)) : WORLD_H;
        if (gapY - curY > 5) {
          hazards.push({
            x: waveX - 20, y: curY, w: 40, h: gapY - curY,
            damage: atkDef.damage, color: '#8b0000',
            vx: waveDir, vy: 0,
            isWave: true, life: 300
          });
        }
        curY = gapY + gapHeight;
      }

      // Phase 3: second staggered wave from opposite side
      if (bossEntity.currentPhase >= 2) {
        var gaps2 = [];
        while (gaps2.length < 2) {
          var gp2 = Math.floor(Math.random() * (numSegments + 1));
          if (gaps2.indexOf(gp2) === -1) gaps2.push(gp2);
        }
        gaps2.sort(function(a, b) { return a - b; });
        var curY2 = 0;
        for (var g2 = 0; g2 <= gaps2.length; g2++) {
          var gapY2 = g2 < gaps2.length ? gaps2[g2] * (WORLD_H / (numSegments + 1)) : WORLD_H;
          if (gapY2 - curY2 > 5) {
            hazards.push({
              x: waveX - 20 + waveDir * 40, y: curY2, w: 40, h: gapY2 - curY2,
              damage: atkDef.damage, color: '#660000',
              vx: waveDir, vy: 0,
              isWave: true, life: 300
            });
          }
          curY2 = gapY2 + gapHeight;
        }
      }

      screenShake = 8;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'acid_pool':
      // Create persistent toxic pools near player
      for (var ap = 0; ap < atkDef.poolCount; ap++) {
        var poolX = bossEntity.windupTarget.x + (Math.random() - 0.5) * 200;
        var poolY = bossEntity.windupTarget.y + (Math.random() - 0.5) * 200;
        poolX = Math.max(atkDef.poolRadius, Math.min(WORLD_W - atkDef.poolRadius, poolX));
        poolY = Math.max(atkDef.poolRadius, Math.min(WORLD_H - atkDef.poolRadius, poolY));
        hazards.push({
          x: poolX, y: poolY,
          w: atkDef.poolRadius * 2, h: atkDef.poolRadius * 2,
          radius: atkDef.poolRadius,
          damage: atkDef.damage, color: '#39FF14',
          vx: 0, vy: 0,
          isPool: true, isCircular: true,
          life: atkDef.poolDuration
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'boulder_roll':
      // Roll boulders vertically in lanes, skip one random lane
      var totalLanes = atkDef.boulderCount + 1;
      var laneW = WORLD_W / totalLanes;
      var safeLane = Math.floor(Math.random() * totalLanes);
      for (var bl = 0; bl < totalLanes; bl++) {
        if (bl === safeLane) continue;
        var boulderX = laneW * bl + laneW / 2;
        var fromTop = Math.random() < 0.5;
        hazards.push({
          x: boulderX, y: fromTop ? -30 : WORLD_H + 30,
          w: atkDef.boulderRadius * 2, h: atkDef.boulderRadius * 2,
          radius: atkDef.boulderRadius,
          damage: atkDef.damage, color: '#8B6914',
          vx: 0, vy: fromTop ? atkDef.boulderSpeed : -atkDef.boulderSpeed,
          isBoulder: true, isCircular: true,
          life: 300, rollAngle: 0
        });
      }
      screenShake = 10;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'enraged_roar':
      // AoE shockwave + spawn runner adds
      var roarDist = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);
      if (roarDist < atkDef.radius) {
        damagePlayer(atkDef.damage);
      }
      screenShake = 15;
      explosions.push({
        x: bossEntity.x, y: bossEntity.y,
        radius: atkDef.radius,
        life: 25, maxLife: 25
      });
      // Spawn runner adds
      var roarRoom = ROOMS[currentRoom];
      var roarCount = Math.min(atkDef.summonCount, roarRoom.spawnPoints.length);
      for (var rs = 0; rs < roarCount; rs++) {
        var rsp = roarRoom.spawnPoints[rs % roarRoom.spawnPoints.length];
        spawnRoomZombie('runner', rsp);
      }
      // Particles
      for (var rp = 0; rp < 30; rp++) {
        var ra = (rp / 30) * Math.PI * 2;
        particles.push({
          x: bossEntity.x, y: bossEntity.y,
          vx: Math.cos(ra) * (5 + Math.random() * 8),
          vy: Math.sin(ra) * (5 + Math.random() * 8),
          life: 30, maxLife: 30,
          color: '#2d5016', size: 5
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    // Ba-Ba attacks
    case 'ground_slam':
      var gsTarget = bossEntity.windupTarget;
      var gsDist = Math.hypot(player.x - gsTarget.x, player.y - gsTarget.y);
      if (gsDist < atkDef.radius) {
        damagePlayer(atkDef.damage);
      }
      screenShake = 12;
      explosions.push({
        x: gsTarget.x, y: gsTarget.y,
        radius: atkDef.radius,
        life: 20, maxLife: 20
      });
      for (var gsi = 0; gsi < 20; gsi++) {
        var gsA = (gsi / 20) * Math.PI * 2;
        particles.push({
          x: gsTarget.x, y: gsTarget.y,
          vx: Math.cos(gsA) * (3 + Math.random() * 5),
          vy: Math.sin(gsA) * (3 + Math.random() * 5),
          life: 25, maxLife: 25,
          color: '#6b3a1f', size: 4
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'boulder_toss':
      var btAngle = Math.atan2(bossEntity.windupTarget.y - bossEntity.y, bossEntity.windupTarget.x - bossEntity.x);
      for (var bti = 0; bti < atkDef.boulderCount; bti++) {
        var btSpread = (bti - (atkDef.boulderCount - 1) / 2) * 0.35;
        var btA = btAngle + btSpread;
        hazards.push({
          x: bossEntity.x, y: bossEntity.y,
          w: atkDef.boulderRadius * 2, h: atkDef.boulderRadius * 2,
          radius: atkDef.boulderRadius,
          damage: atkDef.damage, color: '#8B6914',
          vx: Math.cos(btA) * atkDef.boulderSpeed,
          vy: Math.sin(btA) * atkDef.boulderSpeed,
          isBoulder: true, isCircular: true, bounces: true,
          life: 180, rollAngle: 0
        });
      }
      screenShake = 6;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'falling_rocks':
      for (var fri = 0; fri < atkDef.rockCount; fri++) {
        var frX = Math.random() * (WORLD_W - 100) + 50;
        hazards.push({
          x: frX, y: -30,
          w: atkDef.boulderRadius * 2, h: atkDef.boulderRadius * 2,
          radius: atkDef.boulderRadius,
          damage: atkDef.damage, color: '#8B6914',
          vx: (Math.random() - 0.5) * 1,
          vy: atkDef.boulderSpeed,
          isBoulder: true, isCircular: true,
          life: 300, rollAngle: Math.random() * Math.PI * 2
        });
      }
      screenShake = 8;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    // Kephri attacks
    case 'toxic_burst':
      var tbCount = atkDef.projectileCount;
      for (var tbi = 0; tbi < tbCount; tbi++) {
        var tbAngle = (tbi / tbCount) * Math.PI * 2;
        bullets.push({
          x: bossEntity.x + Math.cos(tbAngle) * 30,
          y: bossEntity.y + Math.sin(tbAngle) * 30,
          vx: Math.cos(tbAngle) * 4,
          vy: Math.sin(tbAngle) * 4,
          damage: atkDef.damage,
          life: 90,
          owner: 'zombie',
          pierce: 0,
          isToxic: true
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'spawn_swarm':
      var swRoom = ROOMS[currentRoom];
      var swCount = Math.min(atkDef.summonCount, swRoom.spawnPoints.length);
      for (var swi = 0; swi < swCount; swi++) {
        var swSp = swRoom.spawnPoints[swi % swRoom.spawnPoints.length];
        spawnRoomZombie('runner', swSp);
      }
      showNotification('SWARM INCOMING!');
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'plague_cloud':
      hazards.push({
        x: bossEntity.x, y: bossEntity.y,
        w: atkDef.poolRadius * 2, h: atkDef.poolRadius * 2,
        radius: atkDef.poolRadius,
        damage: atkDef.damage, color: '#8833cc',
        vx: 0, vy: 0,
        isPool: true, isCircular: true,
        life: atkDef.poolDuration
      });
      screenShake = 5;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    // Akkha attacks
    case 'shadow_orbs':
      var soCount = atkDef.projectileCount;
      for (var soi = 0; soi < soCount; soi++) {
        var soAngle = (soi / soCount) * Math.PI * 2;
        bullets.push({
          x: bossEntity.x + Math.cos(soAngle) * 30,
          y: bossEntity.y + Math.sin(soAngle) * 30,
          vx: Math.cos(soAngle) * 3.5,
          vy: Math.sin(soAngle) * 3.5,
          damage: atkDef.damage,
          life: 120,
          owner: 'zombie',
          pierce: 0,
          isToxic: true
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'detonate':
      // Place timed bombs near player that explode after delay
      var dtTarget = bossEntity.windupTarget;
      for (var dti = 0; dti < atkDef.bombCount; dti++) {
        var dtA = (dti / atkDef.bombCount) * Math.PI * 2;
        var dtX = dtTarget.x + Math.cos(dtA) * 80;
        var dtY = dtTarget.y + Math.sin(dtA) * 80;
        dtX = Math.max(atkDef.bombRadius, Math.min(WORLD_W - atkDef.bombRadius, dtX));
        dtY = Math.max(atkDef.bombRadius, Math.min(WORLD_H - atkDef.bombRadius, dtY));
        hazards.push({
          x: dtX, y: dtY,
          w: atkDef.bombRadius * 2, h: atkDef.bombRadius * 2,
          radius: atkDef.bombRadius,
          damage: atkDef.damage, color: '#c4a032',
          vx: 0, vy: 0,
          isPool: true, isCircular: true, isBomb: true,
          life: 90, maxBombLife: 90,
          explosionRadius: atkDef.radius / 2
        });
      }
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'mirror_dash':
      // Boss dashes toward player's position
      var mdAngle = Math.atan2(
        bossEntity.windupTarget.y - bossEntity.y,
        bossEntity.windupTarget.x - bossEntity.x
      );
      bossEntity.chargeDir = mdAngle;
      bossEntity.attackTimer = 0;
      break;

    // Overseer attacks
    case 'laser_sweep':
      // Sweeping laser beam stored as active attack
      bossEntity.sweepAngle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x) - atkDef.sweepAngle / 2;
      bossEntity.sweepEnd = bossEntity.sweepAngle + atkDef.sweepAngle;
      bossEntity.sweepSpeed = atkDef.sweepAngle / atkDef.sweepTime;
      bossEntity.attackTimer = 0;
      break;

    case 'summon_guards':
      var sgRoom = ROOMS[currentRoom];
      var sgCount = Math.min(atkDef.summonCount, sgRoom.spawnPoints.length);
      for (var sgi = 0; sgi < sgCount; sgi++) {
        var sgSp = sgRoom.spawnPoints[sgi % sgRoom.spawnPoints.length];
        spawnRoomZombie('walker', sgSp);
      }
      showNotification('GUARDS INCOMING!');
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;

    case 'gravity_well':
      // Create gravity pool that pulls player in
      var gwTarget = bossEntity.windupTarget;
      hazards.push({
        x: gwTarget.x, y: gwTarget.y,
        w: atkDef.radius * 2, h: atkDef.radius * 2,
        radius: atkDef.radius,
        damage: atkDef.damage, color: '#2a4a6b',
        vx: 0, vy: 0,
        isPool: true, isCircular: true, isGravity: true,
        pullStrength: atkDef.pullStrength,
        life: atkDef.duration
      });
      screenShake = 5;
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;
  }
}

// ===== UPDATE BOSS ACTIVE ATTACK =====
function updateBossActiveAttack() {
  var def = BOSS_DEFS[bossEntity.bossId];
  var atkName = bossEntity.currentAttack;
  var atkDef = def.attacks[atkName];
  bossEntity.attackTimer++;

  switch (atkName) {
    case 'charge':
      // Move boss along charge direction
      var chargeSpeed = atkDef.speed;
      bossEntity.x += Math.cos(bossEntity.chargeDir) * chargeSpeed;
      bossEntity.y += Math.sin(bossEntity.chargeDir) * chargeSpeed;

      // Wall collision
      var resolved = resolveWallCollisions(bossEntity.x, bossEntity.y, bossEntity.radius);
      bossEntity.x = resolved.x;
      bossEntity.y = resolved.y;

      // Damage player on contact
      var dist = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);
      if (dist < player.radius + bossEntity.radius + 5) {
        damagePlayer(atkDef.damage);
      }

      // Charge trail
      particles.push({
        x: bossEntity.x + (Math.random() - 0.5) * 20,
        y: bossEntity.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 15, maxLife: 15,
        color: '#ff4400', size: 5
      });

      // End charge after traveling length or hitting wall (50 frames max)
      if (bossEntity.attackTimer > 50) {
        bossEntity.bossState = 'idle';
        bossEntity.attackTimer = 0;
      }
      break;

    case 'toxic_spiral':
      bossEntity.spiralTimer++;
      // Fire projectiles in rotating pattern
      if (bossEntity.spiralTimer % Math.floor(atkDef.duration / atkDef.projectiles) === 0) {
        bossEntity.spiralAngle += (Math.PI * 2) / 6; // 6 evenly spaced
        for (var arm = 0; arm < 3; arm++) {
          var angle = bossEntity.spiralAngle + (arm * Math.PI * 2 / 3);
          bullets.push({
            x: bossEntity.x + Math.cos(angle) * 30,
            y: bossEntity.y + Math.sin(angle) * 30,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4,
            damage: atkDef.damage,
            life: 90,
            owner: 'zombie',
            pierce: 0,
            isToxic: true
          });
        }
      }

      if (bossEntity.spiralTimer >= atkDef.duration) {
        bossEntity.bossState = 'idle';
        bossEntity.attackTimer = 0;
      }
      break;

    case 'summon':
      bossEntity.channelTimer++;
      // Boss stands still while channeling (DPS window)
      // Glow effect
      if (bossEntity.channelTimer % 10 === 0) {
        for (var p = 0; p < 6; p++) {
          var a = (p / 6) * Math.PI * 2;
          particles.push({
            x: bossEntity.x + Math.cos(a) * 50,
            y: bossEntity.y + Math.sin(a) * 50,
            vx: -Math.cos(a) * 2,
            vy: -Math.sin(a) * 2,
            life: 15, maxLife: 15,
            color: '#44ff44', size: 3
          });
        }
      }

      if (bossEntity.channelTimer >= atkDef.channelTime) {
        bossEntity.bossState = 'idle';
        bossEntity.attackTimer = 0;
      }
      break;

    case 'mirror_dash':
      // Same as charge logic
      var mdSpeed = def.attacks['mirror_dash'].speed;
      bossEntity.x += Math.cos(bossEntity.chargeDir) * mdSpeed;
      bossEntity.y += Math.sin(bossEntity.chargeDir) * mdSpeed;
      var mdRes = resolveWallCollisions(bossEntity.x, bossEntity.y, bossEntity.radius);
      bossEntity.x = mdRes.x;
      bossEntity.y = mdRes.y;
      var mdDist = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);
      if (mdDist < player.radius + bossEntity.radius + 5) {
        damagePlayer(def.attacks['mirror_dash'].damage);
      }
      particles.push({
        x: bossEntity.x + (Math.random() - 0.5) * 20,
        y: bossEntity.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
        life: 15, maxLife: 15, color: '#c4a032', size: 5
      });
      if (bossEntity.attackTimer > 30) {
        bossEntity.bossState = 'idle';
        bossEntity.attackTimer = 0;
      }
      break;

    case 'laser_sweep':
      // Sweeping laser beam damages player if in path
      bossEntity.sweepAngle += bossEntity.sweepSpeed;
      var laserLen = def.attacks['laser_sweep'].length;
      var laserW = def.attacks['laser_sweep'].width;
      // Check if player is in laser path
      var pAngle = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x);
      var pDist = Math.hypot(player.x - bossEntity.x, player.y - bossEntity.y);
      var angleDiff = Math.abs(pAngle - bossEntity.sweepAngle);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      if (pDist < laserLen && angleDiff < laserW / pDist) {
        if (bossEntity.attackTimer % 15 === 0) {
          damagePlayer(def.attacks['laser_sweep'].damage);
        }
      }
      // Laser particles
      for (var lp = 0; lp < 3; lp++) {
        var lpR = Math.random() * laserLen;
        particles.push({
          x: bossEntity.x + Math.cos(bossEntity.sweepAngle) * lpR,
          y: bossEntity.y + Math.sin(bossEntity.sweepAngle) * lpR,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          life: 10, maxLife: 10, color: '#4488ff', size: 3
        });
      }
      if (bossEntity.sweepAngle >= bossEntity.sweepEnd) {
        bossEntity.bossState = 'idle';
        bossEntity.attackTimer = 0;
      }
      break;

    default:
      bossEntity.bossState = 'idle';
      bossEntity.attackTimer = 0;
      break;
  }
}

// ===== UPDATE TELEGRAPHS =====
function updateTelegraphs() {
  telegraphs = telegraphs.filter(function(t) {
    t.timer++;
    return t.timer < t.maxTime && t.active;
  });
}

// ===== RENDER BOSS HEALTH BAR =====
function renderBossHealthBar() {
  if (!bossEntity || bossEntity.dead) return;

  var barW = 400;
  var barH = 16;
  var barX = (canvas.width - barW) / 2;
  var barY = canvas.height - 50;
  var def = BOSS_DEFS[bossEntity.bossId];

  // Background
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to screen space

  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

  // HP fill
  var hpPercent = bossEntity.hp / bossEntity.maxHp;
  var gradient = ctx.createLinearGradient(barX, barY, barX + barW * hpPercent, barY);
  if (bossEntity.bossId === 'amalgam') {
    gradient.addColorStop(0, '#1a3a0a');
    gradient.addColorStop(1, '#2d5016');
  } else if (bossEntity.bossId === 'baba') {
    gradient.addColorStop(0, '#3a1a0a');
    gradient.addColorStop(1, '#6b3a1f');
  } else if (bossEntity.bossId === 'kephri') {
    gradient.addColorStop(0, '#2a0630');
    gradient.addColorStop(1, '#4a0e4e');
  } else if (bossEntity.bossId === 'akkha') {
    gradient.addColorStop(0, '#6b5010');
    gradient.addColorStop(1, '#c4a032');
  } else if (bossEntity.bossId === 'overseer') {
    gradient.addColorStop(0, '#152535');
    gradient.addColorStop(1, '#2a4a6b');
  } else {
    gradient.addColorStop(0, '#cc0044');
    gradient.addColorStop(1, '#ff0066');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(barX, barY, barW * hpPercent, barH);

  // Phase markers
  for (var p = 1; p < def.phases.length; p++) {
    var markerX = barX + barW * def.phases[p].hpPercent;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(markerX, barY - 2);
    ctx.lineTo(markerX, barY + barH + 2);
    ctx.stroke();
  }

  // Border
  var bossAccent = '#ff0066';
  if (bossEntity.bossId === 'amalgam') bossAccent = '#4a8c2a';
  else if (bossEntity.bossId === 'baba') bossAccent = '#a05a2f';
  else if (bossEntity.bossId === 'kephri') bossAccent = '#8833cc';
  else if (bossEntity.bossId === 'akkha') bossAccent = '#c4a032';
  else if (bossEntity.bossId === 'overseer') bossAccent = '#4488ff';
  ctx.strokeStyle = bossEntity.invulnTimer > 0 ? '#ffff00' : bossAccent;
  ctx.lineWidth = 1;
  ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);

  // Boss name
  ctx.fillStyle = bossAccent;
  ctx.font = "bold 12px 'Orbitron', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(def.name, canvas.width / 2, barY - 8);

  ctx.restore();
}
