import {Account} from "./account";
import {LoadSource} from "./loadSource";
import {EventDto} from "./eventDto";

export interface GameDto {

  localityName: string;
  supervisorName: string;
  totalGridLoad: number;
  startingSourcesAmount: number;
  funds: number;
  popularity: number;
  environmentalScore: number;
  distributionEfficiency: number;
  sources: LoadSource[];
  accounts: Account[];
  events: EventDto[];
}
