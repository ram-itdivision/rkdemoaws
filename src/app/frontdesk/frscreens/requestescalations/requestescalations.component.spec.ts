import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestescalationsComponent } from './requestescalations.component';

describe('RequestescalationsComponent', () => {
  let component: RequestescalationsComponent;
  let fixture: ComponentFixture<RequestescalationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestescalationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestescalationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
