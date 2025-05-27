import {Injectable, NgZone} from '@angular/core';
import {Observable, share, Subject} from 'rxjs';
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {EventDTO} from "./eventDTO";
import {IncomeAddDTO} from "./IncomeAddDTO";
import {UpdateDTOService} from "./services/update-dto.service";
import {DayWeatherUpdateDTO} from "./dtos/dayWeatherUpdateDTO";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {

  private INCOME_ADD_DTO_URL: string = 'http://localhost:8093/stream/income';
  private DAY_WEATHER_DTO_URL: string = 'http://localhost:8093/stream/weather';
  private BUILDING_EVENT_URL: string = 'http://localhost:8090/event/stream';

  private eventSources: Map<string, EventSource> = new Map();

  private incomeDTO = new Subject<IncomeAddDTO>();
  private dayWeatherDTO = new Subject<DayWeatherUpdateDTO>();
  private event$ = new Subject<EventDTO>();

  private connectionCountIncome = 0;
  private connectionCountDayWeather = 0;
  private connectionCountEvent = 0;

  constructor(private zone: NgZone,
              private http: HttpClient) {}

  subscribeToIncomeAddDTO(): Observable<IncomeAddDTO> {
    this.connectionCountIncome++;
    if (!this.eventSources.has(this.INCOME_ADD_DTO_URL)) {
      this.createEventSource<IncomeAddDTO>(this.INCOME_ADD_DTO_URL, this.incomeDTO, 'income-update');
    }
    return this.incomeDTO.asObservable().pipe(share());
  }

  subscribeToDayWeatherUpdateDTO(): Observable<DayWeatherUpdateDTO> {
    this.connectionCountDayWeather++;
    if (!this.eventSources.has(this.DAY_WEATHER_DTO_URL)) {
      this.createEventSource<DayWeatherUpdateDTO>(this.DAY_WEATHER_DTO_URL, this.dayWeatherDTO, 'day-weather-update');
    }
    return this.dayWeatherDTO.asObservable().pipe(share());
  }

  subscribeToBuildingEvents(): Observable<EventDTO> {
    this.connectionCountEvent++;
    if (!this.eventSources.has(this.BUILDING_EVENT_URL)) {
      this.createEventSource<EventDTO>(this.BUILDING_EVENT_URL, this.event$, 'game-update');
    }
    return this.event$.asObservable().pipe(share());
  }

  pauseBuildingEventScheduler() {
    return this.http.post<void>(this.BUILDING_EVENT_URL + '/pause', {});
  }

  resumeBuildingEventScheduler() {
    return this.http.post<void>(this.BUILDING_EVENT_URL + '/resume', {})
  }

  unsubscribeFromIncomeAddDTO(): void {
    if (this.eventSources.has(this.INCOME_ADD_DTO_URL)) {
      this.closeEventSource(this.INCOME_ADD_DTO_URL);
      this.connectionCountIncome = 0;
      console.log('Unsubscribed from IncomeAddDTO events');
    }
  }

  unsubscribeFromDayWeatherUpdateDTO(): void {
    if (this.eventSources.has(this.DAY_WEATHER_DTO_URL)) {
      this.closeEventSource(this.DAY_WEATHER_DTO_URL);
      this.connectionCountDayWeather = 0;
      console.log('Unsubscribed from DayWeatherUpdateDTO events');
    }
  }

  unsubscribeFromBuildingEvents(): void {
    if (this.eventSources.has(this.BUILDING_EVENT_URL)) {
      this.closeEventSource(this.BUILDING_EVENT_URL);
      this.connectionCountEvent = 0;
      console.log('Unsubscribed from Building EventDTO events');
    }
  }


  private createEventSource<T>(url: string, subject$: Subject<T>, eventName: string): void {
    const eventSource = new EventSource(url);
    this.eventSources.set(url, eventSource);

    eventSource.addEventListener(eventName, (event: MessageEvent) => {
      this.zone.run(() => {
        try {
          subject$.next(JSON.parse(event.data));
        } catch (e) {
          console.error(`Error parsing ${eventName} event:`, e);
        }
      });
    });

    eventSource.onerror = (error) => {
      console.error(`EventSource error for ${url}:`, error);
      this.closeEventSource(url);
      setTimeout(() => {
        if (url === this.INCOME_ADD_DTO_URL && this.connectionCountIncome > 0) {
          this.createEventSource(url, subject$, eventName);
        } else if (url === this.DAY_WEATHER_DTO_URL && this.connectionCountDayWeather > 0) {
          this.createEventSource(url, subject$, eventName);
        } else if (url === this.BUILDING_EVENT_URL && this.connectionCountEvent > 0) {
          this.createEventSource(url, subject$, eventName);
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


}
