import {Account} from "./account";
import {LoadSource} from "./loadSource";
import {EventDto} from "./eventDto";

export interface GameDto {

  localityName: string;
  supervisorName: string;
  gridLoadTotal: number;
  startingSourcesAmount: number;
  funds: number;
  popularity: number;
  distributionEfficiency: number;
  incomeRate: number;
  income: number;
  taxRate: number;
  sources: LoadSource[];
  accounts: Account[];
  events: EventDto[];
}
