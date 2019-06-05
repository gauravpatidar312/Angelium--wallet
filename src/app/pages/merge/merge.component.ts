import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.scss']
})
export class MergeComponent implements OnInit {
  model: any = {};
  anlForm: FormGroup;
  submitted: boolean = false;
  formSubmitting: boolean = false;

  xtravelForm: FormGroup;
  xtravelsubmitted: boolean = false;
  xtravelformSubmitting: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.anlForm = this.formBuilder.group({
      anlusername: ['', [Validators.required]],
      anlpassword: ['', Validators.required]
    });

    this.xtravelForm = this.formBuilder.group({
      xtravelusername: ['', [Validators.required]],
      xtravelpassword: ['', Validators.required]
    });
  }

  get f() {
    return this.anlForm.controls;
  }

  get fxtravel() {
    return this.xtravelForm.controls;
  }

  onANLSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.anlForm.invalid) {
      return;
    }
  }

  onXtravelSubmit() {
    this.xtravelsubmitted = true;
    // stop here if form is invalid
    if (this.xtravelForm.invalid) {
      return;
    }
  }
}
