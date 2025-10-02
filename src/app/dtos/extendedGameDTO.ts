import {Building} from "./building";
import {District} from "./district";
import {Supervisor} from "./supervisor";

export interface ExtendedGameDTO {
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
  solarPanelAmount: number,
  solarPanelCapacity: number;
  goldIncome: number;
  popularityIncome: number;
  researchIncome: number;
  buildings: Building[];
  districts: District[];
  timeOfDay: string;
  weatherType: string
}
