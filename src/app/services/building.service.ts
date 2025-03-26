import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingRequest} from "../buildingRequest";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {buildApplication} from "@angular-devkit/build-angular";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  buildingAPIBaseURL: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Building[]> {
    return this.http.get<Building[]>(this.buildingAPIBaseURL);
  }

  getBuildingsById(minimizedGameDTO: MinimizedGameDTO) {
    const ids: number[] = minimizedGameDTO.buildingRequests.map(request => request.buildingId);
    return this.http.post<Building[]>(this.buildingAPIBaseURL + 'ids', ids);
  }

  minimizeBuildings(buildings: Building[]): BuildingRequest[] {
    return buildings.map(
      building => ({
        buildingId: building.id,
        solarPanelAmount: building.solarPanelAmount,
        propertiesMap: this.getPropertyMap(buildings, building.id)
      })
    )
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
    this.setSolarPanelAmounts(compressedBuildings, buildings);
    this.updatePowerPlants(compressedBuildings, buildings)
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
    gameDTO.buildings = [...gameDTO.buildings, building];
    gameDTO.funds -= building.price;
    return gameDTO
  }

  generateInstanceId(building: Building) {
    building.instanceId = window.crypto.getRandomValues(new Uint32Array(1))[0];
  }


  private updatePowerPlants(requests: BuildingRequest[], buildings: Building[]) {
    let extractedMap: Map<string, any>[] = requests.map(request => request.propertiesMap);
    extractedMap.forEach(propertyMap => {
      let powerPlant: Building = buildings.find(building => building.name === propertyMap.get('name'))!;
      if (powerPlant) {
        this.extractPropertyMap(propertyMap, powerPlant);
      }
    })
  }

  private extractPropertyMap(propertiesMap: Map<string, any>, building: Building) {
    building.energyProduction = propertiesMap.get('energyProduction');
    building.goldIncome = propertiesMap.get('goldIncome');
    building.researchIncome = propertiesMap.get('researchIncome');
    building.environmentalScore = propertiesMap.get('score');
    return building;
  }

  private getPropertyMap(buildings: Building[], buildingId: number): Map<string, any> {
    let propertiesMap: Map<string, any> = new Map<string, any>
    let powerPlant: Building = buildings.find(building => building.id === buildingId)!
    propertiesMap.set('name', powerPlant.name);
    propertiesMap.set('energyProduction', powerPlant.energyProduction);
    propertiesMap.set('goldIncome', powerPlant.goldIncome);
    propertiesMap.set('researchIncome', powerPlant.researchIncome);
    propertiesMap.set('score', powerPlant.environmentalScore);
    return propertiesMap;
  }

  private setSolarPanelAmounts(requests: BuildingRequest[], buildings: Building[]) {
    buildings.forEach((building: Building) => requests.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
      }
    }))
  }
}
