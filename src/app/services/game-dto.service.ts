import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, from, Observable, tap} from "rxjs";
import {InitiateGameDto} from "../dtos/initiateGameDto";
import {GameObject} from "../dtos/gameObject";
import {WebsocketService} from "./websocketService";
import {HttpClient} from "@angular/common/http";
import {mockGameObject} from "../mocks/mock-game-object";
import {Building} from "../dtos/building";
import {GameDTO} from "../dtos/gameDTO";
import {mockBuildings} from "../mocks/mock-buildings";

@Injectable({
  providedIn: 'root'
})
export class GameDtoService implements OnInit {
  updateServiceUrl = 'http://localhost:8080';
  private calculationServiceUrl: string = 'http://localhost:8093';

  wsUrl = 'ws://PLACEHOLDER-URL'; //TODO: replace url with real url

  private mockGameDto = mockGameObject;

  private gameDtoSource = new BehaviorSubject<GameObject | null>(null);
  currentGameDto = this.gameDtoSource.asObservable();

  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
  }

  ngOnInit() {

  }

  calculateTotalGridLoad(): number {
    const loadSources: Building[] = mockGameObject.buildings;
    return loadSources.reduce((totalLoad, source) => totalLoad + source.gridLoad, 0);
  }

  startGame(initDto: InitiateGameDto) {
    return this.http.post<GameObject>(this.updateServiceUrl, { initDto }).pipe(
      tap(gameDTO => this.gameDtoSource.next(gameDTO))
    );
  }

  getMockGameObject() {
    console.log(this.mockGameDto.buildings)
    return this.mockGameDto;
  }

  getGameDto(): Observable<GameObject> {
    return this.http.get<GameObject>(this.calculationServiceUrl);
  }


  updateGameDTO(gameDto: GameObject): Observable<GameObject> {
    // const gameDTOToSend: GameDTO = this.filterBuildingIds(gameDto);
    return this.http.put<GameObject>(this.updateServiceUrl, { gameDto: gameDto });
  }

  // updateGameDto(gameDto: GameDto) {
  //   return this.gameDtoSource.next(gameDto);
  // }

  filterBuildingIds(gameObject: GameObject): GameDTO {
    const buildingIds: number[] = gameObject.buildings.map(building => building.id);
    return {
      buildingIds: buildingIds
    } as GameDTO
  }
}
