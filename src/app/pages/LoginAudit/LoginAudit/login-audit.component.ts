import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';

import { SweetAlertOptions } from 'sweetalert2';
import moment from 'moment';

import { Config } from 'datatables.net';
import { LoginAuditService } from 'src/app/Service/LoginAudit.service';
@Component({
  selector: 'app-user-listing',
  templateUrl: './login-audit.component.html',
  styleUrls: ['./login-audit.component.scss']
})
export class LoginAuditComponent implements OnInit, AfterViewInit {

  isCollapsed1 = false;
  isCollapsed2 = true;
  loginDetails: any;
  isLoading = false;


  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();


  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};


  constructor(
    private loginAuditService: LoginAuditService,private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.loadLoginDetails();
   

  
  }
  loadLoginDetails(): void {
    this.loginAuditService.getAllLoginAuditDetails('', 0, 10, '', '', '')
      .subscribe(
        data => {
          this.loginDetails = data;
          console.log(this.loginDetails);
        },
        error => {
          console.error('Error fetching login details', error);
        }
      );
  }
  
  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    var uniqueTextArray = Array.from(new Set(textArray));
  var text = uniqueTextArray.join('\n');

    return text;
  }

 
 
}