import {Injectable} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingRequest} from "../dtos/buildingRequest";
import {FullGameDTO} from "../dtos/fullGameDTO";

import {Tile} from "../dtos/tile";
import {POWER_LINE_ID} from "../power-line-values";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private buildingSubject = new BehaviorSubject<BuildingDTO | undefined>(undefined)
  public building$ = this.buildingSubject.asObservable();

  buildingAPIBaseURL: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) {
  }

  setBuilding(building: BuildingDTO | undefined) {
    this.buildingSubject.next(building)
  }

  getBuilding() {
    return this.buildingSubject.getValue()
  }

  findAll(): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>(this.buildingAPIBaseURL);
  }

  findAllById(minimizedGameDTO: MinimizedGameDTO) {
    const ids: number[] = minimizedGameDTO.buildingRequests.map(request => request.buildingId);
    return this.http.post<BuildingDTO[]>(this.buildingAPIBaseURL + 'ids', ids);
  }

  getPowerPlants() {
    return this.http.get<BuildingDTO[]>(this.buildingAPIBaseURL + 'power-plant');
  }

  minimizeToBuildingRequests(gameDTO: FullGameDTO): BuildingRequest[] {
    const requestDTOs: BuildingRequest[] = gameDTO.buildings.map(building => ({
      buildingId: building?.id,
      instanceId: building?.instanceId,
      solarPanelAmount: building?.solarPanelAmount,
      energyProduction: building?.energyProduction,
      popularityIncome: building?.popularityIncome,
      goldIncome: building?.goldIncome,
      researchIncome: building?.researchIncome,
      environmentalScore: building?.environmentalScore,
      gridCapacity: building?.gridCapacity
    }));
    console.log("outgoing requests: {}", requestDTOs)
    return requestDTOs
  }

  mapBuildingsToTiles(tiles: Tile[], buildings: BuildingDTO[]): Tile[] {
    buildings = buildings.filter(building => building.id !== POWER_LINE_ID);
    const buildingMap = new Map<number, BuildingDTO>()
    buildings.forEach((building: BuildingDTO) => {
      buildingMap.set(building.id, building)
    })
    return tiles.map((tile: Tile) => {
      if (tile.buildingId) {
        const matchingBuilding = buildingMap.get(tile.buildingId)
        if (matchingBuilding) {
          return {
            ...tile,
            building: {...matchingBuilding}
          };
        }
      }
      return tile
    })
  }

  generateInstanceId(building: BuildingDTO) {
    building.instanceId = Math.floor(Math.random() * 999999) + 1
  }
}
