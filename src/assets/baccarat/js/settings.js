var CANVAS_WIDTH = 1700;
var CANVAS_HEIGHT = 768;

var EDGEBOARD_X = 338;
var EDGEBOARD_Y = 0;

var FPS_TIME      = 1000/24;
var DISABLE_SOUND_MOBILE = false;

var FONT_GAME_1 = "arialbold";
var FONT_GAME_2 = "Digital-7";

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var STATE_GAME_WAITING_FOR_BET    = 0;
var STATE_GAME_DEALING            = 1;
var STATE_GAME_SHOW_WINNER        = 2;

var STATE_CARD_DEALING  = 0;
var STATE_CARD_REMOVING = 1;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var ASSIGN_FICHES = "ASSIGN_FICHES";
var END_HAND = "END_HAND";
var ON_CARD_SHOWN = "ON_CARD_SHOWN";
var ON_CARD_ANIMATION_ENDING = "ON_CARD_ANIMATION_ENDING";
var ON_CARD_TO_REMOVE = "ON_CARD_TO_REMOVE";

var NUM_FICHES = 6;
var CARD_WIDTH = 66;
var CARD_HEIGHT = 102;
var MIN_BET;
var MAX_BET;
var TOTAL_MONEY;
var FICHE_WIDTH;
var WIN_OCCURRENCE;
var BET_OCCURRENCE;

var TIME_FICHES_MOV = 600;
var TIME_CARD_DEALING = 250;
var TIME_CARD_REMOVE = 1000;
var TIME_SHOW_FINAL_CARDS = 4000;
var TIME_END_HAND; 
var BET_TIME = 10000;
var AD_SHOW_COUNTER;
var NUM_DECKS = 4;

var BET_TIE = 0;
var BET_BANKER = 1;
var BET_PLAYER = 2;

var WIN_TIE = 0;
var WIN_DEALER = 1;
var WIN_PLAYER = 2;

var POS_BET = new Array();
var MULTIPLIERS = new Array();
var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;
var SHOW_CREDITS;
