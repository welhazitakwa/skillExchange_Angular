import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentScheduleComponent } from './payment-schedule.component';

describe('PaymentScheduleComponent', () => {
  let component: PaymentScheduleComponent;
  let fixture: ComponentFixture<PaymentScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentScheduleComponent]
    });
    fixture = TestBed.createComponent(PaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
