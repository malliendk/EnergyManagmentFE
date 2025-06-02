import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {BuildingService} from "../services/building.service";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {CommonModule} from "@angular/common";
import {Tile} from "../dtos/tile";
import {DistrictInfoComponent} from "../district-info/district-info.component";
import {GridComponent} from "../grid/grid.component";
import {TileService} from "../services/tile.service";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingViewComponent, DistrictInfoComponent, GridComponent]
})
export class BuildingDashboardComponent implements OnInit {

  @ViewChild(BuildingViewComponent) buildingViewComponent?: BuildingViewComponent

  @Input() gameDTO!: ExtendedGameDTO;
  @Output() passGameDTOToTopLevel = new EventEmitter<ExtendedGameDTO>();

  heldBuildings!: Building[];
  groupedBuildings: {building: Building, count: number, id: string}[] = [];

  building: Building | null = null;
  tiles!: Tile[];
  isDetailView: boolean = false;

  constructor(private tileService: TileService) {
  }

  ngOnInit() {
    this.heldBuildings = this.gameDTO.buildings;
    if (this.heldBuildings) {
      this.groupedBuildings = this.groupBuildingsById(this.heldBuildings);
    }
    this.tiles = this.tileService.collectAllTiles(this.gameDTO);
  }

  toggleDetailView(building: Building | null) {
    this.isDetailView = !this.isDetailView;
    this.building = building;
  }

  groupBuildingsById(buildings: Building[]): {building: Building, count: number, id: string}[] {
    // Use number as key type since buildingId is a number
    const buildingMap = new Map<number, {building: Building, count: number}>();

    buildings.forEach(building => {
      const buildingId = building.id;
      // Convert to string when checking to ensure proper comparison
      if (buildingMap.has(buildingId)) {
        buildingMap.get(buildingId)!.count++;
      } else {
        buildingMap.set(buildingId, {building, count: 1});
      }
    });

    // Convert map to array with unique IDs for tracking
    return Array.from(buildingMap.values()).map((entry, index) => ({
      ...entry,
      id: `${entry.building.id}-${index}` // Create a unique ID for tracking
    }));
  }

  updateGameDTO(gameDTO: ExtendedGameDTO): void {
    this.passGameDTOToTopLevel.emit(gameDTO);
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
}
