import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclcheckinComponent } from './addclcheckin.component';

describe('AddclcheckinComponent', () => {
  let component: AddclcheckinComponent;
  let fixture: ComponentFixture<AddclcheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddclcheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddclcheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
