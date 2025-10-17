import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinformupdateComponent } from './checkinformupdate.component';

describe('CheckinformupdateComponent', () => {
  let component: CheckinformupdateComponent;
  let fixture: ComponentFixture<CheckinformupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckinformupdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckinformupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
