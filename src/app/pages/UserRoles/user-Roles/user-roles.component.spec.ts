import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleSComponent } from './user-roles.component';

describe('UserListingComponent', () => {
  let component: UserRoleSComponent;
  let fixture: ComponentFixture<UserRoleSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleSComponent]
    });
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
