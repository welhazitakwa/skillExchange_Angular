import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCourseSpaceComponent } from './user-course-space.component';

describe('UserCourseSpaceComponent', () => {
  let component: UserCourseSpaceComponent;
  let fixture: ComponentFixture<UserCourseSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCourseSpaceComponent]
    });
    fixture = TestBed.createComponent(UserCourseSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
