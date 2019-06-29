import {Component, AfterViewInit, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbThemeService,
  NbStepperComponent,
  NbDialogService
} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {SessionStorageService} from '../../services/session-storage.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {DatePipe} from '@angular/common'
import {NbStepComponent} from '@nebular/theme/components/stepper/step.component';

declare let $: any;

@Component({
  selector: 'ngx-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KYCComponent implements AfterViewInit, OnDestroy {

  private alive = true;
  @Output() periodChange = new EventEmitter<string>();
  typeOfDay: string;
  typeOfMonth: string;
  typeOfYear: string;
  typeOfCountry: string;
  typeOfIdFrom: string;
  typeOfIdBack: string;
  typeOfProofOfAddress: string;
  types: any = {
    'day': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'month': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'year': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'country': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'idFrom': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'idBack': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    'proofOfAddress': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  };
  breakpoint: NbMediaBreakpoint = {name: '', width: 0};
  breakpoints: any;
  currentTheme: string;

  idFrontLabel: any = 'ID Proof (front side)';
  idFrontChangedEvent: any = '';
  idBackLabel: any = 'ID Proof (back side)';
  idBackChangedEvent: any = '';
  selfieLabel: any = 'Selfie';
  selfieChangedEvent: any = '';

  selectedImage = '';

  userData: any;

  kycFormDisable = false;

  @ViewChild('stepper') stepper: NbStepperComponent;

  constructor(public datepipe: DatePipe,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private sessionStorage: SessionStorageService,
              private httpService: HttpService,
              private sessionService: SessionStorageService,
              private dialogService: NbDialogService,
              private toastrService: ToastrService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.userData = this.sessionStorage.getFromSession('userInfo');
    this.userData.kyc_info = this.userData.kyc_info || {};
    if (this.userData.kyc_info.status_description === 'pending') {
      this.kycFormDisable = true;
      this.updateStateKYC();
      // this.kycStep = 'pending';
    }
    if (!this.userData.kyc_info.datefield) {
      this.userData.kyc_info.datefield = '';
    }
  }

  ngAfterViewInit() {
    if (this.userData.kyc_info && this.userData.kyc_info.status_description === 'pending') {
      this.statusPending();
    }

    $('[data-fancybox]').fancybox({
      thumbs: false,
      hash: false,
      loop: true,
      keyboard: true,
      toolbar: false,
      animationEffect: true,
      arrows: true,
      clickContent: true
    });
  }

  statusPending() {
    setTimeout(() => {
      this.stepper.selectedIndex = 1;
    }, 7);
  }

  updateStateKYC() {
    if (this.userData.kyc_info && this.userData.kyc_info.status_description === 'pending') {
      this.idFrontLabel = 'ID Proof (front side)';
      // this.idFrontLabel = this.userData.kyc_info.doc_photo;
      // this.idBackLabel = this.userData.kyc_info.doc_photo_back;
      // this.selfieLabel = this.userData.kyc_info.selfie;
    }
  }

  changePeriod(period: string, typeValue): void {
    if (typeValue === 'day')
      this.typeOfDay = period;
    else if (typeValue === 'month')
      this.typeOfMonth = period;
    else if (typeValue === 'year')
      this.typeOfYear = period;
    else if (typeValue === 'country')
      this.typeOfCountry = period;
    else if (typeValue === 'idFrom')
      this.typeOfIdFrom = period;
    else if (typeValue === 'idBack')
      this.typeOfIdBack = period;
    else if (typeValue === 'proofOfAddress')
      this.typeOfProofOfAddress = period;
    this.periodChange.emit(period);
  }

  fileChangeEvent(event: any, type): void {
    if (type === 'front') {
      this.idFrontChangedEvent = event;
      this.idFrontLabel = event.target.files[0].name;
    }
    if (type === 'back') {
      this.idBackChangedEvent = event;
      this.idBackLabel = event.target.files[0].name;
    }
    if (type === 'selfie') {
      this.selfieChangedEvent = event;
      this.selfieLabel = event.target.files[0].name;
    }
  }

  uploadKYC() {
    if (!this.kycFormDisable) {
      const formData: FormData = new FormData();
      if (this.userData.kyc_info && this.userData.kyc_info.datefield) {
        const formatedData = this.datepipe.transform(this.userData.kyc_info.datefield, 'yyyy-MM-dd');
        formData.append('datefield', formatedData);
      } else {
        this.toastrService.danger('Please select date of birth.', 'KYC');
        return;
      }
      if (this.idFrontChangedEvent !== '') {
        const file = this.idFrontChangedEvent.target.files[0];
        const newfile = new File([file], file.name, {type: file.type});
        formData.append('doc_photo', newfile, newfile.name);
      } else {
        this.toastrService.danger('Please upload ID Proof (front side).', 'KYC');
        return;
      }
      if (this.idBackChangedEvent !== '') {
        const file = this.idBackChangedEvent.target.files[0];
        const newfile = new File([file], file.name, {type: file.type});
        formData.append('doc_photo_back', newfile, newfile.name);
      } else {
        this.toastrService.danger('Please upload ID Proof (back side).', 'KYC');
        return;
      }
      if (this.selfieChangedEvent !== '') {
        const file = this.selfieChangedEvent.target.files[0];
        const newfile = new File([file], file.name, {type: file.type});
        formData.append('selfie', newfile, newfile.name);
      } else {
        this.toastrService.danger('Please upload selfie.', 'KYC');
        return;
      }

      this.httpService.post(formData, 'kyc/').subscribe((res?: any) => {
        if (res.status_description === 'pending') {
          this.userData.kyc_info = {};
          this.userData.kyc_info = res;
          if (this.userData.kyc_info.status_description === 'pending') {
            this.statusPending();
            this.updateStateKYC();
          }

          this.sessionService.updateUserState(this.userData);
          this.kycFormDisable = true;
          this.toastrService.success('User kyc upload successfully', 'KYC');
        }
      });
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
