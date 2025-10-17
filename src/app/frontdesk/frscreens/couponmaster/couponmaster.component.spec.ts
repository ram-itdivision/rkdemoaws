import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponmasterComponent } from './couponmaster.component';

describe('CouponmasterComponent', () => {
  let component: CouponmasterComponent;
  let fixture: ComponentFixture<CouponmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CouponmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
