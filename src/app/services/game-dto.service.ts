import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {InitiateGameDto} from "../dtos/initiateGameDto";
import {GameDto} from "../dtos/gameDto";
import {WebsocketService} from "./websocketService";
import {HttpClient} from "@angular/common/http";
import {mockGameDto} from "../mocks/mock-game-dto";

@Injectable({
  providedIn: 'root'
})
export class GameDtoService {

  baseUrl = 'http://localhost:8081';
  wsUrl = 'ws://PLACEHOLDER-URL'; //TODO: replace url with real url

  private mockGameDto = mockGameDto;

  private gameDtoSource = new BehaviorSubject<GameDto | null>(null);
  currentGameDto = this.gameDtoSource.asObservable();


  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
    // this.webSocketService.connect(this.wsUrl);
    //
    // this.webSocketService.onGameUpdate()
    //   .subscribe((updatedGameDto: GameDto) => this.updateGameDto(updatedGameDto));
  }

  calculateTotalGridLoad(): number {
    const loadSources = mockGameDto.sources;
    return loadSources.reduce((totalLoad, source) => totalLoad + source.gridLoad, 0);
  }

  startGame(initDto: InitiateGameDto) {
    return this.http.post<GameDto>(this.baseUrl, { initDto }).pipe(
      tap(gameDto => this.gameDtoSource.next(gameDto))
    );
  }

  updateGameDto(gameDto: GameDto) {
    this.gameDtoSource.next(gameDto);
  }

  getGameDto() {
    return this.currentGameDto
  }
}
