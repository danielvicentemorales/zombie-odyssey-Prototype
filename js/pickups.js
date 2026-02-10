// ============================================================
// ZOMBIE COMP ODYSSEY - Pickup System
// ============================================================

function spawnPickup(x, y, luck) {
  var r = Math.random() * luck;
  var type;
  if (r < 0.3) type = 'health';
  else if (r < 0.5) type = 'ammo';
  else if (r < 0.65) type = 'shield';
  else if (r < 0.75) type = 'xp_orb';
  else return;

  pickups.push({ x: x, y: y, type: type, life: 600, radius: 8 });
}
