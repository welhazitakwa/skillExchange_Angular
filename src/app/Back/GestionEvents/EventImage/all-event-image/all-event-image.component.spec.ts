import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventImageComponent } from './all-event-image.component';

describe('AllEventImageComponent', () => {
  let component: AllEventImageComponent;
  let fixture: ComponentFixture<AllEventImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEventImageComponent]
    });
    fixture = TestBed.createComponent(AllEventImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
