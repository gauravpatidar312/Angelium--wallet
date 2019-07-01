import {Component, OnDestroy} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {Camera, SecurityCamerasData} from '../../../@core/data/security-cameras';
import {takeWhile, map} from 'rxjs/operators';
import {SessionStorageService} from '../../../services/session-storage.service';
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

  constructor(private securityCamerasService: SecurityCamerasData,
              private sessionStorage: SessionStorageService,
              public translate: TranslateService,) {
    const userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18mode = userSettingInfo.r18mode;

    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        let securityCameraLang = this.translate.instant('pages.dashboard.securityCamera');
        let cloneCameras = _.cloneDeep(cameras);
        cloneCameras.map((cam) => {
          cam.display = (this.r18mode || ['XLOVE', 'XCASINO', 'XWISH'].indexOf(cam.title) < 0);
          if (cam.title === 'XLOVE')
            cam.title = securityCameraLang.xLOVE;
          else if (cam.title === 'XCASINO')
            cam.title = securityCameraLang.xCASINO;
          else if (cam.title === 'XWISH')
            cam.title = securityCameraLang.xWISH;
          else if (cam.title === 'XTRAVEL')
            cam.title = securityCameraLang.xTRAVEL;
          else if (cam.title === 'XMALL')
            cam.title = securityCameraLang.xMALL;
          else if (cam.title === 'XSCHOOL')
            cam.title = securityCameraLang.xSCHOOL;
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
}
