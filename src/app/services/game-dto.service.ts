import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {HttpClient} from "@angular/common/http";
import {Building} from "../dtos/building";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {BuildingService} from "./building.service";
import {BuildingRequest} from "../buildingRequest";
import {Tile} from "../dtos/tile";

@Injectable({
  providedIn: 'root'
})
export class GameDTOService implements OnInit {
  private initiateServiceUrl = 'http://localhost:8080';
  private calculationServiceUrl: string = 'http://localhost:8093';


  constructor(private http: HttpClient,
              private buildingService: BuildingService) {
  }

  ngOnInit() {

  }

  startGame(): Observable<InitiateGameDTO> {
    return this.http.post<InitiateGameDTO>(this.initiateServiceUrl, {});
  }

  updateGameDTO(extendedGameDTO: ExtendedGameDTO): Observable<InitiateGameDTO> {
    console.log('updatedGameDTO: {}', extendedGameDTO)
    const initiateDTO: InitiateGameDTO = this.minimizeToInitiateDTO(extendedGameDTO);
    console.log('outgoing gameDTO: {}', initiateDTO);
    return this.http.put<InitiateGameDTO>(`${this.initiateServiceUrl}/${extendedGameDTO.id}`, initiateDTO);
  }

  // extendGameDTO(minimizedGameDTO: MinimizedGameDTO, fetchedBuildingsById: Building[]): ExtendedGameDTO {
  //   const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
  //   const completeBuildingList: Building[] = this.buildingService.duplicateBuildingsIfNecessary(ids, fetchedBuildingsById);
  //   const fullyProcessedBuildings: Building[] = this.buildingService.updateBuildingValues(minimizedGameDTO, completeBuildingList);
  //   const sortedBuildings: Building[] = this.buildingService.sortBuildingsByCategoryAndPrice(fullyProcessedBuildings);
  //   const {buildingRequests, ...propertyValues} = minimizedGameDTO;
  //   const gameDTO: ExtendedGameDTO = {...propertyValues, buildings: sortedBuildings}
  //   console.log("successfully extended gameDTO: {}", gameDTO)
  //   return gameDTO;
  // }

  extendGameDTO(minimizedGameDTO: MinimizedGameDTO, fetchedBuildingsById: Building[]): ExtendedGameDTO {
    const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
    const completeBuildingList: Building[] = this.buildingService.duplicateBuildingsIfNecessary(ids, fetchedBuildingsById);
    const fullyProcessedBuildings: Building[] = this.buildingService.updateBuildingValues(minimizedGameDTO, completeBuildingList);
    const sortedBuildings: Building[] = this.buildingService.sortBuildingsByCategoryAndPrice(fullyProcessedBuildings);

    // Extract all properties except buildingRequests from minimizedGameDTO
    const {buildingRequests, ...propertyValues} = minimizedGameDTO;

    // Create the initial extended game DTO
    let gameDTO: ExtendedGameDTO = {
      ...propertyValues,
      buildings: sortedBuildings
    };

    // Update tiles with buildings
    gameDTO = this.buildingService.updateTilesWithBuildings(gameDTO);

    console.log("successfully extended gameDTO:", gameDTO);
    return gameDTO;
  }

  /**
   * Minimizes an ExtendedGameDTO to create an InitiateGameDTO
   * @param extendedGameDTO The extended game DTO to minimize
   * @param buildingRequests Building requests to include in the InitiateGameDTO
   * @returns A new InitiateGameDTO with minimal data
   */

  getMinimizedGameDto(): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(this.calculationServiceUrl);
  }

  minimizeToInitiateDTO(extendedGameDTO: ExtendedGameDTO): InitiateGameDTO {
    const buildingRequests: BuildingRequest[] = this.buildingService.minimizeBuildingsToBuildingRequests(extendedGameDTO.buildings);
    const tiles: Tile[] = this.buildingService.collectAllTiles(extendedGameDTO);
    const simplifiedTiles: Tile[] = this.buildingService.removeBuildingsFromTiles(tiles);
    return {
      id: extendedGameDTO.id,
      funds: extendedGameDTO.funds,
      popularity: extendedGameDTO.popularity,
      research: extendedGameDTO.research,
      buildingRequests: buildingRequests,
      tiles: simplifiedTiles,
      districts: extendedGameDTO.districts
    };
  }
}
