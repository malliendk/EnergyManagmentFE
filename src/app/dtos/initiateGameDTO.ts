import {BuildingRequest} from "../buildingRequest";
import {Tile} from "./tile";
import {District} from "./district";

export interface InitiateGameDTO {

  id: number;
  funds: number;
  popularity: number;
  research: number;
  buildingRequests: BuildingRequest[];
  tiles: Tile[];
  districts: District[];
}
