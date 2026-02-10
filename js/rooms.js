// ============================================================
// ZOMBIE COMP ODYSSEY - Room System Core
// ============================================================

var ROOMS = [
  // Room 0: THE BREACH (combat preStage → Ba-Ba boss)
  {
    name: 'THE BREACH',
    type: 'staged',
    tagline: 'THE BRUTE AWAITS',
    width: 1400,
    height: 1100,
    playerSpawn: { x: 700, y: 950 },
    exitPos: { x: 700, y: 60, w: 80, h: 40 },
    preStage: {
      type: 'combat',
      enemies: [
        { type: 'walker', count: 8 },
        { type: 'tank', count: 2 }
      ],
      notification: 'CLEAR THE BREACH!'
    },
    enemies: [],
    spawnPoints: [
      { x: 200, y: 200 }, { x: 700, y: 150 }, { x: 1200, y: 200 },
      { x: 200, y: 550 }, { x: 1200, y: 550 }
    ],
    walls: [
      { x: 400, y: 400, w: 60, h: 60 },
      { x: 940, y: 400, w: 60, h: 60 },
      { x: 670, y: 650, w: 60, h: 60 }
    ],
    bossId: 'baba'
  },

  // Room 1: CONTAMINATION ZONE (combat preStage → Kephri boss)
  {
    name: 'CONTAMINATION ZONE',
    type: 'staged',
    tagline: 'THE PLAGUE FESTERS',
    width: 1600,
    height: 1200,
    playerSpawn: { x: 800, y: 1050 },
    exitPos: { x: 800, y: 60, w: 80, h: 40 },
    preStage: {
      type: 'combat',
      enemies: [
        { type: 'walker', count: 6 },
        { type: 'runner', count: 6 },
        { type: 'spitter', count: 3 }
      ],
      notification: 'PURGE THE INFECTION!'
    },
    enemies: [],
    spawnPoints: [
      { x: 200, y: 200 }, { x: 800, y: 150 }, { x: 1400, y: 200 },
      { x: 200, y: 600 }, { x: 1400, y: 600 },
      { x: 400, y: 400 }, { x: 1200, y: 400 }
    ],
    walls: [
      { x: 450, y: 350, w: 60, h: 60 },
      { x: 1090, y: 350, w: 60, h: 60 },
      { x: 750, y: 550, w: 100, h: 40 },
      { x: 350, y: 800, w: 60, h: 60 },
      { x: 1190, y: 800, w: 60, h: 60 }
    ],
    bossId: 'kephri'
  },

  // Room 2: THE LOCKDOWN (puzzle preStage → Akkha boss)
  {
    name: 'THE LOCKDOWN',
    type: 'staged',
    tagline: 'FIND THE SEQUENCE',
    width: 1400,
    height: 1000,
    playerSpawn: { x: 700, y: 850 },
    exitPos: { x: 700, y: 60, w: 80, h: 40 },
    preStage: {
      type: 'puzzle',
      puzzleId: 'lockdown_switches',
      notification: 'SOLVE THE LOCKDOWN!'
    },
    enemies: [],
    spawnPoints: [
      { x: 200, y: 200 }, { x: 700, y: 150 }, { x: 1200, y: 200 },
      { x: 200, y: 500 }, { x: 1200, y: 500 }
    ],
    walls: [
      // Dividing walls with doorways
      { x: 0, y: 300, w: 500, h: 40 },
      { x: 600, y: 300, w: 800, h: 40 },
      { x: 0, y: 600, w: 800, h: 40 },
      { x: 900, y: 600, w: 500, h: 40 },
      // Obstacles
      { x: 300, y: 150, w: 60, h: 60 },
      { x: 1040, y: 150, w: 60, h: 60 },
      { x: 600, y: 700, w: 60, h: 60 },
    ],
    bossId: 'akkha'
  },

  // Room 3: HORDE CORRIDOR (combat preStage → Overseer boss)
  {
    name: 'HORDE CORRIDOR',
    type: 'staged',
    tagline: 'PUSH THROUGH',
    width: 600,
    height: 2400,
    playerSpawn: { x: 300, y: 2250 },
    exitPos: { x: 300, y: 60, w: 80, h: 40 },
    preStage: {
      type: 'combat',
      enemies: [
        { type: 'walker', count: 14 },
        { type: 'runner', count: 10 },
        { type: 'tank', count: 4 },
        { type: 'exploder', count: 4 }
      ],
      notification: 'PUSH THROUGH THE HORDE!'
    },
    enemies: [],
    spawnPoints: [
      { x: 150, y: 1800 }, { x: 450, y: 1800 },
      { x: 150, y: 1400 }, { x: 450, y: 1400 },
      { x: 150, y: 1000 }, { x: 450, y: 1000 },
      { x: 150, y: 600 }, { x: 450, y: 600 },
      { x: 300, y: 300 }
    ],
    walls: [
      // Chokepoint walls - alternating sides
      { x: 0, y: 1900, w: 200, h: 40 },
      { x: 400, y: 1600, w: 200, h: 40 },
      { x: 0, y: 1300, w: 250, h: 40 },
      { x: 350, y: 1000, w: 250, h: 40 },
      { x: 0, y: 700, w: 200, h: 40 },
      { x: 400, y: 400, w: 200, h: 40 },
      // Cover pillars
      { x: 270, y: 1750, w: 60, h: 60 },
      { x: 270, y: 1150, w: 60, h: 60 },
      { x: 270, y: 550, w: 60, h: 60 }
    ],
    bossId: 'overseer'
  },

  // Room 4: THE AMALGAM (final boss)
  {
    name: 'THE AMALGAM',
    type: 'boss',
    tagline: 'FACE THE ABOMINATION',
    width: 2000,
    height: 1100,
    playerSpawn: { x: 1000, y: 950 },
    exitPos: { x: 1000, y: 60, w: 80, h: 40 },
    enemies: [],
    spawnPoints: [
      { x: 100, y: 100 }, { x: 1900, y: 100 },
      { x: 100, y: 1000 }, { x: 1900, y: 1000 }
    ],
    walls: [
      // 2 small pillars for minimal cover
      { x: 650, y: 500, w: 50, h: 50 },
      { x: 1300, y: 500, w: 50, h: 50 }
    ],
    bossId: 'amalgam'
  },

  // Room 5: EXTRACTION (extraction)
  {
    name: 'EXTRACTION',
    type: 'extraction',
    tagline: 'GET OUT ALIVE',
    width: 1200,
    height: 1200,
    playerSpawn: { x: 600, y: 1050 },
    exitPos: null, // No exit zone - extraction beacon instead
    enemies: [],
    spawnPoints: [
      { x: 100, y: 100 }, { x: 600, y: 100 }, { x: 1100, y: 100 },
      { x: 100, y: 600 }, { x: 1100, y: 600 },
      { x: 100, y: 1100 }, { x: 1100, y: 1100 }
    ],
    walls: [
      // Light cover around beacon
      { x: 500, y: 500, w: 40, h: 120 },
      { x: 660, y: 500, w: 40, h: 120 },
      { x: 520, y: 480, w: 160, h: 40 },
      // Outer walls
      { x: 200, y: 300, w: 80, h: 80 },
      { x: 920, y: 300, w: 80, h: 80 },
      { x: 200, y: 820, w: 80, h: 80 },
      { x: 920, y: 820, w: 80, h: 80 }
    ],
    beaconPos: { x: 600, y: 600 }
  }
];

