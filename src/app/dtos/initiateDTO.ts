import {Tile} from "./tile";
import {Supervisor} from "./supervisor";
import {BuildingInGame} from "./buildingInGame";

export interface InitiateDTO {

  id: number;
  funds: number;
  popularity: number;
  research: number;
  buildings: BuildingInGame[]
  tiles: Tile[];
  supervisor: Supervisor;
}
