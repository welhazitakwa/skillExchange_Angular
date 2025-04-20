import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CousesByCategoryComponent } from './couses-by-category.component';

describe('CousesByCategoryComponent', () => {
  let component: CousesByCategoryComponent;
  let fixture: ComponentFixture<CousesByCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CousesByCategoryComponent]
    });
    fixture = TestBed.createComponent(CousesByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
