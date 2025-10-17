import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingcleaningComponent } from './ongoingcleaning.component';

describe('OngoingcleaningComponent', () => {
  let component: OngoingcleaningComponent;
  let fixture: ComponentFixture<OngoingcleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingcleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OngoingcleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
