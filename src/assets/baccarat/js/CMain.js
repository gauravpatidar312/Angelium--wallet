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
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'card',loop:false,volume:1, ingamename: 'card'});
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'chip',loop:false,volume:1, ingamename: 'chip'});
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'fiche_collect',loop:false,volume:1, ingamename: 'fiche_collect'});
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'press_but',loop:false,volume:1, ingamename: 'press_but'});
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'win',loop:false,volume:1, ingamename: 'win'});
        aSoundsInfo.push({path: 'assets/baccarat/sounds/',filename:'lose',loop:false,volume:1, ingamename: 'lose'});

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

        s_oSpriteLibrary.addSprite("but_menu_bg","assets/baccarat/sprites/but_menu_bg.png");
        s_oSpriteLibrary.addSprite("but_game_bg","assets/baccarat/sprites/but_game_bg.png");
        s_oSpriteLibrary.addSprite("but_exit","assets/baccarat/sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","assets/baccarat/sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("audio_icon","assets/baccarat/sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("bg_game","assets/baccarat/sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("card_spritesheet","assets/baccarat/sprites/card_spritesheet.png");
        s_oSpriteLibrary.addSprite("msg_box","assets/baccarat/sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("display_bg","assets/baccarat/sprites/display_bg.png");
        s_oSpriteLibrary.addSprite("fiche_highlight","assets/baccarat/sprites/fiche_highlight.png");
        s_oSpriteLibrary.addSprite("bet_banker","assets/baccarat/sprites/bet_banker.png");
        s_oSpriteLibrary.addSprite("bet_tie","assets/baccarat/sprites/bet_tie.png");
        s_oSpriteLibrary.addSprite("bet_player","assets/baccarat/sprites/bet_player.png");
        s_oSpriteLibrary.addSprite("win_bg","assets/baccarat/sprites/win_bg.png");
        s_oSpriteLibrary.addSprite("history_cell","assets/baccarat/sprites/history_cell.png");
        s_oSpriteLibrary.addSprite("history_highlight","assets/baccarat/sprites/history_highlight.png");
        s_oSpriteLibrary.addSprite("history_bg","assets/baccarat/sprites/history_bg.png");
        s_oSpriteLibrary.addSprite("but_clear","assets/baccarat/sprites/but_clear.png");
        s_oSpriteLibrary.addSprite("but_deal","assets/baccarat/sprites/but_deal.png");
        s_oSpriteLibrary.addSprite("but_rebet","assets/baccarat/sprites/but_rebet.png");
        s_oSpriteLibrary.addSprite("gui_bg","assets/baccarat/sprites/gui_bg.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","assets/baccarat/sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("logo_credits","assets/baccarat/sprites/logo_credits.png");
        s_oSpriteLibrary.addSprite("but_credits","assets/baccarat/sprites/but_credits.png");

        for(var i=0;i<NUM_FICHES;i++){
            s_oSpriteLibrary.addSprite("fiche_"+i,"assets/baccarat/sprites/fiche_"+i+".png");
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
    ENABLE_CHECK_ORIENTATION = _oData.check_orientation;
    ENABLE_FULLSCREEN = _oData.fullscreen;
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
