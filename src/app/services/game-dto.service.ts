import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {InitiateGameDto} from "../dtos/initiateGameDto";
import {GameDTO} from "../dtos/gameDTO";
import {WebsocketService} from "./websocketService";
import {HttpClient} from "@angular/common/http";
import {mockGameDto} from "../mocks/mock-game-dto";

@Injectable({
  providedIn: 'root'
})
export class GameDtoService {

  updateServiceUrl = 'http://localhost:8080';
  private calculationServiceUrl: string = 'http://localhost:8093';

  wsUrl = 'ws://PLACEHOLDER-URL'; //TODO: replace url with real url

  private mockGameDto = mockGameDto;

  private gameDtoSource = new BehaviorSubject<GameDTO | null>(null);
  currentGameDto = this.gameDtoSource.asObservable();


  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
    // this.webSocketService.connect(this.wsUrl);
    //
    // this.webSocketService.onGameUpdate()
    //   .subscribe((updatedGameDto: GameDto) => this.updateGameDto(updatedGameDto));
  }

  calculateTotalGridLoad(): number {
    const loadSources = mockGameDto.buildings;
    return loadSources.reduce((totalLoad, source) => totalLoad + source.gridLoad, 0);
  }

  startGame(initDto: InitiateGameDto) {
    return this.http.post<GameDTO>(this.updateServiceUrl, { initDto }).pipe(
      tap(gameDTO => this.gameDtoSource.next(gameDTO))
    );
  }

  getGameDto(): Observable<GameDTO> {
    return this.http.get<GameDTO>(this.calculationServiceUrl);
  }

  updateGameDTO(gameDto: GameDTO): Observable<GameDTO> {
    return this.http.put<GameDTO>(this.updateServiceUrl, { gameDto: gameDto });
  }



  // updateGameDto(gameDto: GameDto) {
  //   return this.gameDtoSource.next(gameDto);
  // }
}
