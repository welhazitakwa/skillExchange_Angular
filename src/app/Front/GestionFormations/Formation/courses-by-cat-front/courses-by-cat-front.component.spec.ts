import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesByCatFrontComponent } from './courses-by-cat-front.component';

describe('CoursesByCatFrontComponent', () => {
  let component: CoursesByCatFrontComponent;
  let fixture: ComponentFixture<CoursesByCatFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesByCatFrontComponent]
    });
    fixture = TestBed.createComponent(CoursesByCatFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
