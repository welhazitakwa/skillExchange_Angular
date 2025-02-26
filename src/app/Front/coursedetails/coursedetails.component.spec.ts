import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursedetailsComponent } from './coursedetails.component';

describe('CoursedetailsComponent', () => {
  let component: CoursedetailsComponent;
  let fixture: ComponentFixture<CoursedetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursedetailsComponent]
    });
    fixture = TestBed.createComponent(CoursedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
