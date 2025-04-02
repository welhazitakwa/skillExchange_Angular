import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventImageComponent } from './update-event-image.component';

describe('UpdateEventImageComponent', () => {
  let component: UpdateEventImageComponent;
  let fixture: ComponentFixture<UpdateEventImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEventImageComponent]
    });
    fixture = TestBed.createComponent(UpdateEventImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
