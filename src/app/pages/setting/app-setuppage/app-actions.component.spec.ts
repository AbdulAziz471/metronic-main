import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppActionsComponent } from './app-actions.component';

describe('AppActionsComponent', () => {
  let component: AppActionsComponent;
  let fixture: ComponentFixture<AppActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppActionsComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
