import {AdjacencySet} from "./adjacencySet";
import {BuildingInGame} from "./buildingInGame";

export interface Tile {

  id: number
  building: BuildingInGame | undefined
  zoneType: string
  adjacencySet: AdjacencySet | undefined
  color: string
  hasPowerLine: boolean
}
