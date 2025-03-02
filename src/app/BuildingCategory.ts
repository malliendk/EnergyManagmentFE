export interface BuildingCategory {
  name: string;
  colorCode: string;
}

export const BuildingCategories: { [key: string]: BuildingCategory } = {
  INDUSTRIAL: {
    name: 'Industrial',
    colorCode: ''
  },
  HOUSING: {
    name: 'Housing',
    colorCode: ''
  },
  PRODUCTION: {
    name: 'Production',
    colorCode: ''
  },
  PUBLIC: {
    name: 'Public',
    colorCode: ''
  },
  SPECIAL: {
    name: 'Special',
    colorCode: ''
  }
} as const;
