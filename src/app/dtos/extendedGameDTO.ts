import {Building} from "./building";
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";
import {Tile} from "./tile";
import {District} from "./district";

export interface ExtendedGameDTO {
  id: number;
  supervisorName: string;
  funds: number;
  popularity: number;
  research: number;
  environmentalScore: number;
  energyProduction: number;
  energyConsumption: number;
  gridLoad: number;
  gridCapacity: number;
  houseHolds: number;
  solarPanelAmount: number,
  solarPanelCapacity: number;
  goldIncome: number;
  popularityIncome: number;
  researchIncome: number;
  buildings: Building[];
  districts: District[];
  timeOfDay: string;
  weatherType: string
}
