import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, share, Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {IncomeAddDTO} from "../IncomeAddDTO";
import {EventDTO} from "./eventDTO";
import {DayWeatherUpdateDTO} from "../dtos/dayWeatherUpdateDTO";

@Injectable({
  providedIn: 'root'
})
export class GameEventsService implements OnDestroy{


  private INCOME_SSE_URL: string = 'http://localhost:8093/income-stream';
  private WEATHER_SSE_URL: string = 'http://localhost:8093/day-weather-stream';
  private BUILDING_EVENT_URL: string = 'http://localhost:8090/event/stream';

  private eventSources: Map<string, EventSource> = new Map();

  private incomeDTO = new Subject<IncomeAddDTO>();
  private weatherDTO = new Subject<DayWeatherUpdateDTO>();
  private event$ = new Subject<EventDTO>();
  private incomeConnectionStatusSubject = new BehaviorSubject<boolean>(false);
  private weatherConnectionStatusSubject = new BehaviorSubject<boolean>(false);
  private incomeErrorSubject = new Subject<string>();
  private weatherErrorSubject = new Subject<string>();

  private connectionCountEvent = 0;


  constructor(private zone: NgZone, private http: HttpClient) {}

  connectToIncome(): void {
    if (this.eventSources.has(this.INCOME_SSE_URL)) {
      console.warn('SSE income connection already exists');
      return;
    }

    console.log('Connecting to SSE income stream:', this.INCOME_SSE_URL);
    this.createEventSource<IncomeAddDTO>(
      this.INCOME_SSE_URL,
      this.incomeDTO,
      'income-update',
      true,
      'income'
    );
  }

  connectToWeather(): void {
    if (this.eventSources.has(this.WEATHER_SSE_URL)) {
      console.warn('SSE weather connection already exists');
      return;
    }


    console.log('Connecting to SSE weather stream:', this.WEATHER_SSE_URL);
    this.createEventSource<DayWeatherUpdateDTO>(
      this.WEATHER_SSE_URL,
      this.weatherDTO,
      'weather-update',
      true,
      'weather'
    );
  }

  disconnectFromIncome(): void {
    if (this.eventSources.has(this.INCOME_SSE_URL)) {
      console.log('Disconnecting from SSE income stream');
      this.closeEventSource(this.INCOME_SSE_URL);
      this.incomeConnectionStatusSubject.next(false);
    }
  }

  disconnectFromWeather(): void {
    if (this.eventSources.has(this.WEATHER_SSE_URL)) {
      console.log('Disconnecting from SSE weather stream');
      this.closeEventSource(this.WEATHER_SSE_URL);
      this.weatherConnectionStatusSubject.next(false);
    }
  }

  getIncomeUpdates(): Observable<IncomeAddDTO> {
    return this.incomeDTO.asObservable();
  }

  getWeatherUpdates(): Observable<DayWeatherUpdateDTO> {
    return this.weatherDTO.asObservable();
  }

  getIncomeConnectionStatus(): Observable<boolean> {
    return this.incomeConnectionStatusSubject.asObservable();
  }

  getWeatherConnectionStatus(): Observable<boolean> {
    return this.weatherConnectionStatusSubject.asObservable();
  }

  getIncomeErrors(): Observable<string> {
    return this.incomeErrorSubject.asObservable();
  }

  getWeatherErrors(): Observable<string> {
    return this.weatherErrorSubject.asObservable();
  }

  isIncomeConnected(): boolean {
    const eventSource = this.eventSources.get(this.INCOME_SSE_URL);
    return eventSource !== undefined && eventSource.readyState === EventSource.OPEN;
  }

  isWeatherConnected(): boolean {
    const eventSource = this.eventSources.get(this.WEATHER_SSE_URL);
    return eventSource !== undefined && eventSource.readyState === EventSource.OPEN;
  }

