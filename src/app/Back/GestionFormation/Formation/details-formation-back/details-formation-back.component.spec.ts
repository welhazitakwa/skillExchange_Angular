import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFormationBackComponent } from './details-formation-back.component';

describe('DetailsFormationBackComponent', () => {
  let component: DetailsFormationBackComponent;
  let fixture: ComponentFixture<DetailsFormationBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFormationBackComponent]
    });
    fixture = TestBed.createComponent(DetailsFormationBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
