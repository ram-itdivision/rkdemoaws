import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalatedtasksComponent } from './escalatedtasks.component';

describe('EscalatedtasksComponent', () => {
  let component: EscalatedtasksComponent;
  let fixture: ComponentFixture<EscalatedtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalatedtasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EscalatedtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
