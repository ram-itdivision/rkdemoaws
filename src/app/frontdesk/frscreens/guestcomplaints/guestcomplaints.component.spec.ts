import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestcomplaintsComponent } from './guestcomplaints.component';

describe('GuestcomplaintsComponent', () => {
  let component: GuestcomplaintsComponent;
  let fixture: ComponentFixture<GuestcomplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestcomplaintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestcomplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
