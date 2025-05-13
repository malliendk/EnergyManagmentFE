import {Building} from "./building";

export interface Tile {

  id: number;
  buildingId: number;
  building: Building | null;
  districtId: number;
}
