import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationDetailsComponent } from './identification-details.component';

describe('IdentificationDetailsComponent', () => {
  let component: IdentificationDetailsComponent;
  let fixture: ComponentFixture<IdentificationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentificationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdentificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
