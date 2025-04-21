import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCartProductsComponent } from './all-cart-products.component';

describe('AllCartProductsComponent', () => {
  let component: AllCartProductsComponent;
  let fixture: ComponentFixture<AllCartProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllCartProductsComponent]
    });
    fixture = TestBed.createComponent(AllCartProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
