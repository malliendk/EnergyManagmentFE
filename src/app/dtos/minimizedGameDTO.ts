import {EventDTO} from "./eventDTO";
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";
import {BuildingRequest} from "../buildingRequest";

export interface MinimizedGameDTO {

  id: number;
  supervisorName: string;
  funds: number;
  popularity: number;
  research: number;
  score: number;
  energyProduction: number;
  energyConsumption: number;
  gridLoad: number;
  gridCapacity: number;
  houseHolds: number;
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
  events: EventDTO[];
  timeOfDay: TimeOfDay;
  weatherType: WeatherType
}
