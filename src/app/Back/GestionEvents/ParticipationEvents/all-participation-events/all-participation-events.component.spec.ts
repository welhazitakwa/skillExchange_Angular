import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllParticipationEventsComponent } from './all-participation-events.component';

describe('AllParticipationEventsComponent', () => {
  let component: AllParticipationEventsComponent;
  let fixture: ComponentFixture<AllParticipationEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllParticipationEventsComponent]
    });
    fixture = TestBed.createComponent(AllParticipationEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
