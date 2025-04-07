import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFormationComponent } from './details-formation.component';

describe('DetailsFormationComponent', () => {
  let component: DetailsFormationComponent;
  let fixture: ComponentFixture<DetailsFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFormationComponent]
    });
    fixture = TestBed.createComponent(DetailsFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
