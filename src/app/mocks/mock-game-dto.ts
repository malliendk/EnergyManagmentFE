import {GameDto} from "../dtos/gameDto";
import {mockSources} from "./mock-loadsources";
import {mockAccounts} from "./mock-accounts";
import {mockEvents} from "./mock-events";

export const mockGameDto: GameDto = {
  localityName : 'Zutphen',
  supervisorName : 'Amelia Lupina',
  totalGridLoad : 0,
  startingSourcesAmount : 2,
  funds : 10000,
  popularity : 5000,
  environmentalScore : 15000,
  distributionEfficiency : 0.8,
  sources : mockSources,
  accounts: mockAccounts,
  events: mockEvents
}



