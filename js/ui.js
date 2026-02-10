// ============================================================
// ZOMBIE COMP ODYSSEY - UI & HUD
// ============================================================

function showClassSelect() {
  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('class-screen').classList.add('active');
}

function updateHUD() {
  document.getElementById('health-bar').style.width = (player.hp / player.maxHp * 100) + '%';
  document.getElementById('shield-bar').style.width = (player.shield / player.maxShield * 100) + '%';
  document.getElementById('xp-bar').style.width = (player.xp / player.xpToNext * 100) + '%';
  document.getElementById('level-display').textContent = 'LVL ' + player.level;
  document.getElementById('score-display').textContent = Math.floor(score);
  document.getElementById('kills-display').textContent = 'KILLS: ' + kills;
  var slotLabel = '[' + player.activeWeaponSlot + '] ';
  document.getElementById('weapon-display').textContent = slotLabel + player.weapon.name + (player.reloading ? ' [RELOADING]' : '');
  document.getElementById('ammo-mag').textContent = player.ammo;

  // Wave / Room display
  if (gameMode === 'odyssey') {
    if (hubRoom) {
      var cleared = Object.keys(roomsCleared).length;
      document.getElementById('wave-display').textContent = 'HUB - ' + Math.min(cleared, 4) + '/4 CLEARED';
    } else {
      var roomName = ROOMS[currentRoom].name;
      if (ROOMS[currentRoom].type === 'staged') {
        roomName += roomStage === 'pre' ? ' [CHALLENGE]' : ' [BOSS]';
      }
      document.getElementById('wave-display').textContent = roomName;
    }
  }

  // Combo display
  var comboEl = document.getElementById('combo-display');
  if (combo >= 3) {
    comboEl.textContent = combo + 'x COMBO!';
    comboEl.classList.add('show');
  } else {
    comboEl.classList.remove('show');
  }
}

function showNotification(text) {
  var el = document.createElement('div');
  el.className = 'pickup-notify';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 1500);
}

function showDamageNumber(x, y, dmg, crit) {
  var el = document.createElement('div');
  el.className = 'damage-number' + (crit ? ' crit' : '');
  el.textContent = dmg;
  el.style.left = ((x - camera.x) * cameraZoom) + 'px';
  el.style.top = ((y - camera.y) * cameraZoom) + 'px';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 800);
}

function showWaveBanner(waveNum) {
  var banner = document.getElementById('wave-banner');
  var tags = ["THEY'RE COMING", 'NO MERCY', 'HOLD THE LINE', 'BRACE YOURSELF',
              'UNLEASH HELL', 'SURVIVE', 'BLOOD MOON RISING', 'DEATH APPROACHES'];

  if (waveNum % 5 === 0) {
    banner.innerHTML = 'BOSS WAVE ' + waveNum + '<span class="sub">PREPARE YOURSELF</span>';
  } else {
    var tagline = tags[Math.floor(Math.random() * tags.length)];
    banner.innerHTML = 'WAVE ' + waveNum + '<span class="sub">' + tagline + '</span>';
  }
  banner.classList.add('show');
  setTimeout(function() { banner.classList.remove('show'); }, 2500);
  document.getElementById('wave-display').textContent = 'WAVE ' + waveNum;
}

// ===== ROOM BANNER =====
function showRoomBanner(room) {
  var banner = document.getElementById('wave-banner');

  if (room.type === 'hub') {
    var cleared = Object.keys(roomsCleared).length;
    banner.innerHTML = room.name + '<span class="sub">' + cleared + '/4 CLEARED - ' + room.tagline + '</span>';
    banner.classList.add('show');
    setTimeout(function() { banner.classList.remove('show'); }, 3000);
    document.getElementById('wave-display').textContent = 'HUB - ' + cleared + '/4 CLEARED';
    return;
  }

  var typeLabel = room.type === 'staged' ? (room.preStage.type.toUpperCase() + ' + BOSS') : room.type.toUpperCase();
  banner.innerHTML = room.name + '<span class="sub">' + typeLabel + ' - ' + room.tagline + '</span>';
  banner.classList.add('show');
  setTimeout(function() { banner.classList.remove('show'); }, 3000);
  document.getElementById('wave-display').textContent = room.name;
}

// ===== ROOM TRANSITION (perk pick between rooms) =====
function showRoomTransition(callback) {
  gamePaused = true;
  var screen = document.getElementById('levelup-screen');
  var grid = document.getElementById('perk-grid');
  var titleEl = screen.querySelector('.levelup-title');
  var subtitleEl = screen.querySelector('.levelup-subtitle');

  titleEl.textContent = 'ROOM CLEARED!';
  subtitleEl.textContent = 'CHOOSE A PERK';

  screen.classList.add('active');
  grid.innerHTML = '';

  var available = ALL_PERKS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 3);

  available.forEach(function(perk) {
    var card = document.createElement('div');
    card.className = 'perk-card';
    card.innerHTML =
      '<div class="perk-icon">' + perk.icon + '</div>' +
      '<div class="perk-name">' + perk.name + '</div>' +
      '<div class="perk-desc">' + perk.desc + '</div>';
    card.onclick = function() {
      perk.apply(player);
      player.perks.push(perk.name);
      screen.classList.remove('active');
      // Reset title for normal level-ups
      titleEl.textContent = 'LEVEL UP!';
      gamePaused = false;
      if (callback) callback();
    };
    grid.appendChild(card);
  });
}

// ===== VICTORY SCREEN =====
function showVictoryScreen() {
  gameRunning = false;

  var screen = document.getElementById('gameover-screen');
  var titleEl = screen.querySelector('.gameover-title');
  titleEl.textContent = 'EXTRACTED!';
  titleEl.style.color = '#8FA85A';
  titleEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.6)';

  document.getElementById('go-wave').textContent = 'ALL';
  document.getElementById('go-kills').textContent = kills;
  document.getElementById('go-score').textContent = Math.floor(score);
  document.getElementById('go-level').textContent = player.level;

  // Change stat label
  var statLabels = screen.querySelectorAll('.gameover-stat-label');
  if (statLabels.length > 0) statLabels[0].textContent = 'ROOMS';

  screen.classList.add('active');
}
