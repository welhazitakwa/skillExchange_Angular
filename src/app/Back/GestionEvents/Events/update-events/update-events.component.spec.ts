import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventsComponent } from './update-events.component';

describe('UpdateEventsComponent', () => {
  let component: UpdateEventsComponent;
  let fixture: ComponentFixture<UpdateEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEventsComponent]
    });
    fixture = TestBed.createComponent(UpdateEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
