import {GameDto} from "../dtos/gameDto";
import {mockSources} from "./mock-loadsources";
import {mockAccounts} from "./mock-accounts";
import {mockEvents} from "./mock-events";

export const mockGameDto: GameDto = {
  localityName : 'Zutphen',
  supervisorName : 'Amelia Lupina',
  gridLoadTotal : 0,
  startingSourcesAmount : 2,
  funds : 10000,
  popularity : 5000,
  distributionEfficiency : 0.2,
  incomeRate : 0.2,
  income: 0,
  taxRate: 1,
  sources : mockSources,
  accounts: mockAccounts,
  events: mockEvents
}



