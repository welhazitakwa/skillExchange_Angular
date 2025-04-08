import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRateEventComponent } from './all-rate-event.component';

describe('AllRateEventComponent', () => {
  let component: AllRateEventComponent;
  let fixture: ComponentFixture<AllRateEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllRateEventComponent]
    });
    fixture = TestBed.createComponent(AllRateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
