import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressoperationsComponent } from './inprogressoperations.component';

describe('InprogressoperationsComponent', () => {
  let component: InprogressoperationsComponent;
  let fixture: ComponentFixture<InprogressoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InprogressoperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InprogressoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
