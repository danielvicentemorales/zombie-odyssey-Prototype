// ============================================================
// ZOMBIE COMP ODYSSEY - Character Sprite System
// Style: Last Day on Earth / Tactical Survival
// ============================================================

// ===== PLAYER SPRITES =====

function drawPlayer(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  var t = Date.now() * 0.008;
  var walkCycle = Math.sin(t) * 2;
  var isMoving = (keys['w'] || keys['a'] || keys['s'] || keys['d']);

  if (p.invincible > 0 && p.invincible % 4 < 2) {
    ctx.globalAlpha = 0.5;
  }

  switch (p.className) {
    case 'bulwark': drawBulwarkSprite(ctx, p, walkCycle, isMoving); break;
    case 'mender':  drawMenderSprite(ctx, p, walkCycle, isMoving); break;
    case 'rift':    drawRiftSprite(ctx, p, walkCycle, isMoving); break;
    case 'warden':  drawWardenSprite(ctx, p, walkCycle, isMoving); break;
    case 'shadow':  drawShadowSprite(ctx, p, walkCycle, isMoving); break;
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ===== BULWARK - Riot Armor Survivor =====
function drawBulwarkSprite(ctx, p, walkCycle, isMoving) {
  var leg = isMoving ? walkCycle : 0;

  // --- Short olive-drab pack behind ---
  ctx.fillStyle = '#4A5A3A';
  ctx.fillRect(-14, -5, 8, 10);
  // Pack straps
  ctx.strokeStyle = '#3A4A2A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-6, -4);
  ctx.lineTo(-14, -3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-6, 4);
  ctx.lineTo(-14, 3);
  ctx.stroke();

  // --- Heavy industrial boots ---
  ctx.fillStyle = '#3A3020';
  ctx.fillRect(-2, 8 + leg, 6, 5);
  ctx.fillRect(-2, -13 - leg, 6, 5);
  // Boot soles
  ctx.fillStyle = '#2A2518';
  ctx.fillRect(-1, 12 + leg, 5, 2);
  ctx.fillRect(-1, -14 - leg, 5, 2);

  // --- Armored legs ---
  ctx.fillStyle = '#555555';
  ctx.fillRect(-1, 5 + leg, 5, 5);
  ctx.fillRect(-1, -10 - leg, 5, 5);
  // Knee plates
  ctx.fillStyle = '#666666';
  ctx.fillRect(0, 5 + leg, 3, 3);
  ctx.fillRect(0, -8 - leg, 3, 3);

  // --- Exo-suit torso (wide, heavy, OD green) ---
  ctx.fillStyle = '#4A5A3A';
  ctx.beginPath();
  roundRect(ctx, -10, -10, 18, 20, 3);
  ctx.fill();
  // Armor panel lines
  ctx.strokeStyle = '#3A4A2A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(6, 0);
  ctx.stroke();
  // Khaki band
  ctx.fillStyle = '#7A6A50';
  ctx.fillRect(-2, -8, 3, 16);

  // --- Massive angular shoulder plates ---
  // Top shoulder
  ctx.fillStyle = '#506040';
  ctx.beginPath();
  ctx.moveTo(-6, -14);
  ctx.lineTo(4, -14);
  ctx.lineTo(6, -10);
  ctx.lineTo(-8, -10);
  ctx.closePath();
  ctx.fill();
  // Bottom shoulder
  ctx.beginPath();
  ctx.moveTo(-6, 14);
  ctx.lineTo(4, 14);
  ctx.lineTo(6, 10);
  ctx.lineTo(-8, 10);
  ctx.closePath();
  ctx.fill();
  // Khaki trim on shoulders
  ctx.fillStyle = '#7A6A50';
  ctx.fillRect(-6, -14, 10, 2);
  ctx.fillRect(-6, 12, 10, 2);

  // --- Arms (armored gauntlets) ---
  ctx.fillStyle = '#4A5040';
  ctx.fillRect(4, -12, 8, 5);
  ctx.fillRect(4, 7, 8, 5);
  // Armored glove tips
  ctx.fillStyle = '#3A4030';
  ctx.fillRect(10, -11, 4, 3);
  ctx.fillRect(10, 8, 4, 3);

  // --- Riot shield (left arm / top side) ---
  ctx.fillStyle = '#3A3A3A';
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRect(ctx, 2, -18, 6, 10, 2);
  ctx.fill();
  ctx.stroke();
  // Shield white cross
  ctx.fillStyle = '#DDDDDD';
  ctx.fillRect(4, -16, 2, 6);
  ctx.fillRect(3, -14, 4, 2);

  // --- Head / Helmet (closed, angular) ---
  ctx.fillStyle = '#555560';
  ctx.beginPath();
  ctx.arc(2, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  // Helmet angular top
  ctx.fillStyle = '#555560';
  ctx.beginPath();
  ctx.moveTo(-2, -5);
  ctx.lineTo(8, -4);
  ctx.lineTo(8, 4);
  ctx.lineTo(-2, 5);
  ctx.closePath();
  ctx.fill();
  // Transparent gray visor
  ctx.fillStyle = '#888888';
  ctx.fillRect(6, -2, 4, 4);
  // Visor detail line
  ctx.fillStyle = '#666666';
  ctx.fillRect(6, -0.5, 4, 1);

  drawWeaponInHand(ctx, p);
}

// ===== MENDER - Military Field Medic =====
function drawMenderSprite(ctx, p, walkCycle, isMoving) {
  var leg = isMoving ? walkCycle : 0;

  // --- Olive green field jacket trailing behind ---
  ctx.fillStyle = '#5A6A4A';
  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-18, -5 + Math.sin(Date.now() * 0.004) * 2);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-18, 5 + Math.sin(Date.now() * 0.005) * 2);
  ctx.lineTo(-6, 7);
  ctx.closePath();
  ctx.fill();
  // Coat edge detail
  ctx.strokeStyle = '#4A5A3A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-18, -5);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-18, 5);
  ctx.stroke();

  // --- Olive backpack with Red Cross ---
  ctx.fillStyle = '#4A5A3A';
  ctx.fillRect(-12, -5, 6, 10);
  // Red Cross on back
  ctx.fillStyle = '#CC3333';
  ctx.fillRect(-10, -2, 2, 4);
  ctx.fillRect(-11, -1, 4, 2);

  // --- Tactical boots ---
  ctx.fillStyle = '#3A3020';
  ctx.fillRect(-1, 7 + leg, 4, 4);
  ctx.fillRect(-1, -11 - leg, 4, 4);

  // --- Legs with knee pads ---
  ctx.fillStyle = '#555A48';
  ctx.fillRect(0, 4 + leg, 3, 5);
  ctx.fillRect(0, -9 - leg, 3, 5);
  // Knee pads
  ctx.fillStyle = '#444440';
  ctx.fillRect(0, 4 + leg, 4, 2);
  ctx.fillRect(0, -6 - leg, 4, 2);

  // --- Tactical body (olive jacket over dark vest) ---
  ctx.fillStyle = '#5A6A4A';
  ctx.beginPath();
  roundRect(ctx, -7, -8, 13, 16, 3);
  ctx.fill();
  // Dark vest underneath
  ctx.fillStyle = '#3A4038';
  ctx.beginPath();
  roundRect(ctx, -5, -6, 9, 12, 2);
  ctx.fill();
  // Ammo/bandage belt
  ctx.fillStyle = '#8A7A5A';
  for (var v = 0; v < 4; v++) {
    ctx.fillRect(-4 + v * 2.5, -5, 1.5, 4);
  }
  // Belt strap
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-5, -1);
  ctx.lineTo(4, -1);
  ctx.stroke();

  // --- Arms ---
  ctx.fillStyle = '#5A6A4A';
  ctx.fillRect(3, -10, 8, 4);
  ctx.fillRect(3, 6, 8, 4);
  // Red cross armband on upper arm
  ctx.fillStyle = '#CC3333';
  ctx.fillRect(4, -9, 1, 2);
  ctx.fillRect(3.5, -8.5, 2, 1);
  // Gloves
  ctx.fillStyle = '#4A3A2A';
  ctx.fillRect(9, -9, 4, 3);
  ctx.fillRect(9, 6, 4, 3);

  // --- Head / Boonie hat + Surgical mask ---
  // Base head (skin tone)
  ctx.fillStyle = '#9A8670';
  ctx.beginPath();
  ctx.arc(2, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  // Olive boonie hat
  ctx.fillStyle = '#5A6A4A';
  ctx.beginPath();
  ctx.ellipse(1, 0, 8, 7, 0, -0.7, 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#506040';
  ctx.beginPath();
  ctx.arc(1, 0, 5.5, -1.2, 1.2);
  ctx.closePath();
  ctx.fill();
  // Surgical mask (white, covering lower face)
  ctx.fillStyle = '#D0D0C8';
  ctx.beginPath();
  ctx.moveTo(4, -2);
  ctx.lineTo(9, -1.5);
  ctx.lineTo(9, 1.5);
  ctx.lineTo(4, 2);
  ctx.closePath();
  ctx.fill();
  // Normal brown eyes (no glow)
  ctx.fillStyle = '#442200';
  ctx.beginPath();
  ctx.arc(5, -2.5, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, 2.5, 1, 0, Math.PI * 2);
  ctx.fill();

  drawWeaponInHand(ctx, p);
}

// ===== SHADOW - Spec Ops Operator =====
function drawShadowSprite(ctx, p, walkCycle, isMoving) {
  var leg = isMoving ? walkCycle * 1.2 : 0;
  var capeWave = Math.sin(Date.now() * 0.004) * 3;

  // --- Short dark gray cape flowing behind ---
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-16, -5 + capeWave * 0.5);
  ctx.lineTo(-18, -1 + capeWave * 0.3);
  ctx.lineTo(-16, 3 - capeWave * 0.3);
  ctx.lineTo(-14, 5 - capeWave * 0.5);
  ctx.lineTo(-6, 7);
  ctx.closePath();
  ctx.fill();
  // Cape torn edges
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-16, -5 + capeWave * 0.5);
  ctx.lineTo(-18, -2 + capeWave * 0.3);
  ctx.lineTo(-16, 0);
  ctx.lineTo(-18, 2);
  ctx.lineTo(-14, 5 - capeWave * 0.5);
  ctx.stroke();

  // --- Agile armored legs ---
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(0, 5 + leg, 3, 7);
  ctx.fillRect(0, -12 - leg, 3, 7);
  // Dark gray knee pads
  ctx.fillStyle = '#333333';
  ctx.fillRect(1, 7 + leg, 2, 3);
  ctx.fillRect(1, -10 - leg, 2, 3);
  // Boots
  ctx.fillStyle = '#151515';
  ctx.fillRect(-1, 10 + leg, 4, 3);
  ctx.fillRect(-1, -13 - leg, 4, 3);

  // --- Black tactical vest body ---
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  roundRect(ctx, -7, -8, 12, 16, 3);
  ctx.fill();
  // Dark plate carrier
  ctx.fillStyle = '#2A2A2A';
  ctx.beginPath();
  roundRect(ctx, -5, -6, 8, 12, 2);
  ctx.fill();
  // Crossed belts
  ctx.strokeStyle = '#333338';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, -6);
  ctx.lineTo(3, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, 6);
  ctx.lineTo(3, -6);
  ctx.stroke();
  // Belt buckle center (dark metal)
  ctx.fillStyle = '#555555';
  ctx.beginPath();
  ctx.arc(-1, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // --- Arms ---
  ctx.fillStyle = '#1A1A1A';
  // Main arm (extended)
  ctx.fillRect(3, -3, 12, 4);
  // Off arm
  ctx.fillRect(2, 5, 6, 3);
  // Dark watch/wristband
  ctx.fillStyle = '#333333';
  ctx.fillRect(8, -3, 2, 4);

  // --- Head / Balaclava + NVG mount ---
  // Balaclava base
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.arc(2, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  // NVG mount on forehead
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, -4, 4, 2);
  // Tactical markings
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(7, -3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, 4);
  ctx.lineTo(7, 3);
  ctx.stroke();
  // Dark human eyes (no glow)
  ctx.fillStyle = '#442200';
  ctx.beginPath();
  ctx.ellipse(6, -2.5, 1.5, 1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, 2.5, 1.5, 1, 0, 0, Math.PI * 2);
  ctx.fill();

  drawWeaponInHand(ctx, p);
}

