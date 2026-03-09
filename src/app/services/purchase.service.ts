import {Injectable} from '@angular/core';
import {Tile} from "../dtos/tile";
import {GameDTO} from "../dtos/gameDTO";
import {Observable} from "rxjs";
import {BuildingInGame} from "../dtos/buildingInGame";
import {HttpClient} from "@angular/common/http";
import {BuildingPurchaseRequest} from "../dtos/buildingPurchaseRequest";
import {PURCHASE_URL} from "../constants/urls";
import {BuildingDTO} from "../dtos/buildingDTO";
import {SolarPurchaseRequest} from "../dtos/solarPurchaseRequest";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) {
  }

  purchaseBuilding(building: BuildingDTO, tile: Tile, gameDTO: GameDTO): Observable<GameDTO> {
    const request: BuildingPurchaseRequest = {
      building: building,
      tile: tile,
      gameDTO: gameDTO
    }
    return this.http.post<GameDTO>(`${PURCHASE_URL}/building`, request)
  }

  purchasePowerline(tile: Tile, gameDTO: GameDTO): Observable<GameDTO> {
    const request: BuildingPurchaseRequest = {
      tile: tile,
      gameDTO: gameDTO
    }
    return this.http.post<GameDTO>(`${PURCHASE_URL}/powerline`, request)
  }

  purchaseSolarPanels(solarPanelAmount: number, building: BuildingInGame, gameDTO: GameDTO): Observable<GameDTO> {
    const request: SolarPurchaseRequest = {
      solarPanelAmount: solarPanelAmount,
      building: building,
      gameDTO: gameDTO,
    }
    return this.http.post<GameDTO>(`${PURCHASE_URL}/solar-panels`, request)
  }

  rejectBuilding(gameDTO: GameDTO) {
    const request: BuildingPurchaseRequest = {
      gameDTO: gameDTO
    }
    return this.http.post<GameDTO>(`${PURCHASE_URL}/reject`, request)
  }
}
