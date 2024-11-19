import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleSComponent } from './user-Roles/user-roles.component';
import { RouterModule } from '@angular/router';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from "../../_metronic/partials/content/widgets/widgets.module";
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatSelectModule } from '@angular/material/select';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  declarations: [UserRoleSComponent, ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    MaterialModule,
    RouterModule.forChild([
        {
            path: '',
            component: UserRoleSComponent,
        },
       
    ]),
    CrudModule,
    SharedModule,
    MatSelectModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    WidgetsModule
]
})
export class UserRoleModule { }