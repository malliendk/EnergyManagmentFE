import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarHorizontalComponent } from './chart-bar-horizontal.component';

describe('HorizontalBarChartComponent', () => {
  let component: ChartBarHorizontalComponent;
  let fixture: ComponentFixture<ChartBarHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBarHorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartBarHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
