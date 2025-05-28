import {Building} from "../dtos/building";

export interface EventDTO {
  id: number;
  name: string;
  description: string;
  buildingDTO: Building | null;
}
