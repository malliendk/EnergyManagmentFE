import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, from, Observable, switchMap, tap} from "rxjs";
import {ExtendedGameDTO} from "../extendedGameDTO";
import {WebsocketService} from "./websocketService";
import { HttpClient } from "@angular/common/http";
import {mockGameObject} from "../mocks/mock-game-object";
import {Building} from "../dtos/building";
import {MinimizedGameDTO} from "../minimizedGameDTO";
import {InitiateGameDto} from "../dtos/initiateGameDto";

@Injectable({
  providedIn: 'root'
})
export class GameDTOService implements OnInit {
  private initiateServiceUrl = 'http://localhost:8080';
  private calculationServiceUrl: string = 'http://localhost:8093';

  wsUrl = 'ws://PLACEHOLDER-URL'; //TODO: replace url with real url

  private gameDtoSource = new BehaviorSubject<ExtendedGameDTO | null>(null);
  currentGameDto = this.gameDtoSource.asObservable();

  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
  }

  ngOnInit() {

  }

  calculateTotalGridLoad(): number {
    const loadSources: Building[] = mockGameObject.buildings;
    return loadSources.reduce((totalLoad, source) => totalLoad + source.gridLoad, 0);
  }

  startGame(): Observable<InitiateGameDto> {
    return this.http.post<InitiateGameDto>(this.initiateServiceUrl, {}).pipe(
      switchMap(() => this.getGameDto())
    )
  }

  // startGame() {
  //   return this.http.post<GameObject>(this.initiateServiceUrl, {}).pipe(
  //     tap(gameDTO => this.gameDtoSource.next(gameDTO))
  //   );
  // }

  getGameDto(): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(this.calculationServiceUrl);
  }

  updateGameDTO(gameDto: ExtendedGameDTO): Observable<ExtendedGameDTO> {
    return this.http.put<ExtendedGameDTO>(this.initiateServiceUrl, { gameDto: gameDto });
  }

  extendGameDTO(minimizedDTO: MinimizedGameDTO, buildings: Building[]) {
    (extendedGameDTO: ExtendedGameDTO) : {buildings}
  }
}
