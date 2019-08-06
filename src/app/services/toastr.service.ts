import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  config: any = {};

  constructor(private toastrService: NbToastrService) {
    this.config.position = 'top-right';
    this.config.duration = 6000;
  }

  danger(message, title, position?: any) {
    this.config.status = NbToastStatus.DANGER;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }

  success(message, title, position?: any) {
    this.config.status = NbToastStatus.SUCCESS;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }

  warning(message, title, position?: any) {
    this.config.status = NbToastStatus.WARNING;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }

  info(message, title, position?: any) {
    this.config.status = NbToastStatus.INFO;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }

  primary(message, title, position?: any) {
    this.config.status = NbToastStatus.PRIMARY;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }

  default(message, title, position?: any) {
    this.config.status = NbToastStatus.DEFAULT;
    this.config.position = (position || this.config.position);
    this.toastrService.show(message, title, this.config);
  }
}
