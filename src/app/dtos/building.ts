export interface Building {

  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  imageUri: string;
  category: string;
  gridLoad: number;
  gridCapacity: number;
  energyProduction: number;
  energyConsumption: number;
  solarPanelAmount: number
  solarPanelCapacity: number;
  households: number;
  popularityIncome: number;
  goldIncome: number;
  researchIncome: number;
  environmentalScore: number;
  isPurchased: boolean;
  canBePurchased: boolean;
}
