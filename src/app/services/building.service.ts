import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingRequest} from "../dtos/buildingRequest";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Tile} from "../dtos/tile";
import {District} from "../dtos/district";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  buildingAPIBaseURL: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Building[]> {
    return this.http.get<Building[]>(this.buildingAPIBaseURL);
  }

  findAllById(minimizedGameDTO: MinimizedGameDTO) {
    const ids: number[] = minimizedGameDTO.buildingRequests.map(request => request.buildingId);
    return this.http.post<Building[]>(this.buildingAPIBaseURL + 'ids', ids);
  }

  getPowerPlants() {
    return this.http.get<Building[]>(this.buildingAPIBaseURL + 'power-plants');
  }

  minimizeBuildingsToBuildingRequests(extendedGameDTO: ExtendedGameDTO): BuildingRequest[] {
    const buildings: Building[] = extendedGameDTO.districts.flatMap(district =>
      district.tiles
        .map(tile => tile.building)
        .filter((building): building is Building => building !== null && building !== undefined)
    );

    const requestDTOs = buildings.map(building => ({
      buildingId: building?.id,
      solarPanelAmount: building?.solarPanelAmount,
      energyProduction: building?.energyProduction,
      popularityIncome: building?.popularityIncome,
      goldIncome: building?.goldIncome,
      researchIncome: building?.researchIncome,
      environmentalScore: building?.environmentalScore
    }));
    console.log("outgoing requests: {}", requestDTOs)
    return requestDTOs
  }

  duplicateBuildingsIfNecessary(ids: number[], retrievedBuildings: Building[]): Building[] {
    const buildingMap = new Map<number, Building>();
    retrievedBuildings.forEach((building: Building) => {
      buildingMap.set(building.id, building);
    });
    const finalBuildingList: Building[] = [];
    ids.forEach((id: number) => {
      const building = buildingMap.get(id);
      if (building) {
        finalBuildingList.push(building);
      }
    });
    return finalBuildingList;
  }

  updateBuildingValues(minimizedGameDTO: MinimizedGameDTO, buildings: Building[]): Building[] {
    const compressedBuildings: BuildingRequest[] = minimizedGameDTO.buildingRequests;
    this.mapBuildingRequests(compressedBuildings, buildings);
    buildings.forEach((building: Building) => this.generateInstanceId(building));
    return buildings;
  }

  sortBuildingsByCategoryAndPrice(buildings: Building[]): Building[] {
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

  processPurchasedBuilding(building: Building, gameDTO: ExtendedGameDTO): ExtendedGameDTO {
    gameDTO.funds -= building.price;
    return gameDTO
  }


  getDistrictBuildings(district: District): Building[] {
    return district.tiles
      .map(tile => tile.building)
      .filter((building): building is Building => building !== null);
  }


  generateInstanceId(building: Building) {
    building.instanceId = window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  private mapBuildingRequests(requests: BuildingRequest[], buildings: Building[]) {
    buildings.forEach((building: Building) => requests.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
        building.energyProduction
        building.goldIncome = map.goldIncome;
        building.researchIncome = map.researchIncome;
        building.environmentalScore = map.environmentalScore;
      }
    }))
  }
}
