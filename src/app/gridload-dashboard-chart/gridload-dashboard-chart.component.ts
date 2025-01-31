import {Component, Input, OnInit} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {Building} from "../dtos/building";
import {Color, LegendPosition, ScaleType} from '@swimlane/ngx-charts';
import {mockGameObject} from "../mocks/mock-game-object";

@Component({
  selector: 'app-gridload-dashboard-chart',
  templateUrl: './gridload-dashboard-chart.component.html',
  styleUrls: ['./gridload-dashboard-chart.component.css']
})
export class GridloadDashboardChartComponent implements OnInit {


  @Input() mockGameDto!: GameObject;

  chartResults: any[] = [];
  nameGridLoadArray: any[] = [];
  customColors: any[] = [];
  gradient: boolean = true;
  showLegend: boolean = false;
  xAxis: boolean = true
  yAxis: boolean = true
  legendPosition: LegendPosition = LegendPosition.Right;
  yAxisMaxValue: number = 15;

  gridLoadTotalColor: string = '#ae0000'
  gridLoadTotalName: string = 'Total'
  gridLoadTotalValue: number = 0;

  //pie-chart properties start
  showLabels: boolean = true;
  pieChartVariableNames: string[] = [];
  pieChartColorValues: string[] = [];
  pieChartResultValues: number[] = [];
  trimLabels: boolean = false;
  //pie-chart properties end

  //bar-chart-properties-start
  animations: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Grid load';
  barchartVariableName: string[] = [];
  barChartColorValue: string[] = [];
  barChartResultValue: number[] = [];
  yScaleMax: number = 15;
  //bar-chart-properties-end

  isInitialized: boolean = false;



  ngOnInit() {
    this.mockGameDto.buildings.forEach(source => {
      this.setChartSeries(source);
      this.setCustomColors(source)
    });
    this.setChartResults();
    this.setPieChartVariableNames();
    this.setPieChartColors();
    this.setPieChartResults();
    this.setBarChartVariableName();
    this.setBarChartColor();
    this.setBarChartResults();
    this.isInitialized = true;
  }

  setCustomColors(source: Building): void {
    const nameColorPair: {name: string; value: string} = {
      name: source.name,
      value: source.color
    }
    this.customColors.push(nameColorPair);
  }

  setChartResults() {
    this.chartResults = [
      {
        name: "",
        series: this.nameGridLoadArray
      }
    ]
  }

  setChartSeries(source: Building): void {
    const nameGridloadPair: {name:string, value: number} = {
      name: source.name,
      value: source.gridLoad
    }
    this.nameGridLoadArray.push(nameGridloadPair);
  }

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.customColors.map(c => c.value)
  };


  setPieChartColors(): void {
    this.pieChartColorValues = this.mockGameDto.buildings.map((source: Building) => source.color);
  }

  setPieChartResults(): void {
    this.pieChartResultValues = this.mockGameDto.buildings.map((source: Building) => source.gridLoad);
  }

  setPieChartVariableNames(): void {
    this.pieChartVariableNames = this.mockGameDto.buildings.map((source: Building) => source.name);
  }

  setBarChartVariableName(): void {
    this.barchartVariableName.push(this.gridLoadTotalName);
  }

  setBarChartColor(): void {
    this.barChartColorValue.push(this.gridLoadTotalColor);
  }

  setBarChartResults(): void {
    this.barChartResultValue.push(this.gridLoadTotalValue);
  }

}
