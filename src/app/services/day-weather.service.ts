import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DayWeatherService {

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
    switch (weatherType) {
      case 'sunny':
        return `${timeOfDay} transition`;
      case 'afternoon':
        return 'afternoon transition';
      case 'evening':
        return 'evening transition';
      case 'night':
        return 'night transition';
      default:
        return '';
    }
  }
}
