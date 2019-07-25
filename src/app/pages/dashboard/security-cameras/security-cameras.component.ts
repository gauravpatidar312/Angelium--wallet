import {Component, OnDestroy} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {Camera, SecurityCamerasData} from '../../../@core/data/security-cameras';
import {takeWhile, map} from 'rxjs/operators';
import {SessionStorageService} from '../../../services/session-storage.service';
import {IndexedDBStorageService} from '../../../services/indexeddb-storage.service';
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
  constructor(private securityCamerasService: SecurityCamerasData,
              private sessionStorage: SessionStorageService,
              public translate: TranslateService,
              private storageService: IndexedDBStorageService) {
    const userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18mode = userSettingInfo.r18mode;
    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        this.cloneCameras = _.cloneDeep(cameras);
        let cloneCameras = _.cloneDeep(cameras);
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
}
