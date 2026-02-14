import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FullGameDTO} from "../../dtos/fullGameDTO";
import {SupplyTypes} from "../../supplyType";

@Component({
    selector: 'app-townhall-dashboard',
    templateUrl: './town-hall-dashboard.component.html',
    styleUrls: ['./town-hall-dashboard.component.css'],
    standalone: true,
  imports: [CommonModule]
})
export class TownHallDashboardComponent implements OnInit {

  @Input() gameDTO!: FullGameDTO;

  componentView: string = 'campaigns';
  selectedCampaignType: string = '';

  chartResults: any[] = [];
  customColors: any[] = [];

  showLabels: boolean = true;


  constructor() {
  }

  ngOnInit(): void {
    this.customColors = this.setCustomColors();
  }

  setCustomColors(): { name: string, value: string }[] {
    return [
      {name: SupplyTypes.OPTIMAL.name, value: SupplyTypes.OPTIMAL.color},
      {name: SupplyTypes.SURPLUS.name, value: SupplyTypes.SURPLUS.color},
      {name: SupplyTypes.SHORTAGE.name, value: SupplyTypes.SHORTAGE.color}
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
