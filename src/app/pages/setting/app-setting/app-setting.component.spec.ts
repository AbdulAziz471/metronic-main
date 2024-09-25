import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingComponent } from './app-setting.component';

describe('AppSettingComponent', () => {
  let component: AppSettingComponent;
  let fixture: ComponentFixture<AppSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppSettingComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
