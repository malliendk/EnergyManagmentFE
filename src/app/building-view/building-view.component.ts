import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Building} from '../dtos/building';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {
  PurchaseSolarpanelsHousingComponent
} from "../purchase-solarpanels-housing/purchase-solarpanels-housing.component";
import {BuildingService} from "../services/building.service";

@Component({
  selector: 'app-building-view',
  templateUrl: './building-view.component.html',
  styleUrls: ['./building-view.component.css'],
  standalone: true,
  imports: [CommonModule, PurchaseSolarpanelsHousingComponent]
})
export class BuildingViewComponent implements OnInit {

  @Input() viewType: string = '';
  @Input() buildings!: Building[];
  @Output() passSolarPanelPurchase = new EventEmitter<{
    building: Building, totalCost: number
  }>();
  @Output() passBuilding = new EventEmitter<Building>();
  @Output() passViewType = new EventEmitter<string>();

  buildingMap!: { buildingToDisplay: Building, heldBuildings: Building[] }[];
  isHeldBuildingsView: boolean = false;
  selectedHeldBuildings: Building[] = [];
  building!: Building | null;
  isDetailView: boolean = false;
  categoryPowerPlant: string = "Energiecentrale";
  categoryHousing: string = 'Woning';
  categoryPublicBuilding: string = "Openbare voorziening";

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit(): void {
    if (this.buildings) {
      this.groupBuildingsById(this.buildings);
    }
  }

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.buildings.find(building => building.id === id) || null;
    console.log('this.building:', this.building);
  }

  purchaseBuilding(building: Building) {
    this.passBuilding.emit(building);
  }

  onSolarPanelsPurchase(purchaseData: { amountOfSolarPanels: number, totalCost: number }) {
    this.building!.solarPanelAmount = purchaseData.amountOfSolarPanels;
    this.passSolarPanelPurchase.emit({building: this.building!, totalCost: purchaseData.totalCost});
  }

  groupBuildingsById(buildings: Building[]) {
    let buildingMap: Map<number, Building[]> = new Map<number, Building[]>();
    buildings.forEach(building => {
      if (!buildingMap.has(building.id)) {
        buildingMap.set(building.id, []);
      }
      buildingMap.get(building.id)!.push(building);
    });
    console.log('grouping method activated with buildings: {}', buildings);
    this.buildingMap = Array.from(buildingMap).map(
      ([id, buildings]): { buildingToDisplay: Building, heldBuildings: Building[] } => ({
        buildingToDisplay: buildings[0],
        heldBuildings: buildings
      })
    );
  }

  toggleHeldBuildings(entrySet: { buildingToDisplay: Building, heldBuildings: Building[] }) {
    this.selectedHeldBuildings = entrySet.heldBuildings;
    if ((entrySet.buildingToDisplay.category === this.categoryHousing ||
        entrySet.buildingToDisplay.category === this.categoryPublicBuilding)
      && this.selectedHeldBuildings.length > 1) {
      this.isHeldBuildingsView = true;
    } else {
      this.building = entrySet.buildingToDisplay;
      this.isDetailView = true;
    }
  }

  backToMainView() {
    this.isHeldBuildingsView = false;
    this.selectedHeldBuildings = [];
  }

  cancelDetailView() {
    this.isDetailView = false;
    this.building = null;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }
}
