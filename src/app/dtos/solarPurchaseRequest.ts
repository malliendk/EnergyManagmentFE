import {BuildingInGame} from "./buildingInGame";
import {GameDTO} from "./gameDTO";

export interface SolarPurchaseRequest {
  solarPanelAmount: number
  building: BuildingInGame
  gameDTO: GameDTO
}
