function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;

    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);
        }


        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", this._update);
		if(navigator.userAgent.match(/Windows Phone/i)){
			DISABLE_SOUND_MOBILE = true;
		}

        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

        s_oGameSettings=new CGameSettings();
        _bUpdate = true;
    };

    this.preloaderReady = function(){
        this._loadImages();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
    };

    this.soundLoaded = function(){
        _iCurResource++;
	var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);

    };

    this._initSounds = function(){

        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'card',loop:false,volume:1, ingamename: 'card'});
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'chip',loop:false,volume:1, ingamename: 'chip'});
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'fiche_collect',loop:false,volume:1, ingamename: 'fiche_collect'});
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'press_but',loop:false,volume:1, ingamename: 'press_but'});
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'win',loop:false,volume:1, ingamename: 'win'});
        aSoundsInfo.push({path: 'assets/black-jack/sounds/',filename:'lose',loop:false,volume:1, ingamename: 'lose'});

        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop,
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded
                                                        });
        }

    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_menu_bg","assets/black-jack/sprites/but_menu_bg.png");
        s_oSpriteLibrary.addSprite("but_game_bg","assets/black-jack/sprites/but_game_bg.png");
        s_oSpriteLibrary.addSprite("but_game_small_bg","assets/black-jack/sprites/but_game_small_bg.png");
        s_oSpriteLibrary.addSprite("but_game_very_small_bg","assets/black-jack/sprites/but_game_very_small_bg.png");
        s_oSpriteLibrary.addSprite("but_exit","assets/black-jack/sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","assets/black-jack/sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("audio_icon","assets/black-jack/sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("bg_game_1","assets/black-jack/sprites/bg_game_1.jpg");
        s_oSpriteLibrary.addSprite("bg_game_2","assets/black-jack/sprites/bg_game_2.jpg");
        s_oSpriteLibrary.addSprite("bg_game_3","assets/black-jack/sprites/bg_game_3.jpg");
        s_oSpriteLibrary.addSprite("bg_game_4","assets/black-jack/sprites/bg_game_4.jpg");
        s_oSpriteLibrary.addSprite("seat","assets/black-jack/sprites/seat.png");
        s_oSpriteLibrary.addSprite("card_spritesheet","assets/black-jack/sprites/card_spritesheet.png");
        s_oSpriteLibrary.addSprite("arrow_hand","assets/black-jack/sprites/arrow_hand.png");
        s_oSpriteLibrary.addSprite("msg_box","assets/black-jack/sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("display_bg","assets/black-jack/sprites/display_bg.png");
        s_oSpriteLibrary.addSprite("bet_bg","assets/black-jack/sprites/bet_bg.png");
        s_oSpriteLibrary.addSprite("money_bg","assets/black-jack/sprites/money_bg.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","assets/black-jack/sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("logo_ctl","assets/black-jack/sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_credits","assets/black-jack/sprites/but_credits.png");

        for(var i=0;i<NUM_FICHES;i++){
            s_oSpriteLibrary.addSprite("fiche_"+i,"assets/black-jack/sprites/fiche_"+i+".png");
        }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };

    this._onAllImagesLoaded = function(){

    };

    this._onRemovePreloader = function(){
        _oPreloader.unload();

        this.gotoMenu();
    };

    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function(){
        _oGame = new CGame(_oData);

        _iState = STATE_GAME;
    };

    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }

    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }

    };

    this._update = function(event){
        if(!_bUpdate){
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }

        if(_iState === STATE_GAME){
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    SHOW_CREDITS = oData.show_credits;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oGameSettings;
var s_bFullscreen = false;
var s_aSounds;

