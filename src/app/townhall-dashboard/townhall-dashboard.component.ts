import {Component, Input, OnInit} from '@angular/core';
import {GameDto} from "../dtos/gameDto";
import {ChartService} from "../services/chart.service";
import {mockGameDto} from "../mocks/mock-game-dto";
import {LoadSource} from "../dtos/loadSource";
import {SupplyTypes} from "../supplyType";
import {Account} from "../dtos/account";
import {Router} from "@angular/router";

@Component({
  selector: 'app-townhall-dashboard',
  templateUrl: './townhall-dashboard.component.html',
  styleUrls: ['./townhall-dashboard.component.css']
})
export class TownhallDashboardComponent implements OnInit{

  mockGameDto!: GameDto;

  componentView: string = 'solar panels';

  showLabels: boolean = true;

  pieChartVariableNames: string[] = [];
  pieChartColorValues: string[] = [];
  pieChartResultValues: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.mockGameDto = mockGameDto;
    this.setPieChartVariableNames();
    this.setPieChartColorValue();
    this.setPieChartResultValues();
  }

  setPieChartVariableNames(): void {
    this.pieChartVariableNames = Object.values(SupplyTypes).map(type => type.name);
  }

  setPieChartColorValue(): void {
    this.pieChartColorValues = Object.values(SupplyTypes).map(type => type.color);
  }

  setPieChartResultValues(): void {
    const supplyTypeNames: string[] = Object.values(SupplyTypes).map(type => type.name);
    this.pieChartResultValues = supplyTypeNames.map((name: string) =>
      this.mockGameDto.accounts.filter((account: Account) => account.supplyType === name).length
    );
  }

  toIncome(){
    this.componentView = 'income';
  }

  toTaxes(): void {
    this.componentView = 'taxes'
  }

  toSolarPanels(): void {
    this.componentView = 'solar panels'
  }

  toCampaign(): void {
    this.componentView = 'campaign'
  }

  toInfo(): void {
    this.componentView = 'info'
  }
}
