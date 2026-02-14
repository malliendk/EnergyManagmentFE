export interface BuildingDTO {

  id: number;
  instanceId: number;
  name: string;
  description: string;
  canBePurchased: boolean;
  price: number;
  color: string;
  imageUri: string;
  category: string;
  gridLoad: number;
  gridCapacity: number;
  energyProduction: number;
  energyConsumption: number;
  housing: number;
  popularityIncome: number;
  goldIncome: number;
  researchIncome: number;
  environmentalScore: number;
  popularityCost: number;
  housingRequirement: number;
  solarPanelAmount: number
  solarPanelCapacity: number;
}
