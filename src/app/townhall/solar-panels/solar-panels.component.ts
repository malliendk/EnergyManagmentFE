import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GameObject} from "../../dtos/gameObject";
import {mockGameObject} from "../../mocks/mock-game-object";
import {StatsCalculationService} from "../../services/stats-calculation.service";

@Component({
    selector: 'app-solar-panels',
    templateUrl: './solar-panels.component.html',
    styleUrls: ['./solar-panels.component.css'],
    standalone: false
})
export class SolarPanelsComponent implements OnInit{

  mockGameDto: GameObject = mockGameObject;

  isSideBarGradient: boolean = true;
  sideBarColorCode: string = '#d1bb1a, #ae0000';
  accountCost: number = 5;
  accountAmount: number = 0;
  totalCost: number = 0;
  estimatedIncomeIncrease: number = 0;
  estimatedGridLoadIncrease: number = 0;

  constructor(private calculationService: StatsCalculationService) {
  }

  ngOnInit() {
    this.accountAmount = 100;
    this.calculateStats();
  }

  buySolarPanels() {

  }

  calculateStats() {
    this.totalCost = this.calculateTotalCost();
    this.estimatedIncomeIncrease = this.estimateIncomeIncrease();
    this.estimatedGridLoadIncrease = this.estimateGridLoadIncrease();
  }

  calculateTotalCost(): number {
    return this.calculationService.calculateSolarPanelCost(this.accountAmount, this.accountCost);
  }

  estimateIncomeIncrease(): number {
    return this.calculationService.estimateIncomeIncrease(this.accountAmount, this.mockGameDto);
  }

  estimateGridLoadIncrease(): number {
    return this.calculationService.estimateGridLoadIncrease(this.accountAmount);
  }


}
