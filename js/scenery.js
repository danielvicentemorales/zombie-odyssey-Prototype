// ============================================================
// ZOMBIE COMP ODYSSEY - Procedural Scenery Decorations
// ============================================================

var sceneryDecor = [];

function generateScenery(worldW, worldH, count) {
  sceneryDecor = [];
  var types = ['crack', 'crack', 'stain', 'debris', 'debris', 'debris', 'scorch'];

  for (var i = 0; i < count; i++) {
    var type = types[Math.floor(Math.random() * types.length)];
    var x = Math.random() * worldW;
    var y = Math.random() * worldH;

    // Skip if inside a wall
    var inWall = false;
    for (var wi = 0; wi < roomWalls.length; wi++) {
      var w = roomWalls[wi];
      if (x > w.x && x < w.x + w.w && y > w.y && y < w.y + w.h) {
        inWall = true;
        break;
      }
    }
    if (inWall) continue;

    var obj = { type: type, x: x, y: y };

    if (type === 'crack') {
      obj.size = 15 + Math.random() * 35;
      obj.angle = Math.random() * Math.PI * 2;
      obj.segments = 2 + Math.floor(Math.random() * 3);
      obj.alpha = 0.08 + Math.random() * 0.12;
      obj.color = '#4A4540';
      // Pre-generate crack segments
      obj.points = [];
      var cx = 0, cy = 0;
      for (var s = 0; s <= obj.segments; s++) {
        obj.points.push({ x: cx, y: cy });
        cx += (Math.random() * 0.8 + 0.2) * (obj.size / obj.segments);
        cy += (Math.random() - 0.5) * 14;
      }
    } else if (type === 'stain') {
      obj.size = 8 + Math.random() * 20;
      obj.alpha = 0.06 + Math.random() * 0.1;
      obj.color = Math.random() < 0.6 ? '#3a1a0a' : '#2a1500';
      obj.blobs = [];
      var blobCount = 1 + Math.floor(Math.random() * 3);
      for (var b = 0; b < blobCount; b++) {
        obj.blobs.push({
          ox: (Math.random() - 0.5) * obj.size * 0.6,
          oy: (Math.random() - 0.5) * obj.size * 0.6,
          r: obj.size * (0.3 + Math.random() * 0.7)
        });
      }
    } else if (type === 'debris') {
      obj.size = 1.5 + Math.random() * 3;
      obj.alpha = 0.1 + Math.random() * 0.15;
      obj.color = Math.random() < 0.5 ? '#3A3835' : '#44423E';
      obj.shape = Math.random() < 0.5 ? 'circle' : 'rect';
      obj.angle = Math.random() * Math.PI;
      obj.w = obj.size * (0.6 + Math.random() * 0.8);
      obj.h = obj.size * (0.6 + Math.random() * 0.8);
    } else if (type === 'scorch') {
      obj.size = 12 + Math.random() * 25;
      obj.alpha = 0.05 + Math.random() * 0.08;
      obj.color = '#1a1815';
    }

    sceneryDecor.push(obj);
  }
}

function renderScenery() {
  var viewW = canvas.width / cameraZoom;
  var viewH = canvas.height / cameraZoom;
  var margin = 60;
  var minX = camera.x - margin;
  var maxX = camera.x + viewW + margin;
  var minY = camera.y - margin;
  var maxY = camera.y + viewH + margin;

  for (var i = 0; i < sceneryDecor.length; i++) {
    var d = sceneryDecor[i];
    if (d.x < minX || d.x > maxX || d.y < minY || d.y > maxY) continue;

    ctx.globalAlpha = d.alpha;

    if (d.type === 'crack') {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle);
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      for (var s = 1; s < d.points.length; s++) {
        ctx.lineTo(d.points[s].x, d.points[s].y);
      }
      ctx.stroke();
      // Small branch on some cracks
      if (d.segments > 2 && d.points.length > 2) {
        var bp = d.points[1];
        ctx.beginPath();
        ctx.moveTo(bp.x, bp.y);
        ctx.lineTo(bp.x + 6, bp.y + (Math.random() > 0.5 ? 8 : -8));
        ctx.stroke();
      }
      ctx.restore();
    } else if (d.type === 'stain') {
      ctx.fillStyle = d.color;
      for (var b = 0; b < d.blobs.length; b++) {
        var bl = d.blobs[b];
        ctx.beginPath();
        ctx.arc(d.x + bl.ox, d.y + bl.oy, bl.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (d.type === 'debris') {
      ctx.fillStyle = d.color;
      if (d.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle);
        ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h);
        ctx.restore();
      }
    } else if (d.type === 'scorch') {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
      // Slightly lighter ring
      ctx.strokeStyle = '#2A2825';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
}
