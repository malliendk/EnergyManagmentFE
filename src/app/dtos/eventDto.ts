import {LoadSource} from "./loadSource";

export interface EventDto {

  id: number;
  name: string;
  description: string;
  loadSource: LoadSource;
}
