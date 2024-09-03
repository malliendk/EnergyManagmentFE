import {Component, Input, OnInit} from '@angular/core';
import {GameDto} from "../dtos/gameDto";
import {mockGameDto} from "../mocks/mock-game-dto";
import {LoadSource} from "../dtos/loadSource";
import {GameDtoService} from "../services/game-dto.service";

@Component({
  selector: 'app-loadsource-dashboard',
  templateUrl: './loadsource-dashboard.component.html',
  styleUrls: ['./loadsource-dashboard.component.css']
})
export class LoadsourceDashboardComponent implements OnInit{

  mockGameDto!: GameDto
  gridLoadTotalColor: string = '#ae0000'
  gridLoadTotalName: string = 'Total'
  gridLoadTotalValue: number = 0;

  //pie-chart properties start
  gradient: boolean = false;
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


  constructor(private gameDtoService: GameDtoService) {
  }

  ngOnInit() {
    this.mockGameDto = mockGameDto;
    this.gridLoadTotalValue = this.mockGameDto.gridLoadTotal;
    console.log(this.gridLoadTotalValue)
    this.setPieChartVariableNames();
    this.setPieChartColors();
    this.setPieChartResults();
    this.setBarChartVariableName();
    this.setBarChartColor();
    this.setBarChartResults();
    this.isInitialized = true;
  }

  setPieChartColors(): void {
    this.pieChartColorValues = this.mockGameDto.sources.map((source: LoadSource) => source.color);
  }

  setPieChartResults(): void {
    this.pieChartResultValues = this.mockGameDto.sources.map((source: LoadSource) => source.gridLoad);
  }

  setPieChartVariableNames(): void {
    this.pieChartVariableNames = this.mockGameDto.sources.map((source: LoadSource) => source.name);
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
