import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendEmailComponent } from './SendEmail.component';
describe('SMTPComponent', () => {
  let component: SendEmailComponent;
  let fixture: ComponentFixture<SendEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
