import {EventDTO} from "./eventDTO";

export interface GameDTO {
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
  buildingIds: number[];
  events: EventDTO[];
}
