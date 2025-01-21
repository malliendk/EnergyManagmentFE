import {GameDTO} from "../dtos/gameDTO";
import {mockSources} from "./mock-buildings";
import {mockAccounts} from "./mock-accounts";
import {mockEvents} from "./mock-events";

export const mockGameDto: GameDTO = {
  localityName : 'Zutphen',
  supervisorName : 'Amelia Lupina',
  startingSourcesAmount : 2,
  funds : 10000,
  popularity : 5000,
  research: 1000,
  environmentalScore: 500,
  energyProduction:1500,
  energyConsumption: 750,
  gridCapacity: 100,
  gridLoadTotal : 0,
  energy: 1000,
  science: 200,
  distributionEfficiency : 0.2,
  incomeRate : 0.2,
  income: 0,
  taxRate: 1,
  popRate: 0.5,
  buildings : mockSources,
  accounts: mockAccounts,
  events: mockEvents
}



