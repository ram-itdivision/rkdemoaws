import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomqrcodeComponent } from './roomqrcode.component';

describe('RoomqrcodeComponent', () => {
  let component: RoomqrcodeComponent;
  let fixture: ComponentFixture<RoomqrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomqrcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomqrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
