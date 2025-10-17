import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedoperationsComponent } from './finishedoperations.component';

describe('FinishedoperationsComponent', () => {
  let component: FinishedoperationsComponent;
  let fixture: ComponentFixture<FinishedoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishedoperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishedoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
