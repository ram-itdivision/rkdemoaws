import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishcleaningComponent } from './finishcleaning.component';

describe('FinishcleaningComponent', () => {
  let component: FinishcleaningComponent;
  let fixture: ComponentFixture<FinishcleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishcleaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishcleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
