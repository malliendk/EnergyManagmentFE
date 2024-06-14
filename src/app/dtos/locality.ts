export interface Locality {
  id: number;
  name: string;
  image: string;
  startingSourcesAmount: number;
  networkLoad: number;
  supervisorNames: string[];
  accountsIds: number[];
}
