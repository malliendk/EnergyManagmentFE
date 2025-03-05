import {Injectable, NgZone} from '@angular/core';

import { Observable } from 'rxjs';
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";


@Injectable({
  providedIn: 'root'
})
export class GameEventsService {
  private baseUrl: string = 'http://localhost:8093';

  constructor(private zone: NgZone) {
  }

  /**
   * Subscribe to game events using Server-Sent Events
   * @returns Observable of MinimizedGameDTO objects
   */
  subscribeToGameEvents(): Observable<MinimizedGameDTO> {
    return new Observable<MinimizedGameDTO>(observer => {
      try {
        const eventSource = new EventSource(`${this.baseUrl}/events`);

        console.log('EventSource created:', eventSource);

        // Use addEventListener instead of onmessage
        eventSource.addEventListener('game-update', (event: MessageEvent) => {
          console.group('SSE Game Update Received');
          console.log('Raw Event:', event);
          console.log('Event Type:', event.type);
          console.log('Event Data:', event.data);

          try {
            // Parse the event data
            const gameData: MinimizedGameDTO = JSON.parse(event.data);
            console.log('Parsed Game Data:', gameData);

            // Ensure change detection
            this.zone.run(() => {
              observer.next(gameData);
            });
          } catch (parseError) {
            console.error('JSON Parsing Error:', parseError);
            console.error('Raw event data:', event.data);

            this.zone.run(() => {
              observer.error(parseError);
            });
          }
          console.groupEnd();
        });

        // Generic error handling
        eventSource.onerror = (error) => {
          console.error('EventSource ERROR:', error);
          this.zone.run(() => {
            observer.error(error);
            eventSource.close();
          });
        };

        return () => {
          console.log('Closing EventSource');
          eventSource.close();
        };
      } catch (initError) {
        console.error('EventSource initialization ERROR:', initError);
        observer.error(initError);
        return () => {
        };
      }
    });
  }
}
