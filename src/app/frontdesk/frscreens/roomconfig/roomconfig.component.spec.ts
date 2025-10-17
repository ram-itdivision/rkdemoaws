import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomconfigComponent } from './roomconfig.component';

describe('RoomconfigComponent', () => {
  let component: RoomconfigComponent;
  let fixture: ComponentFixture<RoomconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomconfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
