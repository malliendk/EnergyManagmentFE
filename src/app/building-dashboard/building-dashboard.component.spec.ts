import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BuildingDashboardComponent} from './building-dashboard.component';

describe('LoadsourceListComponent', () => {
  let component: BuildingDashboardComponent;
  let fixture: ComponentFixture<BuildingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
