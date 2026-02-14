import {Injectable} from '@angular/core';
import {Tile} from "../dtos/tile";
import {BuildingDTO} from "../dtos/buildingDTO";
import {
  CATEGORY_COMMERCIAL,
  CATEGORY_ENERGY_PRODUCTION,
  CATEGORY_GRID_ASSET,
  CATEGORY_HOUSING,
  CATEGORY_PUBLIC_FACILITY,
  TILE_TYPE_COMMERCIAL,
  TILE_TYPE_GRASSLAND,
  TILE_TYPE_HOUSING,
  TILE_TYPE_SEA
} from "../constants";
import {BuildingService} from "./building.service";
import {TileService} from "./tile.service";

@Injectable({
  providedIn: 'root'
})
export class TileBuildingService {

  constructor(private tileService: TileService,
              private buildingService: BuildingService) { }

  addBuildingsToTiles(buildings: BuildingDTO[], tiles: Tile[]) {
    const buildingMap = new Map<number, BuildingDTO>();
    buildings.forEach(building => {
      buildingMap.set(building.id, building);
    });
    tiles.forEach(tile => {
      if (tile.buildingId && buildingMap.has(tile.buildingId)) {
        tile.building = buildingMap.get(tile.buildingId) || undefined;
      }
    });
  }

  resetTileAndBuilding() {
    this.tileService.setTile(undefined)
    this.buildingService.setBuilding(undefined)
  }

  filterBuildingsByZoneType(buildings: BuildingDTO[], tile: Tile): BuildingDTO[] {
    const publicBuildings = this.filterBuildings(buildings, CATEGORY_PUBLIC_FACILITY)
      .filter(building => building.id !== 50)
    let gridAssets = this.filterBuildings(buildings, CATEGORY_GRID_ASSET)
    if (tile.hasPowerLine) {
      gridAssets = gridAssets.filter(building => building.name !== "Power Line")
    }
    const housing = this.filterBuildings(buildings, CATEGORY_HOUSING)
    const production = this.filterBuildings(buildings, CATEGORY_ENERGY_PRODUCTION)
    const commercial = this.filterBuildings(buildings, CATEGORY_COMMERCIAL);
    const productionOnLand = production.filter(building => building.name !== "Sea-side Wind Turbine")
    const productionAtSea = production.filter(building => building.name === "Sea-side Wind Turbine")
    let buildingsToReturn: BuildingDTO[]
    switch (tile.zoneType) {
      case TILE_TYPE_HOUSING:
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...housing].map(b => [b.id, b])).values()];
        break
      case TILE_TYPE_COMMERCIAL:
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...commercial].map(b => [b.id, b])).values()];
        break
      case TILE_TYPE_GRASSLAND:
        buildingsToReturn = [...new Map([...publicBuildings, ...gridAssets, ...productionOnLand].map(b => [b.id, b])).values()];
        break
      case TILE_TYPE_SEA:
        buildingsToReturn = productionAtSea;
        break
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
}
