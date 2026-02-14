import {BuildingDTO} from "./buildingDTO";
import {Supervisor} from "./supervisor";
import {Tile} from "./tile";

export interface FullGameDTO {
  id: number;
  supervisorName: string;
  supervisor: Supervisor,
  funds: number;
  popularity: number;
  research: number;
  environmentalScore: number;
  energyProduction: number;
  energyConsumption: number;
  gridLoad: number;
  gridCapacity: number;
  housing: number;
  goldIncome: number;
  popularityIncome: number;
  researchIncome: number;
  buildings: BuildingDTO[];
  tiles: Tile[];
  timeOfDay: string;
  weatherType: string
}
