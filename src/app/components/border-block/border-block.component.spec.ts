import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BorderBlockComponent} from './border-block.component';

describe('BorderBlockComponent', () => {
  let component: BorderBlockComponent;
  let fixture: ComponentFixture<BorderBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorderBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorderBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
