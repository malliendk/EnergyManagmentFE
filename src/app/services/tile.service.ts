import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AdjacencySet} from "../dtos/adjacencySet";
import {Tile} from "../dtos/tile";
import {Building} from "../dtos/building";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {District} from "../dtos/district";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TileService {

  adjacencyURL: string = "http://localhost:8090/adjacency-sets"

  constructor(private http: HttpClient) { }


  updateTilesWithBuildings(gameDTO: ExtendedGameDTO): ExtendedGameDTO {
    const tiles: Tile[] = this.collectAllTiles(gameDTO)
    this.mapBuildingsToTiles(tiles, gameDTO.buildings);
    return gameDTO
  }

  private mapBuildingsToTiles(tiles: Tile[], buildings: Building[]): Tile[] {
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
   * Removes the building property from each tile, keeping only the buildingId reference
   * @param tiles The tiles to process
   * @returns Tiles with only id and buildingId properties
   */

  removeBuildingsFromTiles(tiles: Tile[]): Tile[] {
    return tiles.map(tile => ({
      id: tile.id,
      buildingId: tile.buildingId,
      building: null,
      districtId: tile.districtId,
      adjacencySet: undefined
    }));
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

  collectAllTiles(gameDTO: ExtendedGameDTO): Tile[] {
    return gameDTO.districts.flatMap(district => district.tiles);
  }

  findAllAdjacencySets(): Observable<AdjacencySet[]> {
    return this.http.get<AdjacencySet[]>(this.adjacencyURL);
  }
}
