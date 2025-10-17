import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarregComponent } from './calendarreg.component';

describe('CalendarregComponent', () => {
  let component: CalendarregComponent;
  let fixture: ComponentFixture<CalendarregComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarregComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
