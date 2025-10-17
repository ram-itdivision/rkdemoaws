import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertypolicyComponent } from './propertypolicy.component';

describe('PropertypolicyComponent', () => {
  let component: PropertypolicyComponent;
  let fixture: ComponentFixture<PropertypolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertypolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
