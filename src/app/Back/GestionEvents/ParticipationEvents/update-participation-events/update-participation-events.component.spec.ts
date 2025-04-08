import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateParticipationEventsComponent } from './update-participation-events.component';

describe('UpdateParticipationEventsComponent', () => {
  let component: UpdateParticipationEventsComponent;
  let fixture: ComponentFixture<UpdateParticipationEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateParticipationEventsComponent]
    });
    fixture = TestBed.createComponent(UpdateParticipationEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
