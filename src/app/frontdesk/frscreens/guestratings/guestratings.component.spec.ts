import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestratingsComponent } from './guestratings.component';

describe('GuestratingsComponent', () => {
  let component: GuestratingsComponent;
  let fixture: ComponentFixture<GuestratingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestratingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestratingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
