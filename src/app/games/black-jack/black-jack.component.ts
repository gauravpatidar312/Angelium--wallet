import {Component, ViewChild, TemplateRef, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NbDialogService} from '@nebular/theme';
import {Router} from '@angular/router';
import {ToastrService} from '../../services/toastr.service';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataService} from '../../services/share-data.service';

declare let jQuery: any, CMain: any, parent: any, getParamValue: any;
declare let TEXT_SHARE_IMAGE: any, TEXT_SHARE_TITLE: any, TEXT_SHARE_MSG1: any, TEXT_SHARE_MSG2: any, TEXT_SHARE_SHARE1: any;
declare let isIOS: any, sizeHandler: any;
import * as _ from 'lodash';

@Component({
  selector: 'ngx-black-jack',
  templateUrl: './black-jack.component.html',
  styleUrls: ['./black-jack.component.scss']
})

export class BlackJackComponent implements OnInit {
  displayGame: boolean = false;
  availableWallets: any[] = [];
  fetchingWallets: boolean = false;
  userMoney: number;
  @ViewChild('selectWalletDialog') selectWalletDialog: TemplateRef<any>;

  gameStyles: string[] = [
    'assets/black-jack/css/reset.css',
    'assets/black-jack/css/main.css',
    'assets/black-jack/css/orientation_utils.css',
    'assets/black-jack/css/ios_fullscreen.css'
  ];
  gameScripts: string[] = [
    'assets/black-jack/js/jquery-3.2.1.min.js',
    'assets/black-jack/js/createjs-2015.11.26.min.js',
    'assets/black-jack/js/platform.js',
    'assets/black-jack/js/ios_fullscreen.js',
    'assets/black-jack/js/howler.min.js',
    'assets/black-jack/js/screenfull.js',
    'assets/black-jack/js/ctl_utils.js',
    'assets/black-jack/js/sprite_lib.js',
    'assets/black-jack/js/settings.js',
    'assets/black-jack/js/CLang.js',
    'assets/black-jack/js/CPreloader.js',
    'assets/black-jack/js/CMain.js',
    'assets/black-jack/js/CTextButton.js',
    'assets/black-jack/js/CGfxButton.js',
    'assets/black-jack/js/CToggle.js',
    'assets/black-jack/js/CMenu.js',
    'assets/black-jack/js/CGame.js',
    'assets/black-jack/js/CInterface.js',
    'assets/black-jack/js/CTweenController.js',
    'assets/black-jack/js/CSeat.js',
    'assets/black-jack/js/CFichesController.js',
    'assets/black-jack/js/CVector2.js',
    'assets/black-jack/js/CGameSettings.js',
    'assets/black-jack/js/CEasing.js',
    'assets/black-jack/js/CHandController.js',
    'assets/black-jack/js/CCard.js',
    'assets/black-jack/js/CInsurancePanel.js',
    'assets/black-jack/js/CGameOver.js',
    'assets/black-jack/js/CMsgBox.js',
    'assets/black-jack/js/CCreditsPanel.js'
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
      this.fetchingWallets = false;
      if (res.cryptos) {
        this.availableWallets = _.filter(res.cryptos, (wallet) => {
          return wallet.dollar_amount > 0;
        });
      }
    }, (err) => {
      this.fetchingWallets = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.blackJack'));
    });
  }

  loadGame() {
    setTimeout(() => {
      const oMain = new CMain({
        win_occurrence: 40,          // WIN OCCURRENCE PERCENTAGE. VALUES BETWEEN 0-100
        min_bet: 1,                  // MIN BET PLAYABLE BY USER. DEFAULT IS 0.1$
        max_bet: Math.round(this.userMoney * 0.30),                // MAX BET PLAYABLE BY USER.
        bet_time: 10000,             // WAITING TIME FOR PLAYER BETTING
        money: this.userMoney,                 // STARING CREDIT FOR THE USER
        blackjack_payout: 1.5,       // PAYOUT WHEN USER WINS WITH BLACKJACK (DEFAULT IS 3 TO 2). BLACKJACK OCCURS WHEN USER GET 21 WITH FIRST 2 CARDS
        game_cash: 500,              // GAME CASH AVAILABLE WHEN GAME STARTS
        show_credits: false,          // ENABLE/DISABLE CREDITS BUTTON IN THE MAIN SCREEN
        fullscreen: true,            // SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
        check_orientation: true,     // SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
      });

      jQuery(oMain).on('recharge', function (evt) {
        alert('add your recharge script in index.html');
      });

      jQuery(oMain).on('bet_placed', function (evt, iTotBet) {
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('start_session', function (evt) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeStartSession();
        }
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('end_session', function (evt) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeEndSession();
        }
        // ...ADD YOUR CODE HERE EVENTUALLY
      });

      jQuery(oMain).on('save_score', function (evt, iScore) {
        if (getParamValue('ctl-arcade') === 'true') {
          parent.__ctlArcadeSaveScore({score: iScore});
        }
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
      document.getElementById('black-jack-game').appendChild(script);
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
      document.getElementById('black-jack-game').appendChild(csslink);
    };
    _.each(this.gameStyles, (style) => {
      load(style);
    });
  }
}
