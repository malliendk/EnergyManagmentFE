import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BuildingDTO} from "../dtos/buildingDTO";
import {BuildingService} from "../services/building.service";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {PurchaseService} from "../services/purchase.service";
import {TileService} from "../services/tile.service";
import {GameDTOService} from "../services/game-dto.service";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../components/modal/modal.component";
import {Tile} from "../dtos/tile";
import {GameDTO} from "../dtos/gameDTO";
import {BuildingInGame} from "../dtos/buildingInGame";
import {POWER_LINE_ID, POWER_LINE_IMG_URL} from "../constants/constants";

@Component({
  selector: 'app-building-detail',
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingInfoComponent, FormsModule, ModalComponent]
})
export class BuildingDetailComponent implements OnInit {

  @Input() buildings: BuildingDTO[] = []

  building$ = this.buildingService.building$
  powerLine?: BuildingDTO
  tile$ = this.tileService.tile$
  gameDTO$ = this.gameDTOService.gameDTO$

  solarPanelAmount: number = 0
  purchaseError: string = ''

  powerLineImageURL: string = POWER_LINE_IMG_URL;

  constructor(private buildingService: BuildingService,
              private tileService: TileService,
              private gameDTOService: GameDTOService,
              private purchaseService: PurchaseService
  ) {
  }

  ngOnInit() {
    this.findPowerLine()
  }

  purchaseSolarPanels(building: BuildingInGame, gameDTO: GameDTO): void {
    this.purchaseService.purchaseSolarPanels(this.solarPanelAmount, building, gameDTO)
      .subscribe({
        next: (updatedDTO: GameDTO) => {
          this.gameDTOService.setGameDTO(updatedDTO)
          console.log('solar panels purchased for building: {}', building, gameDTO)
        },
        error: (error) => {
          this.purchaseError = error.error.message
        }
      })
  }

  purchasePowerLine(building: BuildingInGame, tile: Tile, gameDTO: GameDTO): void {
    this.purchaseService.purchasePowerline(tile, gameDTO)
      .subscribe({
        next: (updatedDTO: GameDTO) => {
          this.gameDTOService.setGameDTO(updatedDTO)
          const updatedTile = updatedDTO.tiles.find(tileToFind => tile.id === tileToFind.id)!
          this.tileService.setTile(updatedTile)
          this.buildingService.setBuildingInGame(updatedTile.building)
          console.log('powerline purchased for tile: {}', tile, gameDTO)
        },
        error: (error) => {
          this.purchaseError = error.error.message
        }
      })
  }

  private findPowerLine() {
    this.powerLine = this.buildings.find(building => building.id === POWER_LINE_ID)
  }

  resetPurchaseError() {
    this.purchaseError = ''
  }
}
