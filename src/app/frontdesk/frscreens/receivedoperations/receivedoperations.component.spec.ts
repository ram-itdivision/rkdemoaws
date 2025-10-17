import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedoperationsComponent } from './receivedoperations.component';

describe('ReceivedoperationsComponent', () => {
  let component: ReceivedoperationsComponent;
  let fixture: ComponentFixture<ReceivedoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedoperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceivedoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
