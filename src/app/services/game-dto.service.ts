import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";
import {GameDTO} from "../dtos/gameDTO";
import {HttpClient} from "@angular/common/http";
import {Supervisor} from "../dtos/supervisor";

@Injectable({
  providedIn: 'root'
})
export class GameDTOService {

  private gameDTOSubject = new BehaviorSubject<GameDTO | null>(null);
  public gameDTO$ = this.gameDTOSubject.asObservable()

  private calculationServiceUrl: string = 'http://localhost:8093';
  private sseUrlPostFix: string = 'stream/game-dto'
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient,
              private ngZone: NgZone)
  {}

  startGame(supervisorDTO: Supervisor): Observable<GameDTO> {
    return this.http.post<GameDTO>(this.calculationServiceUrl, supervisorDTO).pipe(
      tap((fullGameDTO: GameDTO) => {
        this.gameDTOSubject.next(fullGameDTO);
      }),
      catchError(err => {
        console.log("Error occurred during game initialization: {}", err)
        throw new Error("Unexpected error happened during game startup: {}", err)
      })
    );
  }

  updateGameDTO(gameDTO: GameDTO): Observable<GameDTO> {
    return this.http.put<GameDTO>(`${this.calculationServiceUrl}`, gameDTO).pipe(
      tap((fullGameDTO: GameDTO) => {
        console.log('updated gameDTO: {}', fullGameDTO)
        this.gameDTOSubject.next(fullGameDTO);
      }),
      catchError(err => {
        console.log("error occurred: {}", err)
        throw new Error("Unexpected error happened while receiving updated gameDTO: {}", err)
      })
    );
  }

  setGameDTO(gameDTO: GameDTO) {
    this.gameDTOSubject.next(gameDTO)
  }

  getGameDTO(): GameDTO {
    return this.gameDTOSubject.getValue()!
  }

  startStream(): void {
    if (this.eventSource) {
      console.warn('SSE stream already active');
      return;
    }
    this.eventSource = new EventSource(`${this.calculationServiceUrl}/${this.sseUrlPostFix}` );
    this.eventSource.addEventListener('connection', (event: MessageEvent) => {
      console.log('Connected to gameDTO SSE stream:', event.data);
    });
    this.eventSource.addEventListener('gameDTO-update', (event: MessageEvent) => {
      this.ngZone.run(() => {
        try {
          const gameDTO: GameDTO = JSON.parse(event.data);
          this.gameDTOSubject.next(gameDTO);
        } catch (error) {
          console.error('Error parsing SSE gameDTO data:', error);
        }
      });
    });
    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.closeStream();
    };
  }

  closeStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE gameDTO stream closed');
    }
  }
}
