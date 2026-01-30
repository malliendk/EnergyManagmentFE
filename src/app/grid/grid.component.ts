import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Building} from "../dtos/building";
import {NgClass, NgStyle} from "@angular/common";
import {District} from "../dtos/district";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";
import {EventDTO} from "../services/eventDTO";
import {TileService} from "../services/tile.service";
import {AdjacencySet} from "../dtos/adjacencySet";
import {ValidationService} from "../services/validation.service";
import {DistrictService} from "../services/district.service";
import {BuildingViewComponent} from "../components/building-view/building-view.component";
import {ModalComponent} from "../components/modal/modal.component";
import {BuildingInfoComponent} from "../components/building-info/building-info.component";
import {DistrictInfoComponent} from "../components/district-info/district-info.component";


@Component({
  selector: 'app-grid',
  imports: [
    NgStyle,
    NgClass,
    BuildingViewComponent,
    ModalComponent,
    BuildingInfoComponent,
    DistrictInfoComponent
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
  activeTile: Tile | null = null;
  allBuildings!: Building[];
  adjacencySets!: AdjacencySet[];
  showBuildingSelectedModal: boolean = false;
  viewBuildingDetail: boolean = false;

  private stackedAdjacencyEffects: Map<number, {
    totalEffect: number,
    affectedProperty: string,
    effectsByProperty: Map<string, number>
  }> = new Map();
  tileAdjacencyEffects: Map<number, Array<{ effect: number, property: string }>> = new Map();

  private originalBuildingStats: {
    popularityIncome: number;
    goldIncome: number;
    researchIncome: number;
  } | null = null;

  tooltipX: number = 0;
  tooltipY: number = 0;

  isPurchaseModalOpen: boolean = false;
  isBuildingSelected: boolean = false;
  isDetailView: boolean = false;
  isFundsModalOpen: boolean = false;
  isCapacityModalOpen: boolean = false;
  isHousingModalOpen: boolean = false;

  housingErrorMessage: string = '';
  notEnoughHousingText: string = 'Je stad heeft niet genoeg inwoners om dit gebouw te kunnen bouwen';
  buildingAlreadyInDistrictText: string = 'Je mag maar één ' + this.building?.name + 'per district bouwen';
  notEnoughHousingExtraText: string = 'Je stad heeft niet genoeg inwoners om nóg een ' + this.building?.name + 'te kunnen bouwen';
  noBuildingSelectedText: string = 'Selecteer een gebouw';

  modalCustomWidth = 'width-90';
  buildingInfoWidth = '400px';

  isDataReady: boolean = false;


  constructor(private tileService: TileService,
              private buildingService: BuildingService,
              private validationService: ValidationService,
              private districtService: DistrictService) {
  }

  ngOnInit() {
    this.districts = this.gameDTO.districts;
    this.tiles = this.tileService.collectAllTiles(this.gameDTO);
    this.reinitializeTile();
    this.tileService.addBuildingsToTiles(this.gameDTO.buildings, this.districts);
    this.findAllBuildings();
    console.log('districts: {}', this.gameDTO.districts);
    this.tileService.findAllAdjacencySets()
      .subscribe((sets: AdjacencySet[]) => this.adjacencySets = sets);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameDTO'] && changes['gameDTO'].currentValue) {
      this.districts = this.gameDTO.districts;
    }
  }

  reinitializeTile() {
    this.tile = {id: 0, buildingId: 0, building: null, districtId: 0, adjacencySet: undefined};
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

  createNewDistrict() {
    this.districtService.createDistrict(this.gameDTO);
  }

  hideTooltip() {
    this.activeTile = null;
  }

  toggleSelectedTile(tileId: number) {
    return this.tile.id === tileId ? 'tile-selected' : '';
  }

  applyStatusColor(district: District) {
    const stressLevel = district.stressLevel;
    if (stressLevel > 0.5) {
      return 'status-blackout';
    } else if (stressLevel > 0.3 && stressLevel <= 0.5) {
      return 'status-critical';
    } else if (stressLevel > 0.1 && stressLevel <= 0.3) {
      return 'status-danger';
    } else if (stressLevel > 0 && stressLevel <= 0.1) {
      return 'status-warning';
    } else {
      return '';
    }
  }

  initializePurchase(tile: Tile) {
    if (!tile.building) {
      console.log('initializing purchase');
      this.tile = tile;
      this.district = this.gameDTO.districts.find(d => d.id === tile.districtId);
      this.togglePurchaseModal();
      console.log('this.tile: {}', this.tile);
      if (this.event) {
        this.passTile.emit(tile);
      }
    } else {
      this.building = tile.building;
      this.toggleBuildingDetailView();
    }
  }

  purchaseBuilding(tile: Tile) {
    if (this.verifyPurchase()) {
      tile.building = this.building!;
      tile.buildingId = this.building!.id;

      this.gameDTO.buildings.push(tile.building);
      this.buildingService.processPurchasedBuilding(tile.building, this.gameDTO);
      this.passUpdatedGameDTO.emit(this.gameDTO);
      this.isPurchaseModalOpen = false;
      this.building = null;
      this.reinitializeTile();
      this.tileAdjacencyEffects.clear();
    }
  }


  verifyPurchase(): boolean {
    if (!this.validationService.validateFunds(this.gameDTO, this.building!)) {
      this.toggleBuildingModal();
      console.log('no money');
      return false;
    }
    if (!this.building?.gridCapacity && !this.validationService.validateGridCapacity(this.district!, this.building!)) {
      this.toggleCapacityModal();
      console.log('no grid capacity')
      return false;
    }
    return this.verifyPublicBuilding(this.building!);
  }

  verifyPublicBuilding(building: Building): boolean {
    if (!building || !this.gameDTO) return false;
    if (building.category !== 'Openbare voorziening') {
      return true;
    }
    const totalHousing = this.gameDTO.districts.reduce((sum, district) => sum + district.housing, 0);
    let totalSameBuildings = 0;
    let sameBuildingInCurrentDistrict = false;
    for (const district of this.gameDTO.districts) {
      const buildingsInDistrict = district.tiles
        .map(tile => tile.building)
        .filter(b => b !== null && b !== undefined);
      const sameBuildings = buildingsInDistrict.filter(b => b.name === building.name);
      totalSameBuildings += sameBuildings.length;
      if (this.district && district.id === this.district.id && sameBuildings.length > 0) {
        sameBuildingInCurrentDistrict = true;
      }
    }
    if (totalHousing < building.housingRequirement) {
      this.housingErrorMessage = this.notEnoughHousingText;
      this.toggleHousingModal();
      return false;
    }
    if (sameBuildingInCurrentDistrict) {
      this.housingErrorMessage = this.buildingAlreadyInDistrictText;
      this.toggleHousingModal();
      return false;
    }
    const requiredHousing = (totalSameBuildings + 1) * building.housingRequirement;
    if (totalHousing < requiredHousing) {
      this.housingErrorMessage = this.notEnoughHousingExtraText;
      this.toggleHousingModal();
      return false;
    }
    return true;
  }

  selectBuilding(building: Building) {
    this.restorePreviousBuildingStats();
    this.clearAllAdjacencyEffects();
    this.building = building;
    this.storeOriginalBuildingStats(building);
    this.isBuildingSelected = true;
    this.setAdjacencyEffects(building);
    if (this.tile && this.tile.adjacencySet) {
      this.applyStackedAdjacencyEffectsToSelectedBuilding();
    }
  }

  changeSelectedTile(tile: Tile, selectedBuilding: Building) {
    if (!tile.building) {
      console.log('changing tile selection, tile ID: {}', tile.id);
      this.restorePreviousBuildingStats();
      this.tile = tile;
      this.clearAllAdjacencyEffects();
      this.setAdjacencyEffects(selectedBuilding);
      if (this.tile && this.tile.adjacencySet) {
        this.applyStackedAdjacencyEffectsToSelectedBuilding();
      }
      if (this.event) {
        this.passTile.emit(tile);
      }
    }
  }


  private storeOriginalBuildingStats(building: Building) {
    this.originalBuildingStats = {
      popularityIncome: building.popularityIncome,
      goldIncome: building.goldIncome,
      researchIncome: building.researchIncome
    };
  }

  private restorePreviousBuildingStats() {
    if (this.building && this.originalBuildingStats) {
      this.building.popularityIncome = this.originalBuildingStats.popularityIncome;
      this.building.goldIncome = this.originalBuildingStats.goldIncome;
      this.building.researchIncome = this.originalBuildingStats.researchIncome;
    }
  }

  private clearAllAdjacencyEffects() {
    this.stackedAdjacencyEffects.clear();
    this.tileAdjacencyEffects.clear();
    if (this.district && this.district.tiles) {
      this.district.tiles.forEach(tile => {
        tile.adjacencySet = undefined;
      });
    }
  }

  private setAdjacencyEffects(buildingToPurchase: Building) {
    console.log('buildingToPurchase: {}', buildingToPurchase);
    this.stackedAdjacencyEffects.clear();
    this.district!.tiles.forEach(tile => {
      tile.adjacencySet = undefined;
    });
    this.district!.tiles.forEach((tile, index) => {
      if (!tile.building) {
        return;
      }
      const matchingAdjacencySet = this.findAdjacencySet(buildingToPurchase, tile.building);
      if (!matchingAdjacencySet) {
        return;
      }
      const relevantAdjacentTiles: Tile[] = this.getAdjacentTiles(index);
      if (relevantAdjacentTiles.length === 0) {
        return;
      }
      relevantAdjacentTiles.forEach(adjacentTile => {
        if (!adjacentTile.building) {
          this.addStackedEffect(adjacentTile, matchingAdjacencySet);
        }
      });
      if (matchingAdjacencySet.hasAreaEffect) {
        this.district!.tiles.forEach(areaEffectTile => {
          if (!areaEffectTile.building) {
            this.addStackedEffect(areaEffectTile, matchingAdjacencySet);
          }
        });
      }
    });
  }

  private addStackedEffect(tile: Tile, adjacencySet: AdjacencySet) {
    let stackedEffect = this.stackedAdjacencyEffects.get(tile.id);
    if (!stackedEffect) {
      stackedEffect = {
        totalEffect: 0,
        affectedProperty: adjacencySet.affectedProperty,
        effectsByProperty: new Map()
      };
      this.stackedAdjacencyEffects.set(tile.id, stackedEffect);
    }
    const currentEffect = stackedEffect.effectsByProperty.get(adjacencySet.affectedProperty) || 0;
    stackedEffect.effectsByProperty.set(adjacencySet.affectedProperty, currentEffect + adjacencySet.effect);
    stackedEffect.totalEffect = Array.from(stackedEffect.effectsByProperty.values())
      .reduce((sum, effect) => sum + effect, 0);
    tile.adjacencySet = {
      buildingName1: adjacencySet.buildingName1,
      buildingName2: adjacencySet.buildingName2,
      affectedProperty: adjacencySet.affectedProperty,
      effect: stackedEffect.totalEffect,
      hasAreaEffect: adjacencySet.hasAreaEffect,
      canBeConsumed: adjacencySet.canBeConsumed
    };
  }

  applyStackedAdjacencyEffectsToSelectedBuilding() {
    if (!this.building || !this.tile) return;

    // Restore original stats before applying effects
    console.log('original building stats: {}', this.originalBuildingStats)
    this.restorePreviousBuildingStats();

    const stackedEffect = this.stackedAdjacencyEffects.get(this.tile.id);
    if (!stackedEffect) return;
    console.log('stackedEffect: {}', stackedEffect)

    // Apply each individual property effect
    stackedEffect.effectsByProperty.forEach((effect, property) => {
      switch (property) {
        case "popularityIncome":
          this.building!.popularityIncome += effect;
          console.log('affected income type: {}', stackedEffect.affectedProperty)
          break;
        case "goldIncome":
          this.building!.goldIncome += effect;
          break;
        case "researchIncome":
          this.building!.researchIncome += effect;
          break;
        default:
          console.warn(`Unknown affected property: ${property}`);
      }
    });
  }

  findAdjacencySet(buildingA: Building, buildingB: Building): AdjacencySet | undefined {
    return this.adjacencySets.find(set =>
      (set.buildingName1 === buildingA.name && set.buildingName2 === buildingB.name) ||
      (set.buildingName1 === buildingB.name && set.buildingName2 === buildingA.name)
    );
  }

  getAdjacentTiles(index: number, rows: number = 3, cols: number = 4): Tile[] {
    const adjacentIndices: number[] = [];
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (row > 0) {
      adjacentIndices.push(index - cols);
    }
    if (row < rows - 1) {
      adjacentIndices.push(index + cols);
    }
    if (col > 0) {
      adjacentIndices.push(index - 1);
    }
    if (col < cols - 1) {
      adjacentIndices.push(index + 1);
    }
    console.log(adjacentIndices)
    return adjacentIndices.map(i => this.district!.tiles[i]);
  }

  showAdjacencyEffect(tile: Tile): number {
    return tile.adjacencySet!.effect;
  }

  decideColor(tile: Tile): string {
    console.log('tile to decide color for: {}', tile)
    const adjacencySet = tile.adjacencySet!;
    switch (adjacencySet.affectedProperty) {
      case "popularityIncome":
        return "popularity-color";
      case "goldIncome":
        return "funds-color";
      case "researchIncome":
        return "research-color";
      default:
        return '';
    }
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
    this.tileAdjacencyEffects.clear();
  }

  togglePurchaseModal() {
    this.isPurchaseModalOpen = !this.isPurchaseModalOpen;
  }

  toggleCapacityModal() {
    this.isCapacityModalOpen = !this.isCapacityModalOpen;
  }

  toggleBuildingModal() {
    this.isFundsModalOpen = !this.isFundsModalOpen;
  }

  toggleHousingModal() {
    this.isHousingModalOpen = !this.isHousingModalOpen
  }

  toggleBuildingSelectedModal() {
    this.showBuildingSelectedModal = !this.showBuildingSelectedModal;
  }

  applyTileColor(): string {
    if (this.event || this.isPurchaseModalOpen) {
      return 'tile-grey';
    }
    return 'tile-pink';
  }

}




