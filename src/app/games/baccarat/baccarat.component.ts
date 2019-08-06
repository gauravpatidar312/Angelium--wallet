import {Component, ViewChild, TemplateRef, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NbDialogService} from '@nebular/theme';
import {Router} from '@angular/router';
import {ToastrService} from '../../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataService} from '../../services/share-data.service';

declare let jQuery: any, CMain: any, parent: any, getParamValue: any;
declare let TEXT_SHARE_IMAGE: any, TEXT_SHARE_TITLE: any, TEXT_SHARE_MSG1: any, TEXT_SHARE_MSG2: any,
  TEXT_SHARE_SHARE1: any;
declare let isIOS: any, sizeHandler: any;
import * as _ from 'lodash';

@Component({
  selector: 'ngx-baccarat',
  templateUrl: './baccarat.component.html',
  styleUrls: ['./baccarat.component.scss']
})

export class BaccaratComponent implements OnInit {
  displayGame: boolean = false;
  availableWallets: any[] = [];
  fetchingWallets: boolean = false;
  userMoney: number;
  @ViewChild('selectWalletDialog') selectWalletDialog: TemplateRef<any>;

  gameStyles: string[] = [
    'assets/baccarat/css/reset.css',
    'assets/baccarat/css/main.css',
    'assets/baccarat/css/orientation_utils.css',
    'assets/baccarat/css/ios_fullscreen.css'
  ];
  gameScripts: string[] = [
    'assets/baccarat/js/jquery-3.1.1.min.js',
    'assets/baccarat/js/createjs-2015.11.26.min.js',
    'assets/baccarat/js/howler.min.js',
    'assets/baccarat/js/screenfull.js',
    'assets/baccarat/js/platform.js',
    'assets/baccarat/js/ios_fullscreen.js',
    'assets/baccarat/js/ctl_utils.js',
    'assets/baccarat/js/sprite_lib.js',
    'assets/baccarat/js/settings.js',
    'assets/baccarat/js/CLang.js',
    'assets/baccarat/js/CPreloader.js',
    'assets/baccarat/js/CMain.js',
    'assets/baccarat/js/CTextButton.js',
    'assets/baccarat/js/CGfxButton.js',
    'assets/baccarat/js/CGuiButton.js',
    'assets/baccarat/js/CToggle.js',
    'assets/baccarat/js/CMenu.js',
    'assets/baccarat/js/CGame.js',
    'assets/baccarat/js/CInterface.js',
    'assets/baccarat/js/CTweenController.js',
    'assets/baccarat/js/CSeat.js',
    'assets/baccarat/js/CFichesController.js',
    'assets/baccarat/js/CVector2.js',
    'assets/baccarat/js/CGameSettings.js',
    'assets/baccarat/js/CEasing.js',
    'assets/baccarat/js/CCard.js',
    'assets/baccarat/js/CGameOver.js',
    'assets/baccarat/js/CWinDisplay.js',
    'assets/baccarat/js/CHistory.js',
    'assets/baccarat/js/CHistoryRow.js',
    'assets/baccarat/js/CMsgBox.js',
    'assets/baccarat/js/CCreditsPanel.js',
  ];

  constructor(private httpService: HttpService,
              private dialogService: NbDialogService,
              private router: Router,
              private toastrService: ToastrService,
              public translate: TranslateService,
              private shareDataService: ShareDataService) {
  }

  ngOnInit() {
    this.getUserWallet();
    this.loadStyles();
    this.loadScripts();
  }

  playNow(wallet: any, ref: any) {
    ref.close(true);
    this.userMoney = ShareDataService.toFixedDown(wallet.dollar_amount, 2);
    this.displayGame = true;
    this.loadGame();
  }

  getUserWallet() {
    this.fetchingWallets = true;
    this.dialogService.open(this.selectWalletDialog, {
      closeOnBackdropClick: false,
      autoFocus: false,
    }).onClose.subscribe(data => {
      if (!data)
        this.router.navigate(['pages/dashboard']);
    });

    this.httpService.get('asset/').subscribe((res?: any) => {
      if (res.cryptos) {
        this.availableWallets = _.filter(res.cryptos, (wallet) => {
          return wallet.dollar_amount > 10 && ['ANL', 'ANLP', 'HEAVEN'].indexOf(wallet.name) === -1;
        });
      }
      this.fetchingWallets = false;
    }, (err) => {
      this.fetchingWallets = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.baccarat'));
    });
  }

  loadGame() {
    setTimeout(() => {
      const oMain = new CMain({
        win_occurrence: 40,          // WIN OCCURRENCE PERCENTAGE. VALUES BETWEEN 0-100
        bet_occurrence: [             // IF PLAYER MUST WIN CURRENT HAND AND THERE ARE MULTIPLE BETS:
          // WARNING: DON'T SET ANY OF THESE VALUES AT 100.
          20,          // OCCURRENCE FOR TIE BET
          30,          // OCCURRENCE FOR BANKER BET
          50           // OCCURRENCE FOR PLAYER BET
        ],
        min_bet: 1,                // MIN BET PLAYABLE BY USER. DEFAULT IS 0.1$
        max_bet: Math.round(this.userMoney * 0.30),               // MAX BET PLAYABLE BY USER.
        multiplier: [                 // MULTIPLIER FOR EACH BET
          8,               // MULTIPLIER FOR TIE: PAYS 8 TO 1
          1.95,            // MULTIPLIER FOR BANKER: PAYS 1.95 TO 1
          2                // MULTIPLIER FOR PLAYER: PAYS 2 TO 1
        ],
        money: this.userMoney,        // STARING CREDIT FOR THE USER
        game_cash: 100,              // GAME CASH AVAILABLE WHEN GAME STARTS
        time_show_hand: 3000,        // TIME (IN MILLISECONDS) SHOWING LAST HAND
        fullscreen: true,             // SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
        check_orientation: true,      // SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
      });

      jQuery(oMain).on('recharge', function (evt) {
        alert('recharge');
      });

      jQuery(oMain).on('start_session', function (evt) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeStartSession();
        } // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('end_session', function (evt) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeEndSession();
        } // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('save_score', function (evt, iMoney) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeSaveScore({score: iMoney});
        }
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('show_interlevel_ad', function (evt) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeShowInterlevelAD();
        }
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('clear_bet', function (evt, iTotBet) {
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('bet_placed', function (evt, iTotBet) {
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('share_event', function (evt, iScore) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeShareEvent({
            img: TEXT_SHARE_IMAGE,
            title: TEXT_SHARE_TITLE,
            msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
            msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1
          });
        }
      });

      if (isIOS()) {
        setTimeout(function () {
          sizeHandler();
        }, 200);
      } else {
        sizeHandler();
      }
    }, 1500);
  }

  loadScripts() {
    const load = function (src) {
      const script: any = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      document.getElementById('baccarat-game').appendChild(script);
    };
    _.each(this.gameScripts, (src) => {
      load(src);
    });
  }

  loadStyles() {
    const load = function (style) {
      const csslink = document.createElement('link');
      csslink.setAttribute('rel', 'stylesheet');
      csslink.setAttribute('type', 'text/css');
      csslink.setAttribute('href', style);
      document.getElementById('baccarat-game').appendChild(csslink);
    };
    _.each(this.gameStyles, (style) => {
      load(style);
    });
  }
}
