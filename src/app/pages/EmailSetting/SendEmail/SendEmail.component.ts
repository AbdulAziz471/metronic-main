import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';


import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2'; 

import { Config } from 'datatables.net';

import { EmailSettingService } from 'src/app/Service/EmailSettings.service'; 

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-send-email',
  templateUrl: './sendEmail.component.html',
  styleUrls: ['./sendEmail.component.scss']
})
export class SendEmailComponent implements OnInit {
 
  data = '';
  emailForm: FormGroup;
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private fb: FormBuilder, 
    private emailservies: EmailSettingService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

 
  sendEmail() {
    if (this.emailForm.valid) {
      this.emailservies.SendEmail(this.emailForm.value).subscribe({
          next: response => console.log('Email sent successfully', response),
          error: error => console.error('Failed to send email', error)
        });
    }
  }

 
  ngOnInit() {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      toAddress: ['', [Validators.required, Validators.email]],
      ccAddress: [''],
      attachments: this.fb.array([]), // You can handle attachment logic as needed
      body: ['', Validators.required],
      fromAddress: ['', [Validators.required, Validators.email]]
    });
  }



}