import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprooveCourseComponent } from './approove-course.component';

describe('ApprooveCourseComponent', () => {
  let component: ApprooveCourseComponent;
  let fixture: ComponentFixture<ApprooveCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprooveCourseComponent]
    });
    fixture = TestBed.createComponent(ApprooveCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
