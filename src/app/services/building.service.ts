import {Injectable} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";

import {Tile} from "../dtos/tile";
import {
  CATEGORY_COMMERCIAL,
  CATEGORY_ENERGY_PRODUCTION,
  CATEGORY_GRID_ASSET,
  CATEGORY_HOUSING,
  CATEGORY_PUBLIC_FACILITY,
  POWER_LINE_ID,
  TILE_TYPE_COMMERCIAL,
  TILE_TYPE_GRASSLAND,
  TILE_TYPE_HOUSING,
  TILE_TYPE_POWER_PLANT,
  TILE_TYPE_SEA
} from "../constants/constants";
import {BuildingInGame} from "../dtos/buildingInGame";
import {GameDTO} from "../dtos/gameDTO";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private buildingInGameSubject = new BehaviorSubject<BuildingInGame | undefined>(undefined)
  private allBuildingsSubject = new BehaviorSubject<BuildingDTO[]>([])
  building$ = this.buildingInGameSubject.asObservable();
  allBuildings$ = this.allBuildingsSubject.asObservable();

  buildingAPIBaseURL: string = 'http://localhost:8093';

  constructor(private http: HttpClient) {
  }

  setBuildingInGame(building: BuildingInGame | undefined) {
    this.buildingInGameSubject.next(building)
  }

  setBuildings(buildings: BuildingDTO[]) {
    console.log('setting buildings: {}', buildings)
    this.allBuildingsSubject.next(buildings)
  }

  updatePurchasableBuildings(): Observable<void> {
    return this.findAll().pipe(
      map(buildings => this.setBuildings(buildings))
    )
  }

  findAll(): Observable<BuildingDTO[]> {
    return this.http.get<BuildingDTO[]>(`${this.buildingAPIBaseURL}/buildings`)
  }

  collectBuildingsFromTiles(gameDTO: GameDTO): BuildingInGame[] {
    return gameDTO.tiles.filter(tile => tile.building).map(tile => tile.building!)
  }

  filterBuildingsByZoneType(buildings: BuildingDTO[], tile: Tile): BuildingDTO[] {
    const publicBuildings = this.filterBuildings(buildings, CATEGORY_PUBLIC_FACILITY)
      .filter(building => building.id !== 50)
    let gridAssets = this.filterBuildings(buildings, CATEGORY_GRID_ASSET)
    if (tile.hasPowerLine) {
      gridAssets = gridAssets.filter(building => building.id !== POWER_LINE_ID)
    }
    let buildingsToReturn: BuildingDTO[]
    let production: BuildingDTO[]
    switch (tile.zoneType) {
      case TILE_TYPE_HOUSING:
        const housing = this.filterBuildings(buildings, CATEGORY_HOUSING)
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...housing].map(b => [b.id, b])).values()];
        break;
      case TILE_TYPE_COMMERCIAL:
        const commercial = this.filterBuildings(buildings, CATEGORY_COMMERCIAL);
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...commercial].map(b => [b.id, b])).values()];
        break;
      case TILE_TYPE_GRASSLAND:
        production = this.filterBuildings(buildings, CATEGORY_ENERGY_PRODUCTION)
        const productionOnLand = production.filter(building => building.name !== "Sea-side Wind Turbine")
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...productionOnLand].map(b => [b.id, b])).values()];
        break;
      case TILE_TYPE_SEA:
        production = this.filterBuildings(buildings, CATEGORY_ENERGY_PRODUCTION)
        const productionAtSea = production.filter(building => building.name === "Sea-side Wind Turbine")
        buildingsToReturn = productionAtSea;
        break;
      case TILE_TYPE_POWER_PLANT:
        buildingsToReturn = buildings.filter(building => building.id === POWER_LINE_ID);
        break;
      default:
        buildingsToReturn = [];
    }
    return this.sortBuildingsByPriority(buildingsToReturn);
  }

  private filterBuildings(buildings: BuildingDTO[], category: string): BuildingDTO[] {
    return buildings.filter(building => building.category === category)
  }

  private sortBuildingsByPriority(buildings: BuildingDTO[]): BuildingDTO[] {
    if (!buildings || buildings.length === 0) {
      return [];
    }
    const categoryPriority = {
      [CATEGORY_ENERGY_PRODUCTION]: 1,
      [CATEGORY_HOUSING]: 2,
      [CATEGORY_COMMERCIAL]: 3,
      [CATEGORY_GRID_ASSET]: 4,
      [CATEGORY_PUBLIC_FACILITY]: 5,
    };
    const defaultPriority = 999;
    return [...buildings].sort((a, b) => {
      const priorityA = categoryPriority[a.category] || defaultPriority;
      const priorityB = categoryPriority[b.category] || defaultPriority;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.price - b.price;
    });
  }

  toBuildingInGame(building: BuildingDTO): BuildingInGame {
    return {
      ...building,
      tileId: 0,
    };
  }

  findUpdatedBuilding(tile: Tile, gameDTO: GameDTO) {
    const updatedBuilding = this.collectBuildingsFromTiles(gameDTO)
      .find(buildingInGame => buildingInGame.tileId === tile.id)!
    console.log('updated building: {}', updatedBuilding)
    return updatedBuilding
  }
}
