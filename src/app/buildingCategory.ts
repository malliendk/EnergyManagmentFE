export interface BuildingCategory {
  name: string;
  colorCode: string;
}

export const BuildingCategories: { [key: string]: BuildingCategory } = {
  INDUSTRIAL: {
    name: 'Industrieel',
    colorCode: ''
  },
  HOUSING: {
    name: 'Woning',
    colorCode: ''
  },
  PRODUCTION: {
    name: 'Productie',
    colorCode: ''
  },
  PUBLIC: {
    name: 'Openbaar gebouw',
    colorCode: ''
  },
  SPECIAL: {
    name: 'Bijzonder gebouw',
    colorCode: ''
  }
} as const;
