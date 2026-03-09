export interface BuildingInGame {

  id: number;
  tileId: number
  category: string;
  color: string;
  canBePurchased: boolean;
  description: string;
  energyProduction: number;
  energyConsumption: number;
  environmentalScore: number;
  goldIncome: number;
  gridCapacity: number;
  housing: number;
  housingRequirement: number;
  imageUri: string;
  name: string;
  researchIncome: number;
  popularityCost: number;
  popularityIncome: number;
  price: number;
  solarPanelAmount: number
  solarPanelCapacity: number;
}
