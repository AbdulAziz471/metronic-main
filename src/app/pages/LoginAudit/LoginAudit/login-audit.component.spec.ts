import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuditComponent } from './login-audit.component';

describe('LoginAuditComponent', () => {
  let component: LoginAuditComponent;
  let fixture: ComponentFixture<LoginAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginAuditComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