// ===== RIFT - Tactical Operative / Urban Runner =====
function drawRiftSprite(ctx, p, walkCycle, isMoving) {
  var leg = isMoving ? walkCycle * 1.2 : 0;
  var scarfWave1 = Math.sin(Date.now() * 0.005) * 3;
  var scarfWave2 = Math.sin(Date.now() * 0.007 + 1) * 4;

  // --- ORANGE SCARF - Firma del personaje (flowing behind, desaturated) ---
  ctx.strokeStyle = '#CC7733';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.quadraticCurveTo(-12, -3 + scarfWave1, -20, -1 + scarfWave2);
  ctx.stroke();
  ctx.strokeStyle = '#BB6622';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, 4);
  ctx.quadraticCurveTo(-14, 3 + scarfWave1 * 0.7, -22, 2 + scarfWave2 * 0.8);
  ctx.stroke();
  // Scarf tip frays
  ctx.strokeStyle = '#AA5511';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-20, -1 + scarfWave2);
  ctx.lineTo(-23, -2 + scarfWave2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-22, 2 + scarfWave2 * 0.8);
  ctx.lineTo(-25, 3 + scarfWave2);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // --- Tactical boots ---
  ctx.fillStyle = '#3A3020';
  ctx.fillRect(-1, 8 + leg, 4, 4);
  ctx.fillRect(-1, -12 - leg, 4, 4);

  // --- Legs with knee pads ---
  ctx.fillStyle = '#4A4840';
  ctx.fillRect(0, 4 + leg, 3, 6);
  ctx.fillRect(0, -10 - leg, 3, 6);
  // Knee pads
  ctx.fillStyle = '#555550';
  ctx.fillRect(0, 4 + leg, 4, 2.5);
  ctx.fillRect(0, -6 - leg, 4, 2.5);

  // --- Body (worn canvas + ratty vest with ammo) ---
  // Canvas base
  ctx.fillStyle = '#4A4845';
  ctx.beginPath();
  roundRect(ctx, -7, -8, 12, 16, 3);
  ctx.fill();
  // Ratty vest
  ctx.fillStyle = '#4A4540';
  ctx.beginPath();
  roundRect(ctx, -5, -6, 9, 12, 2);
  ctx.fill();
  // Ammo pouches on chest
  ctx.fillStyle = '#444440';
  ctx.fillRect(-4, -5, 3, 3);
  ctx.fillRect(-4, -1, 3, 3);
  ctx.fillRect(-4, 3, 3, 3);
  // Ammo detail (bullets visible)
  ctx.fillStyle = '#aa8833';
  for (var am = 0; am < 3; am++) {
    ctx.fillRect(-3.5, -4 + am * 4, 1, 2);
  }
  // Gadget pouches on side
  ctx.fillStyle = '#444440';
  ctx.fillRect(-7, 2, 3, 4);

  // --- Arms ---
  ctx.fillStyle = '#3A3835';
  ctx.fillRect(3, -9, 8, 4);
  ctx.fillRect(3, 5, 8, 4);
  // Gloves (worn leather)
  ctx.fillStyle = '#4A3A2A';
  ctx.fillRect(9, -8, 4, 3);
  ctx.fillRect(9, 5, 4, 3);

  // --- Head / Hoodie up + Tactical half-mask ---
  // Hood
  ctx.fillStyle = '#2A2825';
  ctx.beginPath();
  ctx.arc(2, 0, 7, -1.6, 1.6);
  ctx.closePath();
  ctx.fill();
  // Face area (skin tone)
  ctx.fillStyle = '#9A8670';
  ctx.beginPath();
  ctx.arc(4, 0, 4, -1.0, 1.0);
  ctx.closePath();
  ctx.fill();
  // Tactical half-mask (lower face)
  ctx.fillStyle = '#3A3835';
  ctx.beginPath();
  ctx.moveTo(3, -1.5);
  ctx.lineTo(9, -1);
  ctx.lineTo(9, 1);
  ctx.lineTo(3, 1.5);
  ctx.closePath();
  ctx.fill();
  // Mask detail line
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  // Normal human brown eyes (no glow)
  ctx.fillStyle = '#553322';
  ctx.beginPath();
  ctx.ellipse(6, -2.8, 1.5, 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, 2.8, 1.5, 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  drawWeaponInHand(ctx, p);
}

