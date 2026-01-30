import {EventDTO} from "./eventDTO";
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";
import {BuildingRequest} from "./buildingRequest";
import {District} from "./district";
import {Supervisor} from "./supervisor";

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
  solarPanelAmount: number,
  solarPanelCapacity: number;
  goldIncome: number;
  popularityIncome: number;
  researchIncome: number;
  distributionEfficiency: number;
  incomeRate: number;
  taxRate: number;
  popRate: number;
  buildingRequests: BuildingRequest[];
  districts: District[];
  events: EventDTO[];
  timeOfDay: TimeOfDay;
  weatherType: WeatherType
}
