import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinhistoryComponent } from './checkinhistory.component';

describe('CheckinhistoryComponent', () => {
  let component: CheckinhistoryComponent;
  let fixture: ComponentFixture<CheckinhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckinhistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckinhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
