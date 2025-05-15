import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Building} from "../dtos/building";
import {NgClass, NgForOf, NgStyle} from "@angular/common";
import {District} from "../dtos/district";
import {DistrictService} from "../services/district.service";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";
import {ModalComponent} from "../modal/modal.component";
import {
  PurchaseSolarpanelsHousingComponent
} from "../purchase-solarpanels-housing/purchase-solarpanels-housing.component";
import {BuildingViewComponent} from "../building-view/building-view.component";

@Component({
  selector: 'app-grid',
  imports: [
    NgStyle,
    NgClass,
    BuildingViewComponent,
    ModalComponent
  ],
  templateUrl: './grid.component.html',
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit {
  @Input() gameDTO!: ExtendedGameDTO;
  @Input() building?: Building | undefined;
  @Input() isPurchasing: boolean = false;
  @Output() passSelectedTile = new EventEmitter<Tile>();
  districts!: District[];
  district?: District;
  tiles!: Tile[];
  tile!: Tile;
  allBuildings!: Building[];
  selectedTileId: number = 0;
  activeTile: Tile | null = null;
  tooltipX: number = 0;
  tooltipY: number = 0;
  isPurchaseModalOpen: boolean = false;
  isBuildingSelected: boolean = false;
  isDetailView: boolean = false;
  modalCustomWidth = 'width-90';

  constructor(private districtService: DistrictService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.districts = this.gameDTO.districts;
    this.tiles = this.collectAllTiles(this.gameDTO);
    this.tile = {id: 0, buildingId: 0, building: null, districtId: 0};
    this.buildingService.addBuildingsToTiles(this.gameDTO.buildings, this.districts);
    this.findAllBuildings();
    console.log('districts: {}', this.gameDTO.districts);
  }

  findAllBuildings() {
    this.buildingService.findAll()
      .subscribe(buildings => this.allBuildings = buildings);
  }

  showTooltip(tile: Tile, event: MouseEvent) {
    this.activeTile = tile;
    this.tooltipX = event.clientX + 50;
    this.tooltipY = event.clientY + 400;
  }

  hideTooltip() {
    this.activeTile = null;
  }

  toggleSelectedTile(tileId: number) {
    return this.tile.id === tileId ? 'tile-selected' : '';
  }

  collectAllTiles(gameDTO: ExtendedGameDTO): Tile[] {
    return this.buildingService.collectAllTiles(gameDTO);
  }

  emitSelectedTile() {
    this.passSelectedTile.emit(this.tile);
    console.log('emitting tile: {}', this.tile);
  }

  applyStatusColor(district: District) {
    if (district.gridLoad > 1) {
      return 'status-critical';
    } else if (district.gridLoad > 0.85) {
      return 'status-danger';
    } else if (district.gridLoad > 0.7) {
      return 'status-warning';
    } else {
      return '';
    }
  }

  initializePurchase(tile: Tile) {
    console.log('ínitializing purchase');
    this.isPurchaseModalOpen = true;
    this.tile = tile;
    this.district = this.districts.find(district => district.id === tile.districtId);
  }

  selectBuilding(building: Building) {
    this.isBuildingSelected = true;
    this.building = building;
  }

  toggleSelectedBuilding(buildingId: number) {
    return this.building?.id === buildingId ? 'building-selected' : '';
  }

  toggleBuildingDetailView() {
    this.isDetailView = !this.isDetailView;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }

  setModalWidth90(): string {
    return 'width-90';
  }
}
