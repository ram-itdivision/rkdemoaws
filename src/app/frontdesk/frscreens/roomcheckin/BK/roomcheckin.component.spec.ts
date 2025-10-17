import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcheckinComponent } from './roomcheckin.component';

describe('RoomcheckinComponent', () => {
  let component: RoomcheckinComponent;
  let fixture: ComponentFixture<RoomcheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomcheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomcheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
