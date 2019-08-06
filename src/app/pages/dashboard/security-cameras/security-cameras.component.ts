import {Component, OnDestroy, TemplateRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Camera, SecurityCamerasData} from '../../../@core/data/security-cameras';
import {takeWhile, map} from 'rxjs/operators';
import {SessionStorageService} from '../../../services/session-storage.service';
import {ToastrService} from '../../../services/toastr.service';
import {NbDialogService} from '@nebular/theme';
import {Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
})
export class SecurityCamerasComponent implements OnDestroy {

  private alive = true;

  cameras: Camera[];
  selectedCamera: Camera;
  isSingleView = false;
  r18mode: boolean;
  cloneCameras = [];
  userSettingInfo: any;

  constructor(private securityCamerasService: SecurityCamerasData,
              private sessionStorage: SessionStorageService,
              public translate: TranslateService,
              private dialogService: NbDialogService,
              private toastrService: ToastrService,
              private router: Router) {
    this.userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18mode = this.userSettingInfo.r18mode;
    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        this.cloneCameras = _.cloneDeep(cameras);
        const cloneCameras = _.cloneDeep(cameras);
        cloneCameras.map((cam) => {
          cam.display = (this.r18mode || ['XLOVE', 'XGAMES', 'XWISH'].indexOf(cam.title) < 0);
          cam.title = this.translate.instant('pages.dashboard.securityCamera.' + cam.title.toLowerCase());
        });
        this.cameras = cloneCameras;
        this.selectedCamera = cloneCameras[0];
      });
  }

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      autoFocus: false,
    });
  }

  onGameTemplate(value) {
    if (value === 'black-jack')
      this.router.navigate(['/games/black-jack']);
    else if (value === 'lottery')
      this.router.navigate(['/games/lottery']);
    else if (value === 'baccarat')
      this.router.navigate(['/games/baccarat']);
  }

  onImageClick(title: any, template?: any) {
    if (this.userSettingInfo.user_type === 'owner' && title === 'XLOVE')
      window.open('http://xlove.angelium.net', '_blank');
    else if (this.userSettingInfo.user_type === 'owner' && title === 'XGAMES')
      this.openDialog(template);
    else
      this.toastrService.info(this.translate.instant('pages.transfer.toastr.featureComingSoonStayTuned'),
        this.translate.instant('pages.dashboard.securityCamera.' + title.toLowerCase()));
  }
}
