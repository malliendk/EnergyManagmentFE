import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Building} from "../dtos/building";
import {NgClass, NgStyle} from "@angular/common";
import {District} from "../dtos/district";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";
import {ModalComponent} from "../modal/modal.component";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {EventDTO} from "../services/eventDTO";
import {TileService} from "../services/tile.service";
import {AdjacencySet} from "../dtos/adjacencySet";


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
  activeTile: Tile | null = null;
  allBuildings!: Building[];
  adjacencySets!: AdjacencySet[];

  private stackedAdjacencyEffects: Map<number, {totalEffect: number, affectedProperty: string, effectsByProperty: Map<string, number>}> = new Map();
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
  isBuildingModalOpen: boolean = false;
  isCapacityModalOpen: boolean = false;

  modalCustomWidth = 'width-90';
  buildingInfoWidth = '400px';

  constructor(private tileService: TileService,
              private buildingService: BuildingService) {
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
      this.togglePurchaseModal();
      this.tile = tile;
      this.district = this.districts.find(district => district.id === tile.districtId);
      console.log('this.tile: {}', this.tile);
      console.log('this.building: {}', this.building);
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
      return;
    }

    if (this.building!.energyProduction > remainingGridCapacity ||
      this.building!.energyConsumption > remainingGridCapacity) {
      this.toggleCapacityModalOpen();
      return;
    }
    tile.building = this.building!;
    tile.buildingId = this.building!.id;

    // Apply adjacency effects to the purchased building
    this.gameDTO.buildings.push(tile.building);
    this.buildingService.processPurchasedBuilding(tile.building, this.gameDTO);
    this.passUpdatedGameDTO.emit(this.gameDTO);
    this.isPurchaseModalOpen = false;
    this.building = null;
    this.reinitializeTile();
    this.tileAdjacencyEffects.clear(); // Clear effects when purchase is complete
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
    // Restore previous building stats before switching
    this.restorePreviousBuildingStats();

    // Clear all adjacency effects before setting new ones
    this.clearAllAdjacencyEffects();

    // Set the new building and store its original stats
    this.building = building;
    this.storeOriginalBuildingStats(building);

    this.isBuildingSelected = true;


    // Set adjacency effects on tiles
    this.setAdjacencyEffects(building);


    // Apply the accumulated effect from the currently selected tile to the building
    if (this.tile && this.tile.adjacencySet) {
      this.applyAccumulatedAdjacencyEffectToBuilding();
    }
  }


  private applyAccumulatedAdjacencyEffectToBuilding() {
    if (!this.tile || !this.building) {
      return;
    }


    const stackedEffect = this.stackedAdjacencyEffects.get(this.tile.id);
    if (!stackedEffect) {
      return;
    }


    // Apply all accumulated effects by property type
    stackedEffect.effectsByProperty.forEach((effect, property) => {
      switch (property) {
        case "popularityIncome":
          this.building!.popularityIncome += effect;
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


    console.log('Applied stacked effects to building:', {
      buildingName: this.building.name,
      effectsApplied: Object.fromEntries(stackedEffect.effectsByProperty),
      newStats: {
        popularity: this.building.popularityIncome,
        gold: this.building.goldIncome,
        research: this.building.researchIncome
      }
    });
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


  changeSelectedTile(tile: Tile, selectedBuilding: Building) {
    if (!tile.building) {
      console.log('changing tile selection, tile ID: {}', tile.id);

      // Restore previous building stats before changing tiles
      this.restorePreviousBuildingStats();

      this.tile = tile;

      // Clear and recalculate adjacency effects
      this.clearAllAdjacencyEffects();
      this.setAdjacencyEffects(selectedBuilding);

      // Apply the accumulated effects from the new selected tile
      if (this.tile && this.tile.adjacencySet) {
        this.applyAccumulatedAdjacencyEffectToBuilding();
      }

      if (this.event) {
        this.passTile.emit(tile);
      }
    }
  }

  private clearAllAdjacencyEffects() {
    // Clear the stacked effects map
    this.stackedAdjacencyEffects.clear();

    // Clear the tile adjacency effects map (you have this one too)
    this.tileAdjacencyEffects.clear();

    // Clear adjacencySet from all tiles in the district
    if (this.district && this.district.tiles) {
      this.district.tiles.forEach(tile => {
        tile.adjacencySet = undefined;
      });
    }
  }


  private setAdjacencyEffects(buildingToPurchase: Building) {
    console.log('buildingToPurchase: {}', buildingToPurchase);


    // COMPLETELY clear all existing effects first
    this.stackedAdjacencyEffects.clear();
    this.district!.tiles.forEach(tile => {
      tile.adjacencySet = undefined; // Clear the display effect
    });


    // Now calculate all effects from scratch
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

      // Apply the adjacency effect only to tiles without buildings
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


    // Add to the specific property
    const currentEffect = stackedEffect.effectsByProperty.get(adjacencySet.affectedProperty) || 0;
    stackedEffect.effectsByProperty.set(adjacencySet.affectedProperty, currentEffect + adjacencySet.effect);

    // Calculate total effect (sum of all properties)
    stackedEffect.totalEffect = Array.from(stackedEffect.effectsByProperty.values())
      .reduce((sum, effect) => sum + effect, 0);


    // Update the tile's adjacencySet for display - create a new object each time
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
    this.restorePreviousBuildingStats();

    const stackedEffect = this.stackedAdjacencyEffects.get(this.tile.id);
    if (!stackedEffect) return;

    // Apply each individual property effect
    stackedEffect.effectsByProperty.forEach((effect, property) => {
      switch (property) {
        case "popularityIncome":
          this.building!.popularityIncome += effect;
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
    // this.restorePreviousBuildingStats(); // Restore stats when closing modal
    this.building = null;
    this.reinitializeTile();
    this.togglePurchaseModal();
    this.tileAdjacencyEffects.clear(); // Clear effects when modal is closed
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

  applyTileColor(): string {
    if (this.event || this.isPurchaseModalOpen) {
      return 'tile-grey';
    }
    return 'tile-pink';
  }
}