// ===== WARDEN - Frontier Cowboy =====
function drawWardenSprite(ctx, p, walkCycle, isMoving) {
  var leg = isMoving ? walkCycle : 0;

  // --- Short brown coat behind ---
  ctx.fillStyle = '#8a6a2a';
  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-16, -5 + Math.sin(Date.now() * 0.004) * 1.5);
  ctx.lineTo(-18, 0);
  ctx.lineTo(-16, 5 + Math.sin(Date.now() * 0.005) * 1.5);
  ctx.lineTo(-6, 7);
  ctx.closePath();
  ctx.fill();
  // Coat edge
  ctx.strokeStyle = '#6a5020';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Canvas satchel ---
  ctx.fillStyle = '#8A7A55';
  ctx.fillRect(-12, -4, 5, 8);

  // --- Sturdy boots ---
  ctx.fillStyle = '#4a3a1a';
  ctx.fillRect(-1, 8 + leg, 5, 4);
  ctx.fillRect(-1, -12 - leg, 5, 4);
  // Boot buckles
  ctx.fillStyle = '#666';
  ctx.fillRect(0, 9 + leg, 3, 1);
  ctx.fillRect(0, -11 - leg, 3, 1);

  // --- Legs ---
  ctx.fillStyle = '#5a4a2a';
  ctx.fillRect(0, 4 + leg, 4, 6);
  ctx.fillRect(0, -10 - leg, 4, 6);

  // --- Tool vest body ---
  ctx.fillStyle = '#aa8833';
  ctx.beginPath();
  roundRect(ctx, -7, -8, 14, 16, 3);
  ctx.fill();
  // Dark vest over shirt
  ctx.fillStyle = '#6a5a2a';
  ctx.beginPath();
  roundRect(ctx, -5, -7, 10, 14, 2);
  ctx.fill();
  // Tool pouches
  ctx.fillStyle = '#554420';
  ctx.fillRect(-5, -5, 3, 3);
  ctx.fillRect(-5, 0, 3, 3);
  ctx.fillRect(-5, 4, 3, 2);

  // --- Arms ---
  ctx.fillStyle = '#8a6a2a';
  ctx.fillRect(5, -10, 8, 4);
  ctx.fillRect(5, 6, 8, 4);
  // Simple leather wristbands
  ctx.fillStyle = '#6A5A3A';
  ctx.fillRect(8, -10, 3, 4);
  ctx.fillRect(8, 6, 3, 4);

  // --- Head ---
  ctx.fillStyle = '#a08060';
  ctx.beginPath();
  ctx.arc(2, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  // Cowboy hat
  ctx.fillStyle = '#6a5020';
  // Hat brim (wide)
  ctx.beginPath();
  ctx.ellipse(2, 0, 9, 7, 0, -0.6, 0.6);
  ctx.closePath();
  ctx.fill();
  // Hat crown
  ctx.fillStyle = '#7a6030';
  ctx.beginPath();
  ctx.arc(1, 0, 5.5, -1.2, 1.2);
  ctx.closePath();
  ctx.fill();
  // Hat band
  ctx.strokeStyle = '#554420';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(1, 0, 5.5, -1.0, 1.0);
  ctx.stroke();
  // Simple eyes
  ctx.fillStyle = '#442200';
  ctx.beginPath();
  ctx.arc(5.5, -2.8, 1, 0, Math.PI * 2);
  ctx.arc(5.5, 2.8, 1, 0, Math.PI * 2);
  ctx.fill();

  drawWeaponInHand(ctx, p);
}

