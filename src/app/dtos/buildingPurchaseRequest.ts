import {BuildingDTO} from "./buildingDTO";
import {Tile} from "./tile";
import {GameDTO} from "./gameDTO";

export interface BuildingPurchaseRequest {
  building?: BuildingDTO
  tile?: Tile
  gameDTO: GameDTO
}
