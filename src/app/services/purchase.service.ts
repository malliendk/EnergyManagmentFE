import {Injectable} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {Tile} from "../dtos/tile";
import {SOLAR_PRICE} from "../constants";
import {FullGameDTO} from "../dtos/fullGameDTO";
import {GameDTOService} from "./game-dto.service";
import {NO_FUNDS, NO_GRID_CAPACITY, NO_HOUSING} from "../ErrorMessages";
import {NO_BUILDING_SELECTED} from "../GameMessages";
import {EventDTO} from "../dtos/eventDTO";
import {Observable} from "rxjs";
import {SolarPanelService} from "./solar-panel.service";
import {BuildingService} from "./building.service";
import {POWER_LINE_GRID_CAPACITY, POWER_LINE_ID, POWER_LINE_PRICE} from "../power-line-values";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private gameDTOService: GameDTOService,
              private buildingService: BuildingService,
              private solarPanelService: SolarPanelService) {
  }

  purchaseBuilding(building: BuildingDTO, tile: Tile, gameDTO: FullGameDTO): Observable<FullGameDTO> {
    if (building.id === POWER_LINE_ID) {
      tile.hasPowerLine = true;
      if (tile.building) {
        tile.building!.gridCapacity += POWER_LINE_GRID_CAPACITY
      } else {
        gameDTO.buildings.push(building)
      }
    } else {
      tile.building = building
      tile.buildingId = building.id
    }
    gameDTO.funds -= building.price
    return this.gameDTOService.updateGameDTO(gameDTO)
  }

  purchasePowerline(tile: Tile, gameDTO: FullGameDTO): Observable<FullGameDTO> {
    const tileInGameDTO = gameDTO.tiles.find(t => t.id === tile.id)!;
    tileInGameDTO.building!.gridCapacity += POWER_LINE_GRID_CAPACITY
    tileInGameDTO.hasPowerLine = true;
    gameDTO.funds -= POWER_LINE_PRICE
    return this.gameDTOService.updateGameDTO(gameDTO!)
  }

  purchaseSolarPanels(numberOfSolarPanels: number, buildingDTO: BuildingDTO, gameDTO: FullGameDTO) {
    const buildingInGameDTO = gameDTO.buildings.find(building => buildingDTO.id === building.id)!
    this.solarPanelService.mapValuesToBuilding(buildingInGameDTO, numberOfSolarPanels)
    return this.gameDTOService.updateGameDTO(gameDTO)
  }

  rejectBuilding(event: EventDTO, gameDTO: FullGameDTO) {
    gameDTO.popularity -= event.building.popularityCost;
    this.gameDTOService.updateGameDTO(gameDTO)
  }

  validateSolarPanels(numberOfSolarPanels: number, building: BuildingDTO, gameDTO: FullGameDTO) {
    if (!this.validatePurchasedAmount(numberOfSolarPanels, building)) {
      return "NOT ENOUGH SOLAR PANEL CAPACITY"
    }
    if (!this.validateFundsSolar(numberOfSolarPanels, gameDTO)) {
      return NO_FUNDS
    }
    return
  }


  private validatePurchasedAmount(numberOfSolarPanels: number, building: BuildingDTO): boolean {
    const newAmount = numberOfSolarPanels + building.solarPanelAmount
    return newAmount <= building.solarPanelCapacity;
  }

  private validateFundsSolar(numberOfSolarPanels: number, gameDTO: FullGameDTO) {
    return numberOfSolarPanels * SOLAR_PRICE <= gameDTO.funds;
  }

  validateBuilding(building: BuildingDTO, gameDTO: FullGameDTO): string | undefined {
    if (!this.validateBuildingSelected(building)) {
      return NO_BUILDING_SELECTED
    }
    if (!this.validateFunds(building, gameDTO)) {
      return NO_FUNDS
    }
    if (!this.validateGridCapacity(building, gameDTO)) {
      return NO_GRID_CAPACITY
    }
    if (!this.validateHousing(building, gameDTO)) {
      return NO_HOUSING
    }
    return;
  }

  private validateHousing(building: BuildingDTO, gameDTO: FullGameDTO): boolean {
    if (building.housingRequirement === 0) {
      return true;
    }
    return building.housingRequirement <= gameDTO.housing;
  }

  private validateGridCapacity(building: BuildingDTO, gameDTO: FullGameDTO): boolean {
    console.log('building to be checked: {}', building);
    if (!building.energyConsumption && !building.energyProduction) {
      return true;
    }
    let newEnergyProduction = gameDTO.energyProduction;
    let newEnergyConsumption = gameDTO.energyConsumption;
    if (building.energyProduction) {
      newEnergyProduction += building.energyProduction;
    }
    if (building.energyConsumption) {
      newEnergyConsumption += building.energyConsumption;
    }
    const energyBalance = newEnergyProduction - newEnergyConsumption;
    console.log('grid capacity: {}', gameDTO.gridCapacity)
    console.log('energy Balance: {}', energyBalance)
    return Math.abs(energyBalance) <= gameDTO.gridCapacity;
  }

  private validateFunds(building: BuildingDTO, gameDTO: FullGameDTO): boolean {
    return building.price <= gameDTO.funds;
  }

  private validateBuildingSelected(building: BuildingDTO): boolean {
    return !!building
  }

}