// ===== HUB ROOM =====
var HUB_ROOM = {
  name: 'THE NEXUS',
  type: 'hub',
  tagline: 'CHOOSE YOUR PATH',
  width: 1600,
  height: 1200
};

function initHub() {
  hubRoom = true;
  roomState = 'active';
  roomCleared = false;
  roomTimer = 0;

  WORLD_W = HUB_ROOM.width;
  WORLD_H = HUB_ROOM.height;

  // Clear entities
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
  roomEnemyQueue = [];
  bossEntity = null;
  extractionProgress = 0;
  extractionActive = false;
  exitZone = null;

  // Build boundary walls
  roomWalls = [];
  roomWalls.push({ x: -50, y: -50, w: HUB_ROOM.width + 100, h: 50, boundary: true });
  roomWalls.push({ x: -50, y: HUB_ROOM.height, w: HUB_ROOM.width + 100, h: 50, boundary: true });
  roomWalls.push({ x: -50, y: -50, w: 50, h: HUB_ROOM.height + 100, boundary: true });
  roomWalls.push({ x: HUB_ROOM.width, y: -50, w: 50, h: HUB_ROOM.height + 100, boundary: true });

  // Decorative walls in hub
  roomWalls.push({ x: 300, y: 200, w: 40, h: 200 });
  roomWalls.push({ x: 1260, y: 200, w: 40, h: 200 });
  roomWalls.push({ x: 300, y: 800, w: 40, h: 200 });
  roomWalls.push({ x: 1260, y: 800, w: 40, h: 200 });

  // Position player at bottom center
  player.x = HUB_ROOM.width / 2;
  player.y = HUB_ROOM.height - 150;

  // Heal player between hub visits (except first time)
  var cleared = Object.keys(roomsCleared).length;
  if (cleared > 0) {
    var heal = Math.floor(player.maxHp * 0.25);
    player.hp = Math.min(player.hp + heal, player.maxHp);
  }

  // Create challenge portals in semicircle
  hubPortals = [];
  var centerX = HUB_ROOM.width / 2;
  var centerY = HUB_ROOM.height / 2 - 50;
  var portalRadius = 350;
  var portalNames = ['THE BREACH', 'CONTAMINATION ZONE', 'THE LOCKDOWN', 'HORDE CORRIDOR'];

  for (var i = 0; i < challengeRooms.length; i++) {
    var angle = Math.PI + (i / (challengeRooms.length - 1)) * Math.PI; // semicircle from left to right
    var px = centerX + Math.cos(angle) * portalRadius;
    var py = centerY + Math.sin(angle) * portalRadius;
    var roomIdx = challengeRooms[i];
    var isCleared = roomsCleared[roomIdx] === true;

    var portal = {
      x: px,
      y: py,
      radius: 30,
      interactRadius: 70,
      type: 'portal',
      roomIndex: roomIdx,
      roomName: portalNames[i],
      cleared: isCleared,
      locked: false,
      active: true,
      inRange: false,
      label: portalNames[i],
      onInteract: (function(idx) {
        return function(obj) {
          if (!obj.cleared && !obj.locked) {
            enterChallengeRoom(idx);
          }
        };
      })(roomIdx)
    };

    interactables.push(portal);
    hubPortals.push(portal);
  }

  // Boss portal - centered, above semicircle
  var allCleared = true;
  for (var c = 0; c < challengeRooms.length; c++) {
    if (!roomsCleared[challengeRooms[c]]) { allCleared = false; break; }
  }

  var bossPortal = {
    x: centerX,
    y: centerY - portalRadius + 50,
    radius: 40,
    interactRadius: 80,
    type: 'portal',
    roomIndex: bossRoomIndex,
    roomName: 'THE AMALGAM',
    cleared: false,
    locked: !allCleared,
    isBoss: true,
    active: true,
    inRange: false,
    label: 'THE AMALGAM',
    onInteract: function(obj) {
      if (!obj.locked && !obj.cleared) {
        enterChallengeRoom(bossRoomIndex);
      }
    }
  };

  interactables.push(bossPortal);
  hubPortals.push(bossPortal);

  // Show hub banner
  showRoomBanner(HUB_ROOM);
}

