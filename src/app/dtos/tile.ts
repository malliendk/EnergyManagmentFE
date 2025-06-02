import {Building} from "./building";
import {AdjacencySet} from "./adjacencySet";

export interface Tile {

  id: number;
  buildingId: number;
  building: Building | null;
  districtId: number;
  adjacencySet: AdjacencySet | undefined;
}
