import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRateEventComponent } from './update-rate-event.component';

describe('UpdateRateEventComponent', () => {
  let component: UpdateRateEventComponent;
  let fixture: ComponentFixture<UpdateRateEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRateEventComponent]
    });
    fixture = TestBed.createComponent(UpdateRateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
