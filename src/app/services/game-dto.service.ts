import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
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

  wsUrl = 'ws://PLACEHOLDER-URL'; //TODO: replace url with real url

  private gameDtoSource = new BehaviorSubject<ExtendedGameDTO | null>(null);
  currentGameDto = this.gameDtoSource.asObservable();

  constructor(private http: HttpClient,
              private buildingService: BuildingService) {
  }

  ngOnInit() {

  }

  startGame(): Observable<InitiateGameDTO> {
    return this.http.post<InitiateGameDTO>(this.initiateServiceUrl, {});
  }

  getGameDto(): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(this.calculationServiceUrl);
  }

  updateGameDTO(extendedGameDTO: ExtendedGameDTO): Observable<ExtendedGameDTO> {
    const buildingsRequests: BuildingRequest[] = this.buildingService.minimizeBuildings(extendedGameDTO.buildings);
    const initiateDTO: InitiateGameDTO = this.minimizeToInitiateDTO(extendedGameDTO, buildingsRequests);
    return this.http.put<ExtendedGameDTO>(this.initiateServiceUrl, {gameDto: initiateDTO});
  }

  extendGameDTO(minimizedGameDTO: MinimizedGameDTO, fetchedBuildingsById: Building[]): ExtendedGameDTO {
    const ids: number[] = minimizedGameDTO.buildingRequests.map((request: BuildingRequest) => request.buildingId);
    const completeBuildingList: Building[] = this.buildingService.duplicateBuildingsIfNecessary(ids, fetchedBuildingsById);
    const fullyProcessedBuildings: Building[] = this.buildingService.updateBuildingValues(minimizedGameDTO, completeBuildingList);
    return {
      id: minimizedGameDTO.id,
      supervisorName: minimizedGameDTO.supervisorName,
      funds: minimizedGameDTO.funds,
      popularity: minimizedGameDTO.popularity,
      research: minimizedGameDTO.research,
      environmentalScore: minimizedGameDTO.environmentalScore,
      energyProduction: minimizedGameDTO.energyProduction,
      energyConsumption: minimizedGameDTO.energyConsumption,
      gridLoad: minimizedGameDTO.gridLoad,
      gridCapacity: minimizedGameDTO.gridCapacity,
      solarPanelAmount: minimizedGameDTO.solarPanelAmount,
      solarPanelCapacity: minimizedGameDTO.solarPanelCapacity,
      goldIncome: minimizedGameDTO.goldIncome,
      popularityIncome: minimizedGameDTO.popularityIncome,
      researchIncome: minimizedGameDTO.researchIncome,
      buildings: fullyProcessedBuildings,
      events: [],
      timeOfDay: minimizedGameDTO.timeOfDay,
      weatherType: minimizedGameDTO.weatherType
    }
  }

  minimizeToInitiateDTO(extendedGameDTO: ExtendedGameDTO, buildingRequests: BuildingRequest[]): InitiateGameDTO {
    return {
      funds: extendedGameDTO.funds,
      popularity: extendedGameDTO.popularity,
      research: extendedGameDTO.research,
      buildingRequests: buildingRequests
    }
  }
}
