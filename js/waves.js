// ============================================================
// ZOMBIE COMP ODYSSEY - Wave System
// ============================================================

function startWave() {
  wave++;
  waveCooldown = 180; // 3 second breather
  showWaveBanner(wave);
}

function getWaveTagline() {
  var tags = ["THEY'RE COMING", 'NO MERCY', 'HOLD THE LINE', 'BRACE YOURSELF',
              'UNLEASH HELL', 'SURVIVE', 'BLOOD MOON RISING', 'DEATH APPROACHES'];
  return tags[Math.floor(Math.random() * tags.length)];
}

function spawnWaveZombies() {
  var count = Math.floor(5 + wave * 2.5 + wave * wave * 0.15);
  zombiesRemaining = count;

  for (var i = 0; i < count; i++) {
    (function(delay) {
      setTimeout(function() {
        if (!gameRunning) return;
        spawnZombie();
      }, delay);
    })(i * Math.max(100, 500 - wave * 20));
  }

  // Boss every 5 waves
  if (wave % 5 === 0) {
    setTimeout(function() {
      if (!gameRunning) return;
      spawnZombie('boss');
    }, 2000);
  }
}

function spawnZombie(forceType) {
  var angle = Math.random() * Math.PI * 2;
  var dist = 500 + Math.random() * 300;
  var x = player.x + Math.cos(angle) * dist;
  var y = player.y + Math.sin(angle) * dist;

  var type = forceType;
  if (!type) {
    var r = Math.random();
    if (wave < 3) type = 'walker';
    else if (r < 0.4) type = 'walker';
    else if (r < 0.6) type = 'runner';
    else if (r < 0.75) type = 'tank';
    else if (r < 0.88) type = 'spitter';
    else type = 'exploder';
  }

  var base = ZOMBIE_TYPES[type];
  var waveScale = 1 + (wave - 1) * 0.12;

  var zombie = {
    x: Math.max(20, Math.min(WORLD_W - 20, x)),
    y: Math.max(20, Math.min(WORLD_H - 20, y)),
    vx: 0, vy: 0,
    hp: Math.floor(base.hp * waveScale),
    maxHp: Math.floor(base.hp * waveScale),
    speed: base.speed + (wave - 1) * 0.02,
    damage: Math.floor(base.damage * (1 + (wave - 1) * 0.08)),
    radius: base.radius,
    color: base.color,
    type: type,
    xp: base.xp,
    score: base.score,
    attackCd: 0,
    burning: 0,
    slowed: 0,
    stunned: 0,
    ranged: base.ranged || false,
    explodes: base.explodes || false,
    boss: base.boss || false,
    shootCd: 0,
    knockback: 0,
    kbx: 0, kby: 0
  };

  if (type === 'spitter') {
    var patterns = ['spread', 'burst', 'aimed_double'];
    zombie.patternType = patterns[Math.floor(Math.random() * patterns.length)];
    zombie.burstQueue = 0;
    zombie.burstTimer = 0;
    zombie.burstAngle = 0;
  }

  zombies.push(zombie);
}
