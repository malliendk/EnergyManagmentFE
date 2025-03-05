import {BuildingRequest} from "../buildingRequest";

export interface InitiateGameDTO {

  funds: number;
  popularity: number;
  research: number;
  buildingRequests: BuildingRequest[];
}
