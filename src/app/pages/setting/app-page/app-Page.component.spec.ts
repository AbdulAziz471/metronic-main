import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPageComponent } from './app-page.component';
describe('AppActionsComponent', () => {
  let component: AppPageComponent;
  let fixture: ComponentFixture<AppPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppPageComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
