import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwowaymsgComponent } from './twowaymsg.component';

describe('TwowaymsgComponent', () => {
  let component: TwowaymsgComponent;
  let fixture: ComponentFixture<TwowaymsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwowaymsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TwowaymsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
