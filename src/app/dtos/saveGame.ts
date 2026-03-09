import {Tile} from "./tile";
import {BuildingInGame} from "./buildingInGame";

export interface SaveGame {
  id: number
  name: string
  supervisorInstanceId: number
  buildings: BuildingInGame[]
  tiles: Tile[]
  funds: number
  popularity: number
  research: number;
  environmentalScore: number;
}
