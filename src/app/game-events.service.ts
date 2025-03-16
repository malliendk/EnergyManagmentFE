import {Injectable, NgZone} from '@angular/core';
import {Observable, Subject, share} from 'rxjs';
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {GAME_DTO_EVENT_URL} from "./constants";
import {Event} from "./event";

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {

  private GAME_DTO_EVENT_URL: string = 'http://localhost:8093/events';
  private BUILDING_EVENT_URL: string = 'http://localhost:8090/event/stream';

  private eventSource: EventSource | null = null;
  private gameDTO$ = new Subject<MinimizedGameDTO>();
  private event$ = new Subject<Event>();
  private connectionCount = 0;
  private connectionCountGameDTO: number = 0;
  private connectionCountEvent: number = 0;

  constructor(private zone: NgZone) {}

  /**
   * Subscribe to game events using Server-Sent Events
   * @returns Observable of MinimizedGameDTO objects
   */
  subscribeToGameDTO(): Observable<MinimizedGameDTO> {
    this.connectionCountGameDTO++;
    console.log(`New subscription. Total subscribers: ${this.connectionCountGameDTO}`);
    if (!this.eventSource) {
      console.log('Creating new EventSource connection');
      this.createEventSource(this.GAME_DTO_EVENT_URL);
    } else {
      console.log('Reusing existing EventSource connection');
    }

    return this.gameDTO$.asObservable().pipe(
      share()
    );
  }

  subscribeToEvents(): Observable<Event> {
    this.connectionCountEvent++;
    console.log(`New subscription. Total subscribers: ${this.connectionCountEvent}`);
    if (!this.eventSource) {
      console.log('Creating new EventSource connection');
      this.createEventSource(this.GAME_DTO_EVENT_URL);
    } else {
      console.log('Reusing existing EventSource connection');
    }

    return this.event$.asObservable().pipe(
      share()
    );
  }

  private createEventSource(url: string): void {
    try {
      this.eventSource = new EventSource(url);
      console.log('EventSource created:', this.eventSource);

      this.eventSource.addEventListener('game-update', (event: MessageEvent) => {
        try {
          const gameData: MinimizedGameDTO = JSON.parse(event.data);
          console.log('Game update received:', gameData);

          this.zone.run(() => {
            this.gameDTO$.next(gameData);
          });
        } catch (parseError) {
          console.error('JSON Parsing Error:', parseError);
          console.error('Raw event data:', event.data);
        }
      });

      this.eventSource.onerror = (error) => {
        console.error('EventSource ERROR:', error);

        this.closeEventSource();

        setTimeout(() => {
          if (this.connectionCount > 0) {
            console.log('Attempting to reconnect EventSource');
            this.createEventSource(url);
          }
        }, 5000);
      };
    } catch (initError) {
      console.error('EventSource initialization ERROR:', initError);
      this.eventSource = null;
    }
  }

  /**
   * Unsubscribe from game events
   * Call this when your component is destroyed
   */
  unsubscribe(): void {
    this.connectionCount--;
    console.log(`Unsubscribed. Remaining subscribers: ${this.connectionCount}`);

    if (this.connectionCount <= 0) {
      this.closeEventSource();
      this.connectionCount = 0; // Reset to ensure it doesn't go negative
    }
  }

  private closeEventSource(): void {
    if (this.eventSource) {
      console.log('Closing EventSource connection');
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
