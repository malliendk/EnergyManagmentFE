import {Account} from "./dtos/account";

export interface GameDto {

  localityName: string;
  supervisorName: string;
  totalGridLoad: number;
  startingSourcesAmount: number;
  funds: number;
  popularity: number;
  distributionEfficiency: number;
  sources: LoadSource[];
  accounts: Account[];
  events: Eent[];

}
