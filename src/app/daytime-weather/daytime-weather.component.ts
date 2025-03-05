import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {ClockService} from "../services/clock.service";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";

@Component({
    selector: 'app-daytime-weather',
    templateUrl: './daytime-weather.component.html',
    styleUrls: ['./daytime-weather.component.css'],
    standalone: false
})
export class DaytimeWeatherComponent implements OnInit, OnDestroy{
  private timer: any;
  private timeSubject = new BehaviorSubject<string>('00:00');
  @Input() gameDTO!: ExtendedGameDTO


  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  getTime(): Observable<string> {
    return this.timeSubject.asObservable();
  }

  startTimer(): void {
    let hours = 0;
    let minutes = 0;

    this.timer = setInterval(() => {
      minutes += 5;
      if (minutes >= 60) {
        hours = (hours + Math.floor(minutes / 60)) % 24;
        minutes = minutes % 60;
      }

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      this.timeSubject.next(`${formattedHours}:${formattedMinutes}`);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

