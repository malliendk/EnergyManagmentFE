import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownhallChartBoxComponent } from './townhall-chart-box.component';

describe('TownhallChartBoxComponent', () => {
  let component: TownhallChartBoxComponent;
  let fixture: ComponentFixture<TownhallChartBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownhallChartBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownhallChartBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
