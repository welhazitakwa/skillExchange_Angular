import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcartComponent } from './addcart.component';

describe('AddcartComponent', () => {
  let component: AddcartComponent;
  let fixture: ComponentFixture<AddcartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddcartComponent]
    });
    fixture = TestBed.createComponent(AddcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
