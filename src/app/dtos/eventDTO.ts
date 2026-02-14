import {BuildingDTO} from "./buildingDTO";

export interface EventDTO {

  id: number;
  name: string;
  description: string;
  building: BuildingDTO;
}
