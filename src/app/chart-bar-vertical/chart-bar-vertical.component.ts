import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ChartService} from "../services/chart.service";

@Component({
    selector: 'app-chart-bar-vertical',
    templateUrl: './chart-bar-vertical.component.html',
    styleUrls: ['./chart-bar-vertical.component.css'],
    standalone: false
})
export class ChartBarVerticalComponent implements OnInit {

  @Input() gradient: boolean = false;
  @Input() animations: boolean = false;
  @Input() showXAxis: boolean = false;
  @Input() showYAxis: boolean = false;
  @Input() showXAxisLabel: boolean = false;
  @Input() showYAxisLabel: boolean = false;
  @Input() xAxisLabel: string = '';
  @Input() yAxisLabel: string = '';
  @Input() yScaleMax: number = 0;

  @Input() chartVariableNames: string[] = [];
  @Input() chartColorValues: string[] = [];
  @Input() chartResultValues: number[] = [];

  chartResults: any[] = [];
  customColors: any[] = [];

  constructor(private chartService: ChartService) {
  }

  ngOnInit() {
    this.updateChartData();
  }

  private updateChartData(): void {
    const { customColors, chartResults} = this.chartService.updateChartData(this.chartVariableNames, this.chartColorValues, this.chartResultValues);
    this.customColors = customColors;
    this.chartResults = chartResults;
  }
}
