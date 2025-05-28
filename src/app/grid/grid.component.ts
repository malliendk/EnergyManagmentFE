import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Building} from "../dtos/building";
import {NgClass, NgStyle} from "@angular/common";
import {District} from "../dtos/district";
import {DistrictService} from "../services/district.service";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";
import {ModalComponent} from "../modal/modal.component";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {EventDTO} from "../services/eventDTO";

@Component({
  selector: 'app-grid',
  imports: [
    NgStyle,
    NgClass,
    BuildingViewComponent,
    ModalComponent,
    BuildingInfoComponent
  ],
  templateUrl: './grid.component.html',
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnChanges {
  @Input() gameDTO!: ExtendedGameDTO;
  @Input() building?: Building | null;
  @Input() event?: EventDTO;
  @Output() passUpdatedGameDTO = new EventEmitter<ExtendedGameDTO>();
  @Output() passTile = new EventEmitter<Tile>();
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
  buildingInfoWidth = '400px';
  isBuildingModalOpen: boolean = false;
  isCapacityModalOpen: boolean = false;

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
    const stressLevel = district.stressLevel;
    if (stressLevel > 0.5) {
      return 'status-blackout'; // Blackout condition (deep red)
    } else if (stressLevel > 0.3 && stressLevel <= 0.5) {
      return 'status-critical'; // Severe stress (dark orange/red)
    } else if (stressLevel > 0.1 && stressLevel <= 0.3) {
      return 'status-danger'; // Minor to Moderate stress (yellow to orange)
    } else if (stressLevel > 0 && stressLevel <= 0.1) {
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
      console.log(this.tile);
      console.log(this.building);
      if (this.event) {
        this.passTile.emit(tile);
      }
    }
  }

  purchaseBuilding(tile: Tile) {
    const remainingGridCapacity = this.getRemainingDistrictGridCapacity(this.district!);
    console.log('production/consumption and capacity: {} {}', this.building?.energyProduction, remainingGridCapacity);
    if (this.building!.price > this.gameDTO.funds) {
      this.toggleBuildingModalOpen();
    } else if (
      this.building!.energyProduction > remainingGridCapacity ||
      this.building!.energyConsumption > remainingGridCapacity
    ) {
      this.toggleCapacityModalOpen();
    } else {
      tile.building = this.building!;
      tile.buildingId = this.building!.id;
      const district = this.gameDTO.districts.find(d => d.id === tile.districtId);
      if (district) {
        const tileIndex = district.tiles.findIndex(t => t.id === tile.id);
        if (tileIndex !== -1) {
          district.tiles[tileIndex] = { ...tile }; //
        }
      }

      this.gameDTO.buildings.push(this.building!);
      this.buildingService.processPurchasedBuilding(this.building!, this.gameDTO);
      this.passUpdatedGameDTO.emit(this.gameDTO);
      this.isPurchaseModalOpen = false;
      this.building = null;
      this.reinitializeTile();
    }
  }


  private getRemainingDistrictGridCapacity(district: District): number {
    if (!district || !district.tiles) return 0;

    const totalGridCapacity = district.tiles
      .filter(tile => tile.building && tile.building.gridCapacity)
      .reduce((sum, tile) => sum + (tile.building!.gridCapacity || 0), 0);

    const totalEnergyProduction = district.tiles
      .filter(tile => tile.building && tile.building.energyProduction)
      .reduce((sum, tile) => sum + (tile.building!.energyProduction || 0), 0);

    const totalEnergyConsumption = district.tiles
      .filter(tile => tile.building && tile.building.energyConsumption)
      .reduce((sum, tile) => sum + (tile.building!.energyConsumption || 0), 0);

    const netDeficit = totalEnergyConsumption - totalEnergyProduction;
    const usedCapacity = netDeficit > 0 ? netDeficit : 0;

    return totalGridCapacity - usedCapacity;
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

  toggleCapacityModalOpen() {
    this.isCapacityModalOpen = !this.isCapacityModalOpen;
  }

  toggleBuildingModalOpen() {
    this.isBuildingModalOpen = !this.isBuildingModalOpen;
  }
}
