import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInformationComponent } from './guest-information.component';

describe('GuestInformationComponent', () => {
  let component: GuestInformationComponent;
  let fixture: ComponentFixture<GuestInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
