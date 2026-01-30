import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SOLAR_PANEL_PRICE} from "../constants";
import {CurrencyPipe} from "@angular/common";
import {Building} from "../dtos/building";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-purchase-solarpanels-housing',
  imports: [
    CurrencyPipe,
    FormsModule
  ],
    templateUrl: './purchase-solarpanels-housing.component.html',
    standalone: true,
    styleUrl: './purchase-solarpanels-housing.component.css'
})
export class PurchaseSolarpanelsHousingComponent implements OnInit {

  @Input() building!: Building | null;
  @Output() passSolarPanelPurchase = new EventEmitter<{
    amountOfSolarPanels: number,
    totalCost: number
  }>();

  solarPanelSetAmount: number = 0;
  totalCostSolarPanels: number = 0;

  maxSolarSets!: number;
  minSolarPanelSets: number = 0;

  ngOnInit() {
    this.maxSolarSets = this.building!.solarPanelCapacity - this.building!.solarPanelAmount;
  }

  calculateTotalSolarPanelPrice(numberOfSolarSets: HTMLInputElement) {
    if (numberOfSolarSets.valueAsNumber > this.maxSolarSets) {
      numberOfSolarSets.value = this.maxSolarSets.toString();
    } else if (numberOfSolarSets.valueAsNumber < this.minSolarPanelSets) {
      numberOfSolarSets.value = this.minSolarPanelSets.toString();
    }
    numberOfSolarSets.valueAsNumber ?
      this.totalCostSolarPanels = SOLAR_PANEL_PRICE * numberOfSolarSets.valueAsNumber :
      this.totalCostSolarPanels = 0;
  }

  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  purchaseSolarPanels(numberOfSets: number, totalCost: number) {
    this.passSolarPanelPurchase.emit({
      amountOfSolarPanels: numberOfSets,
      totalCost: totalCost
    });
  }
}
