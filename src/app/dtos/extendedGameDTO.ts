import {Account} from "./account";
import {Building} from "./building";
import {EventDTO} from "./eventDTO";
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";

export interface ExtendedGameDTO {
  id: number;
  supervisorName: string;
  funds: number;
  popularity: number;
  research: number;
  environmentalScore: number;
  energyProduction: number;
  energyConsumption: number;
  gridLoad: number;
  gridCapacity: number;
  solarPanelAmount: number,
  solarPanelCapacity: number;
  goldIncome: number;
  popularityIncome: number;
  researchIncome: number;
  buildings: Building[];
  events: EventDTO[];
  timeOfDay: TimeOfDay;
  weatherType: WeatherType
}