function enterChallengeRoom(roomIndex) {
  hubRoom = false;
  initRoom(roomIndex);
}

// ===== INIT ROOM =====
function initRoom(index) {
  var room = ROOMS[index];
  currentRoom = index;
  roomState = 'active';
  roomCleared = false;
  roomTimer = 0;

  // Set world size to room size
  WORLD_W = room.width;
  WORLD_H = room.height;

  // Clear entities (but NOT player stats/perks)
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
  roomEnemyQueue = [];
  bossEntity = null;
  extractionProgress = 0;
  extractionActive = false;

  // Build walls
  roomWalls = [];
  // World boundary walls (invisible but collideable)
  roomWalls.push({ x: -50, y: -50, w: room.width + 100, h: 50, boundary: true }); // top
  roomWalls.push({ x: -50, y: room.height, w: room.width + 100, h: 50, boundary: true }); // bottom
  roomWalls.push({ x: -50, y: -50, w: 50, h: room.height + 100, boundary: true }); // left
  roomWalls.push({ x: room.width, y: -50, w: 50, h: room.height + 100, boundary: true }); // right

  // Room walls
  if (room.walls) {
    for (var i = 0; i < room.walls.length; i++) {
      roomWalls.push(room.walls[i]);
    }
  }

  // Setup exit zone
  if (room.exitPos) {
    exitZone = {
      x: room.exitPos.x - room.exitPos.w / 2,
      y: room.exitPos.y - room.exitPos.h / 2,
      w: room.exitPos.w,
      h: room.exitPos.h,
      locked: true
    };
  } else {
    exitZone = null;
  }

  // Position player
  player.x = room.playerSpawn.x;
  player.y = room.playerSpawn.y;

  // Between-room heal (25% max HP) except first room
  if (index > 0) {
    var heal = Math.floor(player.maxHp * 0.25);
    player.hp = Math.min(player.hp + heal, player.maxHp);
  }

  // Staged rooms: start with pre-stage
  if (room.type === 'staged') {
    roomStage = 'pre';
    var pre = room.preStage;

    if (pre.type === 'combat') {
      var queue = [];
      for (var e = 0; e < pre.enemies.length; e++) {
        var entry = pre.enemies[e];
        for (var c = 0; c < entry.count; c++) {
          queue.push(entry.type);
        }
      }
      for (var s = queue.length - 1; s > 0; s--) {
        var j = Math.floor(Math.random() * (s + 1));
        var tmp = queue[s]; queue[s] = queue[j]; queue[j] = tmp;
      }
      roomEnemyQueue = queue;
      zombiesRemaining = queue.length;
    }

    if (pre.type === 'puzzle') {
      initPuzzle(pre.puzzleId);
    }

    if (pre.notification) {
      showNotification(pre.notification);
    }
  }

  // Queue enemies for combat rooms
  if (room.type === 'combat') {
    var queue = [];
    for (var e = 0; e < room.enemies.length; e++) {
      var entry = room.enemies[e];
      for (var c = 0; c < entry.count; c++) {
        queue.push(entry.type);
      }
    }
    for (var s = queue.length - 1; s > 0; s--) {
      var j = Math.floor(Math.random() * (s + 1));
      var tmp = queue[s]; queue[s] = queue[j]; queue[j] = tmp;
    }
    roomEnemyQueue = queue;
    zombiesRemaining = queue.length;
  }

  // Boss room (non-staged)
  if (room.type === 'boss' && room.bossId) {
    initBoss(room.bossId);
  }

  // Puzzle room (non-staged)
  if (room.type === 'puzzle') {
    initPuzzle('lockdown_switches');
  }

  // Extraction room
  if (room.type === 'extraction') {
    initExtraction(room.beaconPos);
  }

  // Show banner
  showRoomBanner(room);
}

