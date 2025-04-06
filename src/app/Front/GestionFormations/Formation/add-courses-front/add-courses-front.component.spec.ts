import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoursesFrontComponent } from './add-courses-front.component';

describe('AddCoursesFrontComponent', () => {
  let component: AddCoursesFrontComponent;
  let fixture: ComponentFixture<AddCoursesFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCoursesFrontComponent]
    });
    fixture = TestBed.createComponent(AddCoursesFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
