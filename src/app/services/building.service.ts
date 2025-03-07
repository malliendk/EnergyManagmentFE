import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingRequest} from "../buildingRequest";

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
        solarPanelAmount: building.solarPanelAmount
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
    let requestMap: BuildingRequest[] = minimizedGameDTO.buildingRequests.map(request => ({
      buildingId: request.buildingId,
      solarPanelAmount: request.solarPanelAmount
    }));
    this.setSolarPanelAmounts(buildings, requestMap);
    this.setInstanceId(buildings);
    return buildings;
  }


  private setInstanceId(buildings: Building[]) {
    buildings.forEach(building => building.instanceId = this.generateUniqueId())
  }

  generateUniqueId(): number {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  private setSolarPanelAmounts(buildings: Building[], requestMap: BuildingRequest[]) {
    buildings.forEach((building: Building) => requestMap.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
      }
    }))
  }

  sortBuildingsByCategoryAndPrice(buildings: Building[]): Building[] {
    const CATEGORY_PRIORITY: { [key: string]: number } = {
      'Woning': 0,
      'Openbare voorziening': 1,
      'Industrieel': 2,
      'Energiecentrale': 3,
      'Bijzonder gebouw': 4,
      'Transport': 5
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
