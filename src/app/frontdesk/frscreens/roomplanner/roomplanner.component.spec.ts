import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomplannerComponent } from './roomplanner.component';

describe('RoomplannerComponent', () => {
  let component: RoomplannerComponent;
  let fixture: ComponentFixture<RoomplannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomplannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
