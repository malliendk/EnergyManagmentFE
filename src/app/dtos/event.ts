import {LoadSource} from "./loadSource";

export interface Event{

  id: number;
  name: string;
  description: string;
  loadSource: LoadSource;
}
