import { Component, OnInit } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { ToastrService } from "../services/toastr.service";
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../services/http.service';
import { ShareDataService } from '../services/share-data.service';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  private alive = true;

  selectedTicket: string = 'select';
  issueTypes: any = ['unable to register', 'not getting correct data', 'unable to login'];
  ticketTitle:any = '';
  ticketDescription: any = '';
  ticketSubmitting:any = false;
  currentTheme: string;
  breakpoints: any;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  
  constructor(private toastrService: ToastrService,
              private httpService: HttpService,
              private shareDataService: ShareDataService,
              private themeService: NbThemeService,
              private translate:TranslateService,
              private breakpointService: NbMediaBreakpointsService){
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      })
    
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
  }

  changeIssue(issue){
    this.selectedTicket = issue;
  }

  back(){
    history.back();
  }

  createTicketDialog() {
    if (!(this.ticketTitle && this.ticketDescription && this.selectedTicket !== 'select')) {
      this.ticketSubmitting = false;
      this.toastrService.danger(
        this.translate.instant('pages.setting.toastr.enterValueInAllFields'),
        this.translate.instant('pages.setting.createTicket')
      );
      return;
    }
    this.ticketSubmitting = true;

    let ticketData = { 'title': this.ticketTitle, 'description': this.ticketDescription, 'issue_type': this.selectedTicket };
    
    this.httpService.post(ticketData, 'ticket/').subscribe((res?: any) => {
      this.ticketSubmitting = false;
      if (res.status) {
        this.toastrService.success(
          this.translate.instant('pages.setting.toastr.ticketSuccessfullyCreated'),
          this.translate.instant('pages.setting.createTicket')
        );
        this.back();
      }
    },
      err => {
        this.ticketSubmitting = false;
        this.toastrService.danger(this.shareDataService.getErrorMessage(err),
          this.translate.instant('pages.setting.createTicket')
        );
      });
  }


}
