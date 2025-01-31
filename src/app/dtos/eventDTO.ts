import {Building} from "./building";

export interface EventDTO {

  id: number;
  name: string;
  description: string;
  loadSource: Building;
}
