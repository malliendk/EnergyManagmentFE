import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Building} from '../dtos/building';
import {CommonModule} from "@angular/common";
import {
  PurchaseSolarpanelsHousingComponent
} from "../purchase-solarpanels-housing/purchase-solarpanels-housing.component";
import {GridComponent} from "../grid/grid.component";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {Tile} from "../dtos/tile";

@Component({
  selector: 'app-building-view',
  templateUrl: './building-view.component.html',
  styleUrls: ['./building-view.component.css'],
  standalone: true,
    imports: [CommonModule, PurchaseSolarpanelsHousingComponent, GridComponent]
})
export class BuildingViewComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() viewType: string = '';
  @Input() buildings!: Building[];
  @Output() passSolarPanelPurchase = new EventEmitter<{
    building: Building, totalCost: number
  }>();
  @Output() passPurchase = new EventEmitter<{building: Building, tile: Tile}>();
  @Output() passViewType = new EventEmitter<string>();

  building!: Building | null;
  buildingMap!: { buildingToDisplay: Building, heldBuildings: Building[] }[];
  isHeldBuildingsView: boolean = false;
  isPurchasing = false;
  selectedHeldBuildings: Building[] = [];
  isDetailView: boolean = false;
  categoryPowerPlant: string = "Energiecentrale";
  categoryHousing: string = 'Woning';
  categoryPublicBuilding: string = "Openbare voorziening";

  constructor(private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    if (this.buildings) {
      this.groupBuildingsById(this.buildings);
    }
  }

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.buildings.find(building => building.id === id) || null;
    if (!this.building?.instanceId) {
      this.isPurchasing = true
    }
    console.log(this.isPurchasing);
    console.log('this.building:', this.building);
  }

  selectBuilding(building: Building) {
    // this.passBuilding.emit(building);
    this.isPurchasing = true;
  }

  confirmBuildingPurchase(tile: Tile) {
    this.passPurchase.emit({ building: this.building!, tile: tile });
    this.isPurchasing = false;
    this.isDetailView = false;
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
    this.isPurchasing = false;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }
}
