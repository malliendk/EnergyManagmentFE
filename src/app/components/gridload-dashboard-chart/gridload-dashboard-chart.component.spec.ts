import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GridloadDashboardChartComponent} from './gridload-dashboard-chart.component';

describe('GridloadChartViewComponent', () => {
  let component: GridloadDashboardChartComponent;
  let fixture: ComponentFixture<GridloadDashboardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridloadDashboardChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridloadDashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
