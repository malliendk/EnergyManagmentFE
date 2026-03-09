import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {Subscription} from "rxjs";
import {TileService} from "../services/tile.service";
import {Tile} from "../dtos/tile";
import {NgClass, NgStyle} from "@angular/common";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {GameDTO} from "../dtos/gameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {PurchaseService} from "../services/purchase.service";
import {ModalComponent} from "../components/modal/modal.component";
import {BuildingService} from "../services/building.service";
import {POWER_LINE_ID} from "../constants/constants";

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

  @Input() buildings!: BuildingDTO[];

  private subscription = new Subscription()

  tile!: Tile
  gameDTO!: GameDTO
  building?: BuildingDTO

  purchasableTileBuildings: BuildingDTO[] = [];
  noBuildingSelected: string = "";
  validationError: string = "";


  constructor(private tileService: TileService,
              private buildingService: BuildingService,
              private gameDTOService: GameDTOService,
              private purchaseService: PurchaseService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.addTileSubscription()
    this.addGameDTOSubscription()
    this.addBuildingSubscription()
  }

  addTileSubscription() {
    this.subscription.add(
      this.tileService.tile$
        .subscribe((tile: Tile | undefined) => {
          if (tile) {
            this.tile = tile
            this.filterBuildings(this.buildings, this.tile)
          }}))
  }

  addGameDTOSubscription() {
    this.subscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(gameDTO => {
          this.gameDTO = gameDTO!
        }))
  }

  addBuildingSubscription() {
    this.subscription.add(
      this.buildingService.building$
        .subscribe(building => {
          this.building = building
        }))
  }

  filterBuildings(buildings: BuildingDTO[], tile: Tile): void {
    this.purchasableTileBuildings = this.buildingService.filterBuildingsByZoneType(buildings, tile)
  }

  selectBuilding(building: BuildingDTO) {
    this.building = building
  }

  setBuildingSelected(id: number): string {
    if (this.building) {
      return id === this.building!.id ? 'building-selected' : ''
    }
    return ''
  }

  purchaseBuilding(building: BuildingDTO, tile: Tile, gameDTO: GameDTO) {
    console.log(building, tile, gameDTO)
    if (building.id == POWER_LINE_ID) {
      this.purchaseService.purchasePowerline(tile, gameDTO)
        .subscribe({
          next: (updatedDTO: GameDTO) => {
            this.gameDTOService.setGameDTO(updatedDTO)
            console.log('successfully purchased powerline')
          },
          error: err => {
            console.error('error purchasing powerline: {}', building, err)
            this.validationError = err.error.message
          }
        })
    } else {
      this.purchaseService.purchaseBuilding(building, tile, gameDTO)
        .subscribe({
          next: (updatedDTO: GameDTO) => {
            this.gameDTOService.setGameDTO(updatedDTO)
            const newTile = updatedDTO.tiles.find(tileToFind => tile.id === tileToFind.id)!
            this.tileService.setTile(newTile)
            const newBuilding = newTile.building!
            this.buildingService.setBuildingInGame(newBuilding)
          },
          error: (error) => {
            console.error('error purchasing building: {}', building, error)
            this.validationError = error.error.message
          }
        })
    }
  }

  resetValidationError() {
    this.validationError = ''
  }
}
