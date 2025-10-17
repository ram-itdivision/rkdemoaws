import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmenuComponent } from './frmenu.component';

describe('FrmenuComponent', () => {
  let component: FrmenuComponent;
  let fixture: ComponentFixture<FrmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
