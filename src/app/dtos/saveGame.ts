import {BuildingRequest} from "./buildingRequest";
import {Tile} from "./tile";

export interface SaveGame {
  id: number
  name: string
  supervisorInstanceId: number
  buildingRequests: BuildingRequest[]
  tiles: Tile[]
  funds: number
  popularity: number
  research: number;
  environmentalScore: number;
}
