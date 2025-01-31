import {Component, Input, OnInit} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {Building} from "../dtos/building";
import {mockGameObject} from "../mocks/mock-game-object";
import {ChartBarHorizontalComponent} from "../chart-bar-horizontal/chart-bar-horizontal.component";


@Component({
    selector: 'app-factory-dashboard',
    templateUrl: './factory-dashboard.component.html',
    styleUrls: ['./factory-dashboard.component.css'],
    standalone: false
})
export class FactoryDashboardComponent implements OnInit{

  mockGameDto!: GameObject
  coalPlant!: Building;
  gasPlant!: Building;
  sliderMinValue: number = 0.0;
  sliderMaxValue: number = 6.0;
  sliderStepValue: number = 0.1;
  coalPlantGridLoadStartingValue: number = 0;
  gasPlantGridLoadStartingValue: number = 0;
  isInitialized: boolean = false;

  //chart values start
  showGridLines = false;
  showYAxis: boolean = true;
  fundsScaleMax: number = 15000;
  gridLoadScaleMax = 15;
  fundsVariableName: string[] = [
    'Funds'
  ];
  gridLoadVariableName: string [] = [
    "Total grid load"
  ]
  fundsColor: string[] = [
    '#dfc700'
  ];
  totalGridLoadColor: string[] = [
    '#ae0000'
  ];
  fundsChartResults: number[] = []
  gridLoadChartResults: number[] = []
  //chart values end

  cssFactoryContainer1BackgroundColor: string =
    'conic-gradient(#7c7c7c, #e1e1e1, #b5b5b5, #7c7c7c, #e1e1e1, #acacac, #e1e1e1, #7c7c7c)';
  cssFactoryContainer2BackgroundColor: string =
    'conic-gradient(#7c7c7c, #e1e1e1, #b5b5b5, #7c7c7c, #e1e1e1, #acacac, #e1e1e1, #7c7c7c';


  constructor() {
  }

  ngOnInit(): void {
    this.mockGameDto = mockGameObject
    this.fundsChartResults = [this.mockGameDto.funds]
    this.gridLoadChartResults = [this.mockGameDto.gridLoadTotal]
    this.coalPlant = this.selectPowerPlant('Kolencentrale');
    this.gasPlant = this.selectPowerPlant('Gascentrale');
    this.coalPlantGridLoadStartingValue = this.coalPlant.gridLoad;
    this.gasPlantGridLoadStartingValue = this.gasPlant.gridLoad;
    this.isInitialized = true;
  }

  selectPowerPlant(sourceName: string) {
    return <Building>this.mockGameDto.buildings.find(source => source.name === sourceName);
  }

  calculateNewValues(powerPlant: Building, startingValue: number, powerPlantGridLoad: HTMLInputElement) {
    this.calculateNewTotalGridLoad();
    this.calculateNewFunds(powerPlant, startingValue, powerPlantGridLoad);
  }

  calculateNewTotalGridLoad(): void {
    this.mockGameDto.gridLoadTotal = mockGameObject.buildings.reduce(
      (totalLoad: number, source: Building) => totalLoad + source.gridLoad, 0)
    this.gridLoadChartResults = [this.mockGameDto.gridLoadTotal];
  }

  calculateNewFunds(powerPlant: Building, startingValue: number, powerPlantGridLoad: HTMLInputElement): void {
    const gridLoadDifference: number = startingValue - powerPlantGridLoad.valueAsNumber;
    this.mockGameDto.funds = this.mockGameDto.funds - (gridLoadDifference * 1000);
    if (powerPlant === this.coalPlant) {
      this.coalPlantGridLoadStartingValue -= gridLoadDifference;
    } else if (powerPlant === this.gasPlant) {
      this.gasPlantGridLoadStartingValue -= gridLoadDifference;
    }
    this.fundsChartResults = [this.mockGameDto.funds];
  }
}
