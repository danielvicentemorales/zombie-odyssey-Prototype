// ============================================================
// ZOMBIE COMP ODYSSEY - Rendering Engine
// ============================================================

function render() {
  ctx.save();

  // Zoom & Screen shake
  var shakeX = screenShake ? (Math.random() - 0.5) * screenShake * 2 : 0;
  var shakeY = screenShake ? (Math.random() - 0.5) * screenShake * 2 : 0;
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  // Background
  ctx.fillStyle = '#111115';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // Grid
  ctx.strokeStyle = 'rgba(57,255,20,0.04)';
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

  // World border
  ctx.strokeStyle = 'rgba(139,0,0,0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, WORLD_W, WORLD_H);

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
      case 'health': color = '#ff2244'; break;
      case 'ammo':   color = '#ffaa00'; break;
      case 'shield': color = '#44aaff'; break;
      case 'xp_orb': color = '#aa44ff'; break;
    }
    var pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Turrets
  turrets.forEach(function(t) {
    ctx.fillStyle = '#aa44ff';
    ctx.strokeStyle = '#cc66ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(170,68,255,0.1)';
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
    ctx.stroke();
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
    if (z.slowed > 0) ctx.fillStyle = '#4488ff';
    ctx.beginPath();
    ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    var eyeAngle = Math.atan2(player.y - z.y, player.x - z.x);
    ctx.fillStyle = z.boss ? '#ff0000' : '#cc0000';
    ctx.beginPath();
    ctx.arc(z.x + Math.cos(eyeAngle - 0.3) * z.radius * 0.4, z.y + Math.sin(eyeAngle - 0.3) * z.radius * 0.4, z.radius * 0.2, 0, Math.PI * 2);
    ctx.arc(z.x + Math.cos(eyeAngle + 0.3) * z.radius * 0.4, z.y + Math.sin(eyeAngle + 0.3) * z.radius * 0.4, z.radius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // HP bar for tanks/bosses
    if (z.type === 'tank' || z.boss) {
      var barW = z.radius * 2;
      var barH = 3;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(z.x - barW / 2, z.y - z.radius - 10, barW, barH);
      ctx.fillStyle = z.boss ? '#ff0000' : '#ff4444';
      ctx.fillRect(z.x - barW / 2, z.y - z.radius - 10, barW * (z.hp / z.maxHp), barH);
    }

    // Boss glow
    if (z.boss) {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius + 4 + Math.sin(Date.now() * 0.005) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  });

  // Player
  if (player) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.radius * 0.8, player.radius * 0.8, player.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = player.invincible > 0 && player.invincible % 4 < 2 ? 'rgba(255,255,255,0.5)' : player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Weapon direction
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(player.x + Math.cos(player.angle) * player.radius, player.y + Math.sin(player.angle) * player.radius);
    ctx.lineTo(player.x + Math.cos(player.angle) * (player.radius + 14), player.y + Math.sin(player.angle) * (player.radius + 14));
    ctx.stroke();

    // Shield visual
    if (player.shield > 0) {
      ctx.strokeStyle = 'rgba(68,170,255,' + (0.3 + player.shield / player.maxShield * 0.4) + ')';
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

  // Bullets
  bullets.forEach(function(b) {
    if (b.isFlame) {
      ctx.fillStyle = 'rgba(255,' + Math.floor(Math.random() * 100 + 50) + ',0,' + (b.life / 15) + ')';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.owner === 'zombie') {
      ctx.fillStyle = '#44ff44';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#ffdd44';
      ctx.shadowColor = '#ffdd44';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // Particles
  particles.forEach(function(p) {
    if (p.lightning) {
      ctx.strokeStyle = 'rgba(100,200,255,' + (p.life / p.maxLife) + ')';
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

  ctx.restore();

  renderMinimap();
}

function renderMinimap() {
  var scale = 140 / WORLD_W;

  minimapCtx.fillStyle = 'rgba(0,0,0,0.8)';
  minimapCtx.fillRect(0, 0, 140, 140);

  // Zombies
  minimapCtx.fillStyle = '#ff3333';
  zombies.forEach(function(z) {
    minimapCtx.fillRect(z.x * scale - 1, z.y * scale - 1, 2, 2);
  });

  // Player
  minimapCtx.fillStyle = '#39FF14';
  minimapCtx.fillRect(player.x * scale - 2, player.y * scale - 2, 4, 4);

  // Pickups
  minimapCtx.fillStyle = '#ffaa00';
  pickups.forEach(function(p) {
    minimapCtx.fillRect(p.x * scale - 1, p.y * scale - 1, 2, 2);
  });

  // Border
  minimapCtx.strokeStyle = 'rgba(57,255,20,0.3)';
  minimapCtx.strokeRect(0, 0, 140, 140);
}
