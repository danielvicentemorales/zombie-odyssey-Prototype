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
var totems = [];
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

// Room system globals
var currentRoom = 0;
var roomState = 'active'; // 'active', 'cleared', 'transitioning'
var roomTimer = 0;
var roomWalls = [];
var telegraphs = [];
var hazards = [];
var interactables = [];
var roomEnemyQueue = [];
var exitZone = null;
var bossEntity = null;
var gameMode = 'endless'; // 'endless' or 'odyssey'
var extractionProgress = 0;
var extractionActive = false;
var eKeyJustPressed = false;
var roomCleared = false;

// Hub system globals
var hubRoom = false;
var roomsCleared = {};
var challengeRooms = [0, 1, 2, 3];
var bossRoomIndex = 4;
var extractionRoomIndex = 5;
var hubPortals = [];

// Ability system
var abilityKeysWas = [false, false, false, false];
var shadowClone = null;

// Room stage system
var roomStage = 'pre'; // 'pre' or 'boss'
