import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBanComponent } from './auth-ban.component';

describe('AuthBanComponent', () => {
  let component: AuthBanComponent;
  let fixture: ComponentFixture<AuthBanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthBanComponent]
    });
    fixture = TestBed.createComponent(AuthBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
