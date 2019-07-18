import {Component, AfterViewInit, Output, EventEmitter, OnDestroy, ViewChild} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService, NbStepperComponent} from '@nebular/theme';
import {takeWhile} from 'rxjs/internal/operators';
import {TranslateService} from '@ngx-translate/core';
import {SessionStorageService} from '../../services/session-storage.service';
import {ToastrService} from '../../services/toastr.service';
import {HttpService} from '../../services/http.service';
import {DatePipe} from '@angular/common'
import {ShareDataService} from '../../services/share-data.service';

declare let jQuery: any;

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

  idFrontLabel: any = this.translate.instant('pages.kyc.idProofFront');
  idFrontChangedEvent: any = '';
  idBackLabel: any = this.translate.instant('pages.kyc.idProofBack');
  idBackChangedEvent: any = '';
  selfieLabel: any = this.translate.instant('pages.kyc.selfie');
  selfieChangedEvent: any = '';

  selectedImage = '';

  userData: any;

  isKYCUploaded = false;
  isSubmitting = false;

  firstStep: string;
  secondStep: string;
  thirdStep: string;

  @ViewChild('stepper') stepper: NbStepperComponent;

  constructor(public datepipe: DatePipe,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private sessionStorage: SessionStorageService,
              private httpService: HttpService,
              private sessionService: SessionStorageService,
              private toastrService: ToastrService,
              private shareDataService: ShareDataService,
              public translate: TranslateService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.firstStep = this.translate.instant('pages.kyc.input');
    this.secondStep = this.translate.instant('pages.kyc.audit');
    this.thirdStep = this.translate.instant('pages.kyc.approved');

    this.userData = this.sessionStorage.getFromSession('userInfo');
    this.userData.kyc_info = this.userData.kyc_info || {};
  }

  ngAfterViewInit() {
    if (this.userData.kyc_info && this.userData.kyc_info.status_description) {
      if (this.userData.kyc_info.status_description !== 'failed') {
        this.isKYCUploaded = true;
        this.updateStateKYC();
      }
      this.setStepper(this.userData.kyc_info.status_description);
    }
    this.stepper.selectedIndex = 2;

    if (!this.userData.kyc_info.datefield) {
      this.userData.kyc_info.datefield = '';
    }

    jQuery('[data-fancybox]').fancybox({
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

  setStepper(status) {
    if (status === 'pending') {
      this.firstStep = this.translate.instant('pages.kyc.submitted');
      this.stepper.steps.first.completed = true;
    }
    else if (status === 'confirmed') {
      this.stepper.steps.map((step) => {
        step.completed = true;
      });
    }
    else if (status === 'failed') {
      this.firstStep = this.translate.instant('pages.kyc.failed');
    }
  }

  updateStateKYC() {
    if (this.userData.kyc_info && this.userData.kyc_info.status_description !== 'confirmed') {
        this.idFrontLabel = this.translate.instant('pages.kyc.idProofFront');
        this.idBackLabel = this.translate.instant('pages.kyc.idProofBack');
      this.selfieLabel = this.translate.instant('pages.kyc.selfie');
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
      const fileSize = event.target.files[0].size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadFrontSideIDProofSize'), this.translate.instant('common.kyc'));
        return;
      }
      this.idFrontChangedEvent = event;
      this.idFrontLabel = event.target.files[0].name;
    }
    if (type === 'back') {
      const fileSize = event.target.files[0].size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadBackSideIDProofSize'), this.translate.instant('common.kyc'));
        return;
      }
      this.idBackChangedEvent = event;
      this.idBackLabel = event.target.files[0].name;
    }
    if (type === 'selfie') {
      const fileSize = event.target.files[0].size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadSelfieSize'), this.translate.instant('common.kyc'));
        return;
      }
      this.selfieChangedEvent = event;
      this.selfieLabel = event.target.files[0].name;
    }
  }

  uploadKYC() {
    if (this.isKYCUploaded)
      return;

    const formData: FormData = new FormData();
    if (this.userData.kyc_info && this.userData.kyc_info.datefield) {
      const formatedData = this.datepipe.transform(this.userData.kyc_info.datefield, 'yyyy-MM-dd');
      formData.append('datefield', formatedData);
    } else {
      this.toastrService.danger(
        this.translate.instant('pages.kyc.toastr.pleaseSelectDOB'),
        this.translate.instant('common.kyc'));
      return;
    }

    if (this.idFrontChangedEvent) {
      const file = this.idFrontChangedEvent.target.files[0];
      const fileSize = file.size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadFrontSideIDProofSize'), this.translate.instant('common.kyc'));
        return;
      }
      const newfile = new File([file], file.name, {type: file.type});
      formData.append('doc_photo', newfile, newfile.name);
    } else {
      this.toastrService.danger(
        this.translate.instant('pages.kyc.toastr.uploadFrontSideIDProof'),
        this.translate.instant('common.kyc'));
      return;
    }

    if (this.idBackChangedEvent) {
      const file = this.idBackChangedEvent.target.files[0];
      const fileSize = file.size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadBackSideIDProofSize'), this.translate.instant('common.kyc'));
        return;
      }
      const newfile = new File([file], file.name, {type: file.type});
      formData.append('doc_photo_back', newfile, newfile.name);
    } else {
      this.toastrService.danger(
        this.translate.instant('pages.kyc.toastr.uploadBackSideIDProof'),
        this.translate.instant('common.kyc'));
      return;
    }

    if (this.selfieChangedEvent) {
      const file = this.selfieChangedEvent.target.files[0];
      const fileSize = file.size;
      /*1048576 byte = 1 MB*/
      if (fileSize > (1048576 * 2)) {
        this.toastrService.danger(this.translate.instant('pages.kyc.toastr.uploadSelfieSize'), this.translate.instant('common.kyc'));
        return;
      }
      const newfile = new File([file], file.name, {type: file.type});
      formData.append('selfie', newfile, newfile.name);
    } else {
      this.toastrService.danger(
        this.translate.instant('pages.kyc.toastr.uploadSelfie'),
        this.translate.instant('common.kyc'));
      return;
    }

    this.isSubmitting = true;
    this.httpService.post(formData, 'kyc/').subscribe((res?: any) => {
      this.isSubmitting = false;
      if (res.status_description) {
        this.userData.kyc_info = res;
        this.setStepper(this.userData.kyc_info.status_description);
        this.updateStateKYC();

        this.isKYCUploaded = true;
        this.sessionService.updateUserState(this.userData);
        this.toastrService.success(this.translate.instant('pages.kyc.toastr.userKycUploadSuccessfully'), this.translate.instant('common.kyc'));
      } else {
        this.toastrService.danger(this.shareDataService.getErrorMessage(res), this.translate.instant('common.kyc'));
      }
    }, err => {
      this.isSubmitting = false;
      this.toastrService.danger(this.shareDataService.getErrorMessage(err), this.translate.instant('common.kyc'));
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
