import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthInterceptor } from './Service/auth.interceptor.spec';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from './modules/material/material.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AuthApiService } from './Service/AuthApi.service';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    CommonModule,
    ClipboardModule,
    MaterialModule,FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularEditorModule ,
    InlineSVGModule.forRoot(),
    NgbModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true 
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
