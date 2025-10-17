import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadeusersComponent } from './cascadeusers.component';

describe('CascadeusersComponent', () => {
  let component: CascadeusersComponent;
  let fixture: ComponentFixture<CascadeusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascadeusersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CascadeusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
