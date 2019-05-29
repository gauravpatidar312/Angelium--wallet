import { Injectable } from "@angular/core";
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: "root"
})
export class ToastrService {
  constructor(private toastrService: NbToastrService) {

  }

  toastrDanger(position, status, message) {
    this.toastrService.show('Danger', message,
      {"position" : position , "status": status }
    );
  }

  toastrSuccess(position, status, message) {
    this.toastrService.show('Success', message,
      {"position" : position , "status": status }
    );
  }
}
