import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltypointsComponent } from './loyaltypoints.component';

describe('LoyaltypointsComponent', () => {
  let component: LoyaltypointsComponent;
  let fixture: ComponentFixture<LoyaltypointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltypointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoyaltypointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
