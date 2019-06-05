import {Component, OnDestroy} from '@angular/core';
import {Camera, SecurityCamerasData} from '../../../@core/data/security-cameras';
import {takeWhile, map} from 'rxjs/operators';
import {SessionStorageService} from '../../../services/session-storage.service';

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
              private sessionStorage: SessionStorageService) {
    const userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18mode = userSettingInfo.r18mode;

    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        cameras.map((cam) => {
          cam.display = (this.r18mode || ['XLOVE', 'XCASINO', 'XWISH'].indexOf(cam.title) >= 0);
        });
        this.cameras = cameras;
        this.selectedCamera = cameras[0];
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
