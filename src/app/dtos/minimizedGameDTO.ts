import {EventDTO} from "./eventDTO";
import {BuildingRequest} from "./buildingRequest";
import {Supervisor} from "./supervisor";
import {Tile} from "./tile";

export interface MinimizedGameDTO {

  id: number;
  supervisorName: string;
  supervisorId: number;
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
  distributionEfficiency: number;
  incomeRate: number;
  taxRate: number;
  popRate: number;
  tiles: Tile[];
  buildingRequests: BuildingRequest[];
  events: EventDTO[];
  timeOfDay: string;
  weatherType: string
}
