import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllbadgesComponent } from './allbadges.component';

describe('AllbadgesComponent', () => {
  let component: AllbadgesComponent;
  let fixture: ComponentFixture<AllbadgesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllbadgesComponent]
    });
    fixture = TestBed.createComponent(AllbadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
