import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestcartConfirmComponent } from './guestcart-confirm.component';

describe('GuestcartConfirmComponent', () => {
  let component: GuestcartConfirmComponent;
  let fixture: ComponentFixture<GuestcartConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestcartConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestcartConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
