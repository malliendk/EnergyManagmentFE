import {Supervisor} from "./supervisor";
import {Tile} from "./tile";
import {District} from "./district";
import {BuildingRequest} from "./buildingRequest";

export interface SaveGame {
  id: number
  name: string
  supervisorInstanceId: number
  districts: District[]
  buildingRequests: BuildingRequest[]
  funds: number
  popularity: number
  research: number;
  environmentalScore: number;
}
