import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReclamationReplyComponent } from './all-reclamation-reply.component';

describe('AllReclamationReplyComponent', () => {
  let component: AllReclamationReplyComponent;
  let fixture: ComponentFixture<AllReclamationReplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllReclamationReplyComponent]
    });
    fixture = TestBed.createComponent(AllReclamationReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
