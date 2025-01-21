import {Account} from "./account";
import {Building} from "./building";
import {EventDto} from "./eventDto";

export interface GameDTO {

  localityName: string;
  supervisorName: string;
  startingSourcesAmount: number;
  funds: number;
  popularity: number;
  research: number;
  environmentalScore: number;
  energyProduction: number;
  energyConsumption: number;
  gridCapacity: number;
  gridLoadTotal: number;
  energy: number;
  science: number;
  distributionEfficiency: number;
  incomeRate: number;
  income: number;
  taxRate: number;
  popRate: number;
  buildings: Building[];
  accounts: Account[];
  events: EventDto[];
}
