import {BuildingDTO} from "./buildingDTO";
import {AdjacencySet} from "./adjacencySet";

export interface Tile {

  id: number
  buildingId: number
  building: BuildingDTO | undefined
  zoneType: string
  adjacencySet: AdjacencySet | undefined
  color: string
  hasPowerLine: boolean
}
