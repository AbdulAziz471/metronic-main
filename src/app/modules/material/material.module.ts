// src/app/material/material.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    // Add other Angular Material modules here
  ],
  exports: [
    MatSlideToggleModule, // Re-export the modules
    // Re-export other Angular Material modules here
  ]
})
export class MaterialModule { }
