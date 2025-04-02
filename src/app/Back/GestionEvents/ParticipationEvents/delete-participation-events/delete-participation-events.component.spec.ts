import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParticipationEventsComponent } from './delete-participation-events.component';

describe('DeleteParticipationEventsComponent', () => {
  let component: DeleteParticipationEventsComponent;
  let fixture: ComponentFixture<DeleteParticipationEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteParticipationEventsComponent]
    });
    fixture = TestBed.createComponent(DeleteParticipationEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
