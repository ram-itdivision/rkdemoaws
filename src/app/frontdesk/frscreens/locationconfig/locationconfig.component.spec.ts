import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationconfigComponent } from './locationconfig.component';

describe('LocationconfigComponent', () => {
  let component: LocationconfigComponent;
  let fixture: ComponentFixture<LocationconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationconfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
