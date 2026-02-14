import {Component, OnInit} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {Subscription} from "rxjs";
import {TileService} from "../services/tile.service";
import {Tile} from "../dtos/tile";
import {NgClass, NgStyle} from "@angular/common";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {FullGameDTO} from "../dtos/fullGameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {PurchaseService} from "../services/purchase.service";
import {ModalComponent} from "../components/modal/modal.component";
import {BuildingService} from "../services/building.service";
import {TileBuildingService} from "../services/tile-building.service";

@Component({
  selector: 'app-building-list',
  imports: [
    NgStyle,
    BuildingInfoComponent,
    NgClass,
    ModalComponent
  ],
  templateUrl: './building-list.component.html',
  standalone: true,
  styleUrl: './building-list.component.css'
})
export class BuildingListComponent implements OnInit {

  private tileSubscription = new Subscription()
  private gameDTOSubscription = new Subscription()

  tile!: Tile
  gameDTO!: FullGameDTO
  building?: BuildingDTO
  buildings!: BuildingDTO[]
  purchasableTileBuildings: BuildingDTO[] = [];
  noBuildingSelected: string = "";
  validationError: string = "";

  constructor(private tileService: TileService,
              private buildingService: BuildingService,
              private tileBuildingService: TileBuildingService,
              private gameDTOService: GameDTOService,
              private purchaseService: PurchaseService) {
  }

  ngOnInit() {
    this.addTileSubscription()
    this.addGameDTOSubscription()
    this.findAllBuildings()
    console.log(this.tile)
  }

  addTileSubscription() {
    this.tileSubscription.add(
      this.tileService.tile$
        .subscribe(tile => {
          this.tile = tile!
          this.purchasableTileBuildings = this.tileBuildingService.filterBuildingsByZoneType(this.buildings, tile!)
        })
    )
  }

  addGameDTOSubscription() {
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(gameDTO => this.gameDTO = gameDTO!)
    )
  }

  findAllBuildings() {
    this.buildingService.findAll()
      .subscribe(buildings => {
        console.log('building: {}', buildings)
        this.buildings = buildings
        this.purchasableTileBuildings = this.tileBuildingService.filterBuildingsByZoneType(buildings, this.tile)
      })
  }

  selectBuilding(building: BuildingDTO) {
    this.building = building
  }

  setBuildingSelected(id: number): string {
    if (this.building) {
      return id === this.building!.id ? '' : ''
    }
    return ''
  }

  purchaseBuilding(buildingDTO: BuildingDTO, tile: Tile, gameDTO: FullGameDTO) {
    const possibleError = this.purchaseService.validateBuilding(buildingDTO, gameDTO)
    if (possibleError) {
      this.validationError = possibleError
    }
    this.purchaseService.purchaseBuilding(buildingDTO, tile, gameDTO)
      .subscribe((updatedDTO: FullGameDTO) => {
        this.gameDTOService.setGameDTO(updatedDTO)
        this.resetTileAndBuilding()
      })
  }

  resetTileAndBuilding() {
    this.tileService.setTile(undefined)
    this.buildingService.setBuilding(undefined)
  }

  resetValidationError() {
    this.validationError = ''
  }
}
