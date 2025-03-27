import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {HttpClient} from "@angular/common/http";
import {Building} from "../dtos/building";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {BuildingService} from "./building.service";
import {BuildingRequest} from "../buildingRequest";

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

  getMinimizedGameDto(): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(this.calculationServiceUrl);
  }

  updateGameDTO(extendedGameDTO: ExtendedGameDTO): Observable<InitiateGameDTO> {
    console.log(extendedGameDTO)
    const buildingsRequests: BuildingRequest[] = this.buildingService.minimizeBuildings(extendedGameDTO.buildings);
    const initiateDTO: InitiateGameDTO = this.minimizeToInitiateDTO(extendedGameDTO, buildingsRequests);
    console.log('outgoing gameDTO: {}', initiateDTO);
    return this.http.put<InitiateGameDTO>(`${this.initiateServiceUrl}/${extendedGameDTO.id}`, initiateDTO);
  }

  extendGameDTO(minimizedGameDTO: MinimizedGameDTO, fetchedBuildingsById: Building[]): ExtendedGameDTO {
    const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
    const completeBuildingList: Building[] = this.buildingService.duplicateBuildingsIfNecessary(ids, fetchedBuildingsById);
    const fullyProcessedBuildings: Building[] = this.buildingService.updateBuildingValues(minimizedGameDTO, completeBuildingList);
    const sortedBuildings: Building[] = this.buildingService.sortBuildingsByCategoryAndPrice(fullyProcessedBuildings);
    const {buildingRequests, ...propertyValues} = minimizedGameDTO;
    const gameDTO: ExtendedGameDTO = {...propertyValues, buildings: sortedBuildings}
    console.log("successfully extended gameDTO: {}", gameDTO)
    return gameDTO;
  }

  minimizeToInitiateDTO(extendedGameDTO: ExtendedGameDTO, buildingRequests: BuildingRequest[]): InitiateGameDTO {
    return {
      id: extendedGameDTO.id,
      funds: extendedGameDTO.funds,
      popularity: extendedGameDTO.popularity,
      research: extendedGameDTO.research,
      buildingRequests: buildingRequests
    };
  }
}
