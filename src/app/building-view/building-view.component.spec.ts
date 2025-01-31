import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingViewComponent } from './building-view.component';

describe('BuildingViewComponent', () => {
  let component: BuildingViewComponent;
  let fixture: ComponentFixture<BuildingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
