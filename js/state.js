// ============================================================
// ZOMBIE COMP ODYSSEY - Shared Game State
// ============================================================

var canvas, ctx, minimap, minimapCtx;

var gameRunning = false;
var gamePaused = false;

var camera = { x: 0, y: 0 };
var cameraZoom = 1.5;
var mouse = { x: 0, y: 0, worldX: 0, worldY: 0, down: false };
var keys = {};

var player = null;
var zombies = [];
var bullets = [];
var particles = [];
var pickups = [];
var turrets = [];
var explosions = [];
var damageNumbers = [];
var bloodSplats = [];

var wave = 1;
var score = 0;
var kills = 0;
var combo = 0;
var comboTimer = 0;
var waveTimer = 0;
var waveCooldown = 0;
var zombiesRemaining = 0;
var screenShake = 0;
