import {GameObject} from "../dtos/gameObject";
import {mockBuildings} from "./mock-buildings";
import {mockAccounts} from "./mock-accounts";
import {mockEvents} from "./mock-events";

export const mockGameObject: GameObject = {
  id : 1,
  localityName : 'Zutphen',
  supervisorName : 'Amelia Lupina',
  funds : 10000,
  popularity : 5000,
  research: 1000,
  environmentalScore: 500,
  energyProduction:1500,
  energyConsumption: 750,
  gridCapacity: 100,
  gridLoadTotal : 0,
  solarPanelAmount: 100,
  solarPanelCapacity: 100,
  goldIncome: 300,
  scienceIncome: 200,
  popularityIncome: 100,
  environmentalIncome: 100,
  distributionEfficiency : 0.2,
  incomeRate : 0.2,
  taxRate: 1,
  popRate: 0.5,
  buildings : mockBuildings,
  accounts: mockAccounts,
  events: mockEvents
}



