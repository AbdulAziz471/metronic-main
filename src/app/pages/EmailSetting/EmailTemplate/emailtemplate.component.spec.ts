import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailtemplateComponent } from './emailtemplate.component';
describe('SMTPComponent', () => {
  let component: EmailtemplateComponent;
  let fixture: ComponentFixture<EmailtemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailtemplateComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
