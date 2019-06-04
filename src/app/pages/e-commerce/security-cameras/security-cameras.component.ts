import { Component, OnDestroy } from '@angular/core';
import { Camera, SecurityCamerasData } from '../../../@core/data/security-cameras';
import { takeWhile, map } from 'rxjs/operators';
import { SessionStorageService } from "../../../services/session-storage.service";

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
})
export class SecurityCamerasComponent implements OnDestroy {

  private alive = true;

  cameras: Camera[];
  selectedCamera: Camera;
  camerasData:any = [];
  isSingleView = false;
  r18mode: boolean;
  constructor(
    private securityCamerasService: SecurityCamerasData, 
    private sessionStorage: SessionStorageService) {
    let userSettingInfo = this.sessionStorage.getFromSession('userInfo');
    this.r18mode = userSettingInfo.r18mode;

    this.securityCamerasService.getCamerasData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((cameras: Camera[]) => {
        console.log(cameras)
        // this.cameras = cameras;
        let data = ['XTRAVEL', 'XMALL', 'XSCHOOL'];
        if (this.r18mode) {
          this.camerasData = cameras;
        }else{
          data.filter(x=>{
            let cam = cameras.find(y =>{
              return x == y.title;
            });
            this.camerasData.push(cam);
          });
        }
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
