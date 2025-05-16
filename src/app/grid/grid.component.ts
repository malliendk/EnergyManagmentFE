import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class GridComponent implements OnInit, OnChanges {
  @Input() gameDTO!: ExtendedGameDTO;
  @Input() building?: Building | null;
  @Output() passUpdatedGameDTO = new EventEmitter<ExtendedGameDTO>();
  districts!: District[];
  district?: District;
  tiles!: Tile[];
  tile!: Tile;
  allBuildings!: Building[];
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
    this.reinitializeTile();
    this.buildingService.addBuildingsToTiles(this.gameDTO.buildings, this.districts);
    this.findAllBuildings();
    console.log('districts: {}', this.gameDTO.districts);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameDTO'] && changes['gameDTO'].currentValue) {
      this.districts = this.gameDTO.districts;
    }
  }

  reinitializeTile() {
    this.tile = {id: 0, buildingId: 0, building: null, districtId: 0};
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
    if (!tile.building) {
      console.log('ínitializing purchase');
      this.togglePurchaseModal();
      this.tile = tile;
      this.district = this.districts.find(district => district.id === tile.districtId);
    }
  }

  purchaseBuilding(tile: Tile) {
      tile.building = this.building!;
      tile.buildingId = this.building!.id;
      console.log('building: {} in district {}', this.building, this.district);
      console.log('passing gameDTO: {}', this.gameDTO);
      this.gameDTO.buildings.push(this.building!)
      this.buildingService.processPurchasedBuilding(this.building!, this.gameDTO);
      this.passUpdatedGameDTO.emit(this.gameDTO);
      this.isPurchaseModalOpen = false;
      this.building = null;
      this.reinitializeTile();
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

  cancelDetailView() {
    this.isDetailView = false;
  }

  closePurchaseModal() {
    this.building = null;
    this.reinitializeTile();
    this.togglePurchaseModal();
  }

  togglePurchaseModal() {
    this.isPurchaseModalOpen = !this.isPurchaseModalOpen;
  }
}
