// ============================================================
// ZOMBIE COMP ODYSSEY - Rendering Engine
// ============================================================

var floorPattern = null;

function initFloorPattern() {
  var tileCanvas = document.createElement('canvas');
  tileCanvas.width = 120;
  tileCanvas.height = 120;
  var tctx = tileCanvas.getContext('2d');

  // Base fill
  tctx.fillStyle = '#3A3A38';
  tctx.fillRect(0, 0, 120, 120);

  // 4 subtiles (60x60) with slight color variation
  var subtileColors = ['#3A3A38', '#3C3C3A', '#38383A', '#3E3E3C'];
  for (var ty = 0; ty < 2; ty++) {
    for (var tx = 0; tx < 2; tx++) {
      tctx.fillStyle = subtileColors[ty * 2 + tx];
      tctx.fillRect(tx * 60, ty * 60, 60, 60);
    }
  }

  // Tile joint lines (grout between stone slabs)
  tctx.strokeStyle = 'rgba(30,28,25,0.8)';
  tctx.lineWidth = 1;
  // Horizontal joint
  tctx.beginPath();
  tctx.moveTo(0, 60);
  tctx.lineTo(120, 60);
  tctx.stroke();
  // Vertical joint
  tctx.beginPath();
  tctx.moveTo(60, 0);
  tctx.lineTo(60, 120);
  tctx.stroke();

  // Subtle edge highlight on joints
  tctx.strokeStyle = 'rgba(55,52,48,0.3)';
  tctx.lineWidth = 1;
  tctx.beginPath();
  tctx.moveTo(0, 61);
  tctx.lineTo(120, 61);
  tctx.stroke();
  tctx.beginPath();
  tctx.moveTo(61, 0);
  tctx.lineTo(61, 120);
  tctx.stroke();

  // Micro-cracks on subtile 0 (top-left)
  tctx.strokeStyle = 'rgba(60,56,50,0.3)';
  tctx.lineWidth = 0.5;
  tctx.beginPath();
  tctx.moveTo(12, 18);
  tctx.lineTo(22, 25);
  tctx.lineTo(28, 22);
  tctx.stroke();

  // Micro-crack on subtile 3 (bottom-right)
  tctx.beginPath();
  tctx.moveTo(80, 85);
  tctx.lineTo(95, 92);
  tctx.lineTo(100, 88);
  tctx.stroke();

  // Tiny speckle noise for texture
  for (var i = 0; i < 30; i++) {
    var sx = Math.random() * 120;
    var sy = Math.random() * 120;
    var brightness = Math.floor(Math.random() * 12 + 14);
    tctx.fillStyle = 'rgba(' + (brightness + 20) + ',' + (brightness + 18) + ',' + (brightness + 14) + ',0.4)';
    tctx.fillRect(sx, sy, 1, 1);
  }

  floorPattern = ctx.createPattern(tileCanvas, 'repeat');
}

