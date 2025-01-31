import {Account} from "./account";
import {Building} from "./building";
import {EventDTO} from "./eventDTO";

export interface GameObject {
  id: number;
  localityName: string;
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
  environmentalIncome: number;
  scienceIncome: number;
  distributionEfficiency: number;
  incomeRate: number;
  taxRate: number;
  popRate: number;
  buildings: Building[];
  accounts: Account[];
  events: EventDTO[];
}
