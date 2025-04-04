import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBackDetailsComponent } from './user-back-details.component';

describe('UserBackDetailsComponent', () => {
  let component: UserBackDetailsComponent;
  let fixture: ComponentFixture<UserBackDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBackDetailsComponent]
    });
    fixture = TestBed.createComponent(UserBackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
