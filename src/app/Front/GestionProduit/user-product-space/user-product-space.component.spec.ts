import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductSpaceComponent } from './user-product-space.component';

describe('UserProductSpaceComponent', () => {
  let component: UserProductSpaceComponent;
  let fixture: ComponentFixture<UserProductSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProductSpaceComponent]
    });
    fixture = TestBed.createComponent(UserProductSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
