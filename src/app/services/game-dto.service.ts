import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, catchError, Observable, switchMap, tap} from "rxjs";
import {FullGameDTO} from "../dtos/fullGameDTO";
import {HttpClient} from "@angular/common/http";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {Supervisor} from "../dtos/supervisor";
import {GameDtoMapperService} from "./game-dto-mapper.service";
import {BuildingService} from "./building.service";

@Injectable({
  providedIn: 'root'
})
export class GameDTOService {

  private gameDTOSubject = new BehaviorSubject<FullGameDTO | null>(null);
  public gameDTO$ = this.gameDTOSubject.asObservable()

  private calculationServiceUrl: string = 'http://localhost:8093';
  private sseUrlPostFix: string = 'stream/game-dto'
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient,
              private dtoMapperService: GameDtoMapperService,
              private buildingService: BuildingService,
              private ngZone: NgZone)
  {}

  startGame(supervisorDTO: Supervisor): Observable<FullGameDTO> {
    return this.http.post<MinimizedGameDTO>(this.calculationServiceUrl, supervisorDTO).pipe(
      switchMap((minimizedGameDTO: MinimizedGameDTO) => this.dtoMapperService.extendGameDTO(minimizedGameDTO)),
      tap((fullGameDTO: FullGameDTO) => {
        this.gameDTOSubject.next(fullGameDTO);
      }),
      catchError(err => {
        console.log("Error occurred during game initialization: {}", err)
        throw new Error("Unexpected error happened during game startup: {}", err)
      })
    );
  }

  updateGameDTO(extendedGameDTO: FullGameDTO): Observable<FullGameDTO> {
    const initiateDTO: InitiateGameDTO = this.dtoMapperService.minimizeToInitiateDTO(extendedGameDTO);
    console.log('outgoing minimizedDTO:', initiateDTO);
    return this.http.put<MinimizedGameDTO>(`${this.calculationServiceUrl}`, initiateDTO).pipe(
      switchMap((minimizedGameDTO: MinimizedGameDTO) => this.dtoMapperService.extendGameDTO(minimizedGameDTO)),
      tap((fullGameDTO: FullGameDTO) => {
        this.gameDTOSubject.next(fullGameDTO);
      }),
      catchError(err => {
        console.log("error occurred: {}", err)
        throw new Error("Unexpected error happened while receiving updated gameDTO: {}", err)
      })
    );
  }

  getGameDTO() {
    return this.gameDTOSubject.getValue()
  }

  setGameDTO(gameDTO: FullGameDTO) {
    this.gameDTOSubject.next(gameDTO)
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
          const minimizedDTO: MinimizedGameDTO = JSON.parse(event.data);
          console.log('Received minimized gameDTO:', minimizedDTO);

          this.dtoMapperService.extendGameDTO(minimizedDTO).subscribe({
            next: (fullGameDTO: FullGameDTO) => {
              this.gameDTOSubject.next(fullGameDTO);
              console.log('GameDTO updated via SSE:', fullGameDTO);
            },
            error: (err) => {
              console.error('Error extending gameDTO from SSE:', err);
            }
          });
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
