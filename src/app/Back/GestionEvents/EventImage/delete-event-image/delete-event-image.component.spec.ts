import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEventImageComponent } from './delete-event-image.component';

describe('DeleteEventImageComponent', () => {
  let component: DeleteEventImageComponent;
  let fixture: ComponentFixture<DeleteEventImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEventImageComponent]
    });
    fixture = TestBed.createComponent(DeleteEventImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