// ===== TRANSITION PRE-STAGE TO BOSS =====
function transitionToBoss() {
  var room = ROOMS[currentRoom];
  if (!room.bossId) return;

  roomStage = 'boss';

  // Clear remaining entities but keep player state
  zombies = [];
  bullets = [];
  hazards = [];
  telegraphs = [];
  interactables = [];
  roomEnemyQueue = [];
  roomCleared = false;
  roomTimer = 0;

  // Remove non-boundary walls for boss arena (keep it open)
  var newWalls = [];
  for (var wi = 0; wi < roomWalls.length; wi++) {
    if (roomWalls[wi].boundary) newWalls.push(roomWalls[wi]);
  }
  // Add just a couple of cover pillars for the boss fight
  var cx = room.width / 2;
  var cy = room.height / 2;
  newWalls.push({ x: cx - 200, y: cy - 25, w: 50, h: 50 });
  newWalls.push({ x: cx + 150, y: cy - 25, w: 50, h: 50 });
  roomWalls = newWalls;

  // Reposition player to bottom center of arena
  player.x = room.width / 2;
  player.y = room.height - 100;

  // Spawn the boss
  initBoss(room.bossId);

  // Show boss banner
  var def = BOSS_DEFS[room.bossId];
  showNotification('BOSS: ' + def.name);
  screenShake = 8;
}

// ===== UPDATE ROOM =====
function updateRoom() {
  if (hubRoom) return;
  if (roomState === 'transitioning') return;

  var room = ROOMS[currentRoom];
  roomTimer++;

  // Staged rooms
  if (room.type === 'staged') {
    if (roomStage === 'pre') {
      var pre = room.preStage;

      if (pre.type === 'combat') {
        // Spawn enemies from queue
        if (roomEnemyQueue.length > 0 && roomTimer % 30 === 0) {
          var batchSize = Math.min(3, roomEnemyQueue.length);
          for (var i = 0; i < batchSize; i++) {
            var type = roomEnemyQueue.shift();
            var sp = room.spawnPoints[Math.floor(Math.random() * room.spawnPoints.length)];
            spawnRoomZombie(type, sp);
          }
        }

        // Pre-stage cleared → transition to boss
        if (roomEnemyQueue.length === 0 && zombies.length === 0 && roomTimer > 60) {
          transitionToBoss();
        }
      }

      if (pre.type === 'puzzle') {
        // Puzzle pre-stage clears via puzzle system (roomCleared gets set)
        if (roomCleared) {
          roomCleared = false; // Reset for boss stage
          transitionToBoss();
        }
      }
    } else if (roomStage === 'boss') {
      // Boss stage: clears when boss dies
      if (bossEntity && bossEntity.dead && !roomCleared) {
        roomCleared = true;
        if (exitZone) exitZone.locked = false;
        showNotification('BOSS DEFEATED!');
      }
    }
  }

  if (room.type === 'combat') {
    // Spawn enemies from queue
    if (roomEnemyQueue.length > 0 && roomTimer % 30 === 0) {
      var batchSize = Math.min(3, roomEnemyQueue.length);
      for (var i = 0; i < batchSize; i++) {
        var type = roomEnemyQueue.shift();
        var sp = room.spawnPoints[Math.floor(Math.random() * room.spawnPoints.length)];
        spawnRoomZombie(type, sp);
      }
    }

    // Check clear condition
    if (roomEnemyQueue.length === 0 && zombies.length === 0 && !roomCleared) {
      roomCleared = true;
      if (exitZone) exitZone.locked = false;
      showNotification('ROOM CLEARED!');
    }
  }

  if (room.type === 'boss') {
    // Boss room clears when boss is dead
    if (bossEntity && bossEntity.dead && !roomCleared) {
      roomCleared = true;
      if (exitZone) exitZone.locked = false;
      showNotification('BOSS DEFEATED!');
    }
  }

  // Check exit zone
  if (exitZone && !exitZone.locked && roomCleared) {
    if (player.x > exitZone.x && player.x < exitZone.x + exitZone.w &&
        player.y > exitZone.y && player.y < exitZone.y + exitZone.h) {
      transitionToNextRoom();
    }
  }
}

