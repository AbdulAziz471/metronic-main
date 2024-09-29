import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from "../../../_metronic/partials/content/widgets/widgets.module";
import { SendEmailComponent } from './SendEmail.component';
@NgModule({
  declarations: [SendEmailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
        {
            path: '',
            component: SendEmailComponent,
        } 
    ]),
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    WidgetsModule
]
})
export class SendEmailModule { }
