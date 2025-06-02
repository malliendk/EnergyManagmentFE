import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe, DecimalPipe, NgClass, NgStyle} from "@angular/common";
import {Building} from "../dtos/building";
import {District} from "../dtos/district";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../modal/modal.component";
import {BuildingService} from "../services/building.service";

@Component({
  selector: 'app-building-info',
  imports: [
    NgStyle,
    NgClass,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
  ],
  templateUrl: './building-info.component.html',
  standalone: true,
  styleUrl: './building-info.component.css'
})
export class BuildingInfoComponent implements OnInit{

  @Input() building?: Building;
  @Input() district?: District;

  @Input() customHeight?: string;
  @Input() customWidth?: string;
  @Input() customPadding?: string;
  @Input() customMargin?: string;
  @Input() showSolarPanel: boolean = false;

  buildingsInDistrict!: Building[];

  solarPanelAmount: number = 0;
  remainingSolarCapacity: number = 0;

  productionPerSolarPanel: number = 10;
  goldIncomePerSolarPanel: number = 1;
  researchIncomePerSolarPanel: number = 1;
  environmentalScorePerSolarPanel: number = 1;

  production: number = 0;
  goldIncome: number = 0;
  researchIncome: number = 0;
  environmentalScore: number = 0;

  isCapacityModalOpen: boolean = false;

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit() {
    if (this.district) {
      this.buildingsInDistrict = this.buildingService.getDistrictBuildings(this.district);
      this.calculateStatsFromSolarPanels(this.buildingsInDistrict);
    }
  }

  getCustomWidth(): string {
    return this.customWidth ? 'width-' + this.customWidth : '';
  }

  getCustomPadding(): string {
    return this.customPadding ? 'padding-' + this.customPadding : '';
  }

  getCustomMargin(): string {
    return this.customPadding ? 'margin-' + this.customPadding : '';
  }

  purchaseSolarPanels(district: District) {
    const buildings: Building[] = this.buildingsInDistrict.filter(b => b.solarPanelCapacity > 0);

    const totalCapacity = buildings.reduce(
      (sum: number, b: Building) => sum + (b.solarPanelCapacity - b.solarPanelAmount), 0);

    if (this.solarPanelAmount > totalCapacity) {
      this.remainingSolarCapacity = this.solarPanelAmount - totalCapacity;
      this.solarPanelAmount = totalCapacity;
      this.toggleCapacityModalOpen();
    } else {
      this.remainingSolarCapacity = 0;
    }

    // Sort buildings: first those with existing panels, then by lowest capacity
    const sortedBuildings = buildings.sort((a: Building, b: Building) => {
      if (a.solarPanelAmount > 0 && b.solarPanelAmount === 0) return -1;
      if (a.solarPanelAmount === 0 && b.solarPanelAmount > 0) return 1;
      return a.solarPanelAmount === 0 && b.solarPanelAmount === 0
        ? a.solarPanelCapacity - b.solarPanelCapacity
        : 0;
    });

    let remaining: number = this.solarPanelAmount;
    for (const building of sortedBuildings) {
      const availableCapacity = building.solarPanelCapacity - building.solarPanelAmount;
      const toAdd = Math.min(availableCapacity, remaining);
      building.solarPanelAmount += toAdd;
      remaining -= toAdd;
      if (remaining <= 0) break;
    }
    this.solarPanelAmount = 0;
    this.calculateStatsFromSolarPanels(buildings);
  }

  calculateStatsFromSolarPanels(buildings: Building[]) {
    buildings.forEach(building => {
      this.production = building.solarPanelAmount * this.productionPerSolarPanel;
      this.goldIncome = building.solarPanelAmount * this.goldIncomePerSolarPanel;
      this.researchIncome = building.solarPanelAmount * this.researchIncomePerSolarPanel;
      this.environmentalScore = building.solarPanelAmount * this.environmentalScorePerSolarPanel;
    });
  }

  toggleCapacityModalOpen() {
    this.isCapacityModalOpen = !this.isCapacityModalOpen;
  }
}
