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
  document.getElementById('weapon-display').textContent = player.weapon.name + (player.reloading ? ' [RELOADING]' : '');
  document.getElementById('ammo-mag').textContent = player.ammo;

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
  el.textContent = (crit ? '💥' : '') + dmg;
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
