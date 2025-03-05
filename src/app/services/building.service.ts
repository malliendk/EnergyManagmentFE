import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {map} from "d3";
import {BuildingRequest} from "../buildingRequest";
import {id} from "@swimlane/ngx-charts";

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
    console.log('ids: {}', ids)
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
    this.setIsPurchased(buildings);
    return buildings;
  }

  setSolarPanelAmounts(buildings: Building[], requestMap: BuildingRequest[]) {
    buildings.forEach((building: Building) => requestMap.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
      }
    }))
  }

  setIsPurchased(buildings: Building[]) {
    buildings.forEach((building: Building) => building.isPurchased = true);
  }

  setSolarPanelAmountToBuildings(buildings: Building[], requestMap: BuildingRequest[]) {
    buildings.forEach((building: Building) => requestMap.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
      }
    }))
  }
}
