import {Tile} from "./tile";

export interface District {

  id: number;
  energyProduction: number;
  energyConsumption: number;
  gridCapacity: number;
  netProduction: number;
  injectedPower: number;
  exportedPower: number;
  strandedEnergy: number; // Excess energy with nowhere to go
  stressLevel: number; // Current stress on district grid
  connectedLines: string[]; // IDs of connected transmission lines
  blackout: boolean; // True if stressLevel > 0.5
  monetaryCost: number; // Financial impact of stress
  popularityImpact: number; // Political impact of stress }

  tiles: Tile[];
}
