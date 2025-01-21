import {Building} from "./building";

export interface EventDto {

  id: number;
  name: string;
  description: string;
  loadSource: Building;
}
