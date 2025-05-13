import {Tile} from "./tile";

export interface District {

  id: number;
  energyProduction: number;
  energyConsumption: number;
  excessBalance: number;
  gridCapacity: number;
  gridLoad: number;
  incomingExcessBalances: number[];
  tiles: Tile[];
}
