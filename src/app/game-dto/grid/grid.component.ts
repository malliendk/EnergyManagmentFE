import {Component, OnInit} from '@angular/core';
import {BuildingDTO} from "../../dtos/buildingDTO";
import {NgClass} from "@angular/common";
import {FullGameDTO} from "../../dtos/fullGameDTO";
import {Tile} from "../../dtos/tile";
import {TileService} from "../../services/tile.service";
import {ModalComponent} from "../../components/modal/modal.component";
import {PurchaseService} from "../../services/purchase.service";
import {COAL_TILE_ERROR} from "../../ErrorMessages";
import {ColorService} from "../../services/color.service";
import {Subscription} from "rxjs";
import {GameDTOService} from "../../services/game-dto.service";
import {TileBuildingService} from "../../services/tile-building.service";
import {EventDTO} from "../../dtos/eventDTO";
import {BuildingService} from "../../services/building.service";
import {POWER_LINE_ID} from "../../power-line-values";
import {TILE_TYPE_POWER_PLANT} from "../../constants";


@Component({
  selector: 'app-grid',
  imports: [
    NgClass,
    ModalComponent,
  ],
  templateUrl: './grid.component.html',
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit{

  private resizeObserver: ResizeObserver | null = null;

  private gameDTOSubscription = new Subscription()
  private tileSubscription = new Subscription();

  gameDTO!: FullGameDTO;
  tile: Tile | undefined = undefined
  event?: EventDTO;
  building: BuildingDTO | undefined = undefined;
  powerLine!: BuildingDTO;

  coalErrorMessage: string = '';
  isPowerLineModalOpen = false
  showPurchasePowerLine = false;

  constructor(private gameDTOService: GameDTOService,
              private colorService: ColorService,
              private purchaseService: PurchaseService,
              private tileService: TileService,
              private tileBuildingService: TileBuildingService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.addGameDTOSubscription()
    this.addTileSubscription()
    this.selectPowerLine()
  }

  addGameDTOSubscription() {
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe((initialGameDTO: FullGameDTO | null) => {
          this.gameDTO = initialGameDTO!
          this.powerLine = initialGameDTO!.buildings.find(building => building.id === POWER_LINE_ID)!
          this.setTilesAndBuildings()
        }))
  }

  addTileSubscription() {
    this.tileSubscription.add(
      this.tileService.tile$
        .subscribe(tile => this.tile = tile)
    )
  }

  // ngAfterViewInit() {
  //   const gridElement = document.querySelector('.grid');
  //   if (gridElement) {
  //     this.resizeObserver = new ResizeObserver(() => {
  //       this.tileService.calculateTileWidth.call(this);
  //     });
  //     this.resizeObserver.observe(gridElement);
  //   } else {
  //     this.tileService.calculateTileWidth.call(this);
  //     window.addEventListener('resize', this.tileService.calculateTileWidth.bind(this));
  //   }
  // }

  private setTilesAndBuildings() {
    this.gameDTO.tiles
    this.tileBuildingService.addBuildingsToTiles(this.gameDTO.buildings, this.gameDTO.tiles)
  }

  onTileSelect(tile: Tile) {
    if (tile.zoneType === TILE_TYPE_POWER_PLANT) {
      this.coalErrorMessage = COAL_TILE_ERROR;
      return;
    }
    if (tile.building) {
      this.buildingService.setBuilding(tile.building)
      this.tileService.setTile(tile)
    } else {
      this.tileService.setTile(tile)
      this.buildingService.setBuilding(undefined)
      console.log('selecting tile: {}', this.tile)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTileColor(tile: Tile): string {
    return this.tileService.setTileColor(tile);
  }

  setPowerLinesColor(tile: Tile) {
    return this.colorService.setPowerLinesColor(tile)
  }

  setTileSelected(tile: Tile): string {
    return this.tile ? this.colorService.setSelectedTile(tile, this.tile!.id) : ''
  }

  selectPowerLine() {
    this.buildingService.findAll()
      .subscribe(buildings =>
        this.powerLine = buildings.find(building => building.id === POWER_LINE_ID)!)
  }

  resetCoalModal() {
    this.coalErrorMessage = ''
  }
}




