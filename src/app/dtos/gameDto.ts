import {Account} from "./account";
import {LoadSource} from "./loadSource";
import {EventDto} from "./eventDto";

export interface GameDto {

  localityName: string;
  supervisorName: string;
  startingSourcesAmount: number;
  funds: number;
  popularity: number;
  gridCapacity: number;
  gridLoadTotal: number;
  energy: number;
  science: number;
  distributionEfficiency: number;
  incomeRate: number;
  income: number;
  taxRate: number;
  popRate: number;
  sources: LoadSource[];
  accounts: Account[];
  events: EventDto[];
}