function render() {
  ctx.save();

  // Zoom & Screen shake
  var shakeX = screenShake ? (Math.random() - 0.5) * screenShake * 2 : 0;
  var shakeY = screenShake ? (Math.random() - 0.5) * screenShake * 2 : 0;
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  // Background (textured floor tiles)
  if (floorPattern) {
    ctx.fillStyle = floorPattern;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  } else {
    ctx.fillStyle = '#3A3A38';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  // Grid
  ctx.strokeStyle = 'rgba(100,90,70,0.06)';
  ctx.lineWidth = 1;
  var gridSize = 60;
  var startX = Math.floor(camera.x / gridSize) * gridSize;
  var startY = Math.floor(camera.y / gridSize) * gridSize;
  for (var gx = startX; gx < camera.x + canvas.width + gridSize; gx += gridSize) {
    ctx.beginPath(); ctx.moveTo(gx, camera.y); ctx.lineTo(gx, camera.y + canvas.height); ctx.stroke();
  }
  for (var gy = startY; gy < camera.y + canvas.height + gridSize; gy += gridSize) {
    ctx.beginPath(); ctx.moveTo(camera.x, gy); ctx.lineTo(camera.x + canvas.width, gy); ctx.stroke();
  }

  // Scenery decorations (cracks, stains, debris)
  if (sceneryDecor.length > 0) {
    renderScenery();
  }

  // World border
  ctx.strokeStyle = 'rgba(139,109,79,0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, WORLD_W, WORLD_H);

  // Room walls
  if (gameMode === 'odyssey') {
    renderRoomWalls();
    renderHazards();
    renderExitZone();
    renderInteractables();
    renderTelegraphs();
  }

  // Blood splats
  bloodSplats.forEach(function(b) {
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = '#3a0000';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    b.alpha *= 0.999;
  });
  bloodSplats = bloodSplats.filter(function(b) { return b.alpha > 0.02; });

  // Pickups
  pickups.forEach(function(p) {
    var color;
    switch (p.type) {
      case 'health':  color = '#CC3333'; break;
      case 'ammo':    color = '#C4922A'; break;
      case 'shield':  color = '#5A8BA8'; break;
      case 'xp_orb':  color = '#C4922A'; break;
      case 'grenade': color = '#4a8a4a'; break;
    }
    var pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Turrets
  turrets.forEach(function(t) {
    ctx.fillStyle = '#6A6A68';
    ctx.strokeStyle = '#8A8A88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(100,100,98,0.1)';
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Totems (Mender)
  totems.forEach(function(t) {
    var pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
    var alpha = Math.min(1, t.life / 60);

    // Heal range indicator
    ctx.strokeStyle = 'rgba(92,122,69,' + (0.08 * alpha) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.healRange * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Slow range indicator
    ctx.strokeStyle = 'rgba(90,139,168,' + (0.06 * alpha) + ')';
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.slowRange * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Core
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#5C7A45';
    ctx.shadowColor = '#5C7A45';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 8 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner glow
    ctx.fillStyle = '#8AAA7A';
    ctx.beginPath();
    ctx.arc(t.x, t.y, 4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Zombies
  zombies.forEach(function(z) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(z.x, z.y + z.radius * 0.8, z.radius * 0.8, z.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = z.color;
    if (z.burning > 0) ctx.fillStyle = '#ff4400';
    if (z.slowed > 0) ctx.fillStyle = '#5A8BA8';
    // Boss invulnerability flash
    if (z === bossEntity && bossEntity && bossEntity.invulnTimer > 0) {
      ctx.fillStyle = bossEntity.invulnTimer % 6 < 3 ? '#ffffff' : z.color;
    }

    // Custom boss bodies
    if (z === bossEntity && bossEntity && bossEntity.bossId === 'amalgam') {
      // Amalgam: ellipse + jaw lines (swamp lord)
      ctx.beginPath();
      ctx.ellipse(z.x, z.y, z.radius * 1.2, z.radius, 0, 0, Math.PI * 2);
      ctx.fill();
      var jawAngle = Math.atan2(player.y - z.y, player.x - z.x);
      ctx.strokeStyle = '#1a3a0a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(z.x + Math.cos(jawAngle - 0.4) * z.radius * 0.6, z.y + Math.sin(jawAngle - 0.4) * z.radius * 0.6);
      ctx.lineTo(z.x + Math.cos(jawAngle) * z.radius * 1.3, z.y + Math.sin(jawAngle) * z.radius * 1.3);
      ctx.lineTo(z.x + Math.cos(jawAngle + 0.4) * z.radius * 0.6, z.y + Math.sin(jawAngle + 0.4) * z.radius * 0.6);
      ctx.stroke();
    } else if (z === bossEntity && bossEntity && bossEntity.bossId === 'baba') {
      // Ba-Ba: bulky circle with jagged rocky edges
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
      ctx.fill();
      // Rocky texture lines
      ctx.strokeStyle = '#4a2510';
      ctx.lineWidth = 2;
      for (var ri = 0; ri < 5; ri++) {
        var rAngle = (ri / 5) * Math.PI * 2 + Date.now() * 0.0002;
        ctx.beginPath();
        ctx.moveTo(z.x + Math.cos(rAngle) * z.radius * 0.3, z.y + Math.sin(rAngle) * z.radius * 0.3);
        ctx.lineTo(z.x + Math.cos(rAngle + 0.2) * z.radius * 0.9, z.y + Math.sin(rAngle + 0.2) * z.radius * 0.9);
        ctx.stroke();
      }
      // Jagged outer ring
      ctx.strokeStyle = '#8B6914';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var ji = 0; ji <= 12; ji++) {
        var jAngle = (ji / 12) * Math.PI * 2;
        var jR = z.radius + (ji % 2 === 0 ? 5 : -3);
        if (ji === 0) ctx.moveTo(z.x + Math.cos(jAngle) * jR, z.y + Math.sin(jAngle) * jR);
        else ctx.lineTo(z.x + Math.cos(jAngle) * jR, z.y + Math.sin(jAngle) * jR);
      }
      ctx.stroke();
    } else if (z === bossEntity && bossEntity && bossEntity.bossId === 'kephri') {
      // Kephri: wider ellipse with mandible lines (insect)
      ctx.beginPath();
      ctx.ellipse(z.x, z.y, z.radius * 1.3, z.radius * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mandibles
      var mAngle = Math.atan2(player.y - z.y, player.x - z.x);
      ctx.strokeStyle = '#2a0630';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(z.x + Math.cos(mAngle - 0.5) * z.radius * 0.5, z.y + Math.sin(mAngle - 0.5) * z.radius * 0.5);
      ctx.lineTo(z.x + Math.cos(mAngle - 0.15) * z.radius * 1.1, z.y + Math.sin(mAngle - 0.15) * z.radius * 1.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(z.x + Math.cos(mAngle + 0.5) * z.radius * 0.5, z.y + Math.sin(mAngle + 0.5) * z.radius * 0.5);
      ctx.lineTo(z.x + Math.cos(mAngle + 0.15) * z.radius * 1.1, z.y + Math.sin(mAngle + 0.15) * z.radius * 1.1);
      ctx.stroke();
      // Carapace line
      ctx.strokeStyle = '#6b1d7a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(z.x, z.y, z.radius * 0.7, z.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (z === bossEntity && bossEntity && bossEntity.bossId === 'akkha') {
      // Akkha: diamond/angular shape with golden accents
      ctx.beginPath();
      ctx.moveTo(z.x, z.y - z.radius * 1.1);
      ctx.lineTo(z.x + z.radius * 1.0, z.y);
      ctx.lineTo(z.x, z.y + z.radius * 1.1);
      ctx.lineTo(z.x - z.radius * 1.0, z.y);
      ctx.closePath();
      ctx.fill();
      // Inner diamond
      ctx.strokeStyle = '#e8c840';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(z.x, z.y - z.radius * 0.5);
      ctx.lineTo(z.x + z.radius * 0.5, z.y);
      ctx.lineTo(z.x, z.y + z.radius * 0.5);
      ctx.lineTo(z.x - z.radius * 0.5, z.y);
      ctx.closePath();
      ctx.stroke();
    } else if (z === bossEntity && bossEntity && bossEntity.bossId === 'overseer') {
      // Overseer: hexagonal shape with pulsing core
      ctx.beginPath();
      for (var hi = 0; hi < 6; hi++) {
        var hAngle = (hi / 6) * Math.PI * 2 - Math.PI / 6;
        var hx = z.x + Math.cos(hAngle) * z.radius;
        var hy = z.y + Math.sin(hAngle) * z.radius;
        if (hi === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      // Pulsing eye in center
      var eyePulse = 0.5 + Math.sin(Date.now() * 0.006) * 0.3;
      ctx.fillStyle = '#6A8A9A';
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius * 0.3 * (1 + eyePulse * 0.2), 0, Math.PI * 2);
      ctx.fill();
      // Orbital ring
      ctx.strokeStyle = '#2a4a6b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Use sprite for non-boss zombies
      drawZombie(ctx, z, player);
    }

    // Eyes (only for bosses - non-boss eyes drawn in sprite)
    if (z === bossEntity && bossEntity) {
      var eyeAngle = Math.atan2(player.y - z.y, player.x - z.x);
      ctx.fillStyle = '#ff0000';
      if (bossEntity.bossId === 'amalgam') ctx.fillStyle = '#ffcc00';
      else if (bossEntity.bossId === 'baba') ctx.fillStyle = '#ff4400';
      else if (bossEntity.bossId === 'kephri') ctx.fillStyle = '#7A8A5A';
      else if (bossEntity.bossId === 'akkha') ctx.fillStyle = '#C4A040';
      else if (bossEntity.bossId === 'overseer') ctx.fillStyle = '#6A8A9A';
      ctx.beginPath();
      ctx.arc(z.x + Math.cos(eyeAngle - 0.3) * z.radius * 0.4, z.y + Math.sin(eyeAngle - 0.3) * z.radius * 0.4, z.radius * 0.2, 0, Math.PI * 2);
      ctx.arc(z.x + Math.cos(eyeAngle + 0.3) * z.radius * 0.4, z.y + Math.sin(eyeAngle + 0.3) * z.radius * 0.4, z.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // HP bar for tanks/bosses (small overhead bar, NOT the screen-space boss bar)
    if (z.type === 'tank' || (z.boss && z !== bossEntity)) {
      var barW = z.radius * 2;
      var barH = 3;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(z.x - barW / 2, z.y - z.radius - 10, barW, barH);
      ctx.fillStyle = z.boss ? '#ff0000' : '#ff4444';
      ctx.fillRect(z.x - barW / 2, z.y - z.radius - 10, barW * (z.hp / z.maxHp), barH);
    }

    // Boss glow
    if (z.boss) {
      var bossGlowColor = '#8B4040';
      if (z === bossEntity && bossEntity) {
        if (bossEntity.bossId === 'amalgam') bossGlowColor = '#2d5016';
        else if (bossEntity.bossId === 'baba') bossGlowColor = '#ff6600';
        else if (bossEntity.bossId === 'kephri') bossGlowColor = '#cc00ff';
        else if (bossEntity.bossId === 'akkha') bossGlowColor = '#c4a032';
        else if (bossEntity.bossId === 'overseer') bossGlowColor = '#6A8A9A';
      }
      ctx.shadowColor = bossGlowColor;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = bossGlowColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius + 4 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Boss windup indicator
    if (z === bossEntity && bossEntity && bossEntity.bossState === 'windup') {
      var windupProg = bossEntity.attackTimer / BOSS_DEFS[bossEntity.bossId].attacks[bossEntity.currentAttack].windupTime;
      ctx.strokeStyle = 'rgba(255,255,0,' + (0.3 + windupProg * 0.7) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius + 8, -Math.PI / 2, -Math.PI / 2 + windupProg * Math.PI * 2);
      ctx.stroke();
    }

    // Laser sweep beam (Overseer active attack)
    if (z === bossEntity && bossEntity && bossEntity.bossState === 'active' && bossEntity.currentAttack === 'laser_sweep') {
      var laserLen = BOSS_DEFS[bossEntity.bossId].attacks['laser_sweep'].length;
      ctx.save();
      ctx.translate(z.x, z.y);
      ctx.rotate(bossEntity.sweepAngle);
      ctx.fillStyle = 'rgba(106,138,154,0.4)';
      ctx.fillRect(0, -15, laserLen, 30);
      ctx.strokeStyle = '#6A8A9A';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, -15, laserLen, 30);
      // Core beam
      ctx.fillStyle = 'rgba(140,165,175,0.6)';
      ctx.fillRect(0, -5, laserLen, 10);
      ctx.restore();
    }
  });

  // Afterimages (rendered behind player)
  afterimages.forEach(function(a) {
    ctx.globalAlpha = a.alpha;
    ctx.fillStyle = a.color;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius * (a.life / a.maxLife), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Player
  if (player) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.radius * 0.8, player.radius * 0.8, player.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw player sprite
    drawPlayer(ctx, player);

    // Shield visual
    if (player.shield > 0) {
      ctx.strokeStyle = 'rgba(90,139,168,' + (0.3 + player.shield / player.maxShield * 0.4) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Dash ready indicator
    if (player.dashCd <= 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Bullet trails (rendered behind bullets for depth)
  bulletTrails.forEach(function(t) {
    ctx.globalAlpha = t.alpha;
    if (t.glow) {
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 6;
    }
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  });

  // Bullets
  bullets.forEach(function(b) {
    if (b.isSlash) {
      var alpha = b.life / 8;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.slashAngle);
      ctx.strokeStyle = 'rgba(180,170,155,' + alpha + ')';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#8A8070';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 12, -0.6, 0.6);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,' + (alpha * 0.7) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 10, -0.4, 0.4);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    } else if (b.isFlame) {
      ctx.fillStyle = 'rgba(255,' + Math.floor(Math.random() * 100 + 50) + ',0,' + (b.life / 15) + ')';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.isToxic) {
      // Boss toxic bullets: 6px with pulse, white core, glow 12
      var toxPulse = 1 + Math.sin(Date.now() * 0.01 + b.x) * 0.15;
      ctx.fillStyle = b.trailColor || '#7A8A5A';
      ctx.shadowColor = b.trailColor || '#7A8A5A';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6 * toxPulse, 0, Math.PI * 2);
      ctx.fill();
      // White core
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (b.isSpitter) {
      // Spitter bullets: 5px with light core, glow 8
      ctx.fillStyle = b.trailColor || '#6A7A5A';
      ctx.shadowColor = b.trailColor || '#6A7A5A';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fill();
      // Light core
      ctx.fillStyle = 'rgba(200,255,200,0.6)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (b.owner === 'zombie') {
      // Generic zombie bullets: 5px green, glow 5
      ctx.fillStyle = '#7A8A5A';
      ctx.shadowColor = '#7A8A5A';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Player bullets: use sprite system
      drawBullet(ctx, b);
    }
  });

  // Particles
  particles.forEach(function(p) {
    if (p.lightning) {
      ctx.strokeStyle = 'rgba(170,150,120,' + (p.life / p.maxLife) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      var dx = p.tx - p.x, dy = p.ty - p.y;
      var steps = 5;
      for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        var jx = (i < steps) ? (Math.random() - 0.5) * 20 : 0;
        var jy = (i < steps) ? (Math.random() - 0.5) * 20 : 0;
        ctx.lineTo(p.x + dx * t + jx, p.y + dy * t + jy);
      }
      ctx.stroke();
    } else {
      var alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  });

  // Explosions
  explosions.forEach(function(e) {
    var progress = 1 - e.life / e.maxLife;
    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = 'rgba(255,' + Math.floor(100 + progress * 155) + ',0,0.3)';
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius * (0.5 + progress * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Shadow clone
  if (shadowClone) {
    var cloneAlpha = Math.min(1, shadowClone.life / 60);
    ctx.globalAlpha = cloneAlpha * 0.5;
    ctx.fillStyle = '#3D3D3D';
    ctx.shadowColor = '#3D3D3D';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(shadowClone.x, shadowClone.y, shadowClone.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(61,61,61,' + (0.3 + Math.sin(Date.now() * 0.01) * 0.2) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shadowClone.x, shadowClone.y, shadowClone.radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Grenades
  grenades.forEach(function(g) {
    // Shadow on ground
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(g.x, g.y, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Grenade body (offset upward by z)
    var drawY = g.y - g.z;
    var flashWarning = g.fuseTimer < 60 && g.fuseTimer % 8 < 4;

    ctx.fillStyle = flashWarning ? '#ff4400' : '#3a6a3a';
    ctx.shadowColor = flashWarning ? '#ff4400' : '#3a6a3a';
    ctx.shadowBlur = flashWarning ? 8 : 0;
    ctx.beginPath();
    ctx.arc(g.x, drawY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pin detail
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g.x, drawY - 4);
    ctx.lineTo(g.x + 2, drawY - 6);
    ctx.stroke();

    // Explosion radius preview when timer < 30
    if (g.fuseTimer < 30) {
      ctx.strokeStyle = 'rgba(255,68,0,' + (0.1 + (1 - g.fuseTimer / 30) * 0.3) + ')';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.shadowBlur = 0;
  });

  ctx.restore();

  // Fog effect - subtle vignette
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  var fogGrad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.75
  );
  fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
  fogGrad.addColorStop(1, 'rgba(10,8,5,0.25)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Screen pulse on dodge
  if (dodgeFeedbackTimer > 0) {
    var pulseAlpha = (dodgeFeedbackTimer / 15) * dodgeFeedbackIntensity * 0.15;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // White flash with radial vignette
    var vigGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.7
    );
    vigGrad.addColorStop(0, 'rgba(200,180,140,' + (pulseAlpha * 0.5) + ')');
    vigGrad.addColorStop(1, 'rgba(255,255,255,' + pulseAlpha + ')');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Dodge combo HUD
  if (bulletsDodgedCombo >= 2 && dodgeComboTimer > 0) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var comboAlpha = Math.min(1, dodgeComboTimer / 60);
    ctx.fillStyle = 'rgba(200,180,140,' + comboAlpha + ')';
    ctx.shadowColor = '#C4B48C';
    ctx.shadowBlur = 12;
    ctx.font = "bold 22px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Position below the kill combo display area
    ctx.fillText('DODGE x' + bulletsDodgedCombo, canvas.width / 2, 140);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Screen-space UI elements
  if (gameMode === 'odyssey') {
    renderBossHealthBar();
    renderInteractPrompts();
    renderExtractionHUD();
  }

  renderAbilityHUD();
  renderWeaponHUD();
  renderGrenadeHUD();
  renderPerkHUD();
  renderMinimap();
}

// ===== ROOM WALLS =====
function renderRoomWalls() {
  for (var i = 0; i < roomWalls.length; i++) {
    var w = roomWalls[i];
    if (w.boundary) continue; // Don't render boundary walls

    // Dark fill
    ctx.fillStyle = '#4A4A48';
    ctx.fillRect(w.x, w.y, w.w, w.h);

    // Inner shadow edges (4px dark gradient on each border)
    var sh = 4;
    // Top shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(w.x, w.y, w.w, sh);
    // Bottom shadow
    ctx.fillRect(w.x, w.y + w.h - sh, w.w, sh);
    // Left shadow
    ctx.fillRect(w.x, w.y, sh, w.h);
    // Right shadow
    ctx.fillRect(w.x + w.w - sh, w.y, sh, w.h);

    // Panel lines (horizontal every ~22px, vertical every ~22px)
    ctx.strokeStyle = 'rgba(30,28,25,0.3)';
    ctx.lineWidth = 1;
    if (w.h > 30) {
      for (var py = w.y + 22; py < w.y + w.h - 4; py += 22) {
        ctx.beginPath();
        ctx.moveTo(w.x + 4, py);
        ctx.lineTo(w.x + w.w - 4, py);
        ctx.stroke();
      }
    }
    if (w.w > 30) {
      for (var px = w.x + 22; px < w.x + w.w - 4; px += 22) {
        ctx.beginPath();
        ctx.moveTo(px, w.y + 4);
        ctx.lineTo(px, w.y + w.h - 4);
        ctx.stroke();
      }
    }

    // Panel line highlight (offset by 1px for emboss effect)
    ctx.strokeStyle = 'rgba(60,55,45,0.15)';
    if (w.h > 30) {
      for (var py2 = w.y + 23; py2 < w.y + w.h - 4; py2 += 22) {
        ctx.beginPath();
        ctx.moveTo(w.x + 4, py2);
        ctx.lineTo(w.x + w.w - 4, py2);
        ctx.stroke();
      }
    }

    // Damage marks (1-2 per wall, deterministic position based on wall coords)
    var seed1 = (w.x * 7 + w.y * 13) % 100;
    var seed2 = (w.x * 17 + w.y * 3) % 100;
    if (w.w > 20 && w.h > 20) {
      ctx.fillStyle = 'rgba(40,35,30,0.3)';
      var dmgX1 = w.x + 6 + (seed1 / 100) * (w.w - 12);
      var dmgY1 = w.y + 6 + (seed2 / 100) * (w.h - 12);
      var dmgR1 = 3 + (seed1 % 5);
      ctx.beginPath();
      ctx.arc(dmgX1, dmgY1, dmgR1, 0, Math.PI * 2);
      ctx.fill();

      if (w.w > 40 || w.h > 40) {
        var dmgX2 = w.x + 6 + (seed2 / 100) * (w.w - 12);
        var dmgY2 = w.y + 6 + (seed1 / 100) * (w.h - 12);
        var dmgR2 = 2 + (seed2 % 4);
        ctx.beginPath();
        ctx.arc(dmgX2, dmgY2, dmgR2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Border (toned down green)
    ctx.strokeStyle = 'rgba(139,109,79,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);

    // Subtle inner highlight
    ctx.fillStyle = 'rgba(139,109,79,0.04)';
    ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, w.h - 4);
  }
}

// ===== EXIT ZONE =====
function renderExitZone() {
  if (!exitZone) return;

  var pulse = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;

  if (exitZone.locked) {
    // Red locked exit
    ctx.fillStyle = 'rgba(139,0,0,' + (0.2 + pulse * 0.1) + ')';
    ctx.fillRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
    ctx.strokeStyle = 'rgba(139,0,0,0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);

    // Lock icon (X)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 3;
    var cx = exitZone.x + exitZone.w / 2;
    var cy = exitZone.y + exitZone.h / 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 8); ctx.lineTo(cx + 8, cy + 8);
    ctx.moveTo(cx + 8, cy - 8); ctx.lineTo(cx - 8, cy + 8);
    ctx.stroke();
  } else {
    // Green pulsing unlocked exit
    ctx.fillStyle = 'rgba(143,168,90,' + (0.15 + pulse * 0.15) + ')';
    ctx.fillRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
    ctx.strokeStyle = 'rgba(143,168,90,' + (0.5 + pulse * 0.3) + ')';
    ctx.lineWidth = 2;
    ctx.strokeRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);

    // Arrow indicator
    ctx.fillStyle = 'rgba(143,168,90,' + (0.6 + pulse * 0.4) + ')';
    var cx = exitZone.x + exitZone.w / 2;
    var cy = exitZone.y + exitZone.h / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx + 10, cy + 2);
    ctx.lineTo(cx - 10, cy + 2);
    ctx.closePath();
    ctx.fill();

    // Glow
    ctx.shadowColor = '#8FA85A';
    ctx.shadowBlur = 6;
    ctx.strokeRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
    ctx.shadowBlur = 0;
  }
}

// ===== HAZARD ZONES =====
function renderHazards() {
  for (var i = 0; i < hazards.length; i++) {
    var h = hazards[i];
    var pulse = 0.5 + Math.sin(Date.now() * 0.003 + i) * 0.2;

    if (h.isPool && h.isBomb) {
      // Timed bomb - pulsing golden circle
      var bombProg = h.maxBombLife ? (1 - h.life / h.maxBombLife) : 0;
      var bombPulse = 0.3 + bombProg * 0.7;
      ctx.fillStyle = 'rgba(196,160,50,' + (0.2 + bombPulse * 0.3) + ')';
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,200,64,' + (0.4 + bombPulse * 0.6) + ')';
      ctx.lineWidth = 2 + bombProg * 2;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius * (0.5 + bombProg * 0.5), 0, Math.PI * 2);
      ctx.stroke();
      // Warning flash when about to explode
      if (h.life < 30 && h.life % 6 < 3) {
        ctx.fillStyle = 'rgba(255,200,50,0.4)';
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (h.isPool && h.isGravity) {
      // Gravity well - dark blue vortex
      var gwAlpha = h.life > 60 ? 0.25 : (h.life / 60) * 0.25;
      ctx.fillStyle = 'rgba(42,74,107,' + (gwAlpha + pulse * 0.1) + ')';
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      // Spinning vortex lines
      for (var vi = 0; vi < 4; vi++) {
        var vAngle = (Date.now() * 0.004) + (vi * Math.PI / 2);
        ctx.strokeStyle = 'rgba(68,136,255,' + (0.3 + pulse * 0.3) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius * 0.7, vAngle, vAngle + 0.8);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(68,136,255,' + (0.2 + pulse * 0.2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (h.isPool) {
      // Pool - color based on type (green acid / purple plague)
      var poolAlpha = h.life > 60 ? 0.25 : (h.life / 60) * 0.25;
      var isPurple = h.color === '#8833cc';
      var pR = isPurple ? 136 : 57, pG = isPurple ? 51 : 255, pB = isPurple ? 204 : 20;
      ctx.fillStyle = 'rgba(' + pR + ',' + pG + ',' + pB + ',' + (poolAlpha + pulse * 0.1) + ')';
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(' + pR + ',' + pG + ',' + pB + ',' + (0.3 + pulse * 0.2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.stroke();
      // Bubbles
      if (Math.random() < 0.08) {
        particles.push({
          x: h.x + (Math.random() - 0.5) * h.radius * 1.5,
          y: h.y + (Math.random() - 0.5) * h.radius * 1.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1,
          life: 20, maxLife: 20,
          color: isPurple ? '#8833cc' : '#8FA85A', size: 2
        });
      }
    } else if (h.isBoulder) {
      // Boulder - brown circle with rolling line
      ctx.fillStyle = '#8B6914';
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5a4510';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.stroke();
      // Rolling line effect
      var rollAngle = h.rollAngle || 0;
      ctx.strokeStyle = '#a0822a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(h.x + Math.cos(rollAngle) * h.radius * 0.7, h.y + Math.sin(rollAngle) * h.radius * 0.7);
      ctx.lineTo(h.x - Math.cos(rollAngle) * h.radius * 0.7, h.y - Math.sin(rollAngle) * h.radius * 0.7);
      ctx.stroke();
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + h.radius * 0.8, h.radius * 0.8, h.radius * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (h.isWave) {
      // Blood wave - deep red rect
      ctx.fillStyle = 'rgba(139,0,0,0.6)';
      ctx.fillRect(h.x, h.y, h.w, h.h);
      ctx.strokeStyle = '#cc0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x, h.y, h.w, h.h);
      // Dripping effect
      if (Math.random() < 0.1) {
        particles.push({
          x: h.x + Math.random() * h.w,
          y: h.y + h.h / 2,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 2,
          life: 15, maxLife: 15,
          color: '#8b0000', size: 3
        });
      }
    } else if (h.isShadowTile) {
      // Shadow tile - dark golden corrupted floor tile (Akkha ToA style)
      var stPulse = 0.5 + Math.sin(Date.now() * 0.004 + h.x * 0.1 + h.y * 0.1) * 0.15;
      var stAlpha = h.life > 60 ? 1 : h.life / 60; // Fade out near end
      ctx.globalAlpha = stAlpha;

      // Dark golden base fill
      ctx.fillStyle = 'rgba(100,80,20,' + (0.3 + stPulse * 0.15) + ')';
      ctx.fillRect(h.x, h.y, h.w, h.h);

      // Inner corruption pattern (diagonal lines)
      ctx.strokeStyle = 'rgba(160,130,40,' + (0.2 + stPulse * 0.1) + ')';
      ctx.lineWidth = 1;
      for (var dl = 0; dl < h.w + h.h; dl += 12) {
        ctx.beginPath();
        var dlx1 = h.x + Math.min(dl, h.w);
        var dly1 = h.y + Math.max(0, dl - h.w);
        var dlx2 = h.x + Math.max(0, dl - h.h);
        var dly2 = h.y + Math.min(dl, h.h);
        ctx.moveTo(dlx1, dly1);
        ctx.lineTo(dlx2, dly2);
        ctx.stroke();
      }

      // Grid border with Akkha gold
      ctx.strokeStyle = 'rgba(196,160,50,' + (0.4 + stPulse * 0.3) + ')';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x, h.y, h.w, h.h);

      // Subtle golden particles
      if (Math.random() < 0.04) {
        particles.push({
          x: h.x + Math.random() * h.w,
          y: h.y + Math.random() * h.h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1,
          life: 20, maxLife: 20,
          color: '#e8c840', size: 2
        });
      }
      ctx.globalAlpha = 1;
    } else {
      // Default rectangular hazard
      ctx.fillStyle = 'rgba(143,168,90,' + (0.08 + pulse * 0.06) + ')';
      ctx.fillRect(h.x, h.y, h.w, h.h);

      ctx.strokeStyle = 'rgba(143,168,90,' + (0.2 + pulse * 0.15) + ')';
      ctx.lineWidth = 1;
      ctx.strokeRect(h.x, h.y, h.w, h.h);

      // Toxic bubbles
      if (Math.random() < 0.05) {
        particles.push({
          x: h.x + Math.random() * h.w,
          y: h.y + Math.random() * h.h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1,
          life: 20, maxLife: 20,
          color: h.color || '#8FA85A', size: 2
        });
      }
    }
  }
}

// ===== INTERACTABLES =====
function renderInteractables() {
  for (var i = 0; i < interactables.length; i++) {
    var obj = interactables[i];
    if (!obj.active) continue;

    if (obj.type === 'switch') {
      var pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
      var color = obj.activated ? obj.activeColor : obj.color;

      // Circle
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = obj.activated ? 15 : 8;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius * pulse + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 14px 'Orbitron', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.label, obj.x, obj.y);
    }

    if (obj.type === 'portal') {
      var pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
      var portalR = obj.radius * pulse;

      if (obj.cleared) {
        // Green + checkmark for cleared portals
        ctx.fillStyle = 'rgba(143,168,90,0.15)';
        ctx.strokeStyle = '#8FA85A';
      } else if (obj.locked) {
        // Gray + X for locked boss portal
        ctx.fillStyle = 'rgba(100,100,100,0.15)';
        ctx.strokeStyle = '#666666';
      } else if (obj.isBoss) {
        // Red/orange for unlocked boss portal
        ctx.fillStyle = 'rgba(255,50,50,0.2)';
        ctx.strokeStyle = '#ff4444';
      } else {
        // Muted blue for available challenge portals
        ctx.fillStyle = 'rgba(106,138,154,0.2)';
        ctx.strokeStyle = '#6A8A9A';
      }

      // Outer ring
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, portalR + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner ring with glow
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, portalR - 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Spinning particles inside portal
      if (!obj.cleared && !obj.locked) {
        for (var sp = 0; sp < 4; sp++) {
          var spAngle = (Date.now() * 0.003) + (sp * Math.PI / 2);
          var spR = portalR * 0.5;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(obj.x + Math.cos(spAngle) * spR, obj.y + Math.sin(spAngle) * spR, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Status icon
      if (obj.cleared) {
        // Checkmark
        ctx.strokeStyle = '#8FA85A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(obj.x - 10, obj.y);
        ctx.lineTo(obj.x - 3, obj.y + 8);
        ctx.lineTo(obj.x + 12, obj.y - 8);
        ctx.stroke();
      } else if (obj.locked) {
        // X mark
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(obj.x - 8, obj.y - 8);
        ctx.lineTo(obj.x + 8, obj.y + 8);
        ctx.moveTo(obj.x + 8, obj.y - 8);
        ctx.lineTo(obj.x - 8, obj.y + 8);
        ctx.stroke();
      }

      // Portal label below
      ctx.fillStyle = obj.cleared ? '#8FA85A' : (obj.locked ? '#666' : '#ffffff');
      ctx.font = "bold 10px 'Orbitron', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(obj.roomName, obj.x, obj.y + portalR + 12);
    }

    if (obj.type === 'beacon') {
      var pulse = 1 + Math.sin(Date.now() * 0.003) * 0.2;

      // Outer glow ring
      ctx.strokeStyle = 'rgba(143,168,90,' + (0.2 + pulse * 0.2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 40 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Core
      ctx.fillStyle = '#8FA85A';
      ctx.shadowColor = '#8FA85A';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner core
      ctx.fillStyle = '#AAB89A';
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Progress ring
      if (extractionProgress > 0) {
        ctx.strokeStyle = '#8FA85A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 35, -Math.PI / 2, -Math.PI / 2 + extractionProgress * Math.PI * 2);
        ctx.stroke();
      }

      // Channel effect
      if (obj.channeling) {
        ctx.strokeStyle = 'rgba(143,168,90,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }
}

// ===== TELEGRAPHS =====
function renderTelegraphs() {
  for (var i = 0; i < telegraphs.length; i++) {
    var t = telegraphs[i];
    var progress = t.timer / t.maxTime;

    if (t.type === 'circle') {
      // Expanding red fill with closing inner ring
      ctx.fillStyle = 'rgba(255,0,50,' + (0.05 + progress * 0.15) + ')';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = 'rgba(255,0,50,' + (0.3 + progress * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Closing inner ring
      var innerRadius = t.radius * (1 - progress);
      ctx.strokeStyle = 'rgba(255,100,100,' + (0.4 + progress * 0.6) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, innerRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (t.type === 'laser_arc') {
      // Laser sweep arc telegraph - shows the full sweep zone
      var arcStart = t.angle - t.sweepAngle / 2;
      var arcEnd = t.angle + t.sweepAngle / 2;

      // Filled arc showing danger zone
      ctx.fillStyle = 'rgba(68,136,255,' + (0.04 + progress * 0.1) + ')';
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.arc(t.x, t.y, t.length, arcStart, arcEnd);
      ctx.closePath();
      ctx.fill();

      // Arc border
      ctx.strokeStyle = 'rgba(68,136,255,' + (0.2 + progress * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.length, arcStart, arcEnd);
      ctx.stroke();

      // Sweep direction indicator - animated line showing where it starts
      var indicatorAngle = arcStart + (arcEnd - arcStart) * progress;
      ctx.strokeStyle = 'rgba(150,200,255,' + (0.4 + progress * 0.6) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x + Math.cos(indicatorAngle) * t.length, t.y + Math.sin(indicatorAngle) * t.length);
      ctx.stroke();

      // Start line (where the sweep begins)
      ctx.strokeStyle = 'rgba(255,100,100,' + (0.3 + progress * 0.4) + ')';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x + Math.cos(arcStart) * t.length, t.y + Math.sin(arcStart) * t.length);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (t.type === 'line') {
      // Orange rect with sweep fill
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.angle);

      // Background
      ctx.fillStyle = 'rgba(255,165,0,' + (0.05 + progress * 0.1) + ')';
      ctx.fillRect(0, -t.width / 2, t.length, t.width);

      // Sweep fill
      ctx.fillStyle = 'rgba(255,165,0,' + (0.15 + progress * 0.2) + ')';
      ctx.fillRect(0, -t.width / 2, t.length * progress, t.width);

      // Border
      ctx.strokeStyle = 'rgba(255,165,0,' + (0.3 + progress * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, -t.width / 2, t.length, t.width);

      ctx.restore();
    }

    if (t.type === 'spiral' || t.subtype === 'pulse') {
      // Screen vignette-like pulse
      var pulseAlpha = 0.1 + progress * 0.2;
      ctx.strokeStyle = 'rgba(143,168,90,' + pulseAlpha + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius * (0.5 + progress * 0.5), 0, Math.PI * 2);
      ctx.stroke();

      // Spinning indicator
      for (var s = 0; s < 3; s++) {
        var angle = (Date.now() * 0.005) + (s * Math.PI * 2 / 3);
        ctx.fillStyle = 'rgba(143,168,90,' + (0.3 + progress * 0.5) + ')';
        ctx.beginPath();
        ctx.arc(
          t.x + Math.cos(angle) * t.radius * 0.6,
          t.y + Math.sin(angle) * t.radius * 0.6,
          5, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }

    if (t.type === 'wave') {
      var waveAlpha = 0.1 + progress * 0.3;
      if (t.vertical) {
        // Vertical bar sweep indicator
        ctx.fillStyle = 'rgba(139,0,0,' + waveAlpha + ')';
        ctx.fillRect(t.x - 25, t.y, t.width + 10, t.height);
        ctx.strokeStyle = 'rgba(255,0,0,' + (0.3 + progress * 0.7) + ')';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x - 25, t.y, t.width + 10, t.height);
      } else {
        // Horizontal bar
        ctx.fillStyle = 'rgba(139,0,0,' + waveAlpha + ')';
        ctx.fillRect(t.x, t.y - 25, t.width, t.height + 10);
        ctx.strokeStyle = 'rgba(255,0,0,' + (0.3 + progress * 0.7) + ')';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y - 25, t.width, t.height + 10);
      }
      // "DODGE!" text
      if (progress > 0.3) {
        ctx.fillStyle = 'rgba(255,50,50,' + (progress) + ')';
        ctx.font = "bold 24px 'Orbitron', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DODGE!', WORLD_W / 2, WORLD_H / 2 - 50);
      }
    }

    if (t.type === 'acid') {
      // Green circles at target positions
      for (var ac = 0; ac < (t.poolCount || 3); ac++) {
        var acx = t.x + (Math.random() * 0.001 - 0.0005) + Math.cos(ac * 2.1) * 80;
        var acy = t.y + (Math.random() * 0.001 - 0.0005) + Math.sin(ac * 2.1) * 80;
        ctx.fillStyle = 'rgba(143,168,90,' + (0.05 + progress * 0.15) + ')';
        ctx.beginPath();
        ctx.arc(acx, acy, (t.poolRadius || 50) * (0.3 + progress * 0.7), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(143,168,90,' + (0.2 + progress * 0.6) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    if (t.type === 'tiles') {
      // Shadow tiles telegraph - golden rectangles growing from center
      var tilePosArr = t.tilePositions || [];
      var tileSize = t.tileSize || 60;
      for (var ti = 0; ti < tilePosArr.length; ti++) {
        var tp = tilePosArr[ti];
        var growScale = 0.3 + progress * 0.7; // Grow from center
        var drawW = tileSize * growScale;
        var drawH = tileSize * growScale;
        var drawX = tp.x + (tileSize - drawW) / 2;
        var drawY = tp.y + (tileSize - drawH) / 2;

        // Golden semi-transparent fill
        ctx.fillStyle = 'rgba(196,160,50,' + (0.05 + progress * 0.15) + ')';
        ctx.fillRect(drawX, drawY, drawW, drawH);

        // Pulsing border that intensifies
        var tileBorderPulse = 0.5 + Math.sin(Date.now() * 0.006 + ti) * 0.3;
        ctx.strokeStyle = 'rgba(232,200,64,' + (0.2 + progress * 0.6 + tileBorderPulse * 0.2) + ')';
        ctx.lineWidth = 1 + progress * 2;
        ctx.strokeRect(drawX, drawY, drawW, drawH);
      }
    }

    if (t.type === 'boulder') {
      // Vertical lane indicators
      var numLanes = t.laneCount || 5;
      var laneW = WORLD_W / numLanes;
      for (var ln = 0; ln < numLanes; ln++) {
        var lnX = ln * laneW;
        ctx.fillStyle = 'rgba(139,105,20,' + (0.03 + progress * 0.08) + ')';
        ctx.fillRect(lnX, 0, laneW, WORLD_H);
        ctx.strokeStyle = 'rgba(139,105,20,' + (0.1 + progress * 0.3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lnX, 0);
        ctx.lineTo(lnX, WORLD_H);
        ctx.stroke();
      }
    }

    if (t.subtype === 'channel') {
      // Channel circle
      ctx.fillStyle = 'rgba(255,200,0,' + (0.1 + progress * 0.15) + ')';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius * (0.8 + progress * 0.2), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,200,0,' + (0.4 + progress * 0.4) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ===== INTERACT PROMPTS (screen space) =====
function renderInteractPrompts() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  for (var i = 0; i < interactables.length; i++) {
    var obj = interactables[i];
    if (!obj.active || !obj.inRange) continue;
    // Skip activated switches
    if (obj.type === 'switch' && obj.activated) continue;

    var screenX = (obj.x - camera.x) * cameraZoom;
    var screenY = (obj.y - camera.y) * cameraZoom - 40;

    var promptText, promptW;
    if (obj.type === 'portal') {
      if (obj.cleared) {
        promptText = 'CLEARED';
        promptW = 80;
      } else if (obj.locked) {
        promptText = 'LOCKED';
        promptW = 70;
      } else {
        promptText = '[E] ENTER';
        promptW = 90;
      }
    } else if (obj.type === 'beacon') {
      promptText = '[HOLD E] EXTRACT';
      promptW = 120;
    } else {
      promptText = '[E] INTERACT';
      promptW = 100;
    }

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(screenX - promptW / 2, screenY - 12, promptW, 24);
    ctx.strokeStyle = '#8FA85A';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX - promptW / 2, screenY - 12, promptW, 24);

    ctx.fillStyle = '#8FA85A';
    ctx.font = "bold 12px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(promptText, screenX, screenY);
  }

  ctx.restore();
}

// ===== EXTRACTION HUD (screen space) =====
function renderExtractionHUD() {
  if (!extractionActive && extractionProgress <= 0) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  var barW = 300;
  var barH = 20;
  var barX = (canvas.width - barW) / 2;
  var barY = 80;

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(barX - 2, barY - 18, barW + 4, barH + 24);

  // Label
  ctx.fillStyle = '#8FA85A';
  ctx.font = "bold 10px 'Orbitron', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('EXTRACTING...', canvas.width / 2, barY - 6);

  // Bar background
  ctx.fillStyle = 'rgba(143,168,90,0.1)';
  ctx.fillRect(barX, barY, barW, barH);

  // Progress fill
  var gradient = ctx.createLinearGradient(barX, barY, barX + barW * extractionProgress, barY);
  gradient.addColorStop(0, '#5C6B3A');
  gradient.addColorStop(1, '#8FA85A');
  ctx.fillStyle = gradient;
  ctx.fillRect(barX, barY, barW * extractionProgress, barH);

  // Border
  ctx.strokeStyle = extractionActive ? '#8FA85A' : '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Percentage
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 11px 'Orbitron', monospace";
  ctx.fillText(Math.floor(extractionProgress * 100) + '%', canvas.width / 2, barY + barH / 2 + 1);

  ctx.restore();
}

// ===== ABILITY HUD =====
function renderAbilityHUD() {
  if (!player || !player.abilities || player.abilities.length === 0) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  var boxW = 70;
  var boxH = 50;
  var gap = 8;
  var totalW = player.abilities.length * boxW + (player.abilities.length - 1) * gap;
  var startX = (canvas.width - totalW) / 2;
  var startY = canvas.height - 70;

  for (var i = 0; i < player.abilities.length; i++) {
    var ab = player.abilities[i];
    var bx = startX + i * (boxW + gap);
    var by = startY;
    var onCd = ab.cdTimer > 0;
    var cdPercent = onCd ? ab.cdTimer / ab.cd : 0;

    // Background
    ctx.fillStyle = onCd ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)';
    ctx.fillRect(bx, by, boxW, boxH);

    // Cooldown overlay
    if (onCd) {
      ctx.fillStyle = 'rgba(100,100,100,0.4)';
      ctx.fillRect(bx, by, boxW, boxH * cdPercent);
    }

    // Border
    ctx.strokeStyle = onCd ? '#444444' : player.color;
    ctx.lineWidth = onCd ? 1 : 2;
    ctx.strokeRect(bx, by, boxW, boxH);

    // Active buff glow
    var isBuffActive = false;
    if (ab.name === 'FORTIFY' && player.fortifyTimer > 0) isBuffActive = true;
    if (ab.name === 'OVERCHARGE' && player.overchargeTimer > 0) isBuffActive = true;
    if (ab.name === 'SCAN PULSE' && player.scanTimer > 0) isBuffActive = true;
    if (isBuffActive) {
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, boxW, boxH);
      ctx.shadowBlur = 0;
    }

    // Key label
    var abilityKeyLabels = ['Q', 'E', 'F', 'C'];
    ctx.fillStyle = onCd ? '#666' : '#ffffff';
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(abilityKeyLabels[i], bx + 4, by + 3);

    // Ability name (shortened)
    var shortName = ab.name.length > 10 ? ab.name.substring(0, 9) + '.' : ab.name;
    ctx.fillStyle = onCd ? '#666' : '#cccccc';
    ctx.font = "bold 8px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shortName, bx + boxW / 2, by + boxH / 2 - 2);

    // Cooldown timer text
    if (onCd) {
      var cdSec = (ab.cdTimer / 60).toFixed(1);
      ctx.fillStyle = '#ff6666';
      ctx.font = "bold 11px 'Orbitron', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(cdSec + 's', bx + boxW / 2, by + boxH - 3);
    }
  }

  ctx.restore();
}

// ===== WEAPON HUD =====
function renderWeaponHUD() {
  if (!player) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  var slotW = 120;
  var slotH = 36;
  var gap = 6;
  var startX = canvas.width - slotW - 15;
  var startY = canvas.height - 140;

  for (var s = 1; s <= 2; s++) {
    var sy = startY + (s - 1) * (slotH + gap);
    var isActive = player.activeWeaponSlot === s;
    var wpn = s === 1 ? player.primaryWeapon : player.secondaryWeapon;
    var ammo = s === 1 ? player.primaryAmmo : player.secondaryAmmo;
    var reloading = s === 1 ? player.primaryReloading : player.secondaryReloading;

    // Background
    ctx.fillStyle = isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)';
    ctx.fillRect(startX, sy, slotW, slotH);

    // Active highlight border
    ctx.strokeStyle = isActive ? player.color : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = isActive ? 2 : 1;
    ctx.strokeRect(startX, sy, slotW, slotH);

    // Slot number
    ctx.fillStyle = isActive ? '#ffffff' : '#888';
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('' + s, startX + 4, sy + 3);

    // Weapon name
    ctx.fillStyle = isActive ? '#cccccc' : '#666';
    ctx.font = "bold 9px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var shortName = wpn.name.length > 12 ? wpn.name.substring(0, 11) + '.' : wpn.name;
    ctx.fillText(shortName, startX + slotW / 2, sy + slotH / 2 - 4);

    // Ammo count
    ctx.fillStyle = reloading ? '#ff6666' : (isActive ? '#ffaa00' : '#555');
    ctx.font = "bold 8px 'Orbitron', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(reloading ? 'RELOADING' : (ammo + '/' + wpn.mag), startX + slotW / 2, sy + slotH - 3);
  }

  ctx.restore();
}

// ===== GRENADE HUD =====
function renderGrenadeHUD() {
  if (!player || player.className !== 'bulwark') return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  var boxW = 60;
  var boxH = 36;
  var bx = canvas.width - boxW - 15;
  var by = canvas.height - 50;

  // Background
  ctx.fillStyle = player.grenadeCooldown > 0 ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)';
  ctx.fillRect(bx, by, boxW, boxH);

  // Border
  ctx.strokeStyle = player.grenadeCount > 0 && player.grenadeCooldown <= 0 ? '#4a8a4a' : '#444';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, boxW, boxH);

  // Key label
  ctx.fillStyle = player.grenadeCount > 0 ? '#ffffff' : '#666';
  ctx.font = "bold 10px 'Orbitron', monospace";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('G', bx + 4, by + 3);

  // Grenade icon (small circle)
  ctx.fillStyle = player.grenadeCount > 0 ? '#4a8a4a' : '#333';
  ctx.beginPath();
  ctx.arc(bx + boxW / 2, by + boxH / 2 - 2, 5, 0, Math.PI * 2);
  ctx.fill();
  // Pin
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx + boxW / 2, by + boxH / 2 - 7);
  ctx.lineTo(bx + boxW / 2 + 3, by + boxH / 2 - 10);
  ctx.stroke();

  // Count
  ctx.fillStyle = player.grenadeCount > 0 ? '#ffffff' : '#666';
  ctx.font = "bold 9px 'Orbitron', monospace";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(player.grenadeCount + '/' + player.grenadeMax, bx + boxW / 2, by + boxH - 2);

  ctx.restore();
}

// ===== PERK HUD =====
function renderPerkHUD() {
  if (!player || !player.perks || player.perks.length === 0) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Count perk occurrences
  var perkCounts = {};
  for (var i = 0; i < player.perks.length; i++) {
    var name = player.perks[i];
    perkCounts[name] = (perkCounts[name] || 0) + 1;
  }

  // Build unique perk list with icons from ALL_PERKS
  var uniquePerks = [];
  var seen = {};
  for (var j = 0; j < player.perks.length; j++) {
    var pName = player.perks[j];
    if (!seen[pName]) {
      seen[pName] = true;
      var perkDef = null;
      for (var k = 0; k < ALL_PERKS.length; k++) {
        if (ALL_PERKS[k].name === pName) { perkDef = ALL_PERKS[k]; break; }
      }
      uniquePerks.push({ name: pName, icon: perkDef ? perkDef.icon : '?', count: perkCounts[pName] });
    }
  }

  // Position: top-right, below minimap (minimap is 140x140 at top-right)
  var cellSize = 32;
  var gap = 4;
  var cols = 5;
  var startX = canvas.width - 144;
  var startY = 150;

  for (var p = 0; p < uniquePerks.length; p++) {
    var col = p % cols;
    var row = Math.floor(p / cols);
    var px = startX + col * (cellSize + gap);
    var py = startY + row * (cellSize + gap);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(px, py, cellSize, cellSize);
    ctx.strokeStyle = 'rgba(143,168,90,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, cellSize, cellSize);

    // Icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(uniquePerks[p].icon, px + cellSize / 2, py + cellSize / 2);

    // Stack badge
    if (uniquePerks[p].count > 1) {
      var badgeX = px + cellSize - 2;
      var badgeY = py + 2;
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY + 6, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 9px 'Orbitron', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('x' + uniquePerks[p].count, badgeX, badgeY + 6);
    }
  }

  ctx.restore();
}

function renderMinimap() {
  var scaleX = 140 / WORLD_W;
  var scaleY = 140 / WORLD_H;
  var scale = Math.min(scaleX, scaleY);

  minimapCtx.fillStyle = 'rgba(0,0,0,0.8)';
  minimapCtx.fillRect(0, 0, 140, 140);

  // Room walls on minimap
  if (gameMode === 'odyssey') {
    minimapCtx.fillStyle = 'rgba(143,168,90,0.2)';
    for (var i = 0; i < roomWalls.length; i++) {
      var w = roomWalls[i];
      if (w.boundary) continue;
      minimapCtx.fillRect(w.x * scale, w.y * scale, Math.max(2, w.w * scale), Math.max(2, w.h * scale));
    }

    // Exit zone on minimap
    if (exitZone) {
      minimapCtx.fillStyle = exitZone.locked ? 'rgba(139,0,0,0.5)' : 'rgba(143,168,90,0.5)';
      minimapCtx.fillRect(exitZone.x * scale, exitZone.y * scale, Math.max(3, exitZone.w * scale), Math.max(3, exitZone.h * scale));
    }

    // Interactables on minimap
    for (var j = 0; j < interactables.length; j++) {
      var obj = interactables[j];
      if (!obj.active) continue;
      if (obj.type === 'portal') {
        if (obj.cleared) minimapCtx.fillStyle = '#8FA85A';
        else if (obj.locked) minimapCtx.fillStyle = '#666666';
        else if (obj.isBoss) minimapCtx.fillStyle = '#ff4444';
        else minimapCtx.fillStyle = '#6A8A9A';
        minimapCtx.fillRect(obj.x * scale - 3, obj.y * scale - 3, 6, 6);
      } else if (obj.type === 'beacon') {
        minimapCtx.fillStyle = '#8FA85A';
        minimapCtx.fillRect(obj.x * scale - 2, obj.y * scale - 2, 4, 4);
      } else {
        minimapCtx.fillStyle = obj.activated ? '#8FA85A' : '#ff4444';
        minimapCtx.fillRect(obj.x * scale - 2, obj.y * scale - 2, 4, 4);
      }
    }
  }

  // Zombies
  minimapCtx.fillStyle = '#ff3333';
  zombies.forEach(function(z) {
    var size = z.boss ? 4 : 2;
    minimapCtx.fillRect(z.x * scale - size / 2, z.y * scale - size / 2, size, size);
  });

  // Player
  minimapCtx.fillStyle = '#8FA85A';
  minimapCtx.fillRect(player.x * scale - 2, player.y * scale - 2, 4, 4);

  // Totems
  minimapCtx.fillStyle = '#5C7A45';
  totems.forEach(function(t) {
    minimapCtx.fillRect(t.x * scale - 1, t.y * scale - 1, 3, 3);
  });

  // Pickups
  minimapCtx.fillStyle = '#ffaa00';
  pickups.forEach(function(p) {
    minimapCtx.fillRect(p.x * scale - 1, p.y * scale - 1, 2, 2);
  });

  // Border
  minimapCtx.strokeStyle = 'rgba(143,168,90,0.3)';
  minimapCtx.strokeRect(0, 0, 140, 140);
}
