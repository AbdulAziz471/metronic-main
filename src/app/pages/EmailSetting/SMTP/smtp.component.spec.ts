import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SMTPComponent } from './smtp.component';

describe('SMTPComponent', () => {
  let component: SMTPComponent;
  let fixture: ComponentFixture<SMTPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SMTPComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
