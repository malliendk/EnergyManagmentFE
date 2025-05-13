import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {BuildingService} from "../services/building.service";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {CommonModule} from "@angular/common";
import {Tile} from "../dtos/tile";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingViewComponent]
})
export class BuildingDashboardComponent implements OnInit {

  @ViewChild(BuildingViewComponent) buildingViewComponent?: BuildingViewComponent

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() allBuildings?: Building[];
  @Input() receivingViewType!: string;
  @Output() passGameDTOToTopLevel = new EventEmitter<ExtendedGameDTO>();

  building: Building | null = null;
  // tiles!: Tile[];

  ownedBuildingsView: string = 'overview';
  purchaseView: string = 'purchase';

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.receivingViewType = this.ownedBuildingsView;
    this.buildingService.getAll()
      .subscribe(buildings => this.allBuildings = buildings);
  }

  updateBuildings(purchase: { building: Building; tile: Tile }): void {
    const purchasedBuilding: Building = purchase.building;
    const selectedTile: Tile = purchase.tile;
    this.replaceTileInGameDTO(selectedTile);
    this.buildingService.processPurchasedBuilding(purchasedBuilding, this.gameDTO);
    this.passGameDTOToTopLevel.emit(this.gameDTO);
    if (this.buildingViewComponent) {
      this.buildingViewComponent.building = null;
    }
    setTimeout(() => {
      this.receivingViewType = this.ownedBuildingsView;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  }

  private replaceTileInGameDTO(newTile: Tile) {
    const index = this.gameDTO.tiles.findIndex(tile => tile.id === newTile.id);
    if (index !== -1) {
      this.gameDTO.tiles[index] = newTile;
    } else {
      console.log('Tile with the specified ID not found.');
    }
  }


  updatePurchasedSolarSets(purchasedSet: { building: Building, totalCost: number }) {
    this.gameDTO.funds -= purchasedSet.totalCost;
    this.gameDTO.buildings.forEach(building => {
      if (building.instanceId === purchasedSet.building.instanceId) {
        building.solarPanelAmount = purchasedSet.building.solarPanelAmount
      }
    })
    this.passGameDTOToTopLevel.emit(this.gameDTO);
  }

  updateHeldBuildingsOverview() {
    if (this.buildingViewComponent) {
      this.buildingViewComponent.groupBuildingsById(this.gameDTO.buildings);
    }
  }

  getBuildingViewType(emittedValue: string) {
    this.receivingViewType = emittedValue;
  }
}
