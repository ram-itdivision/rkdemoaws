import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomfeaturesComponent } from './roomfeatures.component';

describe('RoomfeaturesComponent', () => {
  let component: RoomfeaturesComponent;
  let fixture: ComponentFixture<RoomfeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomfeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomfeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
