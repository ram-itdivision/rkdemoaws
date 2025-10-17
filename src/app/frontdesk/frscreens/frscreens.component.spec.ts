import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrscreensComponent } from './frscreens.component';

describe('FrscreensComponent', () => {
  let component: FrscreensComponent;
  let fixture: ComponentFixture<FrscreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrscreensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrscreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
