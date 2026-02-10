// ============================================================
// ZOMBIE COMP ODYSSEY - Input Handling
// ============================================================

var eKeyWasDown = false;

window.addEventListener('keydown', function(e) {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', function(e) {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (player) {
    mouse.worldX = e.clientX / cameraZoom + camera.x;
    mouse.worldY = e.clientY / cameraZoom + camera.y;
  }
});

window.addEventListener('mousedown', function(e) { mouse.down = true; });
window.addEventListener('mouseup', function(e) { mouse.down = false; });
window.addEventListener('contextmenu', function(e) { e.preventDefault(); });

// Prevent default for game keys
window.addEventListener('keydown', function(e) {
  if (['w','a','s','d',' ','r','e','1','2','3','4'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    if (gameRunning) togglePause();
  }
});
