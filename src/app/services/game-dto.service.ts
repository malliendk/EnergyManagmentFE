import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {HttpClient} from "@angular/common/http";
import {Building} from "../dtos/building";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {BuildingService} from "./building.service";
import {BuildingRequest} from "../dtos/buildingRequest";
import {Tile} from "../dtos/tile";

@Injectable({
  providedIn: 'root'
})
export class GameDTOService {
  private initiateServiceUrl = 'http://localhost:8080';
  private calculationServiceUrl: string = 'http://localhost:8093';

  constructor(private http: HttpClient,
              private buildingService: BuildingService) {
  }

  startGame(): Observable<InitiateGameDTO> {
    return this.http.post<InitiateGameDTO>(this.initiateServiceUrl, {});
  }

  updateGameDTO(extendedGameDTO: ExtendedGameDTO): Observable<InitiateGameDTO> {
    const minimizedGameDTO: InitiateGameDTO = this.minimizeToInitiateDTO(extendedGameDTO);
    console.log('outgoing minimizedDTO: {}', minimizedGameDTO)
    return this.http.put<InitiateGameDTO>(`${this.initiateServiceUrl}/${extendedGameDTO.id}`, minimizedGameDTO);
  }

  extendGameDTO(minimizedGameDTO: MinimizedGameDTO, fetchedBuildingsById: Building[]): ExtendedGameDTO {
    const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
    const completeBuildingList: Building[] = this.buildingService.duplicateBuildingsIfNecessary(ids, fetchedBuildingsById);
    const fullyProcessedBuildings: Building[] = this.buildingService.updateBuildingValues(minimizedGameDTO, completeBuildingList);
    const sortedBuildings: Building[] = this.buildingService.sortBuildingsByCategoryAndPrice(fullyProcessedBuildings);
    const {buildingRequests, ...propertyValues} = minimizedGameDTO;
    let gameDTO: ExtendedGameDTO = {
      ...propertyValues,
      buildings: sortedBuildings
    };
    gameDTO = this.buildingService.updateTilesWithBuildings(gameDTO);
    console.log("successfully extended gameDTO: {}", gameDTO);
    return gameDTO;
  }

  getMinimizedGameDto(): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(this.calculationServiceUrl);
  }

  minimizeToInitiateDTO(extendedGameDTO: ExtendedGameDTO): InitiateGameDTO {
    const tiles: Tile[] = this.buildingService.collectAllTiles(extendedGameDTO);
    return {
      id: extendedGameDTO.id,
      funds: extendedGameDTO.funds,
      popularity: extendedGameDTO.popularity,
      research: extendedGameDTO.research,
      buildingRequests: this.buildingService.minimizeBuildingsToBuildingRequests(extendedGameDTO),
      tiles: this.buildingService.removeBuildingsFromTiles(tiles),
      districts: extendedGameDTO.districts
    };
  }
}
