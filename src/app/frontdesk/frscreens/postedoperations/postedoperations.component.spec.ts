import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedoperationsComponent } from './postedoperations.component';

describe('PostedoperationsComponent', () => {
  let component: PostedoperationsComponent;
  let fixture: ComponentFixture<PostedoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostedoperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostedoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
