import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventCommentComponent } from './all-event-comment.component';

describe('AllEventCommentComponent', () => {
  let component: AllEventCommentComponent;
  let fixture: ComponentFixture<AllEventCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEventCommentComponent]
    });
    fixture = TestBed.createComponent(AllEventCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
