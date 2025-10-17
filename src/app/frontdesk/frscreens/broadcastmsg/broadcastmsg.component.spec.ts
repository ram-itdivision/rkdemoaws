import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastmsgComponent } from './broadcastmsg.component';

describe('BroadcastmsgComponent', () => {
  let component: BroadcastmsgComponent;
  let fixture: ComponentFixture<BroadcastmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastmsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BroadcastmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
