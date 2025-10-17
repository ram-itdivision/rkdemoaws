import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestfeedbackComponent } from './guestfeedback.component';

describe('GuestfeedbackComponent', () => {
  let component: GuestfeedbackComponent;
  let fixture: ComponentFixture<GuestfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestfeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
