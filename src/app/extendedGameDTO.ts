import {Account} from "./dtos/account";
import {Building} from "./dtos/building";
import {EventDTO} from "./dtos/eventDTO";
import {TimeOfDay} from "./timeOfDay";
import {WeatherType} from "./weatherType";

export interface ExtendedGameDTO {
  id: number;
  supervisorName: string;
  funds: number;
  popularity: number;
  research: number;
  environmentalScore: number;
  energyProduction: number;
  energyConsumption: number;
  gridLoadTotal: number;
  gridCapacity: number;
  solarPanelAmount: number,
  solarPanelCapacity: number;
  goldIncome: number;
  popularityIncome: number;
  scienceIncome: number;
  distributionEfficiency: number;
  incomeRate: number;
  taxRate: number;
  popRate: number;
  buildings: Building[];
  events: EventDTO[];
  timeOfDay: TimeOfDay;
  weatherType: WeatherType
}
