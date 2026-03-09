import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BuildingService} from "../services/building.service";
import {GameDTOService} from "../services/game-dto.service";
import {GameDTO} from "../dtos/gameDTO";
import {Subscription} from "rxjs";
import {BuildingInGame} from "../dtos/buildingInGame";
import {Tile} from "../dtos/tile";

@Component({
  selector: 'app-factory-dashboard',
  templateUrl: './factory-dashboard.component.html',
  styleUrls: ['./factory-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    CurrencyPipe]
})
export class FactoryDashboardComponent implements OnInit {

  private subscription = new Subscription()

  gameDTO!: GameDTO
  coalPlant!: BuildingInGame

  cells: boolean[] = new Array(70)
  scoreCells: boolean[] = new Array(70)

  minimumProduction: number = 0;
  maximumProduction: number = 5000;
  productionStartingValue = 0
  sliderStepValue: number = 1;
  scalingCost: number = 0;
  goldPerProductionUnit: number = 1;
  secondaryImagesURL = 'assets/photos/coal-plant-inside-cut.jpg';
  errorMessage = ''

  constructor(private buildingService: BuildingService,
              private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    this.addGameDTOSubscription()
    console.log(this.gameDTO)
  }

  addGameDTOSubscription() {
    this.subscription.add(
      this.gameDTOService.gameDTO$.subscribe(
        gameDTO => {
          this.gameDTO = gameDTO!
          this.findCoalPlant()
        }
      )
    )
  }

  findCoalPlant() {
      const coalPlant: BuildingInGame = this.filterCoalPlant()
      console.log('coal plant: {}', coalPlant)
      this.coalPlant = coalPlant
      this.coalPlant.imageUri = this.secondaryImagesURL
      this.productionStartingValue = this.coalPlant.energyProduction
      this.toggleProductionCells()
      this.toggleScoreCells()
  }

  private filterCoalPlant(): BuildingInGame {
    const tilesWithBuilding = this.gameDTO.tiles.filter(tile => tile.building)
    const coalPlantTile: Tile = tilesWithBuilding.find(
      (tile: Tile) => tile.building && tile.building.id === 1)!
    return coalPlantTile.building!
  }

  scaleProduction(gameDTO: GameDTO) {
    this.validateFunds(this.scalingCost, gameDTO)
    gameDTO.funds -= this.scalingCost
    this.gameDTOService.updateGameDTO(gameDTO)
      .subscribe(updatedDTO => {
        this.gameDTOService.setGameDTO(updatedDTO)
        this.updateBuildingsPopIncome();
        this.scalingCost = 0
      })
  }

  recalculate() {
    this.calculateScalingCost()
    this.calculateScore()
    this.toggleProductionCells()
    this.toggleScoreCells()
  }

  private toggleProductionCells() {
    const totalCells = this.cells.length;
    const productionPercentage = this.coalPlant.energyProduction / this.maximumProduction;
    const cellsToActivate = Math.round(productionPercentage * totalCells);
    this.cells.fill(false);
    for (let i = 0; i < cellsToActivate; i++) {
      this.cells[i] = true;
    }
  }

  private toggleScoreCells() {
    const totalCells = this.scoreCells.length;
    const scorePercentage = this.coalPlant.environmentalScore / this.maximumProduction;
    const cellsToActivate = Math.round(scorePercentage * totalCells);
    this.scoreCells.fill(false);
    for (let i = 0; i < cellsToActivate; i++) {
      const index = totalCells - 1 - i;
      if (index >= 0) {
        this.scoreCells[index] = true;
      }
    }
  }

  setColor(cell: boolean): string {
    return cell ? 'green' : 'gray'
  }

  private calculateScalingCost() {
    this.scalingCost = Math.abs((this.productionStartingValue - this.coalPlant.energyProduction) * this.goldPerProductionUnit)
  }

  private calculateScore() {
    this.coalPlant.environmentalScore = this.maximumProduction - this.coalPlant.energyProduction;
  }

  private resetErrorMessage() {
    this.errorMessage = ''
  }

  private validateFunds(cost: number, gameDTO: GameDTO) {
    if (cost > gameDTO.funds) {
      this.errorMessage = "Not enough funds to scale your coal plant"
    }
  }

  private updateBuildingsPopIncome() {
    this.buildingService.updatePurchasableBuildings().subscribe()
  }
}

