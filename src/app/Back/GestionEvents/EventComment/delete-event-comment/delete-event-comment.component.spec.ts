import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEventCommentComponent } from './delete-event-comment.component';

describe('DeleteEventCommentComponent', () => {
  let component: DeleteEventCommentComponent;
  let fixture: ComponentFixture<DeleteEventCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEventCommentComponent]
    });
    fixture = TestBed.createComponent(DeleteEventCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
