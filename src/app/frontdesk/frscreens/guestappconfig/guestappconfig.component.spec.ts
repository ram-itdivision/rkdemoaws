import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestappconfigComponent } from './guestappconfig.component';

describe('GuestappconfigComponent', () => {
  let component: GuestappconfigComponent;
  let fixture: ComponentFixture<GuestappconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestappconfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestappconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
