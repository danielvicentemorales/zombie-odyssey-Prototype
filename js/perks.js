// ============================================================
// ZOMBIE COMP ODYSSEY - Perk / Level-Up System
// ============================================================

function checkLevelUp() {
  if (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = Math.floor(player.xpToNext * 1.5);
    showLevelUp();
  }
}

function showLevelUp() {
  gamePaused = true;
  var screen = document.getElementById('levelup-screen');
  var grid = document.getElementById('perk-grid');
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
      gamePaused = false;
    };
    grid.appendChild(card);
  });
}
