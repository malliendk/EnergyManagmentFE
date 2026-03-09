import {Injectable} from '@angular/core';
import {Tile} from "../dtos/tile";
import {
  TILE_TYPE_COMMERCIAL,
  TILE_TYPE_ENERGY_TRANSPORT,
  TILE_TYPE_GRASSLAND,
  TILE_TYPE_HOUSING,
  TILE_TYPE_POWER_PLANT,
  TILE_TYPE_SEA
} from "../constants/constants";
import {BuildingDTO} from "../dtos/buildingDTO";

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  tileColorCommercial: string = 'commercial-color'
  tileColorFields: string = 'green'
  tileColorCoal: string = 'black'
  tileColorWater: string = 'blue'
  tileColorHousing: string = 'housing-color'
  tileColorEnergyTransport: string = 'energy-transport-color'
  tileColorHasBuilding: string = 'has-building'
  tileColorHasPowerLine: string = 'has-power-line'

  constructor() { }

  getTimeOfDayColor(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return 'morning transition'
      case 'afternoon':
        return 'afternoon transition'
      case 'evening':
        return 'evening transition'
      case 'night':
        return 'night transition'
      default:
        return ''
    }
  }

  getWeatherColor(weatherType: string, timeOfDay: string): string {
    switch (weatherType) {
      case 'sunny':
        return `${timeOfDay} transition`;
      case 'afternoon':
        return 'afternoon transition';
      case 'evening':
        return 'evening transition';
      case 'night':
        return 'night transition';
      default:
        return '';
    }
  }

  setTileColor(tile: Tile): string {
    switch (tile.zoneType) {
      case TILE_TYPE_COMMERCIAL:
        return this.tileColorCommercial;
      case TILE_TYPE_ENERGY_TRANSPORT:
        return this.tileColorEnergyTransport;
      case TILE_TYPE_HOUSING:
        return this.tileColorHousing;
      case TILE_TYPE_POWER_PLANT:
        return this.tileColorCoal;
      case TILE_TYPE_GRASSLAND:
        return this.tileColorFields;
      case TILE_TYPE_SEA:
        return this.tileColorWater;
      default:
        return '';
    }
  }

  setColorHasBuilding(tile: Tile): string {
    return tile.building ? this.tileColorHasBuilding : '';
  }

  setPowerLinesColor(tile: Tile): string {
    return tile.hasPowerLine ? this.tileColorHasPowerLine : '';
  }

  setSelectedTile(tile: Tile, tileId: number): string {
    return tile!.id === tileId ? 'tile-selected' : '';
  }

  setBuildingSelected(building: BuildingDTO, classBuilding: BuildingDTO): string {
    return building === classBuilding ? 'building-selected' : ''
  }

  toggleSelectedBuilding(building: BuildingDTO, buildingId: number) {
    return building.id === buildingId ? 'building-selected' : '';
  }

}
