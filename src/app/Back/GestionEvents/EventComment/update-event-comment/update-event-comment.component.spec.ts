import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventCommentComponent } from './update-event-comment.component';

describe('UpdateEventCommentComponent', () => {
  let component: UpdateEventCommentComponent;
  let fixture: ComponentFixture<UpdateEventCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEventCommentComponent]
    });
    fixture = TestBed.createComponent(UpdateEventCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
