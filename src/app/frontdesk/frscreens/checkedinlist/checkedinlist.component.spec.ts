import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedinlistComponent } from './checkedinlist.component';

describe('CheckedinlistComponent', () => {
  let component: CheckedinlistComponent;
  let fixture: ComponentFixture<CheckedinlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckedinlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckedinlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