  subscribeToBuildingEvents(): Observable<EventDTO> {
    this.connectionCountEvent++;
    if (!this.eventSources.has(this.BUILDING_EVENT_URL)) {
      this.createEventSource<EventDTO>(this.BUILDING_EVENT_URL, this.event$, 'game-update', false, 'building');
    }
    return this.event$.asObservable().pipe(share());
  }


  pauseBuildingEventScheduler() {
    return this.http.post<void>(this.BUILDING_EVENT_URL + '/pause', {});
  }

  resumeBuildingEventScheduler() {
    return this.http.post<void>(this.BUILDING_EVENT_URL + '/resume', {})
  }

  unsubscribeFromBuildingEvents(): void {
    if (this.eventSources.has(this.BUILDING_EVENT_URL)) {
      this.closeEventSource(this.BUILDING_EVENT_URL);
      this.connectionCountEvent = 0;
      console.log('Unsubscribed from Building EventDTO events');
    }
  }

  private createEventSource<T>(
    url: string,
    subject$: Subject<T>,
    eventName: string,
    isSSE: boolean,
    streamType: 'income' | 'weather' | 'building'
  ): void {
    const eventSource = new EventSource(url);
    this.eventSources.set(url, eventSource);

    if (isSSE) {
      eventSource.addEventListener('connection', (event) => {
        this.zone.run(() => {
          console.log(`SSE ${streamType} connection confirmed:`, event.data);
          if (streamType === 'income') {
            this.incomeConnectionStatusSubject.next(true);
          } else if (streamType === 'weather') {
            this.weatherConnectionStatusSubject.next(true);
          }
        });
      });
    }

    eventSource.addEventListener(eventName, (event: MessageEvent) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(event.data);
          subject$.next(data);
          // if (streamType === 'income') {
          //   console.log('Received income update:', data);
          // } else if (streamType === 'weather') {
          //   console.log('Received weather update:', data);
          // }
        } catch (e) {
          console.error(`Error parsing ${eventName} event:`, e);
          if (streamType === 'income') {
            this.incomeErrorSubject.next(`Failed to parse ${eventName} data`);
          } else if (streamType === 'weather') {
            this.weatherErrorSubject.next(`Failed to parse ${eventName} data`);
          }
        }
      });
    });

    eventSource.onopen = () => {
      this.zone.run(() => {
        console.log(`EventSource connection opened for ${url}`);
        // For SSE streams, don't set connection status to true yet, wait for 'connection' event
      });
    };

    eventSource.onerror = (error) => {
      this.zone.run(() => {
        console.error(`EventSource error for ${url}:`, error);
        if (streamType === 'income') {
          this.incomeConnectionStatusSubject.next(false);
          this.incomeErrorSubject.next('Connection error occurred');
        } else if (streamType === 'weather') {
          this.weatherConnectionStatusSubject.next(false);
          this.weatherErrorSubject.next('Connection error occurred');
        }
      });

      this.closeEventSource(url);

      setTimeout(() => {
        if (url === this.BUILDING_EVENT_URL && this.connectionCountEvent > 0) {
          this.createEventSource(url, subject$, eventName, isSSE, streamType);
        } else if (url === this.INCOME_SSE_URL && streamType === 'income') {
          this.createEventSource(url, subject$, eventName, isSSE, streamType);
        } else if (url === this.WEATHER_SSE_URL && streamType === 'weather') {
          this.createEventSource(url, subject$, eventName, isSSE, streamType);
        }
      }, 5000);
    };
  }


  private closeEventSource(url: string): void {
    const source = this.eventSources.get(url);
    if (source) {
      source.close();
      this.eventSources.delete(url);
    }
  }

  ngOnDestroy(): void {
    this.disconnectFromIncome();
    this.disconnectFromWeather();
    this.unsubscribeFromBuildingEvents();
    this.incomeDTO.complete();
    this.weatherDTO.complete();
    this.event$.complete();
    this.incomeConnectionStatusSubject.complete();
    this.weatherConnectionStatusSubject.complete();
    this.incomeErrorSubject.complete();
    this.weatherErrorSubject.complete();
  }
}


