import {Component, Input, OnInit} from '@angular/core';
import {ExtendedGameDTO} from "../extendedGameDTO";
import {ChartService} from "../services/chart.service";
import {mockGameObject} from "../mocks/mock-game-object";
import {SupplyTypes} from "../supplyType";
import {Account} from "../dtos/account";
import {Router} from "@angular/router";
import {AccountService} from "../services/account.service";

@Component({
    selector: 'app-townhall-dashboard',
    templateUrl: './townhall-dashboard.component.html',
    styleUrls: ['./townhall-dashboard.component.css'],
    standalone: false
})
export class TownhallDashboardComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO;

  optimalAccountsNumber: number = 0;
  surplusAccounts: Account[] = [];
  shortageAccounts: Account[] = [];

  componentView: string = 'campaigns';
  selectedCampaignType: string = '';

  chartResults: any[] = [];
  customColors: any[] = [];

  showLabels: boolean = true;


  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.gameDTO = mockGameObject;
    // this.getAccountNumberByType();
    this.customColors = this.setCustomColors();
    this.chartResults = this.setChartResults();
  }

  setCustomColors(): { name: string, value: string }[] {
    return [
      {name: SupplyTypes.OPTIMAL.name, value: SupplyTypes.OPTIMAL.color},
      {name: SupplyTypes.SURPLUS.name, value: SupplyTypes.SURPLUS.color},
      {name: SupplyTypes.SHORTAGE.name, value: SupplyTypes.SHORTAGE.color}
    ]
  }

  setChartResults(): { name: string, value: string }[] {
    return [
      {name: SupplyTypes.OPTIMAL.name, value: (this.optimalAccountsNumber).toString()},
      {name: SupplyTypes.SURPLUS.name, value: this.surplusAccounts.length.toString()},
      {name: SupplyTypes.SHORTAGE.name, value: this.shortageAccounts.length.toString()}
    ]
  }

  // getAccountNumberByType() {
  //   this.optimalAccountsNumber = this.accountService.filterAccountByType(mockGameObject, SupplyTypes.OPTIMAL.name).length -200;
  //   this.surplusAccounts = this.accountService.filterAccountByType(mockGameObject, SupplyTypes.SURPLUS.name);
  //   this.shortageAccounts = this.accountService.filterAccountByType(mockGameObject, SupplyTypes.SHORTAGE.name);
  // }


  toIncome() {
    this.componentView = 'income';
  }

  toTaxes()
    :
    void {
    this.componentView = 'taxes'
  }

  toSolarPanels()
    :
    void {
    this.componentView = 'solar panels'
  }

  toCampaign()
    :
    void {
    this.componentView = 'campaigns'
  }

  toInfo()
    :
    void {
    this.componentView = 'info'
  }

    onCampaignTypeSelect(campaignType: string): void {
    this.selectedCampaignType = campaignType;
    console.log("emitted value:", campaignType)
    console.log(this.selectedCampaignType);

  }

}
