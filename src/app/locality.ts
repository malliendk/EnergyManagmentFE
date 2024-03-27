import {Account} from "./account";

export interface Locality {
  id: number;
  name: string;
  imageUrl: string;
  supervisorNames: string[];
  accountsIds: number[];
}