// ===== TRANSITION TO NEXT ROOM =====
function transitionToNextRoom() {
  if (roomState === 'transitioning') return;
  roomState = 'transitioning';

  // Mark current room as cleared
  roomsCleared[currentRoom] = true;

  // Extraction room = victory
  if (currentRoom === extractionRoomIndex) {
    showVictoryScreen();
    return;
  }

  // Boss room: perk pick → go to extraction
  if (currentRoom === bossRoomIndex) {
    showRoomTransition(function() {
      hubRoom = false;
      initRoom(extractionRoomIndex);
    });
    return;
  }

  // Challenge room: perk pick → return to hub
  showRoomTransition(function() {
    initHub();
  });
}

// ===== WALL COLLISION =====
function resolveWallCollisions(x, y, radius) {
  if (gameMode !== 'odyssey') return { x: x, y: y };

  for (var i = 0; i < roomWalls.length; i++) {
    var w = roomWalls[i];

    // Find closest point on rect to circle center
    var closestX = Math.max(w.x, Math.min(x, w.x + w.w));
    var closestY = Math.max(w.y, Math.min(y, w.y + w.h));

    var dx = x - closestX;
    var dy = y - closestY;
    var distSq = dx * dx + dy * dy;

    if (distSq < radius * radius) {
      var dist = Math.sqrt(distSq);
      if (dist === 0) {
        // Center is inside rect - push out along shortest axis
        var overlapLeft = (x + radius) - w.x;
        var overlapRight = (w.x + w.w) - (x - radius);
        var overlapTop = (y + radius) - w.y;
        var overlapBottom = (w.y + w.h) - (y - radius);

        var minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        if (minOverlap === overlapLeft) x = w.x - radius;
        else if (minOverlap === overlapRight) x = w.x + w.w + radius;
        else if (minOverlap === overlapTop) y = w.y - radius;
        else y = w.y + w.h + radius;
      } else {
        var overlap = radius - dist;
        x += (dx / dist) * overlap;
        y += (dy / dist) * overlap;
      }
    }
  }

  return { x: x, y: y };
}

// ===== BULLET-WALL COLLISION =====
function bulletHitsWall(bx, by) {
  if (gameMode !== 'odyssey') return false;

  for (var i = 0; i < roomWalls.length; i++) {
    var w = roomWalls[i];
    if (w.boundary) continue; // Don't collide bullets with boundary walls
    if (bx >= w.x && bx <= w.x + w.w && by >= w.y && by <= w.y + w.h) {
      return true;
    }
  }
  return false;
}

// ===== SPAWN ROOM ZOMBIE =====
function spawnRoomZombie(type, spawnPoint) {
  var base = ZOMBIE_TYPES[type];
  var progress = Object.keys(roomsCleared).length;
  var roomScale = 1 + progress * 0.15; // Scale with rooms cleared

  var sx = spawnPoint.x + (Math.random() - 0.5) * 60;
  var sy = spawnPoint.y + (Math.random() - 0.5) * 60;

  zombies.push({
    x: Math.max(20, Math.min(WORLD_W - 20, sx)),
    y: Math.max(20, Math.min(WORLD_H - 20, sy)),
    vx: 0, vy: 0,
    hp: Math.floor(base.hp * roomScale),
    maxHp: Math.floor(base.hp * roomScale),
    speed: base.speed + progress * 0.05,
    damage: Math.floor(base.damage * (1 + progress * 0.1)),
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
    boss: false,
    shootCd: 0,
    knockback: 0,
    kbx: 0, kby: 0
  });
}
