import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-daytime-weather',
  templateUrl: './daytime-weather.component.html',
  styleUrls: ['./daytime-weather.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DaytimeWeatherComponent implements OnInit, OnDestroy {

  @Input() gameDTO!: ExtendedGameDTO;
  private timer: any;
  private timeSubject = new BehaviorSubject<string>('00:00');


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

  getTimeOfDayColor(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return 'morning transition'
      case 'afternoon':
        return 'afternoon transition'
      case 'evening':
        return 'evening transition'
      case 'night':
        return 'night transition'
      default:
        return ''
    }
  }

  getWeatherColor(weatherType: string, timeOfDay: string): string {
    const timeOfDayColor = this.getTimeOfDayColor(timeOfDay);
    switch (weatherType) {
      case 'clear':
        return `${timeOfDayColor} transition`;
      case 'moderate':
        return 'moderate transition';
      case 'overcast':
        return 'overcast transition';
      case 'rainy':
        return 'rainy transition';
      default:
        return '';
    }
  }
}


