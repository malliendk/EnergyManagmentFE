import {Injectable, NgZone} from '@angular/core';
import {Observable, share, Subject} from 'rxjs';
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {EventDTO} from "./eventDTO";

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {

  private GAME_DTO_EVENT_URL: string = 'http://localhost:8093/events';
  private BUILDING_EVENT_URL: string = 'http://localhost:8090/event/stream';

  // Map to store multiple EventSource connections
  private eventSources: Map<string, EventSource> = new Map();

  private gameDTO$ = new Subject<MinimizedGameDTO>();
  private event$ = new Subject<EventDTO>();
  private connectionCountGameDTO: number = 0;
  private connectionCountEvent: number = 0;

  constructor(private zone: NgZone) {}

  /**
   * Subscribe to game events using Server-Sent Events
   * @returns Observable of MinimizedGameDTO objects
   */
  subscribeToGameDTO(): Observable<MinimizedGameDTO> {
    this.connectionCountGameDTO++;
    console.log(`New game subscription. Total game subscribers: ${this.connectionCountGameDTO}`);

    if (!this.eventSources.has(this.GAME_DTO_EVENT_URL)) {
      console.log('Creating new Game EventSource connection');
      this.createEventSource<MinimizedGameDTO>(this.GAME_DTO_EVENT_URL, this.gameDTO$, 'game-update');
    } else {
      console.log('Reusing existing Game EventSource connection');
    }

    return this.gameDTO$.asObservable().pipe(
      share()
    );
  }

  /**
   * Subscribe to building events using Server-Sent Events
   * @returns Observable of EventDTO objects
   */
  subscribeToBuildingEvents(): Observable<EventDTO> {
    this.connectionCountEvent++;
    console.log(`New event subscription. Total event subscribers: ${this.connectionCountEvent}`);

    if (!this.eventSources.has(this.BUILDING_EVENT_URL)) {
      console.log('Creating new Building EventSource connection');
      this.createEventSource<EventDTO>(this.BUILDING_EVENT_URL, this.event$, 'game-update');
    } else {
      console.log('Reusing existing Building EventSource connection');
    }

    return this.event$.asObservable().pipe(
      share()
    );
  }

  /**
   * Generic method to create EventSource for different DTOs
   * @param url The URL to connect to
   * @param subject$ The Subject to publish events to
   * @param eventName The name of the event to listen for
   */
  private createEventSource<T>(url: string, subject$: Subject<T>, eventName: string = 'game-update'): void {
    try {
      // Create a new EventSource for this URL
      const newEventSource = new EventSource(url);
      console.log(`EventSource created for ${url}:`, newEventSource);

      // Store it in our map
      this.eventSources.set(url, newEventSource);

      newEventSource.addEventListener(eventName, (event: MessageEvent) => {
        try {
          const data: T = JSON.parse(event.data);
          console.log(`${url} update received:`, data);

          this.zone.run(() => {
            subject$.next(data);
          });
        } catch (parseError) {
          console.error(`JSON Parsing Error for ${url}:`, parseError);
          console.error('Raw event data:', event.data);
        }
      });

      newEventSource.onmessage = (event: MessageEvent) => {
        try {
          const data: T = JSON.parse(event.data);
          console.log(`General message from ${url}:`, data);

          this.zone.run(() => {
            subject$.next(data);
          });
        } catch (parseError) {
          console.error(`JSON Parsing Error in onmessage for ${url}:`, parseError);
          console.error('Raw event data:', event.data);
        }
      };

      // Error handling
      newEventSource.onerror = (error) => {
        console.error(`EventSource ERROR for ${url}:`, error);

        this.closeEventSource(url);

        setTimeout(() => {
          // Check if we still need this connection
          if ((url === this.GAME_DTO_EVENT_URL && this.connectionCountGameDTO > 0) ||
            (url === this.BUILDING_EVENT_URL && this.connectionCountEvent > 0)) {
            console.log(`Attempting to reconnect EventSource to ${url}`);
            this.createEventSource(url, subject$, eventName);
          }
        }, 5000);
      };
    } catch (initError) {
      console.error(`EventSource initialization ERROR for ${url}:`, initError);
      this.eventSources.delete(url);
    }
  }

  /**
   * Unsubscribe from events
   * @param type The type of subscription to unsubscribe from ('game' or 'event')
   */
  unsubscribe(type: 'game' | 'event'): void {
    if (type === 'game') {
      this.connectionCountGameDTO = Math.max(0, this.connectionCountGameDTO - 1);
      console.log(`Unsubscribed from game. Remaining subscribers: ${this.connectionCountGameDTO}`);

      if (this.connectionCountGameDTO <= 0) {
        this.closeEventSource(this.GAME_DTO_EVENT_URL);
      }
    } else {
      this.connectionCountEvent = Math.max(0, this.connectionCountEvent - 1);
      console.log(`Unsubscribed from event. Remaining subscribers: ${this.connectionCountEvent}`);

      if (this.connectionCountEvent <= 0) {
        this.closeEventSource(this.BUILDING_EVENT_URL);
      }
    }
  }

  /**
   * Close a specific EventSource connection or all connections
   * @param url Optional URL to close a specific connection. If not provided, closes all connections.
   */
  private closeEventSource(url?: string): void {
    if (url) {
      const source = this.eventSources.get(url);
      if (source) {
        console.log(`Closing EventSource connection for ${url}`);
        source.close();
        this.eventSources.delete(url);
      }
    } else {
      // Close all connections
      this.eventSources.forEach((source, sourceUrl) => {
        console.log(`Closing EventSource connection for ${sourceUrl}`);
        source.close();
      });
      this.eventSources.clear();
    }
  }

  /**
   * Close all connections and clean up on service destroy
   */
  ngOnDestroy(): void {
    this.closeEventSource();
  }
}
