import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcategoryComponent } from './roomcategory.component';

describe('RoomcategoryComponent', () => {
  let component: RoomcategoryComponent;
  let fixture: ComponentFixture<RoomcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomcategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
