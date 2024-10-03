import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnlineUserComponent } from './onlineUsers.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [OnlineUserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OnlineUserComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
  ],
})
export class OnlineUserModule {}
