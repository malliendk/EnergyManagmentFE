import {BuildingRequest} from "./buildingRequest";
import {Tile} from "./tile";
import {Supervisor} from "./supervisor";

export interface InitiateGameDTO {

  id: number;
  funds: number;
  popularity: number;
  research: number;
  buildingRequests: BuildingRequest[];
  tiles: Tile[];
  supervisor: Supervisor;
}
