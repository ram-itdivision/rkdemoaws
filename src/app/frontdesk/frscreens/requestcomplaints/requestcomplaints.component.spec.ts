import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestcomplaintsComponent } from './requestcomplaints.component';

describe('RequestcomplaintsComponent', () => {
  let component: RequestcomplaintsComponent;
  let fixture: ComponentFixture<RequestcomplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestcomplaintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestcomplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
