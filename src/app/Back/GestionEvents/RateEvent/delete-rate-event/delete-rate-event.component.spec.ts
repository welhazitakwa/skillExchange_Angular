import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRateEventComponent } from './delete-rate-event.component';

describe('DeleteRateEventComponent', () => {
  let component: DeleteRateEventComponent;
  let fixture: ComponentFixture<DeleteRateEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRateEventComponent]
    });
    fixture = TestBed.createComponent(DeleteRateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
