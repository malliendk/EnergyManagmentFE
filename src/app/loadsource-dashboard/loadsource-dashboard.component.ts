import {Component, Input, OnInit} from '@angular/core';
import {GameDTO} from "../dtos/gameDTO";
import {mockGameDto} from "../mocks/mock-game-dto";
import {Building} from "../dtos/building";
import {GameDtoService} from "../services/game-dto.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-loadsource-dashboard',
  templateUrl: './loadsource-dashboard.component.html',
  styleUrls: ['./loadsource-dashboard.component.css']
})
export class LoadsourceDashboardComponent implements OnInit {

  mockGameDto!: GameDTO
  building: Building | null = null;

  isSmallView: boolean = false;
  isShowPurchaseButton: boolean = false;

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


  constructor(private gameDTOService: GameDtoService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isSmallView = true;
    const id: number | null = Number(this.route.snapshot.params['id']);
    if (!id) {
      this.isShowPurchaseButton = true;
    }
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


  toggleCardDetailView(id: number) {
    this.isSmallView = false;
    this.building = this.mockGameDto.buildings.find((building => building.id === id)) as Building | null;
    console.log(this.building)
  }

  cancelDetailView() {
    this.building = null;
    this.isSmallView = true
  }

  purchaseBuilding() {
    this.gameDTOService.updateGameDTO(this.mockGameDto)
      .subscribe(() => {
        this.getGameDTO()
      })
  }

  getGameDTO() {
    this.gameDTOService.getGameDto()
      .subscribe(updatedGameDTO => this.mockGameDto = updatedGameDTO);
  }

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

  getBorderColor(propertyValue: number): string {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }
}