// ===== WEAPON IN HAND =====
function drawWeaponInHand(ctx, p) {
  var w = p.weapon;

  if (w.slash) {
    // Steel machete
    ctx.strokeStyle = '#8A8A8A';
    ctx.shadowColor = '#666666';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    // Blade edge
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, -0.5);
    ctx.lineTo(29, -0.5);
    ctx.stroke();
    // Handle wrap (leather)
    ctx.fillStyle = '#3A2A1A';
    ctx.fillRect(11, -2, 5, 4);
    // Guard (plain metal)
    ctx.fillStyle = '#555555';
    ctx.fillRect(14, -3.5, 1.5, 7);
  } else if (w.throwingStar) {
    // Combat knife
    ctx.save();
    ctx.translate(14, 0);
    // Gray blade
    ctx.fillStyle = '#8A8A8A';
    ctx.fillRect(-1, -1, 10, 2);
    // Dark handle
    ctx.fillStyle = '#3A2A1A';
    ctx.fillRect(-5, -1.5, 5, 3);
    ctx.restore();
  } else if (w.dart) {
    // Tactical crossbow
    ctx.fillStyle = '#5A5045';
    ctx.fillRect(12, -2, 14, 4);
    // Barrel
    ctx.fillStyle = '#4A4540';
    ctx.fillRect(24, -1.5, 5, 3);
    // Bolt slot
    ctx.fillStyle = '#8A8A8A';
    ctx.fillRect(15, -1, 4, 2);
    // Grip
    ctx.fillStyle = '#3A2A1A';
    ctx.fillRect(13, 2, 3, 4);
  } else if (w.plasma) {
    // Military grenade launcher
    ctx.fillStyle = '#4A4A45';
    ctx.fillRect(12, -4, 14, 8);
    // Rotary cylinder
    ctx.fillStyle = '#555550';
    ctx.fillRect(16, -3, 6, 6);
    // Muzzle
    ctx.fillStyle = '#555550';
    ctx.fillRect(24, -3, 4, 6);
    // Simple muzzle ring
    ctx.fillStyle = '#666660';
    ctx.beginPath();
    ctx.arc(28, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    // Grip
    ctx.fillStyle = '#333';
    ctx.fillRect(13, 4, 3, 4);
  } else if (w.pellets && w.pellets >= 5) {
    // Tactical shotgun
    ctx.fillStyle = '#444';
    ctx.fillRect(12, -3, 16, 6);
    // Barrel
    ctx.fillStyle = '#333';
    ctx.fillRect(26, -2, 4, 4);
    // Pump grip
    ctx.fillStyle = '#5a4a2a';
    ctx.fillRect(18, -4, 5, 8);
    // Stock
    ctx.fillStyle = '#4a3a1a';
    ctx.fillRect(8, -2, 6, 4);
    // Shell visible
    ctx.fillStyle = '#aa3333';
    ctx.fillRect(14, -1.5, 2, 3);
  } else if (w.name === 'RIFLE') {
    // Tactical rifle with scope
    ctx.fillStyle = '#444';
    ctx.fillRect(12, -2.5, 18, 5);
    // Barrel
    ctx.fillStyle = '#333';
    ctx.fillRect(28, -1.5, 5, 3);
    // Scope
    ctx.fillStyle = '#333';
    ctx.fillRect(18, -5, 8, 2.5);
    // Scope lens
    ctx.fillStyle = '#888888';
    ctx.beginPath();
    ctx.arc(25, -3.8, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Stock
    ctx.fillStyle = '#5a4a2a';
    ctx.fillRect(8, -2, 6, 4);
    // Grip
    ctx.fillStyle = '#333';
    ctx.fillRect(14, 2.5, 3, 4);
  } else if (w.name === 'MARKSMAN PISTOL') {
    // Precision pistol
    ctx.fillStyle = '#555';
    ctx.fillRect(12, -2, 12, 4);
    // Barrel
    ctx.fillStyle = '#444';
    ctx.fillRect(22, -1.5, 4, 3);
    // Sight (subdued red dot)
    ctx.fillStyle = '#CC3333';
    ctx.beginPath();
    ctx.arc(24, -2.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
    // Grip
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(13, 2, 3, 4);
  } else if (w.name === 'HEAVY PISTOL') {
    // Bulky pistol
    ctx.fillStyle = '#4a4a50';
    ctx.fillRect(12, -2.5, 11, 5);
    // Barrel extension
    ctx.fillStyle = '#3a3a40';
    ctx.fillRect(21, -2, 4, 4);
    // Grip
    ctx.fillStyle = '#333';
    ctx.fillRect(13, 2.5, 4, 4);
    // Muzzle brake
    ctx.fillStyle = '#555';
    ctx.fillRect(23, -1.5, 2, 3);
  } else {
    // Default tactical gun (SMG / dual pistols)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(12, -2, 13, 4);
    // Barrel
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(23, -1.5, 4, 3);
    // Grip
    ctx.fillStyle = '#333';
    ctx.fillRect(13, 2, 3, 4);
    // Magazine
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(16, 2, 2, 3);
  }
}

// ===== ZOMBIE SPRITES =====

function drawZombie(ctx, z, p) {
  ctx.save();
  ctx.translate(z.x, z.y);
  var angle = Math.atan2(p.y - z.y, p.x - z.x);
  ctx.rotate(angle);

  var t = Date.now() * 0.006;
  var walkCycle = Math.sin(t + z.x * 0.1) * 2;

  switch (z.type) {
    case 'walker':   drawWalkerZombie(ctx, z, walkCycle); break;
    case 'runner':   drawRunnerZombie(ctx, z, walkCycle); break;
    case 'tank':     drawTankZombie(ctx, z, walkCycle); break;
    case 'spitter':  drawSpitterZombie(ctx, z, walkCycle); break;
    case 'exploder': drawExploderZombie(ctx, z, walkCycle); break;
    default:         drawWalkerZombie(ctx, z, walkCycle); break;
  }

  // Status overlays
  ctx.rotate(-angle);

  if (z.burning > 0) {
    for (var i = 0; i < 3; i++) {
      var fx = (Math.random() - 0.5) * z.radius;
      var fy = -z.radius + Math.random() * z.radius * 0.5;
      ctx.fillStyle = Math.random() < 0.5 ? '#ff6600' : '#ffcc00';
      ctx.globalAlpha = 0.6 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.arc(fx, fy - Math.random() * 4, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (z.slowed > 0) {
    ctx.strokeStyle = '#8AAFCC';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    for (var i = 0; i < 4; i++) {
      var ca = (i / 4) * Math.PI * 2 + Date.now() * 0.003;
      var cr = z.radius * 0.8;
      var cx = Math.cos(ca) * cr;
      var cy = Math.sin(ca) * cr;
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy);
      ctx.lineTo(cx + 2, cy);
      ctx.moveTo(cx, cy - 2);
      ctx.lineTo(cx, cy + 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (z.stunned > 0) {
    ctx.fillStyle = '#ffff44';
    ctx.globalAlpha = 0.7;
    for (var i = 0; i < 3; i++) {
      var sa = (i / 3) * Math.PI * 2 + Date.now() * 0.008;
      var sr = z.radius + 4;
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr - 4, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawWalkerZombie(ctx, z, walkCycle) {
  var r = z.radius;

  // Shuffling legs
  ctx.fillStyle = '#5A6A50';
  ctx.fillRect(-r * 0.3, r * 0.35 + walkCycle * 0.5, r * 0.3, r * 0.6);
  ctx.fillRect(-r * 0.3, -r * 0.35 - walkCycle * 0.5 - r * 0.6, r * 0.3, r * 0.6);

  // Ragged body
  ctx.fillStyle = z.color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Torn clothing remnants
  ctx.strokeStyle = '#5A5A48';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    var tx = -r * 0.8 + (i / 5) * r * 1.6;
    var ty = r * 0.2 + (i % 2 === 0 ? 4 : -2);
    if (i === 0) ctx.moveTo(tx, ty);
    else ctx.lineTo(tx, ty);
  }
  ctx.stroke();

  // Wound mark
  ctx.fillStyle = '#5A3A30';
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, r * 0.1, r * 0.15, r * 0.1, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Reaching arms
  ctx.fillStyle = '#5A6A50';
  ctx.fillRect(r * 0.5, -r * 0.45, r * 0.85, r * 0.28);
  ctx.fillRect(r * 0.5, r * 0.17, r * 0.85, r * 0.28);
  // Bony hands
  ctx.fillStyle = '#6A7A5A';
  ctx.fillRect(r * 1.2, -r * 0.4, r * 0.2, r * 0.2);
  ctx.fillRect(r * 1.2, r * 0.2, r * 0.2, r * 0.2);

  // Sunken eyes
  ctx.fillStyle = '#5A3030';
  ctx.beginPath();
  ctx.arc(r * 0.3, -r * 0.22, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.3, r * 0.22, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
  // Eye detail
  ctx.fillStyle = '#6A3535';
  ctx.beginPath();
  ctx.arc(r * 0.32, -r * 0.22, r * 0.06, 0, Math.PI * 2);
  ctx.arc(r * 0.32, r * 0.22, r * 0.06, 0, Math.PI * 2);
  ctx.fill();
}

function drawRunnerZombie(ctx, z, walkCycle) {
  var r = z.radius;

  // Running legs (more animated)
  ctx.fillStyle = '#5A5048';
  ctx.save();
  ctx.rotate(walkCycle * 0.2);
  ctx.fillRect(-r * 0.15, r * 0.25, r * 0.22, r * 0.75);
  ctx.restore();
  ctx.save();
  ctx.rotate(-walkCycle * 0.2);
  ctx.fillRect(-r * 0.15, -r * 0.25 - r * 0.75, r * 0.22, r * 0.75);
  ctx.restore();

  // Lean hunched body
  ctx.fillStyle = z.color;
  ctx.beginPath();
  ctx.ellipse(r * 0.1, 0, r * 1.1, r * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rib cage visible
  ctx.strokeStyle = '#6A5A48';
  ctx.lineWidth = 0.8;
  for (var rb = 0; rb < 3; rb++) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.3 + rb * r * 0.3);
    ctx.lineTo(r * 0.2, -r * 0.25 + rb * r * 0.3);
    ctx.stroke();
  }

  // Running arms (aggressive posture)
  ctx.fillStyle = '#6A5A48';
  ctx.save();
  ctx.rotate(-0.5);
  ctx.fillRect(r * 0.4, -r * 0.35, r * 0.8, r * 0.2);
  ctx.restore();
  ctx.save();
  ctx.rotate(0.4);
  ctx.fillRect(r * 0.4, r * 0.15, r * 0.8, r * 0.2);
  ctx.restore();

  // Drool
  ctx.strokeStyle = 'rgba(120,110,90,0.4)';
  ctx.lineWidth = 1;
  var droolWave = Math.sin(Date.now() * 0.012) * 3;
  ctx.beginPath();
  ctx.moveTo(r * 0.9, r * 0.08);
  ctx.quadraticCurveTo(r * 1.1, r * 0.15 + droolWave, r * 0.8, r * 0.35);
  ctx.stroke();

  // Feral eyes (no glow)
  ctx.fillStyle = '#6A4535';
  ctx.beginPath();
  ctx.arc(r * 0.5, -r * 0.15, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.5, r * 0.15, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

function drawTankZombie(ctx, z, walkCycle) {
  var r = z.radius;

  // Massive legs
  ctx.fillStyle = '#3A2828';
  ctx.fillRect(-r * 0.25, r * 0.25 + walkCycle * 0.25, r * 0.35, r * 0.65);
  ctx.fillRect(-r * 0.25, -r * 0.25 - walkCycle * 0.25 - r * 0.65, r * 0.35, r * 0.65);

  // Huge body
  ctx.fillStyle = z.color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Exposed muscle/flesh patches
  ctx.fillStyle = '#5A3030';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.25, r * 0.15, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.4, r * 0.2, r * 0.12, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Armor fragments (metal scraps embedded)
  ctx.fillStyle = '#555';
  ctx.fillRect(-r * 0.6, -r * 0.7, r * 0.4, r * 0.3);
  ctx.fillRect(-r * 0.5, r * 0.4, r * 0.35, r * 0.25);
  // Rivets on armor
  ctx.fillStyle = '#777';
  ctx.beginPath();
  ctx.arc(-r * 0.45, -r * 0.6, 1.5, 0, Math.PI * 2);
  ctx.arc(-r * 0.35, r * 0.5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Scar lines
  ctx.strokeStyle = '#5A3535';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, -r * 0.7);
  ctx.lineTo(r * 0.3, -r * 0.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, r * 0.2);
  ctx.lineTo(r * 0.25, r * 0.7);
  ctx.stroke();

  // Massive club-like arms
  ctx.fillStyle = '#4A3030';
  ctx.fillRect(r * 0.25, -r * 0.55, r * 0.85, r * 0.4);
  ctx.fillRect(r * 0.25, r * 0.15, r * 0.85, r * 0.4);
  // Fist blobs
  ctx.beginPath();
  ctx.arc(r * 1.0, -r * 0.35, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 1.0, r * 0.35, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Small deformed head
  ctx.fillStyle = '#4A3030';
  ctx.beginPath();
  ctx.arc(r * 0.35, 0, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Angry small eyes (no glow)
  ctx.fillStyle = '#6A3535';
  ctx.beginPath();
  ctx.arc(r * 0.48, -r * 0.08, r * 0.08, 0, Math.PI * 2);
  ctx.arc(r * 0.48, r * 0.08, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpitterZombie(ctx, z, walkCycle) {
  var r = z.radius;

  // Thin legs
  ctx.fillStyle = '#4A5A48';
  ctx.fillRect(-r * 0.25, r * 0.3 + walkCycle * 0.4, r * 0.22, r * 0.6);
  ctx.fillRect(-r * 0.25, -r * 0.3 - walkCycle * 0.4 - r * 0.6, r * 0.22, r * 0.6);

  // Hunched body
  ctx.fillStyle = z.color;
  ctx.beginPath();
  ctx.ellipse(-r * 0.1, 0, r * 0.85, r, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pustules/boils
  ctx.fillStyle = '#5A6A4A';
  ctx.beginPath();
  ctx.arc(-r * 0.4, -r * 0.3, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-r * 0.2, r * 0.5, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Distended throat / acid sac
  ctx.fillStyle = '#4A6A4A';
  ctx.beginPath();
  ctx.ellipse(r * 0.45, 0, r * 0.5, r * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  // Acid sac veins
  ctx.strokeStyle = '#5A7A5A';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(r * 0.2, -r * 0.2);
  ctx.quadraticCurveTo(r * 0.5, -r * 0.1, r * 0.7, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.2, r * 0.2);
  ctx.quadraticCurveTo(r * 0.5, r * 0.1, r * 0.7, 0);
  ctx.stroke();

  // Muted glow near mouth
  ctx.fillStyle = 'rgba(90,122,90,0.25)';
  ctx.beginPath();
  ctx.arc(r * 0.85, 0, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Thin arms
  ctx.fillStyle = '#4A5A48';
  ctx.fillRect(r * 0.05, -r * 0.65, r * 0.35, r * 0.2);
  ctx.fillRect(r * 0.05, r * 0.45, r * 0.35, r * 0.2);

  // Eyes (no glow)
  ctx.fillStyle = '#5A6A4A';
  ctx.beginPath();
  ctx.arc(r * 0.25, -r * 0.2, r * 0.1, 0, Math.PI * 2);
  ctx.arc(r * 0.25, r * 0.2, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
}

function drawExploderZombie(ctx, z, walkCycle) {
  var r = z.radius;
  var pulse = 1 + Math.sin(Date.now() * 0.01) * 0.08;

  // Stumpy legs
  ctx.fillStyle = '#5A3030';
  ctx.fillRect(-r * 0.2, r * 0.25 + walkCycle * 0.25, r * 0.25, r * 0.45);
  ctx.fillRect(-r * 0.2, -r * 0.25 - walkCycle * 0.25 - r * 0.45, r * 0.25, r * 0.45);

  // Bloated pulsing body
  var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * pulse);
  grad.addColorStop(0, '#AA5530');
  grad.addColorStop(0.4, '#8B4030');
  grad.addColorStop(0.8, '#6A3030');
  grad.addColorStop(1, '#4A2020');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Crack/fissure lines
  ctx.strokeStyle = '#8A5530';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.15, -r * 0.2);
  ctx.lineTo(-r * 0.1, r * 0.3);
  ctx.lineTo(0, r * 0.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.6, -r * 0.2);
  ctx.lineTo(r * 0.1, 0);
  ctx.lineTo(r * 0.5, r * 0.3);
  ctx.stroke();

  // Internal glow showing through cracks
  ctx.fillStyle = 'rgba(160,100,60,0.25)';
  ctx.beginPath();
  ctx.arc(r * 0.05, 0, r * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Spark particles
  if (Math.random() < 0.4) {
    ctx.fillStyle = '#AA8844';
    ctx.beginPath();
    ctx.arc(
      (Math.random() - 0.5) * r * 1.8,
      (Math.random() - 0.5) * r * 1.8,
      0.8 + Math.random() * 1.2, 0, Math.PI * 2
    );
    ctx.fill();
  }

  // Vestigial arms
  ctx.fillStyle = '#5A3030';
  ctx.fillRect(r * 0.35, -r * 0.25, r * 0.3, r * 0.18);
  ctx.fillRect(r * 0.35, r * 0.07, r * 0.3, r * 0.18);

  // Eyes (no glow)
  ctx.fillStyle = '#7A5530';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.12, r * 0.1, 0, Math.PI * 2);
  ctx.arc(r * 0.35, r * 0.12, r * 0.1, 0, Math.PI * 2);
  ctx.fill();
}

// ===== BULLET SPRITES =====

function drawBullet(ctx, b) {
  ctx.save();
  ctx.translate(b.x, b.y);

  if (b.isSlash) {
    var alpha = b.life / 8;
    ctx.rotate(b.slashAngle);
    ctx.strokeStyle = 'rgba(160,155,145,' + alpha + ')';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#8A8070';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 14, -0.6, 0.6);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(190,185,175,' + (alpha * 0.8) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 12, -0.4, 0.4);
    ctx.stroke();
  } else if (b.isFlame) {
    ctx.fillStyle = 'rgba(255,' + Math.floor(Math.random() * 100 + 50) + ',0,' + (b.life / 15) + ')';
    ctx.beginPath();
    ctx.arc(0, 0, 4 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.isDart) {
    var angle = Math.atan2(b.vy, b.vx);
    ctx.rotate(angle);
    // Needle
    ctx.fillStyle = '#8A8A8A';
    ctx.shadowBlur = 0;
    ctx.fillRect(-6, -0.75, 12, 1.5);
    // Tip
    ctx.fillStyle = '#AAAAAA';
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(9, -1.5);
    ctx.lineTo(9, 1.5);
    ctx.closePath();
    ctx.fill();
    // Tail
    ctx.fillStyle = '#666660';
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-9, -2);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-9, 2);
    ctx.closePath();
    ctx.fill();
  } else if (b.isPlasma) {
    var pPulse = 1 + Math.sin(Date.now() * 0.015) * 0.15;
    ctx.fillStyle = '#8A7A5A';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 5 * pPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C4B08A';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(138,122,90,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 7 * pPulse, 0, Math.PI * 2);
    ctx.stroke();
  } else if (b.isThrowingStar) {
    var starAngle = Date.now() * 0.02;
    ctx.rotate(starAngle);
    ctx.fillStyle = '#8A8A8A';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      var a = (i / 4) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * 4.5, Math.sin(a) * 4.5);
      var innerA = a + Math.PI / 4;
      ctx.lineTo(Math.cos(innerA) * 1.5, Math.sin(innerA) * 1.5);
    }
    ctx.closePath();
    ctx.fill();
    // Center dot
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.owner === 'player') {
    var angle = Math.atan2(b.vy, b.vx);
    ctx.rotate(angle);
    ctx.fillStyle = '#C4A060';
    ctx.shadowColor = '#C4A060';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(1, 0, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ===== UTILITY =====

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
