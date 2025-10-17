import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomtariffsComponent } from './roomtariffs.component';

describe('RoomtariffsComponent', () => {
  let component: RoomtariffsComponent;
  let fixture: ComponentFixture<RoomtariffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomtariffsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomtariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
