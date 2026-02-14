import {Injectable} from '@angular/core';
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingDTO} from "../dtos/buildingDTO";
import {FullGameDTO} from "../dtos/fullGameDTO";
import {BuildingRequest} from "../dtos/buildingRequest";
import {BuildingService} from "./building.service";
import {map, Observable} from 'rxjs';
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {POWER_LINE_ID} from "../power-line-values";

@Injectable({
  providedIn: 'root'
})
export class GameDtoMapperService {

  constructor(private buildingService: BuildingService) {
  }

  minimizeToInitiateDTO(gameDTO: FullGameDTO): InitiateGameDTO {
    console.log('before initiated DTO {}', gameDTO);
    return {
      id: gameDTO.id,
      funds: gameDTO.funds,
      popularity: gameDTO.popularity,
      research: gameDTO.research,
      supervisor: gameDTO.supervisor,
      buildingRequests: this.buildingService.minimizeToBuildingRequests(gameDTO),
      tiles: gameDTO.tiles,
    };
  }

  extendGameDTO(minimizedGameDTO: MinimizedGameDTO): Observable<FullGameDTO> {
    return this.buildingService.findAllById(minimizedGameDTO).pipe(
      map((buildings => {
        const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
        const completeBuildingList: BuildingDTO[] = this.duplicateBuildingsIfNecessary(ids, buildings);
        const fullyProcessedBuildings: BuildingDTO[] = this.updateBuildingValues(completeBuildingList, minimizedGameDTO);
        const sortedBuildings: BuildingDTO[] = this.sortBuildingsByCategoryAndPrice(fullyProcessedBuildings);
        const {buildingRequests, ...propertyValues} = minimizedGameDTO;
        let gameDTO: FullGameDTO = {
          ...propertyValues,
          buildings: sortedBuildings
        };
        gameDTO.tiles = this.buildingService.mapBuildingsToTiles(gameDTO.tiles, gameDTO.buildings);
        console.log("successfully extended gameDTO: {}", gameDTO);
        return gameDTO
      })))
  }

  private duplicateBuildingsIfNecessary(ids: number[], buildings: BuildingDTO[]): BuildingDTO[] {
    buildings = buildings.filter(building => building.id !== POWER_LINE_ID);
    const buildingMap = new Map<number, BuildingDTO>();
    buildings.forEach((building: BuildingDTO) => {
      buildingMap.set(building.id, building);
    });
    const finalBuildingList: BuildingDTO[] = [];
    ids.forEach((id: number) => {
      const building = buildingMap.get(id);
      if (building) {
        finalBuildingList.push(building);
      }
    });
    buildings.forEach((building: BuildingDTO) => {
      if (!building.instanceId) {
        this.buildingService.generateInstanceId(building)
      }
    });
    return finalBuildingList;
  }

  private updateBuildingValues(buildings: BuildingDTO[], minimizedGameDTO: MinimizedGameDTO): BuildingDTO[] {
    const compressedBuildings: BuildingRequest[] = minimizedGameDTO.buildingRequests;
    this.mapBuildingRequests(compressedBuildings, buildings);
    return buildings;
  }

  private mapBuildingRequests(requests: BuildingRequest[], buildings: BuildingDTO[]) {
    buildings.forEach((building: BuildingDTO) => requests.forEach(map => {
      if (map.instanceId == building.instanceId) {
        building.solarPanelAmount = map.solarPanelAmount
        building.energyProduction
        building.goldIncome = map.goldIncome
        building.researchIncome = map.researchIncome
        building.environmentalScore = map.environmentalScore
        building.gridCapacity = map.gridCapacity
      }
    }))
  }

  private sortBuildingsByCategoryAndPrice(buildings: BuildingDTO[]): BuildingDTO[] {
    const CATEGORY_PRIORITY: { [key: string]: number } = {
      'Woning': 0,
      'Openbare voorziening': 1,
      'Productie': 2,
      'Industrieel': 3,
      'Energiecentrale': 4,
      'Bijzonder gebouw': 5,
      'Transport': 6
    };

    return buildings.sort((a, b) => {
      const categoryComparison =
        (CATEGORY_PRIORITY[a.category] ?? Infinity) -
        (CATEGORY_PRIORITY[b.category] ?? Infinity);
      if (categoryComparison === 0) {
        return a.price - b.price;
      }
      return categoryComparison;
    });
  }
}
