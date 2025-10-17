import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestregistrationComponent } from './guestregistration.component';

describe('GuestregistrationComponent', () => {
  let component: GuestregistrationComponent;
  let fixture: ComponentFixture<GuestregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestregistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
