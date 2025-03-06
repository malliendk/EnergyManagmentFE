import {BuildingRequest} from "../buildingRequest";

export interface InitiateGameDTO {

  id: number;
  funds: number;
  popularity: number;
  research: number;
  buildingRequests: BuildingRequest[];
}
