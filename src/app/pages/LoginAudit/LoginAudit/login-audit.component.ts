import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'; 
import { SweetAlertOptions } from 'sweetalert2';
import { Observable } from 'rxjs';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { UserService } from 'src/app/Service/UserAPi.service';
import { UserQueryParams } from './login-audit.modal';

import moment from 'moment';
import { forkJoin } from 'rxjs';
import { Config } from 'datatables.net';
import { LoginAuditService } from 'src/app/Service/LoginAudit.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-user-listing',
  templateUrl: './login-audit.component.html',
  styleUrls: ['./login-audit.component.scss']
})
export class LoginAuditComponent implements OnInit, AfterViewInit {

  private modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;  
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};

  public users: any[] = [];
  public pagesList: any[] = []; 
  public actionList: any[] = []; 
  selectedAction = {
    userName: '', // default or user-inputted value
    skip: 0,      // default starting value
    pageSize: 10, // default number of items per page
    searchQuery: '',
    orderBy: '',
    fields: ''
  };
  reloadEvent: EventEmitter<boolean> = new EventEmitter();


  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private roleServices: RolesApiService,
    private LogAuditService: LoginAuditService,
    private editroleservice: EditRoleService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this,this.loadLogAudit();
      
  }
  loadLogAudit(): void {
    const { userName, skip, pageSize, searchQuery, orderBy, fields } = this.selectedAction;
  
    this.LogAuditService.getAllLoginAuditDetails(userName, skip, pageSize, searchQuery, orderBy, fields).subscribe({
      next: (response) => {
        console.log("Received users:", response);
        this.users = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching users', error)
    });
  }
  



}