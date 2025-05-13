import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Building} from "../dtos/building";
import {NgClass} from "@angular/common";
import {District} from "../dtos/district";
import {DistrictService} from "../services/district.service";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";

@Component({
  selector: 'app-grid',
  imports: [
    NgClass
  ],
  templateUrl: './grid.component.html',
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() gameDTO!: ExtendedGameDTO;
  @Input() building?: Building | undefined;
  @Output() passSelectedTile = new EventEmitter<Tile>();
  @Input() isPurchasing: boolean = false;
  districts!: District[];
  tiles!: Tile[];
  tile!: Tile;
  selectedTileId: number = 0;
  activeTile: Tile | null = null;
  tooltipX: number = 0;
  tooltipY: number = 0;
  isTutorial: boolean = false;
  isInitialized: boolean = false;

  constructor(private districtService: DistrictService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.districts = this.gameDTO.districts;
    this.tiles = this.gameDTO.tiles;
    this.tile = {id: 0, buildingId: 0, building: null, districtId: 0};
    this.buildingService.addBuildingsToTiles(this.gameDTO.buildings, this.districts);
    console.log('districts: {}', this.gameDTO.districts);
    this.isInitialized = true;
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
    return this.selectedTileId === tileId ? 'tile-selected' : '';
  }

  selectTileValues(id: number, buildingId: number, building: Building) {
    const selectedTile = this.tiles.find(tile => tile.id === id);
    if (selectedTile && !selectedTile.building) {
      this.tile.id = id;
      this.tile.buildingId = buildingId;
      this.tile.building = building;
      console.log('selectTileValues', this.tile);
      this.selectedTileId = id;
    } else {
      console.log('Tile already has a building and cannot be selected.');
    }
  }

  emitSelectedTile() {
    this.passSelectedTile.emit(this.tile);
    console.log('emitting tile: {}', this.tile);
  }

  createNewDistrict(){
  }

  ngOnDestroy() {
    this.isInitialized = false;
  }
}
