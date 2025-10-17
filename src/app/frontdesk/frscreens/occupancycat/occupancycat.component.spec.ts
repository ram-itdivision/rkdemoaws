import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancycatComponent } from './occupancycat.component';

describe('OccupancycatComponent', () => {
  let component: OccupancycatComponent;
  let fixture: ComponentFixture<OccupancycatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccupancycatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OccupancycatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
