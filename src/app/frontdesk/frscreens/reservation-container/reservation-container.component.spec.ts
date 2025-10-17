import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationContainerComponent } from './reservation-container.component';

describe('ReservationContainerComponent', () => {
  let component: ReservationContainerComponent;
  let fixture: ComponentFixture<ReservationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
