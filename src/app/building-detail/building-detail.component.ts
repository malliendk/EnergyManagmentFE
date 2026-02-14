import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BuildingDTO} from "../dtos/buildingDTO";
import {BuildingService} from "../services/building.service";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {PurchaseService} from "../services/purchase.service";
import {TileBuildingService} from "../services/tile-building.service";
import {TileService} from "../services/tile.service";
import {GameDTOService} from "../services/game-dto.service";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../components/modal/modal.component";
import {POWER_LINE_ID, POWER_LINE_IMG_URL} from "../power-line-values";
import {Tile} from "../dtos/tile";
import {FullGameDTO} from "../dtos/fullGameDTO";

@Component({
  selector: 'app-building-detail',
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingInfoComponent, FormsModule, ModalComponent]
})
export class BuildingDetailComponent implements OnInit {

  building$ = this.buildingService.building$
  powerLine?: BuildingDTO
  tile$ = this.tileService.tile$
  gameDTO$ = this.gameDTOService.gameDTO$

  solarPanelAmount: number = 0
  purchaseError: string = ''

  powerLineImageURL = POWER_LINE_IMG_URL;

  constructor(private buildingService: BuildingService,
              private tileService: TileService,
              private gameDTOService: GameDTOService,
              private purchaseService: PurchaseService,
              private tileBuildingService: TileBuildingService
              ) {
  }

  ngOnInit() {
    this.findPowerLine()
  }

  purchaseSolarPanels(building: BuildingDTO, gameDTO: FullGameDTO): void {
    const possibleError: string | undefined = this.purchaseService.validateSolarPanels(
      this.solarPanelAmount, building, gameDTO)
    if (possibleError) {
      this.purchaseError = possibleError
      return
    }
    this.purchaseService.purchaseSolarPanels(this.solarPanelAmount, building, gameDTO)
      .subscribe(updatedDTO => {
        this.gameDTOService.setGameDTO(updatedDTO)
      })
  }

  purchasePowerLine(tile: Tile, gameDTO: FullGameDTO): void {
    this.purchaseService.purchasePowerline(tile, gameDTO)
      .subscribe(updatedDTO => {
        this.gameDTOService.setGameDTO(updatedDTO)
        console.log('powerline purchased for tile: {}', tile, gameDTO)
      })
  }

  private findPowerLine() {
    this.buildingService.findAll()
      .subscribe(buildings => {
        this.powerLine = buildings.find(building => building.id === POWER_LINE_ID)
      })
  }

  cancelDetailView() {
    this.tileBuildingService.resetTileAndBuilding()
  }

  resetPurchaseError() {
    this.purchaseError = ''
  }
}
