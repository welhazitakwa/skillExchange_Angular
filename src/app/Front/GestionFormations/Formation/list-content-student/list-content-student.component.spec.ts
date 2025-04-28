import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContentStudentComponent } from './list-content-student.component';

describe('ListContentStudentComponent', () => {
  let component: ListContentStudentComponent;
  let fixture: ComponentFixture<ListContentStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListContentStudentComponent]
    });
    fixture = TestBed.createComponent(ListContentStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
