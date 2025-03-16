import {Building} from "./dtos/building";

export interface Event {
  id: number;
  name: string;
  description: string;
  buildingDTO: Building | null;
}
