import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningrequiredComponent } from './cleaningrequired.component';

describe('CleaningrequiredComponent', () => {
  let component: CleaningrequiredComponent;
  let fixture: ComponentFixture<CleaningrequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningrequiredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CleaningrequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
