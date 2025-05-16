import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {BuildingRequest} from "../buildingRequest";
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

  minimizeBuildingsToBuildingRequests(buildings: Building[]): BuildingRequest[] {
    return buildings.map(
      building => ({
        buildingId: building.id,
        solarPanelAmount: building.solarPanelAmount,
        propertiesMap: this.createPropertyMap(buildings, building.id)
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
    gameDTO.funds -= building.price;
    return gameDTO
  }

  /**
   * Maps buildings to tiles based on the buildingId property of each tile
   * @param tiles The list of tiles that need buildings assigned
   * @param buildings The list of available buildings to map to tiles
   * @returns An updated list of tiles with their building property populated
   */
  mapBuildingsToTiles(tiles: Tile[], buildings: Building[]): Tile[] {
    // Create a map for quick lookup of buildings by their ID
    const buildingMap = new Map<number, Building>();
    buildings.forEach((building: Building) => {
      buildingMap.set(building.id, building);
    });

    // Map each tile to a building if it has a buildingId
    return tiles.map((tile: Tile) => {
      if (tile.buildingId) {
        const matchingBuilding = buildingMap.get(tile.buildingId);
        if (matchingBuilding) {
          // Create a new tile object with the building property populated
          return {
            ...tile,
            building: {...matchingBuilding}
          };
        }
      }
      // Return the original tile if no building ID or no matching building found
      return tile;
    });
  }

  /**
   * Updates the tiles in the extended game DTO with the corresponding buildings
   * @param gameDTO The ExtendedGameDTO to update
   * @returns The updated ExtendedGameDTO with buildings mapped to tiles
   */
  updateTilesWithBuildings(gameDTO: ExtendedGameDTO): ExtendedGameDTO {
    const tiles: Tile[] = this.collectAllTiles(gameDTO)
    this.mapBuildingsToTiles(tiles, gameDTO.buildings);
    return gameDTO
  }

  /**
   * Removes the building property from each tile, keeping only the buildingId reference
   * @param tiles The tiles to process
   * @returns Tiles with only id and buildingId properties
   */

  removeBuildingsFromTiles(tiles: Tile[]): Tile[] {
    return tiles.map(tile => ({
      id: tile.id,
      buildingId: tile.buildingId,
      building: null,
      districtId: tile.districtId
    }));
  }

  collectAllTiles(gameDTO: ExtendedGameDTO): Tile[] {
    return gameDTO.districts.flatMap(district => district.tiles);
  }

  generateInstanceId(building: Building) {
    building.instanceId = window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  private updatePowerPlants(requests: BuildingRequest[], buildings: Building[]) {
    requests.forEach((request: BuildingRequest) => {
      if (request.propertiesMap) {
        const propertiesMap = request.propertiesMap;
        const powerPlantName = propertiesMap['name'];
        let powerPlant: Building | undefined = buildings.find(building => building.name === powerPlantName);
        if (powerPlant) {
          this.readPropertyMap(propertiesMap, powerPlant);
        }
      }
    })
  }

  private readPropertyMap(propertiesMap: Record<string, any>, building: Building): Building {
    building.energyProduction = propertiesMap['energyProduction'];
    building.goldIncome = propertiesMap['goldIncome'];
    building.researchIncome = propertiesMap['researchIncome'];
    building.environmentalScore = propertiesMap['score'];
    return building;
  }

  private createPropertyMap(buildings: Building[], buildingId: number): Record<string, any> {
    let powerPlant: Building = buildings.find(building => building.id === buildingId)!
    return {
      name: powerPlant.name,
      energyProduction: powerPlant.energyProduction,
      goldIncome: powerPlant.goldIncome,
      researchIncome: powerPlant.researchIncome,
      score: powerPlant.environmentalScore,
      id: powerPlant.id
    };
  }

  private setSolarPanelAmounts(requests: BuildingRequest[], buildings: Building[]) {
    buildings.forEach((building: Building) => requests.forEach(map => {
      if (map.buildingId == building.id) {
        building.solarPanelAmount = map.solarPanelAmount;
      }
    }))
  }

  addBuildingsToTiles(buildings: Building[], districts: District[]) {
    const buildingMap = new Map<number, Building>();
    buildings.forEach(building => {
      buildingMap.set(building.id, building);
    });
    districts.forEach(district => {
      district.tiles.forEach(tile => {
        if (tile.buildingId && buildingMap.has(tile.buildingId)) {
          tile.building = buildingMap.get(tile.buildingId) || null;
        }
      });
    })
  }
}
