import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcalenderComponent } from './roomcalender.component';

describe('RoomcalenderComponent', () => {
  let component: RoomcalenderComponent;
  let fixture: ComponentFixture<RoomcalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomcalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
