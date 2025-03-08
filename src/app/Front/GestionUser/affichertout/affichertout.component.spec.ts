import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichertoutComponent } from './affichertout.component';

describe('AffichertoutComponent', () => {
  let component: AffichertoutComponent;
  let fixture: ComponentFixture<AffichertoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichertoutComponent]
    });
    fixture = TestBed.createComponent(AffichertoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
