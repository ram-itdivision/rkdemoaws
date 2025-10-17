import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderclearanceComponent } from './underclearance.component';

describe('UnderclearanceComponent', () => {
  let component: UnderclearanceComponent;
  let fixture: ComponentFixture<UnderclearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderclearanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnderclearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
